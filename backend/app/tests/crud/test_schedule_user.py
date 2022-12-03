from datetime import datetime, timedelta

import pytest
from sqlalchemy.orm import Session

from app import schemas, crud
from app.models import ScheduleUser
from app.tests.utils.schedule_user import create_random_schedule_user
from app.tests.utils.utils import random_user, random_schedule


@pytest.mark.last
def test_create_schedule_user(db: Session):
    user_id = random_user(db)
    schedule_id = random_schedule(db)
    shift_start = datetime.now()
    shift_end = shift_start + timedelta(hours=8)
    schedule_user_in = schemas.ScheduleUserCreate(
        user_id=user_id,
        schedule_id=schedule_id,
        shift_start=shift_start,
        shift_end=shift_end
    )
    schedule_user_in_db = crud.schedule_user.create(db, obj_in=schedule_user_in)
    assert schedule_user_in_db
    assert schedule_user_in_db.user_id == schedule_user_in.user_id
    assert schedule_user_in_db.schedule_id == schedule_user_in.schedule_id
    assert schedule_user_in_db.shift_start == schedule_user_in.shift_start
    assert schedule_user_in_db.shift_end == schedule_user_in.shift_end


def test_get_by_user_id_and_shift_start(db: Session):
    schedule_user_in_db = create_random_schedule_user(db)
    schedule_user = crud.schedule_user \
        .get_by_user_id_and_shift_start(db,
                                        user_id=schedule_user_in_db.user_id,
                                        shift_start=schedule_user_in_db.shift_start)
    assert schedule_user
    assert schedule_user_in_db.user_id == schedule_user.user_id
    assert schedule_user_in_db.schedule_id == schedule_user.schedule_id
    assert schedule_user_in_db.shift_start == schedule_user.shift_start
    assert schedule_user_in_db.shift_end == schedule_user.shift_end


def test_get_all_user_schedules(db: Session):
    schedule_user_in_db = create_random_schedule_user(db)
    schedule_user = crud.schedule_user.get_all_user_schedules(db, user_id=schedule_user_in_db.user_id)
    schedule_user_list = db.query(ScheduleUser).filter(ScheduleUser.user_id == schedule_user_in_db.user_id).all()
    assert schedule_user
    assert len(schedule_user) == len(schedule_user_list)
    assert schedule_user == schedule_user_list


def test_get_user_schedules(db: Session):
    schedule_user_in_db = create_random_schedule_user(db)
    schedule_user = crud.schedule_user \
        .get_user_schedules(db,
                            user_id=schedule_user_in_db.user_id,
                            start_date=schedule_user_in_db.shift_start,
                            end_date=schedule_user_in_db.shift_end)
    schedule_user_list = db.query(ScheduleUser) \
        .filter(ScheduleUser.user_id == schedule_user_in_db.user_id,
                ScheduleUser.shift_start == schedule_user_in_db.shift_start,
                ScheduleUser.shift_end == schedule_user_in_db.shift_end).all()
    assert schedule_user
    assert len(schedule_user) == len(schedule_user_list)
    assert schedule_user == schedule_user_list


def test_get_by_ids(db: Session):
    schedule_user_in_db = create_random_schedule_user(db)
    schedule_user = crud.schedule_user.get_by_ids(db,
                                                  schedule_id=schedule_user_in_db.schedule_id,
                                                  user_id=schedule_user_in_db.user_id)
    schedule_user_list = db.query(ScheduleUser) \
        .filter(ScheduleUser.user_id == schedule_user_in_db.user_id,
                ScheduleUser.schedule_id == schedule_user_in_db.schedule_id).all()
    assert schedule_user
    assert len(schedule_user) == len(schedule_user_list)
    assert schedule_user == schedule_user_list


def test_update_schedule_user(db: Session):
    schedule_user_in_db = create_random_schedule_user(db)
    schedule_user_updated = schemas.ScheduleUserUpdate(
        schedule_id=schedule_user_in_db.schedule_id,
        user_id=schedule_user_in_db.user_id,
        shift_start=schedule_user_in_db.shift_start + timedelta(hours=2),
        shift_end=datetime.now() + timedelta(hours=8)
    )
    schedule_user = crud.schedule_user.update(db, db_obj=schedule_user_in_db, obj_in=schedule_user_updated)
    assert schedule_user
    assert schedule_user.user_id == schedule_user_updated.user_id
    assert schedule_user.schedule_id == schedule_user_updated.schedule_id
    assert schedule_user.shift_start == schedule_user_updated.shift_start
    assert schedule_user.shift_end == schedule_user_updated.shift_end


def test_delete_schedule_user(db: Session):
    schedule_user_in_db = create_random_schedule_user(db)
    schedule_user_deleted = crud.schedule_user.remove(db, id=schedule_user_in_db.id)
    schedule_user = crud.schedule_user.get(db, id=schedule_user_in_db.id)
    assert schedule_user_deleted
    assert not schedule_user
