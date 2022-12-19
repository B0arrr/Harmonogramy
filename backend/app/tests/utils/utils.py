import random
import string
from typing import Dict, List

from sqlalchemy.orm import Session
from starlette.testclient import TestClient

from app import crud
from app.core.config import settings
from app.core.security import get_password_hash
from app.models import ScheduleUser


def random_lower_string(amount: int = 32) -> str:
    return "".join(random.choices(string.ascii_lowercase, k=amount))


def random_email() -> str:
    return f"{random_lower_string(10)}@{random_lower_string(5)}.com"


def random_password() -> str:
    return get_password_hash(random_lower_string(8))


def random_int(min: int = 1, max: int = 100) -> int:
    return random.randint(min, max)


def random_bool() -> bool:
    return bool(random.getrandbits(1))


def get_user_ids(db: Session) -> List[int]:
    users = crud.user.get_all(db)
    return [user.id for user in users]


def get_schedule_ids(db: Session) -> List[int]:
    schedules = crud.schedule.get_all(db)
    return [schedule.id for schedule in schedules]


def get_company_ids(db: Session) -> List[int]:
    companies = crud.company.get_all(db)
    return [company.id for company in companies]


def get_employment_ids(db: Session) -> List[int]:
    employments = crud.employment.get_all(db)
    return [employment.id for employment in employments]


def get_position_ids(db: Session) -> List[int]:
    positions = crud.position.get_all(db)
    return [position.id for position in positions]


def random_user(db: Session) -> int:
    return random.choice(get_user_ids(db))


def random_schedule(db: Session) -> int:
    return random.choice(get_schedule_ids(db))


def random_company(db: Session) -> int:
    return random.choice(get_company_ids(db))


def random_employment(db: Session) -> int:
    return random.choice(get_employment_ids(db))


def random_position(db: Session) -> int:
    return random.choice(get_position_ids(db))


def random_schedule_for_user(db: Session, user_id: int) -> int:
    schedules = crud.schedule_user.get_all_user_schedules(db, user_id=user_id)
    schedule = random.choice(schedules)
    return schedule.id


def random_schedule_user(db: Session) -> ScheduleUser:
    schedules = crud.schedule_user.get_all(db)
    return random.choice(schedules)


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
