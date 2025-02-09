from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

# Get environment
ENV = os.getenv("ENV", "development")

# Choose connection string based on environment
if ENV == "production":
    DATABASE_URL = os.getenv("PROD_DATABASE_URL")
else:
    DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/hpg")

# Create engine with appropriate settings
engine = create_engine(
    DATABASE_URL,
    echo=ENV == "development",  # Only echo SQL in development
    pool_size=5,  # Default connection pool size
    max_overflow=10,  # Allow up to 10 connections beyond pool_size
    pool_timeout=30,  # Timeout after 30 seconds waiting for a connection
    pool_recycle=1800,  # Recycle connections after 30 minutes
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close() 