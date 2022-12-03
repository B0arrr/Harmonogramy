from datetime import date, timedelta

from sqlalchemy.orm import Session

from app import schemas, crud
from app.models import User
from app.tests.utils.user import create_random_user
from app.tests.utils.utils import random_lower_string, random_email, random_bool, random_int, random_password, \
    random_position, random_employment, random_company


def test_create_user(db: Session):
    first_name = random_lower_string(8)
    last_name = random_lower_string(8)
    email = random_email()
    password = random_password()
    is_active = False
    is_superuser = random_bool()
    is_employed = True
    date_of_employment = date.today()
    date_of_fired = date.today() + timedelta(days=random_int())
    company_id = random_company(db)
    employment_id = random_employment(db)
    position_id = random_position(db)
    user_in = schemas.UserCreate(
        first_name=first_name,
        last_name=last_name,
        email=email,
        password=password,
        is_active=is_active,
        is_superuser=is_superuser,
        is_employed=is_employed,
        date_of_employment=date_of_employment,
        date_of_fired=date_of_fired,
        company_id=company_id,
        employment_id=employment_id,
        position_id=position_id
    )
    user = crud.user.create(db, obj_in=user_in)
    assert user
    assert user_in.first_name == user.first_name
    assert user_in.last_name == user.last_name
    assert user_in.email == user.email
    assert user_in.password == user.password
    assert user_in.is_active == user.is_active
    assert user_in.is_superuser == user.is_superuser
    assert user_in.is_employed == user.is_employed
    assert user_in.date_of_employment == user.date_of_employment
    assert user_in.date_of_fired == user.date_of_fired
    assert user_in.company_id == user.company_id
    assert user_in.employment_id == user.employment_id
    assert user_in.position_id == user.position_id


def test_get_user_by_id(db: Session):
    user = create_random_user(db)
    user_in_db = crud.user.get(db, id=user.id)
    assert user_in_db
    assert user_in_db.first_name == user.first_name
    assert user_in_db.last_name == user.last_name
    assert user_in_db.email == user.email
    assert user_in_db.password == user.password
    assert user_in_db.is_active == user.is_active
    assert user_in_db.is_superuser == user.is_superuser
    assert user_in_db.is_employed == user.is_employed
    assert user_in_db.date_of_employment == user.date_of_employment
    assert user_in_db.date_of_fired == user.date_of_fired
    assert user_in_db.company_id == user.company_id
    assert user_in_db.employment_id == user.employment_id
    assert user_in_db.position_id == user.position_id


def test_get_user_by_email(db: Session):
    user = create_random_user(db)
    user_in_db = crud.user.get_user_by_email(db, email=user.email)
    assert user_in_db
    assert user_in_db.first_name == user.first_name
    assert user_in_db.last_name == user.last_name
    assert user_in_db.email == user.email
    assert user_in_db.password == user.password
    assert user_in_db.is_active == user.is_active
    assert user_in_db.is_superuser == user.is_superuser
    assert user_in_db.is_employed == user.is_employed
    assert user_in_db.date_of_employment == user.date_of_employment
    assert user_in_db.date_of_fired == user.date_of_fired
    assert user_in_db.company_id == user.company_id
    assert user_in_db.employment_id == user.employment_id
    assert user_in_db.position_id == user.position_id


def test_get_users_from_company_by_id(db: Session):
    company_id = random_company(db)
    users = crud.user.get_users_from_company_by_id(db, company_id=company_id)
    users_in_db = db.query(User).filter(User.company_id == company_id).all()
    assert len(users) == len(users_in_db)
    assert users == users_in_db


def test_get_users_with_employment(db: Session):
    employment_id = random_employment(db)
    users = crud.user.get_users_with_employment(db, employment_id=employment_id)
    users_in_db = db.query(User).filter(User.employment_id == employment_id).all()
    assert len(users) == len(users_in_db)
    assert users == users_in_db


def test_get_users_on_position(db: Session):
    position_id = random_position(db)
    users = crud.user.get_users_on_position(db, position_id=position_id)
    users_in_db = db.query(User).filter(User.position_id == position_id).all()
    assert len(users) == len(users_in_db)
    assert users == users_in_db


def test_get_all_users(db: Session):
    users = crud.user.get_all(db)
    users_in_db = db.query(User).all()
    assert len(users) == len(users_in_db)
    assert users == users_in_db


def test_update_user(db: Session):
    user = create_random_user(db)
    user_updated = schemas.UserUpdate(
        first_name=random_lower_string(8),
        last_name=random_lower_string(8),
        email=user.email,
        is_active=False,
        is_superuser=random_bool(),
        is_employed=True,
        date_of_employment=user.date_of_employment,
        date_of_fired=user.date_of_fired,
        company_id=user.company_id,
        employment_id=user.employment_id,
        position_id=user.position_id
    )
    user_in_db = crud.user.update(db, db_obj=user, obj_in=user_updated)
    assert user_in_db
    assert user_in_db.first_name == user_updated.first_name
    assert user_in_db.last_name == user_updated.last_name
    assert user_in_db.email == user_updated.email
    assert user_in_db.is_active == user_updated.is_active
    assert user_in_db.is_superuser == user_updated.is_superuser
    assert user_in_db.is_employed == user_updated.is_employed
    assert user_in_db.date_of_employment == user_updated.date_of_employment
    assert user_in_db.date_of_fired == user_updated.date_of_fired
    assert user_in_db.company_id == user_updated.company_id
    assert user_in_db.employment_id == user_updated.employment_id
    assert user_in_db.position_id == user_updated.position_id


def test_update_user_password(db: Session):
    user = create_random_user(db)
    user_updated = schemas.UserUpdatePassword(
        password=random_password()
    )
    user_in_db = crud.user.update(db, db_obj=user, obj_in=user_updated)
    assert user_in_db
    assert user_in_db.password == user_updated.password


def test_delete_user(db: Session):
    user = create_random_user(db)
    deleted_user = crud.user.remove(db, id=user.id)
    users = crud.user.get_all(db)
    assert deleted_user
    assert user not in users
