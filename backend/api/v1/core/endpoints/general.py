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
##

@router.get("/user_achievements", status_code=200, response_model=list[UserAchievementsOut])
def get_user_achievements(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Get the user's achievements

    Returns:
        list[UserAchievementsOut]: A list of the user's achievements
        empty list if no achievements
        
    This endpoint is used to populate the achievements section of the user dashboard.
    """
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
    """
    Get the user's statistics and information
    
    This endpoint retrieves user statistics including progress, achievements, and other user data.
    It's used to populate the user dashboard with relevant information.
    
    Returns:
        str: Success message (to be expanded with actual statistics)
    
    Raises:
        HTTPException: 404 if user is not logged in
    """
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
    print("hello")
    try:
        user_history = (
            db.query(UserHistory)
            .filter(UserHistory.user_id == current_user.id)
            .order_by(UserHistory.timestamp.desc())  # Changed from created_at to timestamp
            .all()
        )
        print(user_history)
        if not user_history:
            return []
        
        return user_history
    except Exception as e:
        print(f"Error fetching user history: {str(e)}")
        return []
    
@router.post("/submit_quiz_answer", status_code=201)
def submit_quiz_answer(answer: UserAnswerIn, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Submit a user's answer to a question and save it to their history.
    
    Args:
        answer (UserAnswerIn): The user's answer details.
        db (Session): Database session dependency.
        current_user (User): The authenticated user dependency.
        
    Returns:
        dict: A status message indicating success.
        
    Raises:
        HTTPException: 500 if there is a database error during saving.
    """
    try:
        # Create a new UserHistory record
        new_history_entry = UserHistory(
            user_id=current_user.id, # Use the authenticated user's ID
            subject=answer.subject,
            category=answer.category,
            moment=answer.moment,
            difficulty=answer.difficulty,
            skipped=answer.skipped,
            time_spent=answer.time_spent,
            correct=answer.correct,
            # timestamp is set automatically by default=func.now()
        )
        
        # Add to session and commit
        db.add(new_history_entry)
        db.commit()
        db.refresh(new_history_entry) # Optional: refresh to get the generated ID/timestamp
        
        return {"status": "success", "message": "Answer submitted successfully."}

    except IntegrityError as e:
        db.rollback() # Rollback the transaction on error
        print(f"Database Integrity Error submitting answer: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not save answer due to a database integrity issue."
        )
    except Exception as e:
        db.rollback()
        print(f"Error submitting answer: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred while submitting the answer."
        )

