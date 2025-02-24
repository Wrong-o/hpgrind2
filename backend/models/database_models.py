from sqlalchemy import Column, Integer, String, Boolean, DateTime, SmallInteger, Float, ForeignKey, Enum, Table
from sqlalchemy.orm import relationship, backref
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import UUID
from database import Base
from passlib.context import CryptContext
import uuid
from datetime import datetime

# Password hashing configuration
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Many-to-many relationship table for questions and delmoment
question_delmoment = Table('question_delmoment', Base.metadata,
    Column('question_id', Integer, ForeignKey('questions.id')),
    Column('delmoment_id', Integer, ForeignKey('delmoment.id'))
)

class DBUser(Base):
    __tablename__ = "user_table"

    id = Column(Integer, primary_key=True)
    email = Column(String(100), nullable=False, unique=True)
    password = Column(String(100), nullable=False)

    # Relationships
    question_attempts = relationship("QuestionAttempt", back_populates="user")
    history = relationship("UserHistory", back_populates="user")
    premium = relationship("Premium", back_populates="user", uselist=False)
    category_progress = relationship("UserCategoryProgress", back_populates="user")
    achievements = relationship("UserAchievement", back_populates="user")
    gear = relationship("UserGear", back_populates="user")

    @staticmethod
    def hash_password(password: str) -> str:
        return pwd_context.hash(password)

    def verify_password(self, plain_password: str) -> bool:
        return pwd_context.verify(plain_password, self.password)

class UserHistory(Base):
    __tablename__ = "user_history"

    id = Column(Integer, primary_key=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    user_id = Column(Integer, ForeignKey("user_table.id"), nullable=False)
    subject = Column(String(100), nullable=False)
    category = Column(String(100), nullable=False)
    moment = Column(String(100), nullable=False)
    difficulty = Column(SmallInteger, nullable=False)
    skipped = Column(Boolean, default=False)
    time = Column(SmallInteger, nullable=False)  # Time in seconds
    is_correct = Column(Boolean, default=False)
    question_data = Column(String, nullable=True)  # Store the full question data as JSON string

    # Relationships
    user = relationship("DBUser", back_populates="history")

class Premium(Base):
    __tablename__ = "premium"

    user_id = Column(Integer, ForeignKey("user_table.id"), primary_key=True)
    tier = Column(SmallInteger, nullable=False)

    # Relationships
    user = relationship("DBUser", back_populates="premium")

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    description = Column(String)
    parent_id = Column(Integer, ForeignKey("categories.id"))
    
    parent = relationship("Category", remote_side=[id], back_populates="subcategories")
    subcategories = relationship("Category", back_populates="parent")
    questions = relationship("Question", back_populates="category")
    user_progress = relationship("UserCategoryProgress", back_populates="category")
    achievements = relationship("Achievement", back_populates="category")

class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    question_type = Column(String)  # "math", "text", etc.
    amne = Column(String)  # "Kvalitativ" or "Kvantitativ"
    provdel = Column(String)  # "XYZ", "NOG", "PRO", "DTK"
    difficulty = Column(Float)
    expected_time = Column(Integer)
    category_id = Column(Integer, ForeignKey("categories.id"))
    
    # Relationships
    category = relationship("Category", back_populates="questions")
    delmoment = relationship("Delmoment", secondary=question_delmoment, back_populates="questions")
    attempts = relationship("QuestionAttempt", back_populates="question")

class QuestionAttempt(Base):
    __tablename__ = "question_attempts"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("user_table.id"), nullable=False)
    question_id = Column(Integer, ForeignKey("questions.id"), nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    correct = Column(Boolean, nullable=False)
    time_taken = Column(Float)  # Time taken in seconds
    
    user = relationship("DBUser", back_populates="question_attempts")
    question = relationship("Question", back_populates="attempts")

class UserCategoryProgress(Base):
    __tablename__ = "user_category_progress"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("user_table.id"), nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    progress = Column(Float, default=0.0)  # Progress as a percentage
    last_updated = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("DBUser", back_populates="category_progress")
    category = relationship("Category", back_populates="user_progress")

class Achievement(Base):
    __tablename__ = "achievements"

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    description = Column(String(100), nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"))
    
    category = relationship("Category", back_populates="achievements")
    users = relationship("UserAchievement", back_populates="achievement")

class UserAchievement(Base):
    __tablename__ = "user_achievements"

    user_id = Column(Integer, ForeignKey("user_table.id"), primary_key=True)
    achievement_id = Column(Integer, ForeignKey("achievements.id"), primary_key=True)
    achieved = Column(Boolean, default=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user = relationship("DBUser", back_populates="achievements")
    achievement = relationship("Achievement", back_populates="users")

class Gear(Base):
    __tablename__ = "gear"

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    type = Column(String(100), nullable=False)

    # Relationships
    users = relationship("UserGear", back_populates="gear")

class UserGear(Base):
    __tablename__ = "user_gear"

    user_id = Column(Integer, ForeignKey("user_table.id"), primary_key=True)
    gear_id = Column(Integer, ForeignKey("gear.id"), primary_key=True)
    unlocked = Column(Boolean, default=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user = relationship("DBUser", back_populates="gear")
    gear = relationship("Gear", back_populates="users")

class Delmoment(Base):
    __tablename__ = "delmoment"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True)
    description = Column(String)
    
    # Relationships
    questions = relationship("Question", secondary=question_delmoment, back_populates="delmoment") 