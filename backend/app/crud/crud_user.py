from typing import List, Optional

from sqlalchemy.orm import Session

from app import crud
from app.core.security import verify_password
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

    def authenticate(
            self, db: Session, *, email: str, password: str
    ) -> Optional[User]:
        user = self.get_user_by_email(db, email=email)
        if not user:
            return None
        if not verify_password(password, user.password):
            return None
        return user

    def is_active(self, user: User) -> bool:
        return user.is_active

    def is_superuser(self, user: User) -> bool:
        return user.is_superuser


user = CRUDUser(User)
