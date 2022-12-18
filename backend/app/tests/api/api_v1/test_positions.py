from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app import crud
from app.core.config import settings
from app.tests.utils.position import create_random_position
from app.tests.utils.utils import random_lower_string


def test_create_position(
        client: TestClient, superuser_token_headers: dict, db: Session
) -> None:
    data = {"position": "test"}
    response = client.post(
        f"{settings.API_V1_STR}/position/create_position", headers=superuser_token_headers, json=data
    )
    assert response.status_code == 200
    content = response.json()
    assert content["position"] == data["position"]
    assert "id" in content


def test_get_position_by_id(
        client: TestClient, superuser_token_headers: dict, db: Session
) -> None:
    position = create_random_position(db)
    response = client.get(
        f"{settings.API_V1_STR}/position/get_position_by_id/{position.id}", headers=superuser_token_headers
    )
    assert response.status_code == 200
    content = response.json()
    assert content["id"] == position.id
    assert content["position"] == position.position


def test_get_position_id(
        client: TestClient, superuser_token_headers: dict, db: Session
) -> None:
    position = create_random_position(db)
    response = client.get(
        f"{settings.API_V1_STR}/position/get_position_id/{position.position}", headers=superuser_token_headers
    )
    assert response.status_code == 200
    content = response.json()
    assert content == position.id


def test_get_all_positions(
        client: TestClient, superuser_token_headers: dict, db: Session
) -> None:
    positions = crud.position.get_all(db)
    response = client.get(
        f"{settings.API_V1_STR}/position/get_all_positions", headers=superuser_token_headers
    )
    assert response.status_code == 200
    content = response.json()
    assert len(content) == len(positions)


def test_update_position_by_id(
        client: TestClient, superuser_token_headers: dict, db: Session
) -> None:
    position = create_random_position(db)
    position_name = random_lower_string()
    response = client.put(
        f"{settings.API_V1_STR}/position/update_position_by_id/{position.id}/position/{position_name}",
        headers=superuser_token_headers
    )
    assert response.status_code == 200
    content = response.json()
    assert content["id"] == position.id
    assert content["position"] == position_name


def test_delete_position(
        client: TestClient, superuser_token_headers: dict, db: Session
) -> None:
    position = create_random_position(db)
    response = client.delete(
        f"{settings.API_V1_STR}/position/delete_position/{position.id}"
    )
    assert response.status_code == 200
    content = response.json()
    assert content["id"] == position.id
    assert content["position"] == position.position
