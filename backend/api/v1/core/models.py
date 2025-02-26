from datetime import datetime

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


class Premium(Base):
    __tablename__ = "premium"

    user_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("users.id"),
        primary_key=True)

    is_premium: Mapped[bool] = mapped_column(Boolean, default=False)
    expiration_date: Mapped[datetime] = mapped_column(DateTime)


class User_history(Base):
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
