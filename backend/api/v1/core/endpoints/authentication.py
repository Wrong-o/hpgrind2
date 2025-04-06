from typing import Annotated
from api.v1.core.models import User, Token
from api.v1.core.schemas import (
    TokenSchema,
    UserOutSchema,
    UserRegisterSchema,
    PasswordResetRequestSchema
)
from db_setup import get_db
from security import (
    get_current_token,
    get_current_user,
    hash_password,
    verify_password,
    create_database_token,
)
from email_service import (
    get_user_by_email,
    generate_password_reset_token,
    send_password_reset_email
)
from fastapi import APIRouter, Depends, HTTPException, status, Response
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import ValidationError
from sqlalchemy.orm import Session
from sqlalchemy import delete, select
from sqlalchemy.exc import IntegrityError

router = APIRouter()


@router.post("/token")
def login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: Session = Depends(get_db),
) -> TokenSchema:
    """
    Login a user
    This endpoint validates the user's credentials and returns an access token
    """
    user = (
        db.execute(
            select(User).where(User.email == form_data.username),
        )
        .scalars()
        .first()
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User does not exist",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Passwords do not match",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_database_token(user_id=user.id, db=db)
    return {"access_token": access_token.token, "token_type": "Bearer"}


@router.post("/user/create", status_code=status.HTTP_201_CREATED)
def register_user(
    user: UserRegisterSchema, db: Session = Depends(get_db)
) -> UserOutSchema:
    """
    Register a new user
    This endpoint creates a new user in the database
    """
    # Check if email already exists
    existing_user = db.execute(
        select(User).where(User.email == user.email)
    ).scalars().first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Validate password requirements
    if len(user.password) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Lösenordet måste vara minst 8 tecken långt"
        )
    if not any(c.islower() for c in user.password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Lösenordet måste innehålla minst en liten bokstav"
        )
    if not any(c.isupper() for c in user.password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Lösenordet måste innehålla minst en stor bokstav"
        )
    if not any(c.isdigit() for c in user.password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Lösenordet måste innehålla minst en siffra"
        )

    hashed_password = hash_password(user.password)
    new_user = User(
        **user.model_dump(exclude={"password"}), hashed_password=hashed_password
    )
    db.add(new_user)
    db.commit()
    return new_user


@router.delete("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(
    current_token: Token = Depends(get_current_token),
    db: Session = Depends(get_db),
):
    """
    Logout a user
    This endpoint invalidates the user's current token
    """
    db.execute(delete(Token).where(Token.token == current_token.token))
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("/me", response_model=UserOutSchema)
def read_user_me(
    current_user: User = Depends(get_current_user),
):
    """
    Get the current user's information
    This endpoint returns the current user's information
    """
    return current_user

@router.post("/password-reset-request", status_code=status.HTTP_200_OK)
def request_password_reset(
    reset_request: PasswordResetRequestSchema,
    db: Session = Depends(get_db),
):
    """
    Request a password reset email
    This endpoint sends a password reset link to the user email
    """
    user = get_user_by_email(session=db, email=reset_request.email)
    if not user:
        return {
            "message": "En länk för att återställa ditt lösenord har skickats till din email"
        }
    token = generate_password_reset_token(user_id=user.id, db=db)
    send_password_reset_email(reset_request.email, token)

    return {
        "message": "En länk för att återställa ditt lösenord har skickats till din email"
    }
