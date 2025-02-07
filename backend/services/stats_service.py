from sqlalchemy.orm import Session
from sqlalchemy import func, case
from models.database_models import UserCategoryProgress, QuestionAttempt, Category, Question
from typing import List, Dict
from datetime import datetime, timedelta

class UserStats:
    def __init__(self, db: Session, user_id: int):
        self.db = db
        self.user_id = user_id

    def get_overall_stats(self) -> Dict:
        total_attempts = self.db.query(QuestionAttempt).filter(
            QuestionAttempt.user_id == self.user_id
        ).count()

        correct_attempts = self.db.query(QuestionAttempt).filter(
            QuestionAttempt.user_id == self.user_id,
            QuestionAttempt.is_correct == True
        ).count()

        avg_time = self.db.query(func.avg(QuestionAttempt.time_taken)).filter(
            QuestionAttempt.user_id == self.user_id
        ).scalar()

        return {
            "total_attempts": total_attempts,
            "accuracy": (correct_attempts / total_attempts * 100) if total_attempts > 0 else 0,
            "avg_time": avg_time or 0,
            "categories_started": self.get_categories_started(),
            "streak": self.get_current_streak()
        }

    def get_progress_by_category(self) -> List[Dict]:
        return self.db.query(UserCategoryProgress).filter(
            UserCategoryProgress.user_id == self.user_id
        ).all()

    def get_current_streak(self) -> int:
        today = datetime.utcnow().date()
        streak = 0
        
        while True:
            has_attempt = self.db.query(QuestionAttempt).filter(
                QuestionAttempt.user_id == self.user_id,
                func.date(QuestionAttempt.attempted_at) == today - timedelta(days=streak)
            ).first()
            
            if not has_attempt:
                break
            streak += 1
        
        return streak

    def get_categories_started(self) -> int:
        return self.db.query(UserCategoryProgress).filter(
            UserCategoryProgress.user_id == self.user_id
        ).count()

    def get_category_stats(self):
        # Get all categories first
        categories = self.db.query(Category).all()
        
        # Get attempts per category with accuracy
        stats = (
            self.db.query(
                Category.id,
                Category.name,
                func.count(QuestionAttempt.id).label('total_attempts'),
                func.sum(case((QuestionAttempt.is_correct, 1), else_=0)).label('correct_attempts')
            )
            .join(Question, Question.category_id == Category.id)
            .outerjoin(QuestionAttempt, 
                      (QuestionAttempt.question_id == Question.id) & 
                      (QuestionAttempt.user_id == self.user_id))
            .group_by(Category.id, Category.name)
            .all()
        )

        return [
            {
                'category_id': stat.id,
                'category_name': stat.name,
                'total_attempts': stat.total_attempts or 0,
                'correct_attempts': stat.correct_attempts or 0,
                'accuracy': round((stat.correct_attempts / stat.total_attempts * 100) 
                                if stat.total_attempts and stat.correct_attempts 
                                else 0, 1)
            }
            for stat in stats
        ] 