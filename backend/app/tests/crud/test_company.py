from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.schemas import CompanyCreate
from app.tests.utils.company import create_random_company
from app.tests.utils.utils import random_lower_string


def test_create_company(db: Session):
    company = random_lower_string()
    company_in = CompanyCreate(company=company)
    company_in_db = crud.company.create(db, obj_in=company_in)
    assert company_in_db
    assert company_in.company == company_in_db.company


def test_get_company_by_id(db: Session):
    company_new = create_random_company(db)
    company = crud.company.get(db, id=company_new.id)
    assert company
    assert company_new.company == company.company


def test_get_all_companies(db: Session):
    companies = crud.company.get_all(db)
    companies_in_db = db.query(models.Company).all()
    assert companies
    assert len(companies) == len(companies_in_db)
    assert companies == companies_in_db


def test_update_company(db: Session):
    company_new = create_random_company(db)
    company_name = random_lower_string(8)
    company_to_update = jsonable_encoder(company_new)
    company_updated = schemas.CompanyUpdate(**company_to_update)
    company_updated.company = company_name
    company_updated_in_db = crud.company.update(db,
                                                db_obj=company_new,
                                                obj_in=company_updated)
    assert company_updated_in_db
    assert company_updated_in_db.company == company_updated.company


def test_delete_company(db: Session):
    company_new = create_random_company(db)
    company_deleted = crud.company.remove(db, id=company_new.id)
    companies = crud.company.get_all(db)
    assert company_deleted
    assert company_deleted not in companies
