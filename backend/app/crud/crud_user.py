from typing import List

from sqlalchemy.orm import Session

from app import crud, schemas
from app.crud.base import CRUDBase
from app.models import User
from app.schemas import UserCreate, UserUpdate


class CRUDUser(CRUDBase[User, UserCreate, UserUpdate]):
    def get_id(
            self, db: Session, *, email: str
    ) -> int:
        return db.query(self.model).filter(User.email == email).first().id

    def get_user_by_email(
            self, db: Session, *, email: str
    ) -> User:
        return db.query(self.model).filter(User.email == email).first()

    def get_users_from_company(
            self, db: Session, *, company: str
    ) -> List[User]:
        company_id = crud.company.get_id(db, company=company)
        return db.query(self.model).filter(User.company_id == company_id).all()


user = CRUDUser(User)
