from datetime import datetime, timedelta

from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app import crud
from app.core.config import settings
from app.tests.utils.utils import random_schedule, random_user, \
    random_schedule_user


def test_create_schedule_user(
        client: TestClient, superuser_token_headers: dict, db: Session
) -> None:
    data = {
        "schedule_id": random_schedule(db),
        "user_id": random_user(db),
        "shift_start": datetime.now().strftime("%Y-%m-%dT%H:%M:%S"),
        "shift_end": (datetime.now() + timedelta(hours=8))
        .strftime("%Y-%m-%dT%H:%M:%S")
    }
    response = client.post(
        f"{settings.API_V1_STR}/schedule_user/create_schedule_user",
        headers=superuser_token_headers,
        json=data
    )
    assert response.status_code == 200
    content = response.json()
    assert content["schedule_id"] == data["schedule_id"]
    assert content["user_id"] == data["user_id"]
    assert content["shift_start"] == data["shift_start"]
    assert content["shift_end"] == data["shift_end"]
    assert "id" in content


def test_get_schedule_user_by_id(
        client: TestClient, superuser_token_headers: dict, db: Session
) -> None:
    schedule = random_schedule_user(db)
    response = client.get(
        f"{settings.API_V1_STR}/schedule_user"
        f"/get_schedule_user_by_id/{schedule.id}",
        headers=superuser_token_headers
    )
    assert response.status_code == 200
    content = response.json()
    assert content["id"] == schedule.id
    assert content["user_id"] == schedule.user_id
    assert content["schedule_id"] == schedule.schedule_id
    assert content["shift_start"] == schedule\
        .shift_start.strftime("%Y-%m-%dT%H:%M:%S")
    assert content["shift_end"] == schedule\
        .shift_end.strftime("%Y-%m-%dT%H:%M:%S")


def test_get_all_schedules_for_user(
        client: TestClient, superuser_token_headers: dict, db: Session
) -> None:
    user_id = random_user(db)
    schedules = crud.schedule_user.get_all_user_schedules(db, user_id=user_id)
    response = client.get(
        f"{settings.API_V1_STR}/schedule_user/get_all_schedules_for_user/"
        f"{user_id}",
        headers=superuser_token_headers
    )
    assert response.status_code == 200
    content = response.json()
    assert len(content) == len(schedules)


def test_get_user_schedules(
        client: TestClient, superuser_token_headers: dict, db: Session
) -> None:
    user_id = random_user(db)
    start_date = datetime.now() - timedelta(days=2)
    end_date = datetime.now() + timedelta(days=2)
    schedules = crud.schedule_user.get_user_schedules(db,
                                                      user_id=user_id,
                                                      start_date=start_date,
                                                      end_date=end_date)
    response = client.get(
        f"{settings.API_V1_STR}/schedule_user/get_user_schedules/"
        f"{user_id}/from/{start_date}/end/{end_date}",
        headers=superuser_token_headers
    )
    assert response.status_code == 200
    content = response.json()
    assert len(content) == len(schedules)


def test_update_schedule_for_user(
        client: TestClient, superuser_token_headers: dict, db: Session
) -> None:
    schedule = random_schedule_user(db)
    schedule_user_in = {
        "user_id": schedule.user_id,
        "schedule_id": schedule.schedule_id,
        "shift_start": (datetime.now() - timedelta(hours=2))
        .strftime("%Y-%m-%dT%H:%M:%S"),
        "shift_end": (datetime.now() - timedelta(hours=2))
        .strftime("%Y-%m-%dT%H:%M:%S")
    }
    response = client.put(
        f"{settings.API_V1_STR}/schedule_user/update_schedule_for_user_by_id/"
        f"{schedule.id}",
        headers=superuser_token_headers,
        json=schedule_user_in
    )
    assert response.status_code == 200
    content = response.json()
    assert content["user_id"] == schedule_user_in["user_id"]
    assert content["schedule_id"] == schedule_user_in["schedule_id"]
    assert content["shift_start"] == schedule_user_in["shift_start"]
    assert content["shift_end"] == schedule_user_in["shift_end"]


def test_delete_schedule_user(
        client: TestClient, superuser_token_headers: dict, db: Session
) -> None:
    schedule = random_schedule_user(db)
    response = client.delete(
        f"{settings.API_V1_STR}/schedule_user"
        f"/delete_schedule_user_by_id/{schedule.id}",
        headers=superuser_token_headers
    )
    assert response.status_code == 200
    content = response.json()
    assert content["user_id"] == schedule.user_id
    assert content["schedule_id"] == schedule.schedule_id
    assert content["shift_start"] == schedule.shift_start \
        .strftime("%Y-%m-%dT%H:%M:%S")
    assert content["shift_end"] == schedule.shift_end \
        .strftime("%Y-%m-%dT%H:%M:%S")
