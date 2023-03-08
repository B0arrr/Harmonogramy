from fastapi import APIRouter

from app.api.api_v1.endpoints import company, employment, position, \
    schedule, schedule_user, user, login

api_router = APIRouter()

api_router.include_router(login.router,
                          tags=["login"])
api_router.include_router(company.router,
                          prefix="/company", tags=["company"])
api_router.include_router(employment.router,
                          prefix="/employment", tags=["employment"])
api_router.include_router(position.router,
                          prefix="/position", tags=["position"])
api_router.include_router(schedule.router,
                          prefix="/schedule", tags=["schedule"])
api_router.include_router(schedule_user.router,
                          prefix="/schedule_user", tags=["schedule_user"])
api_router.include_router(user.router,
                          prefix="/user", tags=["user"])
