import base64
from datetime import UTC, datetime, timedelta, timezone
from random import SystemRandom
from typing import Annotated, Optional
from uuid import uuid4, UUID
import os

from api.v1.core.models import User, Token
from db_setup import get_db
from settings import settings
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from pydantic import ValidationError
from sqlalchemy import select
from sqlalchemy.orm import Session
from dotenv import load_dotenv
from jose import JWTError, jwt

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

DEFAULT_ENTROPY = 32
_sysrand = SystemRandom()

def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)

def token_bytes(nbytes=None):
    """Return a random byte string.
    If *nbytes* is not supplied, a reasonable default is used.
    """
    if nbytes is None:
        nbytes = DEFAULT_ENTROPY
    return _sysrand.randbytes(nbytes)

def token_urlsafe(nbytes=None):
    """Return a random URL-safe string.
    If *nbytes* is not supplied, a reasonable default is used.
    """
    tok = token_bytes(nbytes)
    return base64.urlsafe_b64encode(tok).rstrip(b"=").decode("ascii")

def create_database_token(user_id: UUID, db: Session):
    randomized_token = token_urlsafe()
    new_token= Token(token=randomized_token, user_id=user_id)
    db.add(new_token)
    db.commit()
    return new_token

def verify_database_token(token_str: str, db: Session):
    """
    Return a token
    """
    max_age = timedelta(minutes=int(settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    token = (
        db.execute(
            select(Token).where(
                Token.token == token_str,
                Token.created >= datetime.now(timezone.utc) - max_age
            ),
        )
        .scalars()
        .first()
    )
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token invalid or expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return token

def verify_token_access(token_str: str, db: Session):
    """
    Verify token access and return the token if valid
    Used by authentication functions
    """
    return verify_database_token(token_str=token_str, db=db)

def get_current_user(
        token: Annotated[str, Depends(oauth2_scheme)], db: Session = Depends(get_db)
    ):
    """
    oauth2_scheme automatically extracts the token from the authentication header 
    used to get current user
    """
    token = verify_token_access(token_str=token, db=db)
    user = token.user
    return user

def get_current_token(
        token: Annotated[str, Depends(oauth2_scheme)], db: Session = Depends(get_db)
    ):
    """
    oauth2_scheme automatically extracts the token from the authentication header 
    used to get current token for logout
    """
    token = verify_token_access(token_str=token, db=db)
    return token

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str, credentials_exception):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    return email

def get_current_user_optional(token: Optional[str] = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> Optional[User]:
    if token is None:
        return None
    try:
        return get_current_user(token, db)
    except HTTPException:
        return None