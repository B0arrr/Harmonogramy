import secrets

from pydantic import BaseSettings, EmailStr, AnyHttpUrl


class Settings(BaseSettings):
    PROJECT_NAME: str = "Harmonogramy"

    SERVER_HOST: AnyHttpUrl = "http://localhost:8000/api"

    API_V1_STR: str = "/api"
    SQLALCHEMY_DATABASE_URI: str = "postgresql://postgres:mysecretpassword@db:5432/app"  # noqa

    SECRET_KEY: str = secrets.token_urlsafe(32)
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8

    FIRST_SUPERUSER: EmailStr = "test@example.com"
    FIRST_SUPERUSER_PASSWORD: str = "test123"

    EMAIL_RESET_TOKEN_EXPIRE_HOURS: int = 48
    EMAIL_TEMPLATES_DIR: str = "./app/email-templates/build"
    EMAILS_ENABLED: bool = False

    EMAILS_FROM_NAME: str = "Harmonogramy"
    EMAILS_FROM_EMAIL: EmailStr = "test@test.com"

    class Config:
        case_sensitive = True


settings = Settings()
