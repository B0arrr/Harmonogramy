from datetime import date, timedelta

from sqlalchemy.orm import Session

from app import crud, schemas
from app.core.config import settings
from app.core.security import get_password_hash


def init_db(db: Session) -> None:
    company = crud.company.get_by_company(db, company="Test")
    if not company:
        company_in = schemas.CompanyCreate(
            company="Test"
        )
        company = crud.company.create(db, obj_in=company_in)

    employment = crud.employment.get_by_employment(db, employment="Test")
    if not employment:
        employment_in = schemas.EmploymentCreate(
            employment="Test",
            max_hours_per_week=40,
            max_hours_per_day=8
        )
        employment = crud.employment.create(db, obj_in=employment_in)

    position = crud.position.get_by_position(db, position="Test")
    if not position:
        position_in = schemas.PositionCreate(
            position="Test"
        )
        position = crud.position.create(db, obj_in=position_in)

    user = crud.user.get_user_by_email(db, email=settings.FIRST_SUPERUSER)
    if not user:
        user_in = schemas.UserCreate(
            first_name="Test",
            last_name="Test",
            email=settings.FIRST_SUPERUSER,
            password=get_password_hash(settings.FIRST_SUPERUSER_PASSWORD),
            is_active=True,
            is_superuser=True,
            is_employed=True,
            date_of_employment=date.today(),
            date_of_fired=date.today() + timedelta(days=30),
            company_id=company.id,
            employment_id=employment.id,
            position_id=position.id
        )
        user = crud.user.create(db, obj_in=user_in)
