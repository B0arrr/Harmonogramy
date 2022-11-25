import random
from datetime import date, timedelta

from sqlalchemy.orm import Session

from app import models, crud


def create_random_schedule(db: Session) -> models.Schedule:
    start_day = get_last_day(db) + timedelta(days=1)
    day_off = rand_bool()
    return crud.schedule.create(db, start_day=start_day, day_off=day_off)


def get_day(obj):
    return obj['start_day']


def rand_bool():
    return bool(random.getrandbits(1))


def get_last_day(db: Session) -> date:
    days = crud.schedule.get_all(db)
    if not days:
        return date.today()
    return max(day.start_day for day in days)
