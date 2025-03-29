from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from api.v1.core.models import User, User_achievements, Achievement
from db_setup import get_db
from security import get_current_user
from pydantic import BaseModel

router = APIRouter()

class AchievementResponse(BaseModel):
    id: int
    name: str
    description: str
    achieved_at: str
#TODO fortsätt här med att fixa user_achievements_endpoint
@router.get("/user_achievements", status_code=200, response_model=List[AchievementResponse])
def get_user_achievements(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Get all achievements acquired by the current user.
    Returns a list of achievement objects with their details.
    """
    # Check if user exists
    user = db.query(User).filter(User.id == current_user.id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Logga in för att se dina achievements")
    
    # Query all achievements acquired by the user
    acquired_achievements = (
        db.query(
            Achievement.id,
            Achievement.name,
            Achievement.description,
            User_achievements.timestamp.label("achieved_at")
        )
        .join(
            User_achievements,
            User_achievements.achievement_id == Achievement.id
        )
        .filter(
            User_achievements.user_id == current_user.id,
            User_achievements.achieved == True
        )
        .all()
    )
    
    # Format the response
    result = [
        {
            "id": achievement.id,
            "name": achievement.name,
            "description": achievement.description,
            "achieved_at": achievement.achieved_at.isoformat() if achievement.achieved_at else None
        }
        for achievement in acquired_achievements
    ]
    
    return result 