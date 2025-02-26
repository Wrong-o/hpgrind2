from api.v1.core.models import User
from db_setup import get_db
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import delete, insert, select, update
from sqlalchemy.orm import Session, joinedload, selectinload
from sqlalchemy.exc import IntegrityError

router = APIRouter()


@router.get("/users", status_code=200)
def list_users(db: Session = Depends(get_db)):
    users = db.scalars(select(User)).all()
    if not users:
        raise HTTPException(status_code=404, detail="No users found")
    return users
