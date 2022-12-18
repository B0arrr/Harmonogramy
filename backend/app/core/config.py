import secrets

from pydantic import BaseSettings, EmailStr


class Settings(BaseSettings):
    API_V1_STR: str = "/api"
    SQLALCHEMY_DATABASE_URI: str = "postgresql://postgres:mysecretpassword@localhost:5050/app"

    SECRET_KEY: str = secrets.token_urlsafe(32)
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8

    FIRST_SUPERUSER: EmailStr = "test@example.com"
    FIRST_SUPERUSER_PASSWORD: str = "test123"

    class Config:
        case_sensitive = True


settings = Settings()
