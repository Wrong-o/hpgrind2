from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, HTTPException, status, requests
from api.v1.core.models import Base
from api.v1.core.schemas import User
from db_setup import init_db, get_db
from api.v1.routers import router
from sqlalchemy import delete, insert, select, update, text
from sqlalchemy.orm import Session, joinedload, selectinload
from fastapi.middleware.cors import CORSMiddleware
import sqlalchemy.exc

async def lifespan(app: FastAPI):
    # Initialize database with all tables
    init_db()
    
    # Run migration to add created column to tokens table if it doesn't exist
    db = next(get_db())
    try:
        # First check if column exists
        try:
            db.execute(text("SELECT created FROM tokens LIMIT 1"))
            print("Column 'created' already exists in tokens table")
        except sqlalchemy.exc.ProgrammingError:
            # Need to rollback the failed transaction
            db.rollback()
            
            # Now add the column in a new transaction
            try:
                print("Adding 'created' column to tokens table...")
                db.execute(text("ALTER TABLE tokens ADD COLUMN created TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL"))
                db.commit()
                print("Successfully added 'created' column to tokens table")
            except Exception as e:
                db.rollback()
                print(f"Error adding column: {str(e)}")
    except Exception as e:
        print(f"Error during migration: {str(e)}")
    finally:
        db.close()
    
    yield


app = FastAPI(lifespan=lifespan)
app.include_router(router, prefix="/api/v1")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)