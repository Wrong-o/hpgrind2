from sqlalchemy import create_engine, event
from sqlalchemy.orm import Session
from sqlalchemy.exc import OperationalError
import time
import logging
from api.v1.core.models import Base
from settings import settings

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)
# Connection timeout settings
CONNECT_TIMEOUT = 10  # seconds
MAX_OVERFLOW = 10     # Maximum overflow pool size
POOL_SIZE = 5         # Connection pool size
POOL_RECYCLE = 3600   # Recycle connections after 1 hour
POOL_TIMEOUT = 30     # Timeout for getting connection from pool
POOL_PRE_PING = True  # Pre-ping connections to ensure they're alive
# Create engine with enhanced parameters for production
try:
    logger.info(f"Connecting to database with URL: {settings.DB_URL.split('@')[0]}:***@{settings.DB_URL.split('@')[1] if '@' in settings.DB_URL else '(invalid URL)'}")
    
    engine = create_engine(
        settings.DB_URL,
        echo=settings.ENV != 'production',  # Enable echo only in non-production
        pool_size=POOL_SIZE,
        max_overflow=MAX_OVERFLOW,
        pool_timeout=POOL_TIMEOUT,
        pool_recycle=POOL_RECYCLE,
        pool_pre_ping=POOL_PRE_PING,
        connect_args={'connect_timeout': CONNECT_TIMEOUT}
    )
    
    # Log each connection checkout for debugging
    if settings.ENV != 'production':
        @event.listens_for(engine, "checkout")
        def checkout(dbapi_connection, connection_record, connection_proxy):
            logger.debug("Connection checked out")
            
    logger.info("Database engine created successfully")
except Exception as e:
    logger.error(f"Error creating database engine: {str(e)}")
    raise

def get_db(retries=3, retry_delay=1):
    """
    Generator function that yields a database session.
    Used for dependency injection in FastAPI endpoints.
    
    Args:
        retries: Number of connection retries
        retry_delay: Delay between retries in seconds
    """
    attempt = 0
    last_error = None
    
    while attempt < retries:
        try:
            with Session(engine, expire_on_commit=False) as session:
                yield session
                return
        except OperationalError as e:
            attempt += 1
            last_error = e
            logger.warning(f"Database connection attempt {attempt} failed: {str(e)}")
            
            if attempt < retries:
                logger.info(f"Retrying database connection in {retry_delay} seconds...")
                time.sleep(retry_delay)
    
    # If we get here, all retries have failed
    logger.error(f"All database connection attempts failed after {retries} retries")
    raise last_error or OperationalError("Failed to connect to database after multiple attempts")
