"""
Database Diagnostic Script

This script provides detailed diagnostics about database connection issues.
It attempts various connection methods and provides detailed error information
to help troubleshoot database connectivity problems.
"""
import os
import sys
import time
import socket
import platform
import traceback
from urllib.parse import urlparse
import ssl
import json

try:
    import psycopg2
    PSYCOPG2_AVAILABLE = True
except ImportError:
    PSYCOPG2_AVAILABLE = False

try:
    from sqlalchemy import create_engine, text
    from sqlalchemy.exc import OperationalError, SQLAlchemyError
    SQLALCHEMY_AVAILABLE = True
except ImportError:
    SQLALCHEMY_AVAILABLE = False

def print_section(title):
    """Print a section header"""
    print("\n" + "=" * 50)
    print(f" {title} ".center(50, "="))
    print("=" * 50 + "\n")

def parse_db_url(db_url):
    """Parse a database URL into its components without showing password"""
    try:
        # Handle postgresql+psycopg2:// format
        if db_url.startswith('postgresql+psycopg2://'):
            db_url = db_url.replace('postgresql+psycopg2://', 'postgresql://')
        
        result = urlparse(db_url)
        
        # Get username and password
        credentials = result.netloc.split('@')[0]
        username = credentials.split(':')[0] if ':' in credentials else credentials
        
        # Get host and port
        host_port = result.netloc.split('@')[-1]
        host = host_port.split(':')[0] if ':' in host_port else host_port
        port = host_port.split(':')[1] if ':' in host_port else '5432'
        
        # Get database name
        database = result.path.strip('/')
        
        return {
            'username': username,
            'host': host,
            'port': port,
            'database': database,
            'scheme': result.scheme
        }
    except Exception as e:
        print(f"Error parsing DB URL: {str(e)}")
        return None

def test_network_connection(host, port, timeout=5):
    """Test if we can connect to the database host and port"""
    try:
        start_time = time.time()
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(timeout)
        result = sock.connect_ex((host, int(port)))
        duration = time.time() - start_time
        sock.close()
        
        return {
            'success': result == 0,
            'error_code': result,
            'duration': duration
        }
    except Exception as e:
        return {
            'success': False,
            'error': str(e),
            'exception_type': type(e).__name__
        }

def get_system_info():
    """Get basic system information"""
    info = {
        'platform': platform.platform(),
        'python_version': platform.python_version(),
        'node': platform.node(),
        'processor': platform.processor() or 'Unknown',
        'drivers': {
            'psycopg2': PSYCOPG2_AVAILABLE,
            'sqlalchemy': SQLALCHEMY_AVAILABLE
        }
    }
    
    # Get IP address
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        info['ip_address'] = s.getsockname()[0]
        s.close()
    except:
        info['ip_address'] = 'Unknown'
    
    return info

def test_psycopg2_connection(db_config, timeout=10):
    """Test direct connection using psycopg2"""
    if not PSYCOPG2_AVAILABLE:
        return {'success': False, 'error': 'psycopg2 is not installed'}
    
    try:
        start_time = time.time()
        conn = psycopg2.connect(
            dbname=db_config['database'],
            user=db_config['username'],
            password=os.environ.get('DB_PASSWORD', ''),
            host=db_config['host'],
            port=db_config['port'],
            connect_timeout=timeout
        )
        duration = time.time() - start_time
        
        # Test a simple query
        cursor = conn.cursor()
        cursor.execute('SELECT 1')
        result = cursor.fetchone()[0]
        cursor.close()
        conn.close()
        
        return {
            'success': True,
            'duration': duration,
            'test_query_result': result
        }
    except Exception as e:
        return {
            'success': False,
            'error': str(e),
            'exception_type': type(e).__name__,
            'traceback': traceback.format_exc()
        }

