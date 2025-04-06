from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Database settings
    DB_URL: str
    
    # Security settings
    SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 120
    PASSWORD_RESET_TOKEN_EXPIRE_MINUTES: int = 60
    
    # Service settings
    POSTMARK_TOKEN: str
    FRONTEND_BASE_URL: str
    
    # CORS settings
    CORS_ORIGINS: list[str] = []
    
    # Environment
    ENV: str = "development"

    def get_cors_origins(self):
        if self.ENV == "development":
            return [
                "http://localhost:3000",
                "http://localhost:5173",
                self.FRONTEND_BASE_URL
            ]
        return [self.FRONTEND_BASE_URL]

    @property
    def cors_origins(self) -> list[str]:
        return self.get_cors_origins()

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Settings()