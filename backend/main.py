import logging
import os
from contextlib import asynccontextmanager
from typing import Optional

import sqlalchemy.exc
from api.v1.core.endpoints import authentication, general, question_director
from api.v1.core.models import Base
from api.v1.core.schemas import User
from api.v1.routers import router
from db_setup import engine, get_db
from fastapi import Depends, FastAPI, HTTPException, requests, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from pydantic import BaseModel
from settings import settings
from sqlalchemy import delete, insert, inspect, select, text, update
from sqlalchemy.orm import Session, joinedload, selectinload

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

# Custom exception handlers
@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request, exc):
    if exc.status_code == 404:
        return JSONResponse(
            status_code=404,
            content={"detail": "Resource not found", "path": request.url.path}
        )
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": str(exc.detail)}
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": "Invalid request parameters", "errors": str(exc)}
    )

# CORS Configuration - aligned with Nginx configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS", "PUT", "DELETE"],
    allow_headers=[
        "DNT",
        "User-Agent",
        "X-Requested-With",
        "If-Modified-Since",
        "Cache-Control",
        "Content-Type",
        "Range",
        "Authorization",
    ],
    expose_headers=["Content-Length", "Content-Range"],
    max_age=1728000,  # Matching Nginx's Access-Control-Max-Age
)

app.include_router(
    question_director.router,
    prefix="/api/v1/question_generator",
    tags=["question_generator"],
)
app.include_router(authentication.router, prefix="/api/auth", tags=["auth"])
app.include_router(general.router, prefix="/api/v1/general", tags=["general"])