def test_sqlalchemy_connection(db_url, timeout=10):
    """Test connection using SQLAlchemy"""
    if not SQLALCHEMY_AVAILABLE:
        return {'success': False, 'error': 'SQLAlchemy is not installed'}
    
    try:
        start_time = time.time()
        engine = create_engine(
            db_url, 
            connect_args={'connect_timeout': timeout}
        )
        conn = engine.connect()
        duration = time.time() - start_time
        
        # Test a simple query
        result = conn.execute(text('SELECT 1')).scalar()
        conn.close()
        
        return {
            'success': True,
            'duration': duration,
            'test_query_result': result
        }
    except Exception as e:
        error_details = {
            'success': False,
            'error': str(e),
            'exception_type': type(e).__name__,
            'traceback': traceback.format_exc()
        }
        
        # Add more details for OperationalError
        if isinstance(e, OperationalError) and "password authentication failed" in str(e):
            error_details['likely_cause'] = "Incorrect username or password"
        elif isinstance(e, OperationalError) and "no pg_hba.conf entry" in str(e):
            error_details['likely_cause'] = "PostgreSQL server is not configured to accept connections from this IP"
        
        return error_details

def run_diagnostics():
    """Run all diagnostics and print results"""
    print_section("Database Connection Diagnostics")
    
    # Get DB_URL from environment
    db_url = os.environ.get('DB_URL')
    if not db_url:
        print("ERROR: DB_URL environment variable is not set")
        print("Please set the DB_URL environment variable and try again.")
        return False
    
    print("DB_URL is set ✓")
    
    # Parse DB_URL
    db_config = parse_db_url(db_url)
    if not db_config:
        print("ERROR: Could not parse DB_URL")
        print(f"DB_URL: {db_url[:10]}...{db_url[-10:] if len(db_url) > 20 else db_url}")
        return False
    
    # Print system info
    print_section("System Information")
    system_info = get_system_info()
    for key, value in system_info.items():
        if key == 'drivers':
            print(f"Drivers:")
            for driver, available in value.items():
                print(f"  - {driver}: {'Available ✓' if available else 'Not available ✗'}")
        else:
            print(f"{key.replace('_', ' ').title()}: {value}")
    
    # Print database configuration
    print_section("Database Configuration")
    print(f"Connection Type: {db_config['scheme']}")
    print(f"Username: {db_config['username']}")
    print(f"Host: {db_config['host']}")
    print(f"Port: {db_config['port']}")
    print(f"Database: {db_config['database']}")
    
    # Test network connectivity
    print_section("Network Connectivity Test")
    print(f"Testing connection to {db_config['host']}:{db_config['port']}...")
    network_result = test_network_connection(db_config['host'], db_config['port'])
    
    if network_result.get('success'):
        print(f"✅ Network connection successful ({network_result.get('duration', 0):.2f} seconds)")
    else:
        print(f"❌ Network connection failed: {network_result.get('error', f'Error code: {network_result.get('error_code', 'unknown')}')})")
        print("\nPossible causes:")
        print("1. Database server is not running")
        print("2. Firewall is blocking the connection")
        print("3. Incorrect host or port")
        print("4. Network route to the server is unavailable")
        
        # No need to continue if we can't connect
        print("\nNetwork connectivity failed, so database connection tests will likely fail as well.")
        print("Please fix network connectivity issues before proceeding.")
        
        # But we'll continue anyway for complete diagnostics
    
    # Direct connection with psycopg2
    if PSYCOPG2_AVAILABLE:
        print_section("Direct PostgreSQL Connection (psycopg2)")
        print("Testing direct connection using psycopg2...")
        
        # Check if DB_PASSWORD is set
        if not os.environ.get('DB_PASSWORD'):
            print("WARNING: DB_PASSWORD environment variable is not set.")
            print("If your database requires a password, this test will fail.")
            print("Please set the DB_PASSWORD environment variable temporarily for this test.")
        
        psycopg2_result = test_psycopg2_connection(db_config)
        if psycopg2_result.get('success'):
            print(f"✅ Direct connection successful ({psycopg2_result.get('duration', 0):.2f} seconds)")
            print(f"Query result: {psycopg2_result.get('test_query_result')}")
        else:
            print(f"❌ Direct connection failed: {psycopg2_result.get('error')}")
            if 'traceback' in psycopg2_result:
                print("\nError traceback:")
                print(psycopg2_result['traceback'])
    else:
        print_section("Direct PostgreSQL Connection (psycopg2)")
        print("⚠️ psycopg2 is not installed. Skipping direct connection test.")
        print("To test direct connections, install psycopg2: pip install psycopg2-binary")
    
    # SQLAlchemy connection
    if SQLALCHEMY_AVAILABLE:
        print_section("SQLAlchemy Connection")
        print("Testing connection using SQLAlchemy...")
        
        sqlalchemy_result = test_sqlalchemy_connection(db_url)
        if sqlalchemy_result.get('success'):
            print(f"✅ SQLAlchemy connection successful ({sqlalchemy_result.get('duration', 0):.2f} seconds)")
            print(f"Query result: {sqlalchemy_result.get('test_query_result')}")
        else:
            print(f"❌ SQLAlchemy connection failed: {sqlalchemy_result.get('error')}")
            if 'likely_cause' in sqlalchemy_result:
                print(f"Likely cause: {sqlalchemy_result['likely_cause']}")
            if 'traceback' in sqlalchemy_result:
                print("\nError traceback:")
                print(sqlalchemy_result['traceback'])
    else:
        print_section("SQLAlchemy Connection")
        print("⚠️ SQLAlchemy is not installed. Skipping SQLAlchemy connection test.")
        print("To test SQLAlchemy connections, install SQLAlchemy: pip install sqlalchemy")
    
    # Summary and recommendations
    print_section("Diagnosis Summary")
    
    if network_result.get('success') and (
        (PSYCOPG2_AVAILABLE and psycopg2_result.get('success')) or
        (SQLALCHEMY_AVAILABLE and sqlalchemy_result.get('success'))
    ):
        print("✅ All tests passed successfully! Your database connection is working.")
        return True
    else:
        print("❌ Some tests failed. Here are some recommendations:")
        
        if not network_result.get('success'):
            print("\n1. Check network connectivity:")
            print("   - Verify the database server is running")
            print("   - Check firewall settings on both the client and server")
            print("   - Verify the host and port are correct")
            print(f"   - Try connecting using other tools: psql -h {db_config['host']} -p {db_config['port']} -U {db_config['username']} -d {db_config['database']}")
        
        if PSYCOPG2_AVAILABLE and not psycopg2_result.get('success'):
            print("\n2. Check authentication:")
            print("   - Verify username and password are correct")
            print("   - Check pg_hba.conf on the PostgreSQL server to allow connections from this IP")
            
            # Specific error handling
            error_str = psycopg2_result.get('error', '')
            if "password authentication failed" in error_str:
                print("\n   ⚠️ Password authentication failed. Double-check your password.")
            elif "no pg_hba.conf entry" in error_str:
                print(f"\n   ⚠️ Server is not configured to accept connections from this host.")
                print(f"      Your IP: {system_info.get('ip_address', 'Unknown')}")
                print(f"      Edit pg_hba.conf on the PostgreSQL server to add:")
                print(f"      host    {db_config['database']}    {db_config['username']}    {system_info.get('ip_address', '0.0.0.0/0')}    md5")
        
        if SQLALCHEMY_AVAILABLE and not sqlalchemy_result.get('success'):
            print("\n3. SQLAlchemy-specific issues:")
            print("   - Make sure your connection string format is correct")
            print("   - Check for any SQLAlchemy-specific configuration issues")
            print(f"   - Your connection string: {db_config['scheme']}://{db_config['username']}:***@{db_config['host']}:{db_config['port']}/{db_config['database']}")
        
        print("\nIf the issues persist, consider:")
        print("1. Checking database logs for more detailed error messages")
        print("2. Temporarily allowing broader access in pg_hba.conf for testing")
        print("3. Testing from a different host to isolate network issues")
        
        return False

if __name__ == "__main__":
    success = run_diagnostics()
    sys.exit(0 if success else 1) 