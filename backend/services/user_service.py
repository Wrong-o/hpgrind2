from sqlalchemy.orm import Session
from models.database_models import DBUser
from models.pydantic_models import UserCreate
from fastapi import HTTPException, status

def get_user_by_email(db: Session, email: str):
    return db.query(DBUser).filter(DBUser.email == email).first()

def create_user(db: Session, user: UserCreate):
    try:
        print(f"Creating user with email: {user.email}")  # Debug log
        # Check if user already exists
        db_user = get_user_by_email(db, user.email)
        if db_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )

        # Create new user
        hashed_password = DBUser.hash_password(user.password)
        db_user = DBUser(
            email=user.email,
            password=hashed_password
        )

        try:
            db.add(db_user)
            db.commit()
            db.refresh(db_user)
            print(f"Successfully created user with id: {db_user.id}")  # Debug log
            return db_user
        except Exception as e:
            db.rollback()
            print(f"Database error: {str(e)}")  # Debug log
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Database error: {str(e)}"
            )
    except Exception as e:
        print(f"User creation error: {str(e)}")  # Debug log
        raise

def authenticate_user(db: Session, email: str, password: str):
    user = get_user_by_email(db, email)
    if not user:
        return False
    if not user.verify_password(password):
        return False
    return user

def save_user_history(db: Session, user_id: int, subject: str, category: str, moment: str, difficulty: int, skipped: bool, time: int, is_correct: bool, question_data: str):
    """Save user's question attempt history"""
    from models.database_models import UserHistory
    
    history = UserHistory(
        user_id=user_id,
        subject=subject,
        category=category,
        moment=moment,
        difficulty=difficulty,
        skipped=skipped,
        time=time,
        is_correct=is_correct,
        question_data=question_data
    )
    
    try:
        db.add(history)
        db.commit()
        db.refresh(history)
        return history
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save history: {str(e)}"
        )