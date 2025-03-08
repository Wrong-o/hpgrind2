from pydantic import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str
    secret_key: str
    access_token_expire_minutes: int
    env: str

    class Config:
        env_file = ".env"


settings = Settings()
