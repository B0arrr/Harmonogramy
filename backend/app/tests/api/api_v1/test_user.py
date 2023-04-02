from datetime import date, timedelta

from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app import crud
from app.core.config import settings
from app.core.security import verify_password
from app.tests.utils.user import create_random_user
from app.tests.utils.utils import random_lower_string, random_email, \
    random_password, random_company, random_employment, random_position


def test_create_user(
        client: TestClient, superuser_token_headers: dict, db: Session
) -> None:
    data = {
        "first_name": random_lower_string(),
        "last_name": random_lower_string(),
        "email": random_email(),
        "password": random_password(),
        "is_active": False,
        "is_superuser": False,
        "is_employed": True,
        "date_of_employment": str(date.today()),
        "date_of_fired": str(date.today() + timedelta(days=30)),
        "company_id": random_company(db),
        "employment_id": random_employment(db),
        "position_id": random_position(db)
    }
    response = client.post(
        f"{settings.API_V1_STR}/user/create_user",
        headers=superuser_token_headers,
        json=data
    )
    assert response.status_code == 200
    content = response.json()
    assert content["first_name"] == data["first_name"]
    assert content["last_name"] == data["last_name"]
    assert content["email"] == data["email"]
    assert verify_password(data["password"], content["password"])
    assert content["is_active"] == data["is_active"]
    assert content["is_superuser"] == data["is_superuser"]
    assert content["is_employed"] == data["is_employed"]
    assert content["date_of_employment"] == data["date_of_employment"]
    assert content["date_of_fired"] == data["date_of_fired"]
    assert content["company_id"] == data["company_id"]
    assert content["employment_id"] == data["employment_id"]
    assert content["position_id"] == data["position_id"]
    assert "id" in content


def test_get_user_by_id(
        client: TestClient, superuser_token_headers: dict, db: Session
) -> None:
    user = create_random_user(db)
    response = client.get(
        f"{settings.API_V1_STR}/user/get_user_by_id/{user.id}",
        headers=superuser_token_headers
    )
    assert response.status_code == 200
    content = response.json()
    assert content["id"] == user.id
    assert content["first_name"] == user.first_name
    assert content["last_name"] == user.last_name
    assert content["email"] == user.email
    assert content["password"] == user.password
    assert content["is_active"] == user.is_active
    assert content["is_superuser"] == user.is_superuser
    assert content["is_employed"] == user.is_employed
    assert content["date_of_employment"] == str(user.date_of_employment)
    assert content["date_of_fired"] == str(user.date_of_fired)
    assert content["company_id"] == user.company_id
    assert content["employment_id"] == user.employment_id
    assert content["position_id"] == user.position_id


def test_get_user_by_email(
        client: TestClient, superuser_token_headers: dict, db: Session
) -> None:
    user = create_random_user(db)
    response = client.get(
        f"{settings.API_V1_STR}/user/get_user_by_email/{user.email}",
        headers=superuser_token_headers
    )
    assert response.status_code == 200
    content = response.json()
    assert content["id"] == user.id
    assert content["first_name"] == user.first_name
    assert content["last_name"] == user.last_name
    assert content["email"] == user.email
    assert content["password"] == user.password
    assert content["is_active"] == user.is_active
    assert content["is_superuser"] == user.is_superuser
    assert content["is_employed"] == user.is_employed
    assert content["date_of_employment"] == str(user.date_of_employment)
    assert content["date_of_fired"] == str(user.date_of_fired)
    assert content["company_id"] == user.company_id
    assert content["employment_id"] == user.employment_id
    assert content["position_id"] == user.position_id


def test_get_user_id_by_email(
        client: TestClient, superuser_token_headers: dict, db: Session
) -> None:
    user = create_random_user(db)
    response = client.get(
        f"{settings.API_V1_STR}/user/get_user_id_by_email/{user.email}",
        headers=superuser_token_headers
    )
    assert response.status_code == 200
    content = response.json()
    assert content == user.id


def test_get_all_users_from_company_by_id(
        client: TestClient, superuser_token_headers: dict, db: Session
) -> None:
    company_id = random_company(db)
    users = crud.user.get_users_from_company_by_id(db, company_id=company_id)
    response = client.get(
        f"{settings.API_V1_STR}/user/get_all_users_from_company_by_id/"
        f"{company_id}",
        headers=superuser_token_headers
    )
    assert response.status_code == 200
    content = response.json()
    assert len(users) == len(content)


def test_get_all_users_from_company(
        client: TestClient, superuser_token_headers: dict, db: Session
) -> None:
    company_id = random_company(db)
    company = crud.company.get(db, id=company_id).company
    users = crud.user.get_users_from_company_by_id(db, company_id=company_id)
    response = client.get(
        f"{settings.API_V1_STR}/user/get_all_users_from_company/{company}",
        headers=superuser_token_headers
    )
    assert response.status_code == 200
    content = response.json()
    assert len(users) == len(content)


def test_get_all_users_with_employment_id(
        client: TestClient, superuser_token_headers: dict, db: Session
) -> None:
    employment_id = random_employment(db)
    users = crud.user.get_users_with_employment(db,
                                                employment_id=employment_id)
    response = client.get(
        f"{settings.API_V1_STR}/user/get_all_users_with_employment_id/"
        f"{employment_id}",
        headers=superuser_token_headers
    )
    assert response.status_code == 200
    content = response.json()
    assert len(users) == len(content)


