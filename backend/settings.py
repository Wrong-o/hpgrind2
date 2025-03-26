from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    DATABASE_URL: str
    secret_key: str
    access_token_expire_minutes: int
    env: str

    class Config:
        env_file = ".env"

class Settings(BaseSettings):
    DB_URL: str
    ACCESS_TOKEN_EXPIRE_MINUTES: str
    PASSWORD_RESET_TOKEN_EXPIRE_MINUTES: int = 60
    POSTMARK_TOKEN: str
    FRONTEND_BASE_URL: str = "http://localhost:5173"

    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()