from datetime import timedelta

from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.tests.utils.schedule import get_last_day, random_bool, create_random_schedule


def test_create_schedule(db: Session):
    start_day = get_last_day(db) + timedelta(days=1)
    day_off = random_bool()
    schedule_in_db = crud.schedule.create(db, start_day=start_day, day_off=day_off)
    assert schedule_in_db
    assert start_day == schedule_in_db.start_day
    assert day_off == schedule_in_db.day_off


def test_get_schedule_by_id(db: Session):
    schedule_new = create_random_schedule(db)
    schedule = crud.schedule.get(db, id=schedule_new.id)
    assert schedule
    assert schedule_new.start_day == schedule.start_day
    assert schedule_new.day_off == schedule.day_off


def test_get_all_schedules(db: Session):
    schedule = crud.schedule.get_all(db)
    schedule_in_db = db.query(models.Schedule).all()
    assert schedule
    assert len(schedule_in_db) == len(schedule)
    assert schedule_in_db == schedule


def test_update_schedule(db: Session):
    schedule_new = create_random_schedule(db)
    schedule_day_off = not schedule_new.day_off
    schedule_to_update = jsonable_encoder(schedule_new)
    schedule_updated = schemas.ScheduleUpdate(**schedule_to_update)
    schedule_updated.day_off = schedule_day_off
    schedule_updated_in_db = crud.schedule.update(db, db_obj=schedule_new, obj_in=schedule_updated)
    assert schedule_updated_in_db
    assert schedule_updated_in_db.start_day == schedule_updated.start_day
    assert schedule_updated_in_db.day_off == schedule_updated.day_off


def test_delete_schedule(db: Session):
    schedule_new = create_random_schedule(db)
    schedule_deleted = crud.schedule.remove(db, id=schedule_new.id)
    schedules = crud.schedule.get_all(db)
    assert schedule_deleted
    assert schedule_deleted not in schedules
