from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.schemas import EmploymentCreate
from app.tests.utils.company import create_random_company
from app.tests.utils.employment import create_random_employment
from app.tests.utils.utils import random_lower_string, random_int


def test_create_employment(db: Session):
    employment = random_lower_string()
    employment_in = EmploymentCreate(employment=employment,
                                     max_hours_per_week=random_int(),
                                     max_hours_per_day=random_int())
    employment_in_db = crud.employment.create(db, obj_in=employment_in)
    assert employment_in_db
    assert employment_in.employment == employment_in_db.employment
    assert employment_in.max_hours_per_day == employment_in_db.max_hours_per_day
    assert employment_in.max_hours_per_week == employment_in_db.max_hours_per_week


def test_get_employment_by_id(db: Session):
    employment_new = create_random_employment(db)
    employment = crud.employment.get(db, id=employment_new.id)
    assert employment
    assert employment_new.employment == employment.employment


def test_get_all_employments(db: Session):
    employments = crud.employment.get_all(db)
    employments_in_db = db.query(models.Employment).all()
    assert employments
    assert len(employments_in_db) == len(employments_in_db)
    assert employments == employments_in_db


def test_update_employment(db: Session):
    employment_new = create_random_employment(db)
    employment_name = random_lower_string(8)
    employment_to_update = jsonable_encoder(employment_new)
    employment_updated = schemas.EmploymentUpdate(**employment_to_update)
    employment_updated.employment = employment_name
    employment_updated_in_db = crud.employment.update(db, db_obj=employment_new, obj_in=employment_updated)
    assert employment_updated_in_db
    assert employment_updated_in_db.employment == employment_updated.employment


def test_delete_employment(db: Session):
    employment_new = create_random_employment(db)
    employment_deleted = crud.employment.remove(db, id=employment_new.id)
    employments = crud.employment.get_all(db)
    assert employment_deleted
    assert employment_deleted not in employments
