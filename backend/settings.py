from pydantic_settings import BaseSettings, SettingsConfigDict
import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class Settings(BaseSettings):
    # Database settings
    DB_URL: str = ""  # Default empty to allow validation to handle errors
    
    # Security settings
    SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 120
    PASSWORD_RESET_TOKEN_EXPIRE_MINUTES: int = 60
    
    # Service settings
    POSTMARK_TOKEN: str
    FRONTEND_BASE_URL: str
    
    # OpenAI settings
    OPENAI_API_KEY: str
    
    # Environment
    ENV: str = "development"

    @property
    def cors_origins(self) -> list[str]:
        if self.ENV == "development":
            return [
                "http://localhost:3000",
                "http://localhost:5173",
                self.FRONTEND_BASE_URL
            ]
        return [self.FRONTEND_BASE_URL]
    
    # Add validation for DB_URL
    def validate_db_url(self):
        """Validate DB_URL and provide detailed error if missing"""
        if not self.DB_URL:
            # Check environment variable directly
            db_url_env = os.environ.get("DB_URL")
            if db_url_env:
                self.DB_URL = db_url_env
                logger.warning("DB_URL loaded directly from environment, not from .env file")
            else:
                error_msg = "DB_URL is not set! Please check your environment variables or .env file."
                logger.error(error_msg)
                # In production, raise error; in development, use SQLite as fallback
                if self.ENV == "production":
                    raise ValueError(error_msg)
                else:
                    # Fallback to SQLite for local development
                    self.DB_URL = "sqlite:///./sql_app.db"
                    logger.warning(f"Using SQLite fallback database: {self.DB_URL}")
        return self.DB_URL

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )


try:
    settings = Settings()
    # Validate and set DB_URL
    settings.validate_db_url()
    
    # Logging sanitized settings for debugging
    safe_db_url = "No DB_URL set"
    if settings.DB_URL:
        parts = settings.DB_URL.split('@')
        if len(parts) > 1:
            # Hide password in logs
            safe_db_url = f"{parts[0].split(':')[0]}:****@{parts[1]}"
        else:
            safe_db_url = settings.DB_URL  # Likely SQLite
            
    logger.info(f"Settings loaded | Environment: {settings.ENV} | DB: {safe_db_url}")
except Exception as e:
    logger.critical(f"Failed to load settings: {str(e)}")
    raise