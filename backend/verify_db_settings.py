"""
Database Settings Verification Script

This script checks database connection settings and verifies that they are correctly configured.
It's particularly useful for diagnosing connection issues in production environments.
"""
import os
import sys
import time
import socket
from urllib.parse import urlparse
from sqlalchemy import create_engine
from sqlalchemy.exc import OperationalError

def parse_db_url(db_url):
    """Parse a database URL into its components"""
    try:
        # Handle postgresql+psycopg2:// format
        if db_url.startswith('postgresql+psycopg2://'):
            db_url = db_url.replace('postgresql+psycopg2://', 'postgresql://')
        
        result = urlparse(db_url)
        
        # Get username and password
        credentials = result.netloc.split('@')[0]
        username = credentials.split(':')[0] if ':' in credentials else credentials
        password = credentials.split(':')[1] if ':' in credentials else 'No password'
        
        # Get host and port
        host_port = result.netloc.split('@')[-1]
        host = host_port.split(':')[0] if ':' in host_port else host_port
        port = host_port.split(':')[1] if ':' in host_port else '5432'
        
        # Get database name
        database = result.path.strip('/')
        
        return {
            'username': username,
            'password': '******' if password else 'No password', 
            'host': host,
            'port': port,
            'database': database
        }
    except Exception as e:
        print(f"Error parsing DB URL: {str(e)}")
        return None

def test_network_connection(host, port, timeout=5):
    """Test if we can connect to the database host and port"""
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(timeout)
        result = sock.connect_ex((host, int(port)))
        sock.close()
        return result == 0
    except Exception as e:
        print(f"Error testing network connection: {str(e)}")
        return False

def check_db_settings():
    """Check database connection settings"""
    print("\n===== Database Settings Verification =====\n")
    
    # Check if DB_URL is set
    db_url = os.environ.get('DB_URL')
    if not db_url:
        print("ERROR: DB_URL environment variable is not set")
        return False
    
    print("DB_URL is set ✓")
    
    # Parse DB_URL
    db_config = parse_db_url(db_url)
    if not db_config:
        print("ERROR: Could not parse DB_URL")
        return False
    
    print("\nDatabase Configuration:")
    print(f"  Username: {db_config['username']}")
    print(f"  Password: {db_config['password']}")
    print(f"  Host: {db_config['host']}")
    print(f"  Port: {db_config['port']}")
    print(f"  Database: {db_config['database']}")
    
    # Test network connectivity
    print("\nTesting network connectivity to database host...")
    if test_network_connection(db_config['host'], db_config['port']):
        print(f"  Network connection to {db_config['host']}:{db_config['port']} successful ✓")
    else:
        print(f"  ERROR: Could not connect to {db_config['host']}:{db_config['port']}")
        print("  Possible causes:")
        print("  - Database server is not running")
        print("  - Firewall is blocking the connection")
        print("  - Network route to the server is unavailable")
        print("  - Database is not listening on the specified port")
        return False
    
    # Test database connection
    print("\nTesting database connection...")
    try:
        engine = create_engine(db_url, connect_args={'connect_timeout': 10})
        connection = engine.connect()
        connection.close()
        print("  Database connection successful ✓")
    except OperationalError as e:
        print(f"  ERROR: Could not connect to database: {str(e)}")
        print("\n  Possible causes:")
        print("  - Database credentials are incorrect")
        print("  - Database does not exist")
        print("  - PostgreSQL pg_hba.conf doesn't allow connections from this IP")
        print("  - Database server is rejecting connections")
        return False
    
    print("\n✅ All database settings checks passed!")
    return True

if __name__ == "__main__":
    success = check_db_settings()
    if not success:
        print("\n⚠️ Database settings verification failed. Please fix the issues above.")
        sys.exit(1)
    else:
        print("\nDatabase settings are correctly configured.") 