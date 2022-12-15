from fastapi import APIRouter

from app.api.api_v1.endpoints import test, company, employment, position, schedule, schedule_user, user, login

api_router = APIRouter()

api_router.include_router(test.router, tags=["test"])
api_router.include_router(company.router, tags=["company"])
api_router.include_router(employment.router, tags=["employment"])
api_router.include_router(position.router, tags=["position"])
api_router.include_router(schedule.router, tags=["schedule"])
api_router.include_router(schedule_user.router, tags=["schedule_user"])
api_router.include_router(user.router, tags=["user"])
api_router.include_router(login.router, tags=["login"])
