from datetime import date, timedelta

from sqlalchemy.orm import Session

from app import models, crud
from app.tests.utils.utils import random_bool


def create_random_schedule(db: Session) -> models.Schedule:
    start_day = get_last_day(db) + timedelta(days=1)
    day_off = random_bool()
    return crud.schedule.create(db, start_day=start_day, day_off=day_off)


def get_day(obj):
    return obj['start_day']


def get_last_day(db: Session) -> date:
    days = crud.schedule.get_all(db)
    if not days:
        return date.today()
    return max(day.start_day for day in days)
