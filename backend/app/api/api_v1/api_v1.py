from fastapi import APIRouter

from app.api.api_v1.endpoints import test, company

api_router = APIRouter()

api_router.include_router(test.router, tags=["test"])
api_router.include_router(company.router, tags=["company"])
