from pydantic import BaseModel, EmailStr, validator
from typing import Optional, List
from datetime import datetime
import re


class UserBase(BaseModel):
    email: EmailStr


class UserCreate(UserBase):
    password: str

    @validator('password')
    def validate_password(cls, v):
        # At least 8 characters long
        if len(v) < 8:
            raise ValueError("minst 8 tecken")

        # Must contain at least one uppercase letter
        if not re.search(r'[A-Z]', v):
            raise ValueError("minst en stor bokstav")

        # Must contain at least one lowercase letter
        if not re.search(r'[a-z]', v):
            raise ValueError("minst en liten bokstav")

        # Must contain at least one number
        if not re.search(r'\d', v):
            raise ValueError("minst en siffra")

        # Must contain at least one special character
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', v):
            raise ValueError("minst ett specialtecken (!@#$%^&*(),.?\":{}|<>)")

        return v


class User(UserBase):
    id: int

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None


class UserHistory(BaseModel):
    id: int
    timestamp: datetime
    subject: str
    category: str
    moment: str
    difficulty: int
    skipped: bool
    time: int

    class Config:
        from_attributes = True


class Achievement(BaseModel):
    id: int
    name: str
    description: str

    class Config:
        from_attributes = True


class UserAchievement(BaseModel):
    achievement_id: int
    achieved: bool
    timestamp: datetime
    achievement: Achievement

    class Config:
        from_attributes = True


class Gear(BaseModel):
    id: int
    name: str
    type: str

    class Config:
        from_attributes = True


class UserGear(BaseModel):
    gear_id: int
    unlocked: bool
    timestamp: datetime
    gear: Gear

    class Config:
        from_attributes = True
