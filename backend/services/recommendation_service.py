from sqlalchemy.orm import Session
from models.database_models import Category, UserCategoryProgress, Question
from typing import List, Tuple
from backend.services.spaced_repetition import SpacedRepetitionSystem

class RecommendationEngine:
    def __init__(self, db: Session, user_id: int):
        self.db = db
        self.user_id = user_id
        self.srs = SpacedRepetitionSystem(db, user_id)

    def get_next_recommended_category(self) -> Category:
        # Get user's current progress
        progress = self.db.query(UserCategoryProgress).filter(
            UserCategoryProgress.user_id == self.user_id
        ).all()
        
        # Find categories with low progress
        weak_categories = [p for p in progress if p.progress_score < 70]
        
        if weak_categories:
            # Return the category with lowest progress
            return min(weak_categories, key=lambda x: x.progress_score).category
        
        # If all categories are strong, find new ones
        existing_category_ids = [p.category_id for p in progress]
        new_category = self.db.query(Category).filter(
            ~Category.id.in_(existing_category_ids)
        ).first()
        
        return new_category

    def get_recommended_questions(self, count: int = 5) -> List[Question]:
        # Get due review questions (30% of recommendations)
        review_count = max(1, count // 3)
        review_questions = self.srs.get_review_questions(review_count)
        
        # Get new questions for remaining slots
        new_count = count - len(review_questions)
        new_questions = self._get_new_questions(new_count)
        
        return review_questions + new_questions

    def _get_new_questions(self, count: int) -> List[Question]:
        # Previous implementation of get_recommended_questions
        progress = self.db.query(UserCategoryProgress).filter(
            UserCategoryProgress.user_id == self.user_id
        ).all()
        
        questions = []
        for p in progress:
            difficulty_range = self._calculate_optimal_difficulty(p)
            category_questions = self.db.query(Question).filter(
                Question.category_id == p.category_id,
                Question.difficulty.between(difficulty_range[0], difficulty_range[1])
            ).limit(count).all()
            
            questions.extend(category_questions)
        
        return questions[:count]

    def _calculate_optimal_difficulty(self, progress: UserCategoryProgress) -> Tuple[float, float]:
        """Calculate optimal difficulty range based on user performance"""
        base_difficulty = progress.progress_score
        
        if progress.accuracy > 90:
            return (base_difficulty + 10, base_difficulty + 30)
        elif progress.accuracy > 70:
            return (base_difficulty, base_difficulty + 20)
        else:
            return (max(0, base_difficulty - 10), base_difficulty + 10) 