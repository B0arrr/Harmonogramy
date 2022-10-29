from pydantic import BaseSettings


class Settings(BaseSettings):
    SQLALCHEMY_DATABASE_URI: str = "postgresql://postgres:mysecretpassword@localhost:5050/app"

    class Config:
        case_sensitive = True


settings = Settings()