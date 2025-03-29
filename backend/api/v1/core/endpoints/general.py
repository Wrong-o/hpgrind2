from api.v1.core.models import User
from db_setup import get_db
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import delete, insert, select, update
from sqlalchemy.orm import Session, joinedload, selectinload
from sqlalchemy.exc import IntegrityError
from security import get_current_user

router = APIRouter()


@router.get("/users", status_code=200)
def list_users(db: Session = Depends(get_db)):
    users = db.scalars(select(User)).all()
    if not users:
        raise HTTPException(status_code=404, detail="No users found")
    return users

@router.get("/user_achievements", status_code=200)
def get_user_achievements(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    user = db.query(User).filter(User.id == current_user.id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Logga in för att få rekomenderade uppgifter")
    return user.recommended_path

@router.get("/user_stats", status_code=200)
def get_user_stats(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    user = db.query(User).filter(User.id == current_user.id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Logga in för att få rekomenderade uppgifter")
    return "successfull return of user stats"