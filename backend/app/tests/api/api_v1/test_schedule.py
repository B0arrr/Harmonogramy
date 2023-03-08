from datetime import timedelta

from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app import crud
from app.core.config import settings
from app.tests.utils.schedule import get_last_day, create_random_schedule


def test_create_schedule(
        client: TestClient, superuser_token_headers: dict, db: Session
) -> None:
    data = {
        "start_day": str(get_last_day(db) + timedelta(days=1)),
        "day_off": False
    }
    response = client.post(
        f"{settings.API_V1_STR}/schedule/create_schedule",
        headers=superuser_token_headers,
        json=data
    )
    assert response.status_code == 200
    content = response.json()
    assert content["start_day"] == data["start_day"]
    assert content["day_off"] == data["day_off"]
    assert "id" in content


def test_get_schedule_by_id(
        client: TestClient, superuser_token_headers: dict, db: Session
) -> None:
    schedule = create_random_schedule(db)
    response = client.get(
        f"{settings.API_V1_STR}/schedule/get_schedule_by_id/{schedule.id}",
        headers=superuser_token_headers
    )
    assert response.status_code == 200
    content = response.json()
    assert content["id"] == schedule.id
    assert content["start_day"] == str(schedule.start_day)
    assert content["day_off"] == schedule.day_off


def test_get_schedule_id(
        client: TestClient, superuser_token_headers: dict, db: Session
) -> None:
    schedule = create_random_schedule(db)
    response = client.get(
        f"{settings.API_V1_STR}/schedule/get_schedule_id/"
        f"{schedule.start_day}",
        headers=superuser_token_headers
    )
    assert response.status_code == 200
    content = response.json()
    assert content == schedule.id


def test_get_all_schedules(
        client: TestClient, superuser_token_headers: dict, db: Session
) -> None:
    schedules = crud.schedule.get_all(db)
    response = client.get(
        f"{settings.API_V1_STR}/schedule/get_all_schedules",
        headers=superuser_token_headers
    )
    assert response.status_code == 200
    content = response.json()
    assert len(schedules) == len(content)


def test_update_schedule(
        client: TestClient, superuser_token_headers: dict, db: Session
) -> None:
    schedule = create_random_schedule(db)
    start_day = str(schedule.start_day)
    day_off = not schedule.day_off
    response = client.put(
        f"{settings.API_V1_STR}/schedule/update_schedule/id/"
        f"{schedule.id}/start_day/{start_day}/day_off/{day_off}",
        headers=superuser_token_headers
    )
    assert response.status_code == 200
    content = response.json()
    assert content["id"] == schedule.id
    assert content["start_day"] == str(schedule.start_day)
    assert content["day_off"] == day_off


def test_delete_schedule(
        client: TestClient, superuser_token_headers: dict, db: Session
) -> None:
    schedule = create_random_schedule(db)
    response = client.delete(
        f"{settings.API_V1_STR}/schedule/delete_schedule/{schedule.id}",
        headers=superuser_token_headers
    )
    assert response.status_code == 200
    content = response.json()
    assert content["id"] == schedule.id
    assert content["start_day"] == str(schedule.start_day)
    assert content["day_off"] == schedule.day_off
