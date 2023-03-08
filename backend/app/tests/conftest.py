from typing import Generator, Dict

import pytest as pytest
from starlette.testclient import TestClient

from app.db.init_db import init_db
from app.db.sessions import SessionLocal
from app.main import app
from app.models import ScheduleUser, User, Position, Employment, Company, \
    Schedule
from app.tests.utils.company import create_random_company
from app.tests.utils.employment import create_random_employment
from app.tests.utils.position import create_random_position
from app.tests.utils.user import create_random_user
from app.tests.utils.utils import get_superuser_token_headers


@pytest.fixture(scope="session")
def db() -> Generator:
    yield SessionLocal()


@pytest.fixture(scope="module")
def client() -> Generator:
    with TestClient(app) as c:
        yield c


@pytest.fixture(scope="session", autouse=True)
def cleanup():
    db = SessionLocal()
    init_db(db)
    create_random_employment(db)
    create_random_position(db)
    create_random_company(db)
    for i in range(5):
        create_random_user(db)
    db.query(ScheduleUser).delete()
    db.commit()
    yield
    db.query(ScheduleUser).delete()
    db.query(User).delete()
    db.query(Position).delete()
    db.query(Employment).delete()
    db.query(Company).delete()
    db.query(Schedule).delete()
    db.commit()


@pytest.fixture(scope="module")
def superuser_token_headers(client: TestClient) -> Dict[str, str]:
    return get_superuser_token_headers(client)
