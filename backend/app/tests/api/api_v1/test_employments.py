from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app import crud
from app.core.config import settings
from app.tests.utils.employment import create_random_employment
from app.tests.utils.utils import random_lower_string


def test_create_employment(
        client: TestClient, superuser_token_headers: dict, db: Session
) -> None:
    data = {
        "employment": "test",
        "max_hours_per_week": 40,
        "max_hours_per_day": 8
    }
    response = client.post(
        f"{settings.API_V1_STR}/employment/create_employment",
        headers=superuser_token_headers,
        json=data
    )
    assert response.status_code == 200
    content = response.json()
    assert content["employment"] == data["employment"]
    assert content["max_hours_per_week"] == data["max_hours_per_week"]
    assert content["max_hours_per_day"] == data["max_hours_per_day"]
    assert "id" in content


def test_get_employment_by_id(
        client: TestClient, superuser_token_headers: dict, db: Session
) -> None:
    employment = create_random_employment(db)
    response = client.get(
        f"{settings.API_V1_STR}/employment/get_employment_by_id/"
        f"{employment.id}",
        headers=superuser_token_headers
    )
    assert response.status_code == 200
    content = response.json()
    assert content["id"] == employment.id
    assert content["employment"] == employment.employment
    assert content["max_hours_per_week"] == employment.max_hours_per_week
    assert content["max_hours_per_day"] == employment.max_hours_per_day


def test_get_employment_id(
        client: TestClient, superuser_token_headers: dict, db: Session
) -> None:
    employment = create_random_employment(db)
    response = client.get(
        f"{settings.API_V1_STR}/employment/get_employment_id/"
        f"{employment.employment}",
        headers=superuser_token_headers
    )
    assert response.status_code == 200
    content = response.json()
    assert content == employment.id


def test_get_all_employments(
        client: TestClient, superuser_token_headers: dict, db: Session
) -> None:
    employments = crud.employment.get_all(db)
    response = client.get(
        f"{settings.API_V1_STR}/employment/get_all_employments",
        headers=superuser_token_headers
    )
    assert response.status_code == 200
    content = response.json()
    assert len(content) == len(employments)


def test_update_employment_by_id(
        client: TestClient, superuser_token_headers: dict, db: Session
) -> None:
    employment = create_random_employment(db)
    employment_name = random_lower_string()
    response = client.put(
        f"{settings.API_V1_STR}/employment/update_employment_by_id/"
        f"{employment.id}/employment/{employment_name}",
        headers=superuser_token_headers
    )
    assert response.status_code == 200
    content = response.json()
    assert content["id"] == employment.id
    assert content["employment"] == employment_name


def test_delete_employment(
        client: TestClient, superuser_token_headers: dict, db: Session
) -> None:
    employment = create_random_employment(db)
    response = client.delete(
        f"{settings.API_V1_STR}/employment/delete_employment/{employment.id}"
    )
    assert response.status_code == 200
    content = response.json()
    assert content["id"] == employment.id
    assert content["employment"] == employment.employment
