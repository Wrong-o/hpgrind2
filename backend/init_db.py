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

def initialize_database():
    """
    Initialize the database by creating all tables based on SQLAlchemy models.
    Also adds basic seed data if the database is empty.
    """
    print("Initializing database schema...")
    
    try:
        # Create all tables defined in the models
        Base.metadata.create_all(bind=engine)
        print("Database schema created successfully.")
        
        # Check if the database is empty (no users)
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

if __name__ == "__main__":
    initialize_database() 