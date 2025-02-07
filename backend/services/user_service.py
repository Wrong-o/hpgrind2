from sqlalchemy.orm import Session
from models.database_models import DBUser
from models.pydantic_models import UserCreate
from fastapi import HTTPException, status
from database import get_db

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
            hashed_password=hashed_password,
            is_active=True
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