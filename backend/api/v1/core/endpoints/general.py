from api.v1.core.models import User, UserAchievements, UserHistory
from api.v1.core.schemas import UserAchievementsOut, UserAnswerIn, UserHistoryOut
from db_setup import get_db
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import delete, insert, select, update, func, distinct, case
from sqlalchemy.orm import Session, joinedload, selectinload
from sqlalchemy.exc import IntegrityError
from security import get_current_user
from typing import List, Dict, Any
router = APIRouter()


@router.get("/user_achievements", status_code=200, response_model=list[UserAchievementsOut])
def get_user_achievements(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    achievements = (
        db.query(UserAchievements)
        .options(joinedload(UserAchievements.achievement))
        .filter(UserAchievements.user_id == current_user.id)
        .all()
    )
    if not achievements:
        return []
    return achievements

@router.get("/user_stats", status_code=200)
def get_user_stats(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    user = db.query(User).filter(User.id == current_user.id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Logga in för att få rekomenderade uppgifter")
    return "successfull return of user stats"

@router.get("/category_stats", status_code=200, response_model=List[Dict[str, Any]])
def get_category_stats(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Get statistics for each category from user_history table

    Returns:
        List[Dict[str, Any]]: A list of dictionaries containing the category, total answers, and correct answers
    """
    category_stats = (
        db.query(
            UserHistory.category,
            func.count(UserHistory.id).label("total_answers"),
            func.sum(case(
                [(UserHistory.correct == True, 1)],
                else_=0
            )).label("correct")
        )
        .filter(UserHistory.user_id == current_user.id)
        .group_by(UserHistory.category)
        .all()
    )
    
    results = [
        {
            "category": stat.category,
            "total_answers": stat.total_answers,
            "correct": stat.correct if stat.correct is not None else 0
        }
        for stat in category_stats
    ]
    
    if not results:
        return []
    
    return results

@router.get("/user_history", status_code=200, response_model=List[UserHistoryOut])
def get_user_history(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Get the user's question history
    
    Returns:
        List[UserHistoryOut]: A list of the user's question history
    """
    try:
        user_history = (
            db.query(UserHistory)
            .filter(UserHistory.user_id == current_user.id)
            .order_by(UserHistory.created_at.desc())  # Sort by newest first
            .all()
        )
        
        if not user_history:
            return []
        
        return user_history
    except Exception as e:
        # Log the error but return an empty list rather than throwing an exception
        print(f"Error fetching user history: {str(e)}")
        return []
    
@router.post("/submit_quiz_answer", status_code=200)
def submit_quiz_answer(answer: UserAnswerIn, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Submit a user's answer to a question
    
    Args:
        answer (UserAnswerIn): The user's answer to a question
        
    Returns:
        dict: A status and message about the operation
    """
    user = get_current_user(token=answer.token, db=db)
    return user.id
