from datetime import date, timedelta

from sqlalchemy.orm import Session

from app import crud, schemas
from app.tests.utils.utils import random_lower_string, random_email, random_password, random_bool, random_int, \
    random_position, random_employment, random_company


def create_random_user(db: Session):
    user_in = schemas.UserCreate(
        first_name=random_lower_string(8),
        last_name=random_lower_string(8),
        email=random_email(),
        password=random_password(),
        is_active=False,
        is_superuser=random_bool(),
        is_employed=True,
        date_of_employment=date.today(),
        date_of_fired=date.today() + timedelta(days=random_int()),
        company_id=random_company(db),
        employment_id=random_employment(db),
        position_id=random_position(db)
    )
    return crud.user.create(db, obj_in=user_in)
