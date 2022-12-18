import random
import string
from typing import Dict

from sqlalchemy.orm import Session
from starlette.testclient import TestClient

from app import crud
from app.core.config import settings
from app.core.security import get_password_hash


def random_lower_string(amount: int = 32) -> str:
    return "".join(random.choices(string.ascii_lowercase, k=amount))


def random_email() -> str:
    return f"{random_lower_string(10)}@{random_lower_string(5)}.com"


def random_password() -> str:
    return get_password_hash(random_lower_string(8))


def random_int(min: int = 1, max: int = 100) -> int:
    return random.randint(min, max)


def random_bool():
    return bool(random.getrandbits(1))


def get_user_ids(db: Session):
    users = crud.user.get_all(db)
    return [user.id for user in users]


def get_schedule_ids(db: Session):
    schedules = crud.schedule.get_all(db)
    return [schedule.id for schedule in schedules]


def get_company_ids(db: Session):
    companies = crud.company.get_all(db)
    return [company.id for company in companies]


def get_employment_ids(db: Session):
    employments = crud.employment.get_all(db)
    return [employment.id for employment in employments]


def get_position_ids(db: Session):
    positions = crud.position.get_all(db)
    return [position.id for position in positions]


def random_user(db: Session):
    return random.choice(get_user_ids(db))


def random_schedule(db: Session):
    return random.choice(get_schedule_ids(db))


def random_company(db: Session):
    return random.choice(get_company_ids(db))


def random_employment(db: Session):
    return random.choice(get_employment_ids(db))


def random_position(db: Session):
    return random.choice(get_position_ids(db))


def get_superuser_token_headers(client: TestClient) -> Dict[str, str]:
    login_data = {
        "username": settings.FIRST_SUPERUSER,
        "password": settings.FIRST_SUPERUSER_PASSWORD,
    }
    r = client.post(f"{settings.API_V1_STR}/login/access-token", data=login_data)
    tokens = r.json()
    a_token = tokens["access_token"]
    headers = {"Authorization": f"Bearer {a_token}"}
    return headers
