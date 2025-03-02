from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

# Get environment
ENV = os.getenv("ENV", "development")

# Choose connection string based on environment
if ENV == "production":
    DATABASE_URL = os.getenv("PROD_DATABASE_URL")
else:
    DATABASE_URL = os.getenv(
        "DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/hpg")

# Ensure URL is PostgreSQL
if not DATABASE_URL.startswith('postgresql://'):
    raise ValueError("DATABASE_URL must be a PostgreSQL connection string")

# Create engine with PostgreSQL specific settings
engine = create_engine(
    DATABASE_URL,
    echo=False,  # Disable SQL logging
    pool_pre_ping=True,  # Enable connection health checks
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
