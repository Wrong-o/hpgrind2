from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, HTTPException, status, requests
from api.v1.core.models import Base
from api.v1.core.schemas import User
from db_setup import get_db, engine
from api.v1.routers import router
from sqlalchemy import delete, insert, select, update, text
from sqlalchemy.orm import Session, joinedload, selectinload
from fastapi.middleware.cors import CORSMiddleware
import sqlalchemy.exc
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from typing import Optional
from pydantic import BaseModel
from api.v1.core.endpoints import question_director, authentication, general

async def lifespan(app: FastAPI):
    # Initialize database with all tables
    try:
        print("Initializing database schema...")
        Base.metadata.create_all(bind=engine)
        print("Database schema initialized successfully.")
    except Exception as e:
        print(f"Error initializing database schema: {str(e)}")
    
    yield


app = FastAPI(lifespan=lifespan)
app.include_router(router, prefix="/api/v1")

# CORS Configuration - updated to allow all required endpoints
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with actual frontend origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

app.include_router(question_director.router, prefix="/api/v1/question_generator", tags=["question_generator"])
app.include_router(authentication.router, prefix="/api/auth", tags=["auth"])
app.include_router(general.router, prefix="/api/v1/general", tags=["general"])