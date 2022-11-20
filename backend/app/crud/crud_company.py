from typing import List

from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models import Company
from app.schemas import CompanyCreate, CompanyUpdate


class CRUDCompany(CRUDBase[Company, CompanyCreate, CompanyUpdate]):
    def get_by_company(
            self, db: Session, *, company: str
    ) -> Company:
        return db.query(self.model).filter(Company.company == company).first()


company = CRUDCompany(Company)
