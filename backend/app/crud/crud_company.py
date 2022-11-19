from typing import List

from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models import Company
from app.schemas import CompanyCreate, CompanyUpdate


class CRUDCompany(CRUDBase[Company, CompanyCreate, CompanyUpdate]):
    def get_id(
            self, db: Session, *, company: str
    ) -> int:
        return db.query(self.model).filter(Company.company == company).first().id

    def get_company_by_id(
            self, db: Session, *, id: int
    ) -> str:
        return db.query(self.model).filter(Company.id == id).first().company


company = CRUDCompany(Company)
