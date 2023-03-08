from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models import Employment
from app.schemas import EmploymentCreate, EmploymentUpdate


class CRUDEmployment(CRUDBase[Employment, EmploymentCreate, EmploymentUpdate]):
    def get_by_employment(
            self, db: Session, *, employment: str
    ) -> Employment:
        return db.query(self.model) \
            .filter(Employment.employment == employment) \
            .first()


employment = CRUDEmployment(Employment)
