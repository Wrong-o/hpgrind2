from typing import Annotated
from api.v1.core.models import User, Token
from api.v1.core.schemas import (
    TokenSchema,
    UserOutSchema,
    UserRegisterSchema
)
from db_setup import get_db
from security import (
    hash_password,
)
from fastapi import APIRouter, Depends, HTTPException, status, Response
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import ValidationError
from sqlalchemy.orm import Session
from sqlalchemy import delete, select
from sqlalchemy.exc import IntegrityError

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/user/create", status_code=status.HTTP_201_CREATED)
def register_user(
    user: UserRegisterSchema, db: Session = Depends(get_db)
    ) -> UserOutSchema:
    # TODO ADD VALIDATION TO CREATION OF PASSWORD
    hashed_password = hash_password(user.password)
    new_user = User(
        **user.model_dump(exclude={"password"}), hashed_password=hashed_password
    )
    db.add(new_user)
    db.commit()
    return new_user