"""
Database Initialization Script

This script initializes the database by creating all tables based on 
the SQLAlchemy models directly, without relying on migrations.
"""
from db_setup import engine
from api.v1.core.models import Base, User, Token, Premium, User_history

def initialize_database():
    """
    Initialize the database by creating all tables based on SQLAlchemy models.
    """
    print("Initializing database schema...")
    
    try:
        # Create all tables defined in the models
        Base.metadata.create_all(bind=engine)
        print("Database schema created successfully.")
        
        print("Database initialization completed.")
    except Exception as e:
        print(f"Error during database initialization: {str(e)}")

if __name__ == "__main__":
    initialize_database() 