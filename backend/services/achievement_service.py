from sqlalchemy.orm import Session
from models.database_models import Achievement, UserAchievement, QuestionAttempt
from datetime import datetime, timedelta
from sqlalchemy import func


class AchievementManager:
    def __init__(self, db: Session, user_id: int):
        self.db = db
        self.user_id = user_id

    def check_achievements(self):
        """Check and award all possible achievements"""
        self._check_accuracy_achievements()
        self._check_speed_achievements()
        self._check_streak_achievements()
        self._check_category_achievements()
        self._check_milestone_achievements()

    def _check_accuracy_achievements(self):
        accuracy_achievements = {
            "Beginner": 60,
            "Intermediate": 75,
            "Advanced": 85,
            "Expert": 95,
            "Master": 98
        }

        total_correct = self.db.query(func.count(QuestionAttempt.id)).filter(
            QuestionAttempt.user_id == self.user_id,
            QuestionAttempt.is_correct == True
        ).scalar()

        total_attempts = self.db.query(func.count(QuestionAttempt.id)).filter(
            QuestionAttempt.user_id == self.user_id
        ).scalar()

        if total_attempts > 0:
            accuracy = (total_correct / total_attempts) * 100
            for title, required_accuracy in accuracy_achievements.items():
                if accuracy >= required_accuracy:
                    self._award_achievement(f"Accuracy {title}", "accuracy", required_accuracy)

    def _check_streak_achievements(self):
        streak_achievements = {
            "Consistent": 3,
            "Dedicated": 7,
            "Committed": 14,
            "Unstoppable": 30,
            "Legendary": 100
        }

        current_streak = self._calculate_current_streak()
        for title, required_streak in streak_achievements.items():
            if current_streak >= required_streak:
                self._award_achievement(f"Streak {title}",
                                        "streak", required_streak)

    def _award_achievement(self,
                           name: str,
                           requirement_type: str,
                           requirement_value: float):
        achievement = self.db.query(Achievement).filter(
            Achievement.name == name
        ).first()

        if not achievement:
            achievement = Achievement(
                name=name,
                description=f"Achieve {requirement_value} in {requirement_type}",
                requirement_type=requirement_type,
                requirement_value=requirement_value
            )
            self.db.add(achievement)
            self.db.commit()

        existing = self.db.query(UserAchievement).filter(
            UserAchievement.user_id == self.user_id,
            UserAchievement.achievement_id == achievement.id
        ).first()

        if not existing:
            user_achievement = UserAchievement(
                user_id=self.user_id,
                achievement_id=achievement.id
            )
            self.db.add(user_achievement)
            self.db.commit() 