def test_get_all_users_with_employment(
        client: TestClient, superuser_token_headers: dict, db: Session
) -> None:
    employment_id = random_employment(db)
    employment = crud.employment.get(db, id=employment_id).employment
    users = crud.user.get_users_with_employment(db,
                                                employment_id=employment_id)
    response = client.get(
        f"{settings.API_V1_STR}/user/get_all_users_with_employment/"
        f"{employment}",
        headers=superuser_token_headers
    )
    assert response.status_code == 200
    content = response.json()
    assert len(users) == len(content)


def test_get_all_users_on_position_id(
        client: TestClient, superuser_token_headers: dict, db: Session
) -> None:
    position_id = random_position(db)
    users = crud.user.get_users_on_position(db, position_id=position_id)
    response = client.get(
        f"{settings.API_V1_STR}/user/get_all_users_on_position_id/"
        f"{position_id}",
        headers=superuser_token_headers
    )
    assert response.status_code == 200
    content = response.json()
    assert len(users) == len(content)


def test_get_all_users_on_position(
        client: TestClient, superuser_token_headers: dict, db: Session
) -> None:
    position_id = random_position(db)
    position = crud.position.get(db, id=position_id).position
    users = crud.user.get_users_on_position(db, position_id=position_id)
    response = client.get(
        f"{settings.API_V1_STR}/user/get_all_users_on_position/{position}",
        headers=superuser_token_headers
    )
    assert response.status_code == 200
    content = response.json()
    assert len(users) == len(content)


def test_get_all_users(
        client: TestClient, superuser_token_headers: dict, db: Session
) -> None:
    users = crud.user.get_all(db)
    response = client.get(
        f"{settings.API_V1_STR}/user/get_all_users",
        headers=superuser_token_headers
    )
    assert response.status_code == 200
    content = response.json()
    assert len(content) == len(users)


def test_update_user_by_id(
        client: TestClient, superuser_token_headers: dict, db: Session
) -> None:
    user = create_random_user(db)
    data = {
        "first_name": "Test",
        "last_name": "Test",
        "email": "test@test.com",
        "is_active": True,
        "is_superuser": True,
        "is_employed": False,
        "date_of_employment": "2022-12-18",
        "date_of_fired": "2022-12-20",
        "company_id": random_company(db),
        "employment_id": random_employment(db),
        "position_id": random_position(db)
    }
    response = client.put(
        f"{settings.API_V1_STR}/user/update_user_by_id/{user.id}",
        headers=superuser_token_headers,
        json=data
    )
    assert response.status_code == 200
    content = response.json()
    assert content["id"] == user.id
    assert content["first_name"] == data["first_name"]
    assert content["last_name"] == data["last_name"]
    assert content["email"] == data["email"]
    assert content["is_active"] == data["is_active"]
    assert content["is_superuser"] == data["is_superuser"]
    assert content["is_employed"] == data["is_employed"]
    assert content["date_of_employment"] == data["date_of_employment"]
    assert content["date_of_fired"] == data["date_of_fired"]
    assert content["company_id"] == data["company_id"]
    assert content["employment_id"] == data["employment_id"]
    assert content["position_id"] == data["position_id"]


def test_update_user_password(
        client: TestClient, superuser_token_headers: dict, db: Session
) -> None:
    user = create_random_user(db)
    data = {
        "password": random_lower_string()
    }
    response = client.put(
        f"{settings.API_V1_STR}/user/update_user_password/{user.id}",
        headers=superuser_token_headers,
        json=data
    )
    # assert response.status_code == 200
    content = response.json()
    assert content["id"] == user.id
    assert content["first_name"] == user.first_name
    assert content["last_name"] == user.last_name
    assert content["email"] == user.email
    assert verify_password(data["password"], content["password"])
    assert content["is_active"] == user.is_active
    assert content["is_superuser"] == user.is_superuser
    assert content["is_employed"] == user.is_employed
    assert content["date_of_employment"] == str(user.date_of_employment)
    assert content["date_of_fired"] == str(user.date_of_fired)
    assert content["company_id"] == user.company_id
    assert content["employment_id"] == user.employment_id
    assert content["position_id"] == user.position_id


def test_activate_user(
        client: TestClient, superuser_token_headers: dict, db: Session
) -> None:
    user = crud.user.get_user_by_email(db=db, email=settings.FIRST_SUPERUSER)
    response = client.put(
        f"{settings.API_V1_STR}/user/activate_user/{user.id}",
        headers=superuser_token_headers
    )
    assert response.status_code == 200
    content = response.json()
    assert content["is_active"] is True


def test_delete_user(
        client: TestClient, superuser_token_headers: dict, db: Session
) -> None:
    user = create_random_user(db)
    response = client.delete(
        f"{settings.API_V1_STR}/user/delete_user/{user.id}",
        headers=superuser_token_headers
    )
    assert response.status_code == 200
    content = response.json()
    assert content["id"] == user.id
    assert content["first_name"] == user.first_name
    assert content["last_name"] == user.last_name
    assert content["email"] == user.email
    assert content["password"] == user.password
    assert content["is_active"] == user.is_active
    assert content["is_superuser"] == user.is_superuser
    assert content["is_employed"] == user.is_employed
    assert content["date_of_employment"] == str(user.date_of_employment)
    assert content["date_of_fired"] == str(user.date_of_fired)
    assert content["company_id"] == user.company_id
    assert content["employment_id"] == user.employment_id
    assert content["position_id"] == user.position_id
