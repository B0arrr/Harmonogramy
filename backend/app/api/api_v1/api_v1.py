from fastapi import APIRouter

from app.api.api_v1.endpoints import test, company, employment, position, schedule

api_router = APIRouter()

api_router.include_router(test.router, tags=["test"])
api_router.include_router(company.router, tags=["company"])
api_router.include_router(employment.router, tags=["employment"])
api_router.include_router(position.router, tags=["position"])
api_router.include_router(schedule.router, tags=["schedule"])
