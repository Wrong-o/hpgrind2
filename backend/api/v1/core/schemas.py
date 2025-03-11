from pydantic import BaseModel, Field, ConfigDict, EmailStr, field_validator
from datetime import datetime
from enum import Enum
import re


class UserBase(BaseModel):
    email: EmailStr = Field(
        description="The email of the user"
    )


class UserCreate(UserBase):
    password: str

    @field_validator("password")
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError("Lösenordet måste vara minst 8 tecken långt")
        if not re.search(r'[A-Z]', v):
            raise ValueError(
                "Lösenordet måste innehålla minst en stor bokstav")
        if not re.search(r'[a-z]', v):
            raise ValueError(
                "Lösenordet måste innehålla minst en liten bokstav")
        if not re.search(r'\d', v):
            raise ValueError("Lösenordet måste innehålla minst en siffra")
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', v):
            raise ValueError(
                "Lösenordet måste innehålla minst ett specialtecken (!@#$%^&*(),.?\":{}|<>)")
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

    