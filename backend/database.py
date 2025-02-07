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
    connect_args = {"sslmode": "require"}
else:
    DATABASE_URL = os.getenv("DATABASE_URL")
    connect_args = {}

engine = create_engine(
    DATABASE_URL,
    echo=ENV == "development",  # Only echo in development
    pool_size=5,
    max_overflow=10,
    pool_timeout=30,
    pool_recycle=1800,
    connect_args=connect_args
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close() 