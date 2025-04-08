from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, HTTPException, status, requests
from api.v1.core.models import Base
from api.v1.core.schemas import User
from db_setup import get_db, engine
from api.v1.routers import router
from sqlalchemy import delete, insert, select, update, text, inspect
from sqlalchemy.orm import Session, joinedload, selectinload
from fastapi.middleware.cors import CORSMiddleware
import sqlalchemy.exc
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from typing import Optional
from pydantic import BaseModel
from api.v1.core.endpoints import question_director, authentication, general
import os
from settings import settings
import logging
#
logger = logging.getLogger(__name__)

async def lifespan(app: FastAPI):
    logger.debug("Starting lifespan")
    logger.debug(f"DB_URL: {settings.DB_URL}")
    # Initialize database with all tables
    try:
        print("Initializing database schema...")
        # Ensure the database exists and is accessible
        inspector = inspect(engine)
        tables_exist = len(inspector.get_table_names()) > 0

        # Create all tables if they don't exist
        Base.metadata.create_all(bind=engine)
        print("Database schema initialized successfully.")
        
        # Check if we need to add basic seed data (if tables were just created)
        if not tables_exist:
            print("No tables found before initialization, adding seed data...")
            try:
                from init_db import initialize_database
                initialize_database()
                print("Seed data added successfully.")
            except Exception as seed_error:
                print(f"Warning: Could not add seed data: {str(seed_error)}")
        
        print(f"Running in {settings.ENV} mode")
        print(f"CORS origins: {settings.cors_origins}")
    except Exception as e:
        print(f"Error initializing database schema: {str(e)}")
    
    yield


app = FastAPI(lifespan=lifespan)
app.include_router(router, prefix="/api/v1")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.cors_origins] if isinstance(settings.cors_origins, str) else settings.cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "X-Requested-With", "Accept", 
                  "Origin", "Access-Control-Request-Method", 
                  "Access-Control-Request-Headers", "DNT", 
                  "User-Agent", "If-Modified-Since", "Cache-Control", "Range"],
    expose_headers=["Content-Length", "Content-Range"],
    max_age=86400  # Cache preflight requests for 24 hours
)

app.include_router(question_director.router, prefix="/api/v1/question_generator", tags=["question_generator"])
app.include_router(authentication.router, prefix="/api/auth", tags=["auth"])
app.include_router(general.router, prefix="/api/v1/general", tags=["general"])