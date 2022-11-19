from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models import Employment
from app.schemas import EmploymentCreate, EmploymentUpdate


class CRUDEmployment(CRUDBase[Employment, EmploymentCreate, EmploymentUpdate]):
    def get_id(
            self, db: Session, *, employment: str
    ) -> int:
        return db.query(self.model).filter(Employment.employment == employment).first().id

    def get_employment_by_id(
            self, db: Session, *, id: int
    ) -> str:
        return db.query(self.model).filter(Employment.id == id).first().employment


employment = CRUDEmployment(Employment)
