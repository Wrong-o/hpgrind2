from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str

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