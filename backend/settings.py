from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Database settings
    DB_URL: str = "postgresql://postgres:postgres@db:5432/hpg"
    
    # Security settings
    SECRET_KEY: str = "your-secret-key-here"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 120
    PASSWORD_RESET_TOKEN_EXPIRE_MINUTES: int = 60
    
    # Service settings
    POSTMARK_TOKEN: str = "dummy-token"  # Default value for development
    FRONTEND_BASE_URL: str = "http://localhost:5173"
    
    # Environment
    ENV: str = "development"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Settings()