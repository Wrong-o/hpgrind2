from pydantic import BaseModel, Field, ConfigDict, EmailStr, validator
from datetime import datetime
from enum import Enum
import re


class UserBase(BaseModel):
    email: EmailStr = Field(
        description="The email of the user"
    )


class UserCreate(UserBase):
    password: str

    @validator("password")
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

    class Config:
        orm_mode = True


class TokenSchema(BaseModel):
    access_token: str
    token_type: str


class UserRegisterSchema(BaseModel):
    email: EmailStr
    password: str
    
    class Config:
        orm_mode = True


class UserOutSchema(BaseModel):
    id: int
    email: EmailStr
    
    class Config:
        orm_mode = True


class UserSchema(BaseModel):
    id: int
    email: EmailStr
    created: datetime
    
    class Config:
        orm_mode = True

    