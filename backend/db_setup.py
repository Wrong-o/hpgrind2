from sqlalchemy import create_engine
from sqlalchemy.orm import Session

from api.v1.core.models import Base
from settings import settings

# Create engine with echo for debugging
engine = create_engine(f"{settings.DATABASE_URL}", echo=True)

def get_db():
    """
    Generator function that yields a database session.
    Used for dependency injection in FastAPI endpoints.
    """
    with Session(engine, expire_on_commit=False) as session:
        yield session
