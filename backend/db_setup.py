from sqlalchemy import create_engine
from sqlalchemy.orm import Session

from api.v1.core.models import Base
from settings import settings

engine = create_engine(f"{settings.DATABASE_URL}", echo=True)


def init_db():
    # Import all models to ensure they are registered
    from api.v1.core.models import User, Token, Premium, User_history
    
    # Create all tables
    Base.metadata.create_all(bind=engine)


def get_db():
    with Session(engine, expire_on_commit=False) as session:
        yield session
