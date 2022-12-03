from datetime import datetime, timedelta

from sqlalchemy.orm import Session

from app import schemas, crud
from app.tests.utils.utils import random_user, random_schedule


def create_random_schedule_user(db: Session):
    schedule_user_in = schemas.ScheduleUserCreate(
        schedule_id=random_schedule(db),
        user_id=random_user(db),
        shift_start=datetime.now(),
        shift_end=datetime.now() + timedelta(hours=8)
    )
    return crud.schedule_user.create(db, obj_in=schedule_user_in)
