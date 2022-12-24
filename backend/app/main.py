from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.api_v1.api_v1 import api_router
from app.core.config import settings
from app.db.init_db import init_db
from app.db.sessions import SessionLocal

app = FastAPI()


@app.on_event("startup")
def init():
    db = SessionLocal()
    init_db(db)
    print("Initial data created")


origins = [
    "http://localhost:4200",
    "localhost:4200"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(api_router, prefix=settings.API_V1_STR)
