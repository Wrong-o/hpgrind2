"""
Database Initialization Script

This script initializes the database by creating all tables based on 
the SQLAlchemy models directly, without relying on migrations.
It also adds basic seed data if the database is empty.
"""
from db_setup import engine, get_db
from api.v1.core.models import Base, User, Token, Premium, User_history, User_achievements
from sqlalchemy.orm import Session
from sqlalchemy import inspect, text
from sqlalchemy.exc import OperationalError
import time
import os
import sys
from settings import settings

def test_connection():
    """
    Test the database connection and print diagnostics
    """
    print(f"Testing database connection to: {settings.DB_URL}")
    
    # Extract connection details without showing password
    db_url_parts = settings.DB_URL.split('@')
    if len(db_url_parts) > 1:
        host_part = db_url_parts[1]
        print(f"Connecting to host: {host_part}")
    
    try:
        # Try to connect to the database
        connection = engine.connect()
        connection.close()
        print("Database connection successful!")
        return True
    except OperationalError as e:
        print(f"Database connection failed: {str(e)}")
        print("\nPossible issues:")
        print("1. Database credentials are incorrect")
        print("2. Database server is not accessible from this host")
        print("3. PostgreSQL pg_hba.conf doesn't allow connections from this IP")
        print("4. Database server firewall is blocking connections")
        print("\nPlease check your DB_URL environment variable and database server configuration.")
        return False

def initialize_database(max_retries=3, retry_delay=5):
    """
    Initialize the database by creating all tables based on SQLAlchemy models.
    Also adds basic seed data if the database is empty.
    
    Args:
        max_retries: Maximum number of connection attempts
        retry_delay: Seconds to wait between retries
    """
    print("Starting database initialization...")
    
    # First test the connection
    for attempt in range(max_retries):
        if test_connection():
            break
        elif attempt < max_retries - 1:
            print(f"Connection attempt {attempt + 1} failed. Retrying in {retry_delay} seconds...")
            time.sleep(retry_delay)
        else:
            print("All connection attempts failed. Exiting.")
            sys.exit(1)
    
    try:
        # Create all tables defined in the models
        print("Creating database tables...")
        Base.metadata.create_all(bind=engine)
        print("Database schema created successfully.")
        
        # Check if the database is empty (no users)
        print("Checking for existing data...")
        db = next(get_db())
        try:
            # Check if User table exists and is empty
            inspector = inspect(engine)
            if 'user' in inspector.get_table_names():
                user_count = db.query(User).count()
                if user_count == 0:
                    print("Database is empty. Adding basic seed data...")
                    # Add basic seed data here
                    # Create at least one admin user or system account
                    from api.v1.core.security import get_password_hash
                    admin_user = User(
                        email="admin@example.com",
                        hashed_password=get_password_hash("admin123"),  # This is just a placeholder, should be changed
                        is_active=True
                    )
                    db.add(admin_user)
                    db.commit()
                    print("Created admin user: admin@example.com")
                    
                    # Initialize any other required seed data here
                    # ...
                    
                    print("Basic seed data added successfully.")
                else:
                    print("Database already contains data. Skipping seed data creation.")
            else:
                print("User table doesn't exist yet. Tables were just created.")
                
        except Exception as e:
            print(f"Error checking/adding seed data: {str(e)}")
            db.rollback()
        finally:
            db.close()
            
        print("Database initialization completed.")
    except Exception as e:
        print(f"Error during database initialization: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    initialize_database() 