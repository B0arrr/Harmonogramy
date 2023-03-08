from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app import crud
from app.core.config import settings
from app.tests.utils.company import create_random_company
from app.tests.utils.utils import random_lower_string


def test_create_company(
        client: TestClient, superuser_token_headers: dict, db: Session
) -> None:
    data = {"company": "test"}
    response = client.post(
        f"{settings.API_V1_STR}/company/create_company",
        headers=superuser_token_headers,
        json=data
    )
    assert response.status_code == 200
    content = response.json()
    assert content["company"] == data["company"]
    assert "id" in content


def test_get_company_by_id(
        client: TestClient, superuser_token_headers: dict, db: Session
) -> None:
    company = create_random_company(db)
    response = client.get(
        f"{settings.API_V1_STR}/company/get_company_by_id/{company.id}",
        headers=superuser_token_headers
    )
    assert response.status_code == 200
    content = response.json()
    assert content["id"] == company.id
    assert content["company"] == company.company


def test_get_company_id(
        client: TestClient, superuser_token_headers: dict, db: Session
) -> None:
    company = create_random_company(db)
    response = client.get(
        f"{settings.API_V1_STR}/company/get_company_id/{company.company}",
        headers=superuser_token_headers
    )
    assert response.status_code == 200
    content = response.json()
    assert content == company.id


def test_get_all_companies(
        client: TestClient, superuser_token_headers: dict, db: Session
) -> None:
    companies = crud.company.get_all(db)
    response = client.get(
        f"{settings.API_V1_STR}/company/get_all_companies",
        headers=superuser_token_headers
    )
    assert response.status_code == 200
    content = response.json()
    assert len(content) == len(companies)


def test_update_company_by_id(
        client: TestClient, superuser_token_headers: dict, db: Session
) -> None:
    company = create_random_company(db)
    company_name = random_lower_string()
    response = client.put(
        f"{settings.API_V1_STR}/company/update_company_by_id/"
        f"{company.id}/company/{company_name}",
        headers=superuser_token_headers
    )
    assert response.status_code == 200
    content = response.json()
    assert content["id"] == company.id
    assert content["company"] == company_name


def test_delete_company(
        client: TestClient, superuser_token_headers: dict, db: Session
) -> None:
    company = create_random_company(db)
    response = client.delete(
        f"{settings.API_V1_STR}/company/delete_company/{company.id}"
    )
    assert response.status_code == 200
    content = response.json()
    assert content["id"] == company.id
    assert content["company"] == company.company
