from sqlalchemy.orm import Session
from models.database_models import QuestionAttempt, Question
from datetime import datetime, timedelta
import math

class SpacedRepetitionSystem:
    def __init__(self, db: Session, user_id: int):
        self.db = db
        self.user_id = user_id

    def get_review_questions(self, count: int = 5):
        """Get questions due for review based on spaced repetition"""
        now = datetime.utcnow()
        
        # Get all attempts for this user
        attempts = self.db.query(QuestionAttempt).filter(
            QuestionAttempt.user_id == self.user_id
        ).order_by(QuestionAttempt.attempted_at.desc()).all()

        # Group by question and calculate next review date
        question_reviews = {}
        for attempt in attempts:
            if attempt.question_id not in question_reviews:
                interval = self._calculate_interval(attempt)
                next_review = attempt.attempted_at + timedelta(days=interval)
                question_reviews[attempt.question_id] = next_review

        # Get questions due for review
        due_questions = []
        for question_id, review_date in question_reviews.items():
            if review_date <= now:
                question = self.db.query(Question).filter(
                    Question.id == question_id
                ).first()
                if question:
                    due_questions.append(question)

        return due_questions[:count]

    def _calculate_interval(self, attempt: QuestionAttempt) -> int:
        """Calculate next interval using SuperMemo-2 algorithm"""
        previous_attempts = self.db.query(QuestionAttempt).filter(
            QuestionAttempt.user_id == self.user_id,
            QuestionAttempt.question_id == attempt.question_id,
            QuestionAttempt.attempted_at < attempt.attempted_at
        ).order_by(QuestionAttempt.attempted_at.desc()).all()

        if not previous_attempts:
            return 1 if attempt.is_correct else 0

        # Calculate EF (easiness factor)
        consecutive_correct = 0
        for prev in previous_attempts:
            if prev.is_correct:
                consecutive_correct += 1
            else:
                break

        ef = max(1.3, 2.5 - 0.8 * (1 - consecutive_correct/len(previous_attempts)))
        interval = 1 if not attempt.is_correct else math.ceil(6 * ef ** (consecutive_correct - 1))

        return interval 