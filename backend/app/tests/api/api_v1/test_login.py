from typing import Dict

from fastapi.testclient import TestClient

from app.core.config import settings


def test_access_token(
        client: TestClient
) -> None:
    login_data = {
        "username": settings.FIRST_SUPERUSER,
        "password": settings.FIRST_SUPERUSER_PASSWORD,
    }
    result = client.post(f"{settings.API_V1_STR}/login/access-token",
                         data=login_data)
    assert result.status_code == 200
    tokens = result.json()
    assert "access_token" in tokens
    assert tokens["access_token"]


def test_use_access_token(
        client: TestClient, superuser_token_headers: Dict[str, str]
) -> None:
    result = client.post(
        f"{settings.API_V1_STR}/login/test-token",
        headers=superuser_token_headers,
    )
    assert result.status_code == 200
    content = result.json()
    assert "email" in content

# def test_password_recovery(
#         client: TestClient
# ) -> None:
#     result = client.post(
#         f"{settings.API_V1_STR}/password-recovery/{settings.FIRST_SUPERUSER}"
#     )
#     assert result.status_code == 200
#     content = result.json()
#     assert content["msg"] == "Password recovery email sent"


# def test_reset_password(
#         client: TestClient
# ) -> None:
#     token = generate_password_reset_token(email=settings.FIRST_SUPERUSER)
#     data = {
#         "token": token,
#         "new_password": f"{settings.FIRST_SUPERUSER_PASSWORD}"
#     }
#     result = client.post(
#         f"{settings.API_V1_STR}/reset-password", json=data
#     )
#     assert result.status_code == 200
#     content = result.json()
#     assert content["msg"] == "Password updated successfully"
