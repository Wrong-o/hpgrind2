#
from typing import Annotated
from api.v1.core.models import User, Token, EmailVerificationToken, PasswordResetToken
from api.v1.core.schemas import (
    TokenSchema,
    UserOutSchema,
    UserRegisterSchema,
    PasswordResetRequestSchema,
    PasswordResetConfirmSchema
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
    send_password_reset_email,
    generate_verification_token,
    send_verification_email
)
from fastapi import APIRouter, Depends, HTTPException, status, Response
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import ValidationError
from sqlalchemy.orm import Session
from sqlalchemy import delete, select
from sqlalchemy.exc import IntegrityError
import logging
from datetime import datetime, timezone, timedelta
from settings import settings

router = APIRouter()

logger = logging.getLogger(__name__)
@router.post("/token")
def login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: Session = Depends(get_db),
) -> TokenSchema:
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
    
    # Check if the user's email is verified
    if not user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="email_not_verified",
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
    logger.debug(f"Registering user: {user}")
    try:
        # Check if email already exists
        existing_user = db.execute(
            select(User).where(User.email == user.email)
        ).scalars().first()

        if existing_user:
            logger.warning(f"Email already registered: {user.email}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )

        # Password validation is now handled by the Pydantic model
        logger.debug(f"Creating user with email: {user.email}")
        hashed_password = hash_password(user.password)
        new_user = User(
            **user.model_dump(exclude={"password"}), hashed_password=hashed_password
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        # Generate verification token and send verification email
        logger.debug(f"Generating verification token for user ID: {new_user.id}")
        verification_token = generate_verification_token(new_user.id, db)
        logger.debug(f"Sending verification email to: {new_user.email}")
        send_verification_email(new_user.email, verification_token)
        
        logger.info(f"User registered successfully: {new_user.email}")
        return new_user
    except ValidationError as ve:
        logger.error(f"Validation error: {ve}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(ve)
        )
    except Exception as e:
        logger.error(f"Unexpected error during user registration: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ett oväntat fel uppstod"
        )

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

@router.post("/password-reset-confirm", status_code=status.HTTP_200_OK)
def confirm_password_reset(
    reset_confirm: PasswordResetConfirmSchema,
    db: Session = Depends(get_db),
):
    """
    Confirm password reset and set new password
    This endpoint validates the reset token and updates the user's password
    """
    # Find the reset token
    reset_token = db.execute(
        select(PasswordResetToken)
        .where(PasswordResetToken.token == reset_confirm.token)
        .where(PasswordResetToken.used == False)
    ).scalars().first()
    
    if not reset_token:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired password reset token"
        )
    
    # Check if token is expired (based on creation time + expiry minutes)
    token_age = datetime.now(timezone.utc) - reset_token.created
    if token_age > timedelta(minutes=int(settings.PASSWORD_RESET_TOKEN_EXPIRE_MINUTES)):
        # Mark token as used to prevent reuse
        reset_token.used = True
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password reset token has expired"
        )
    
    # Get the user
    user = reset_token.user
    
    # Update the password
    user.hashed_password = hash_password(reset_confirm.new_password)
    
    # Mark the token as used
    reset_token.used = True
    
    db.commit()
    
    return {"message": "Lösenordet har uppdaterats. Du kan nu logga in med ditt nya lösenord."}

@router.get("/verify-email")
def verify_email(token: str, db: Session = Depends(get_db)):
    """
    Verify a user's email address using the token sent via email
    """
    # Find the verification token
    verification_token = db.execute(
        select(EmailVerificationToken)
        .where(EmailVerificationToken.token == token)
        .where(EmailVerificationToken.used == False)
    ).scalars().first()
    
    if not verification_token:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired verification token"
        )
    
    # Mark the user as verified
    user = verification_token.user
    user.is_verified = True
    
    # Mark the token as used
    verification_token.used = True
    
    db.commit()
    
    return {"message": "Email verified successfully"}

@router.post("/resend-verification")
def resend_verification(
    email: str, 
    db: Session = Depends(get_db)
):
    """
    Resend verification email to a user
    """
    # Find the user by email
    user = db.execute(select(User).where(User.email == email)).scalars().first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Check if the user is already verified
    if user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User is already verified"
        )
    
    # Generate a new verification token
    token = generate_verification_token(user.id, db)
    
    # Send the verification email
    success = send_verification_email(user.email, token)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to send verification email"
        )
    
    return {"message": "Verification email resent successfully"}
