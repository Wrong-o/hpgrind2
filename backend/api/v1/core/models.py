from datetime import datetime, timezone
from typing import List

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import DeclarativeBase, relationship, Mapped, mapped_column


class Base(DeclarativeBase):
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    def __repr__(self):
        return super().__repr__()


class User(Base):
    __tablename__ = "users"

    email: Mapped[str] = mapped_column(String, unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=func.now())
    tokens: Mapped[List["Token"]] = relationship(back_populates="user")
    reset_tokens: Mapped[List["PasswordResetToken"]] = relationship(back_populates="user")


class Premium(Base):
    __tablename__ = "premium"

    user_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("users.id"),
        primary_key=True)

    is_premium: Mapped[bool] = mapped_column(Boolean, default=False)
    expiration_date: Mapped[datetime] = mapped_column(DateTime)


class UserHistory(Base):
    __tablename__ = "user_history"

    user_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("users.id"),
        primary_key=True)
    timestamp: Mapped[datetime] = mapped_column(DateTime, default=func.now())
    subject: Mapped[str] = mapped_column(String)
    category: Mapped[str] = mapped_column(String)
    moment: Mapped[str] = mapped_column(Text)
    difficulty: Mapped[str] = mapped_column(String)
    skipped: Mapped[bool] = mapped_column(Boolean, default=False)
    time_spent: Mapped[int] = mapped_column(Integer)
    correct: Mapped[bool] = mapped_column(Boolean, default=False)


class Token(Base):
    __tablename__ = "tokens"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True)
    created: Mapped[datetime] = mapped_column(
        DateTime,
        default=lambda: datetime.now(timezone.utc)
    )
    token: Mapped[str] = mapped_column(unique=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    user: Mapped["User"] = relationship(back_populates="tokens")

class PasswordResetToken(Base):
    """Token used for password reset"""
    __tablename__ = "password_reset_tokens"
    created: Mapped[datetime] = mapped_column(
        DateTime,
        default=lambda: datetime.now(timezone.utc)
    )
    token: Mapped[str] = mapped_column(unique=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    user: Mapped["User"] = relationship(back_populates="reset_tokens")
    used: Mapped[bool] = mapped_column(Boolean, default=False)

class Achievement(Base):
    __tablename__ = "achievements"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String)
    description: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=func.now())
    user_achievements: Mapped[List["UserAchievements"]] = relationship(back_populates="achievement")

class UserAchievements(Base):
    __tablename__ = "user_achievements"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("users.id"))
    achievement_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("achievements.id"))
    timestamp: Mapped[datetime] = mapped_column(DateTime, default=func.now())
    achievement: Mapped["Achievement"] = relationship(back_populates="user_achievements")
