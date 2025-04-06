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

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Settings()