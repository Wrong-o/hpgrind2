"""
Script to manually run the migrations for tokens table.
This is a more comprehensive solution that checks for
and creates both the table and required columns if needed.
"""
from sqlalchemy import text, inspect
from db_setup import get_db, engine
import sqlalchemy.exc
from sqlalchemy.orm import Session

def run_complete_tokens_migration():
    """
    Run a complete migration for the tokens table:
    1. Create tokens table if it doesn't exist
    2. Add user_id column if it doesn't exist
    3. Add token column if it doesn't exist
    4. Add created column if it doesn't exist
    """
    db = next(get_db())
    inspector = inspect(engine)
    
    try:
        # Check if tokens table exists
        if 'tokens' not in inspector.get_table_names():
            print("Creating 'tokens' table...")
            create_tokens_table(db)
        
        # Check and add columns if needed
        existing_columns = [c['name'] for c in inspector.get_columns('tokens')]
        
        if 'user_id' not in existing_columns:
            print("Adding 'user_id' column to tokens table...")
            add_user_id_column(db)
            
        if 'token' not in existing_columns:
            print("Adding 'token' column to tokens table...")
            add_token_column(db)
            
        if 'created' not in existing_columns:
            print("Adding 'created' column to tokens table...")
            add_created_column(db)
            
        print("Migration completed successfully")
            
    except Exception as e:
        db.rollback()
        print(f"Error during migration: {str(e)}")
    finally:
        db.close()

def create_tokens_table(db: Session):
    """Create the tokens table with id as primary key"""
    try:
        # PostgreSQL syntax for creating table with foreign key
        db.execute(text("""
            CREATE TABLE tokens (
                id SERIAL PRIMARY KEY,
                user_id UUID NOT NULL,
                CONSTRAINT fk_tokens_user_id FOREIGN KEY (user_id) REFERENCES users(id)
            )
        """))
        db.commit()
        print("Successfully created tokens table")
    except Exception as e:
        db.rollback()
        print(f"Error creating tokens table: {str(e)}")

def add_user_id_column(db: Session):
    """Add user_id column with foreign key constraint"""
    try:
        # PostgreSQL supports adding foreign key constraints in ALTER TABLE
        db.execute(text("""
            ALTER TABLE tokens 
            ADD COLUMN user_id UUID NOT NULL,
            ADD CONSTRAINT fk_tokens_user_id FOREIGN KEY (user_id) REFERENCES users(id)
        """))
        db.commit()
        print("Successfully added user_id column to tokens table")
    except Exception as e:
        db.rollback()
        print(f"Error adding user_id column: {str(e)}")

def add_token_column(db: Session):
    """Add token column with unique constraint"""
    try:
        db.execute(text("""
            ALTER TABLE tokens 
            ADD COLUMN token VARCHAR NOT NULL
        """))
        # Create unique index in a separate step
        db.execute(text("""
            CREATE UNIQUE INDEX IF NOT EXISTS ix_tokens_token ON tokens (token)
        """))
        db.commit()
        print("Successfully added token column to tokens table")
    except Exception as e:
        db.rollback()
        print(f"Error adding token column: {str(e)}")

def add_created_column(db: Session):
    """Add created timestamp column with default value"""
    try:
        db.execute(text("""
            ALTER TABLE tokens 
            ADD COLUMN created TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
        """))
        db.commit()
        print("Successfully added created column to tokens table")
    except Exception as e:
        db.rollback()
        print(f"Error adding created column: {str(e)}")

if __name__ == "__main__":
    run_complete_tokens_migration() 