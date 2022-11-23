from sqlalchemy.orm import Session

from app import models, crud
from app.schemas import PositionCreate
from app.tests.utils.utils import random_lower_string


def create_random_position(db: Session) -> models.Position:
    position = random_lower_string()
    position_in = PositionCreate(position=position)
    return crud.position.create(db, obj_in=position_in)
