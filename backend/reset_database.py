"""
Reset Database Script

This script drops and recreates all tables in the database based on 
the SQLAlchemy models. It provides a fresh start without relying on 
migrations or fixing ad-hoc issues.
"""
from sqlalchemy import text, inspect
from db_setup import get_db, engine
from api.v1.core.models import Base, User, Token, Premium, User_history
import os

def reset_database():
    """
    Reset the entire database:
    1. Drop all tables
    2. Recreate tables from SQLAlchemy models
    """
    print("Starting database reset process...")
    
    # Get PostgreSQL connection from environment variable or use default
    database_url = os.environ.get("DATABASE_URL", "postgresql://postgres:postgres@db:5432/hpg")
    if not database_url.startswith("postgresql://"):
        print("Error: This script requires a PostgreSQL database.")
        return
    
    # Step 1: Drop all tables
    print("Dropping all existing tables...")
    db = next(get_db())
    inspector = inspect(engine)
    existing_tables = inspector.get_table_names()
    
    try:
        # Disable foreign key checks for easier dropping
        db.execute(text("SET session_replication_role = 'replica'"))
        
        # Drop each table
        for table in existing_tables:
            print(f"Dropping table: {table}")
            db.execute(text(f'DROP TABLE IF EXISTS "{table}" CASCADE'))
        
        db.commit()
        print("All tables dropped successfully.")
        
        # Step 2: Create all tables using SQLAlchemy models
        print("Creating new tables from SQLAlchemy models...")
        Base.metadata.create_all(bind=engine)
        print("Database tables created successfully.")
        
        # Restore foreign key checks
        db.execute(text("SET session_replication_role = 'origin'"))
        db.commit()
        
        print("Database reset completed successfully.")
    except Exception as e:
        db.rollback()
        print(f"Error during database reset: {str(e)}")
    finally:
        # Always restore foreign key checks
        try:
            db.execute(text("SET session_replication_role = 'origin'"))
            db.commit()
        except:
            pass
        db.close()

if __name__ == "__main__":
    reset_database() 