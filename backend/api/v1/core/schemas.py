import re
from datetime import datetime
from enum import Enum
from typing import Literal, Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator


class UserBase(BaseModel):
    email: EmailStr = Field(description="The email of the user")


class UserCreate(UserBase):
    password: str

    @field_validator("password")
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError("Lösenordet måste vara minst 8 tecken långt")
        if not re.search(r"[A-Z]", v):
            raise ValueError("Lösenordet måste innehålla minst en stor bokstav")
        if not re.search(r"[a-z]", v):
            raise ValueError("Lösenordet måste innehålla minst en liten bokstav")
        if not re.search(r"\d", v):
            raise ValueError("Lösenordet måste innehålla minst en siffra")
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', v):
            raise ValueError(
                'Lösenordet måste innehålla minst ett specialtecken (!@#$%^&*(),.?":{}|<>)'
            )
        return v


class User(UserBase):
    id: int

    model_config = ConfigDict(from_attributes=True)


class TokenSchema(BaseModel):
    access_token: str
    token_type: str


class UserRegisterSchema(BaseModel):
    email: EmailStr
    password: str

    @field_validator("password")
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError("Lösenordet måste vara minst 8 tecken långt")
        if not re.search(r"[A-Z]", v):
            raise ValueError("Lösenordet måste innehålla minst en stor bokstav")
        if not re.search(r"[a-z]", v):
            raise ValueError("Lösenordet måste innehålla minst en liten bokstav")
        if not re.search(r"\d", v):
            raise ValueError("Lösenordet måste innehålla minst en siffra")
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', v):
            raise ValueError(
                'Lösenordet måste innehålla minst ett specialtecken (!@#$%^&*(),.?":{}|<>)'
            )
        return v

    model_config = ConfigDict(from_attributes=True)


class UserOutSchema(BaseModel):
    id: int
    email: EmailStr

    model_config = ConfigDict(from_attributes=True)


class UserSchema(BaseModel):
    id: int
    email: EmailStr
    created: datetime

    model_config = ConfigDict(from_attributes=True)


class PasswordResetRequestSchema(BaseModel):
    email: EmailStr = Field(..., description="Email address for password reset")

    model_config = ConfigDict(
        json_schema_extra={"example": {"email": "user@example.com"}}
    )


class PasswordResetConfirmSchema(BaseModel):
    token: str = Field(..., description="Password reset token recieved via email")
    new_password: str = Field(
        ..., min_length=8, description="New password that meets security"
    )

    model_config = ConfigDict(
        json_schema_extra={
            "examples": {
                "token": "randomsecuretoken",
                "new_password": "NewP@ssw0rd!",
            }
        }
    )


class EmailVerificationSchema(BaseModel):
    token: str = Field(..., description="Email verification token received via email")

    model_config = ConfigDict(
        json_schema_extra={"example": {"token": "randomsecuretoken"}}
    )


class AchievementBase(BaseModel):
    title: str
    description: str


class UserAchievementsOut(BaseModel):
    user_id: int
    achievement_id: int
    timestamp: datetime
    achievement: AchievementBase

    class Config:
        from_attributes = True


class UserAnswerIn(BaseModel):
    # token: str # Removed - token should come from Authorization header
    category: str
    subject: str
    moment: str
    difficulty: int
    skipped: bool
    time_spent: int
    correct: bool

    model_config = ConfigDict(from_attributes=True)


class UserHistoryOut(BaseModel):
    category: str
    subject: str
    moment: str
    difficulty: int
    skipped: bool
    time_spent: int  # Changed from 'time' to 'time_spent' to match model
    correct: bool

    # Add Config to allow ORM mode if not already present
    model_config = ConfigDict(from_attributes=True)


class ChatMessage(BaseModel):
    role: Literal["system", "user", "assistant"]
    content: str


class ChatBotIn(BaseModel):
    messages: list[ChatMessage]
    model_config = ConfigDict(from_attributes=True)


class ChatBotOut(BaseModel):
    message: str
