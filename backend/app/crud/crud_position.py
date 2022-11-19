from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models import Position
from app.schemas import PositionCreate, PositionUpdate


class CRUDPosition(CRUDBase[Position, PositionCreate, PositionUpdate]):
    def get_id(
            self, db: Session, *, position: str
    ) -> int:
        return db.query(self.model).filter(Position.position == position).first().id

    def get_position_by_id(
            self, db: Session, id: int
    ) -> str:
        return db.query(self.model).filter(Position.id == id).position


position = CRUDPosition(Position)
