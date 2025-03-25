"""
Script to fix the tokens table in PostgreSQL.
This should be run in the Docker environment where PostgreSQL is used.
"""
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
import os

# Get database connection parameters from environment
database_url = os.environ.get("DATABASE_URL", "postgresql://postgres:postgres@db:5432/hpg")

# Parse the database URL
if database_url.startswith("postgresql://"):
    parts = database_url.replace("postgresql://", "").split("/")
    credentials_host = parts[0].split("@")
    
    if "@" in database_url:
        credentials = credentials_host[0].split(":")
        username = credentials[0]
        password = credentials[1] if len(credentials) > 1 else ""
        
        host_port = credentials_host[1].split(":")
        host = host_port[0]
        port = host_port[1] if len(host_port) > 1 else "5432"
    else:
        # No credentials in URL
        username = "postgres"
        password = "postgres"
        host_port = credentials_host[0].split(":")
        host = host_port[0]
        port = host_port[1] if len(host_port) > 1 else "5432"
    
    database = parts[1] if len(parts) > 1 else "hpg"
else:
    print(f"Invalid database URL format: {database_url}")
    exit(1)

print(f"Connecting to PostgreSQL at {host}:{port}, database: {database}, user: {username}")

try:
    # Connect to PostgreSQL
    conn = psycopg2.connect(
        dbname=database,
        user=username,
        password=password,
        host=host,
        port=port
    )
    conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    cursor = conn.cursor()
    
    # Check if the tokens table exists
    cursor.execute("SELECT EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name = 'tokens')")
    table_exists = cursor.fetchone()[0]
    
    if not table_exists:
        print("The tokens table does not exist. Creating it...")
        cursor.execute("""
            CREATE TABLE tokens (
                id SERIAL PRIMARY KEY,
                user_id UUID NOT NULL REFERENCES users(id),
                created TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
            )
        """)
        print("Tokens table created successfully.")
    
    # Check if the token column exists
    cursor.execute("""
        SELECT EXISTS(
            SELECT 1 
            FROM information_schema.columns 
            WHERE table_name = 'tokens' AND column_name = 'token'
        )
    """)
    token_column_exists = cursor.fetchone()[0]
    
    if not token_column_exists:
        print("Adding token column to tokens table...")
        cursor.execute("ALTER TABLE tokens ADD COLUMN token VARCHAR NOT NULL")
        cursor.execute("CREATE UNIQUE INDEX ix_tokens_token ON tokens (token)")
        print("Token column added successfully.")
    else:
        print("Token column already exists.")
    
    # Check if the created column exists
    cursor.execute("""
        SELECT EXISTS(
            SELECT 1 
            FROM information_schema.columns 
            WHERE table_name = 'tokens' AND column_name = 'created'
        )
    """)
    created_column_exists = cursor.fetchone()[0]
    
    if not created_column_exists:
        print("Adding created column to tokens table...")
        cursor.execute("""
            ALTER TABLE tokens 
            ADD COLUMN created TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
        """)
        print("Created column added successfully.")
    else:
        print("Created column already exists.")
    
    # Check table structure
    cursor.execute("""
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'tokens'
    """)
    columns = cursor.fetchall()
    print("\nCurrent tokens table structure:")
    for column in columns:
        print(f"- {column[0]}: {column[1]}")
    
    print("\nMigration completed successfully")
    
except Exception as e:
    print(f"Error: {str(e)}")
finally:
    if 'conn' in locals():
        conn.close() 