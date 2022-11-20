from sqlalchemy.orm import Session

from app import models, crud
from app.schemas import EmploymentCreate
from app.tests.utils.utils import random_lower_string, random_int


def create_random_employment(db: Session) -> models.Employment:
    employment = random_lower_string()
    employment_in = EmploymentCreate(employment=employment,
                                     max_hours_per_week=random_int(),
                                     max_hours_per_day=random_int())
    return crud.employment.create(db, obj_in=employment_in)
