from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models import Position
from app.schemas import PositionCreate, PositionUpdate


class CRUDPosition(CRUDBase[Position, PositionCreate, PositionUpdate]):
    def get_by_position(
            self, db: Session, *, position: str
    ) -> Position:
        return db.query(self.model).filter(Position.position == position).first()


position = CRUDPosition(Position)
