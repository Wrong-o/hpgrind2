from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base
from passlib.context import CryptContext
import enum

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class DBUser(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    category_progress = relationship("UserCategoryProgress", back_populates="user")
    question_attempts = relationship("QuestionAttempt", back_populates="user")
    achievements = relationship("UserAchievement", back_populates="user")

    @staticmethod
    def hash_password(password: str) -> str:
        return pwd_context.hash(password)

    def verify_password(self, password: str) -> bool:
        return pwd_context.verify(password, self.hashed_password)

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    description = Column(String)
    parent_id = Column(Integer, ForeignKey("categories.id"), nullable=True)
    
    # Relationships
    subcategories = relationship("Category", 
                               backref=relationship("Category", remote_side=[id]))
    questions = relationship("Question", back_populates="category")
    user_progress = relationship("UserCategoryProgress", back_populates="category")
    achievements = relationship("Achievement", back_populates="category")

class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    category_id = Column(Integer, ForeignKey("categories.id"))
    question_type = Column(String)  # e.g., 'math', 'power_rule', etc.
    difficulty = Column(Float)  # 1-10 scale
    expected_time = Column(Integer)  # in seconds
    
    # Relationships
    category = relationship("Category", back_populates="questions")
    attempts = relationship("QuestionAttempt", back_populates="question")

class QuestionAttempt(Base):
    __tablename__ = "question_attempts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    question_id = Column(Integer, ForeignKey("questions.id"))
    is_correct = Column(Boolean)
    time_taken = Column(Integer)  # in seconds
    attempted_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("DBUser", back_populates="question_attempts")
    question = relationship("Question", back_populates="attempts")

class UserCategoryProgress(Base):
    __tablename__ = "user_category_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    category_id = Column(Integer, ForeignKey("categories.id"))
    accuracy = Column(Float, default=0.0)  # 0-100%
    avg_time = Column(Float)  # average time in seconds
    total_attempts = Column(Integer, default=0)
    last_attempt = Column(DateTime(timezone=True))
    progress_score = Column(Float, default=0.0)  # Calculated score based on accuracy and time
    
    # Relationships
    user = relationship("DBUser", back_populates="category_progress")
    category = relationship("Category", back_populates="user_progress")

class Achievement(Base):
    __tablename__ = "achievements"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True)
    description = Column(String)
    icon = Column(String)  # Path/URL to achievement icon
    requirement_type = Column(String)  # e.g., 'accuracy', 'speed', 'streak'
    requirement_value = Column(Float)  # Target value to unlock
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=True)
    
    # Relationships
    category = relationship("Category", back_populates="achievements")
    user_achievements = relationship("UserAchievement", back_populates="achievement")

class UserAchievement(Base):
    __tablename__ = "user_achievements"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    achievement_id = Column(Integer, ForeignKey("achievements.id"))
    unlocked_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("DBUser", back_populates="achievements")
    achievement = relationship("Achievement", back_populates="user_achievements") 