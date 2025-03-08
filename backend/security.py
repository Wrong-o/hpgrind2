import base64
from datetime import UTC, datetime, timedelta, timezone
from random import SystemRandom
from typing import Annotated
from uuid import uuid4, UUID

from api.v1.core.models import User, Token
from db_setup import get_db
from settings import settings
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from pydantic import ValidationError
from sqlalchemy import select
from sqlalchemy.orm import Session

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/v1/auth/token")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

DEFAULT_ENTROPY = 32
_sysrand = SystemRandom()

def hash_password(password: str) -> str:
    return pwd_context.hash(password)