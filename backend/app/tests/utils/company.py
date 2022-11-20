from sqlalchemy.orm import Session

from app import models, crud
from app.schemas import CompanyCreate
from app.tests.utils.utils import random_lower_string


def create_random_company(db: Session) -> models.Company:
    company = random_lower_string()
    company_in = CompanyCreate(company=company)
    return crud.company.create(db, obj_in=company_in)
