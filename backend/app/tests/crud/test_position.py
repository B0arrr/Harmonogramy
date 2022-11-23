from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.schemas import PositionCreate
from app.tests.utils.position import create_random_position
from app.tests.utils.utils import random_lower_string


def test_create_position(db: Session):
    position = random_lower_string()
    position_in = PositionCreate(position=position)
    position_in_db = crud.position.create(db, obj_in=position_in)
    assert position_in_db
    assert position_in.position == position_in_db.position


def test_get_position_by_id(db: Session):
    position_new = create_random_position(db)
    position = crud.position.get(db, id=position_new.id)
    assert position
    assert position_new.position == position.position


def test_get_all_positions(db: Session):
    position = crud.position.get_all(db)
    position_in_db = db.query(models.Position).all()
    assert position
    assert len(position_in_db) == len(position)
    assert position_in_db == position


def test_update_position(db: Session):
    position_new = create_random_position(db)
    position_name = random_lower_string(8)
    position_to_update = jsonable_encoder(position_new)
    position_updated = schemas.PositionUpdate(**position_to_update)
    position_updated.position = position_name
    position_updated_in_db = crud.employment.update(db, db_obj=position_new, obj_in=position_updated)
    assert position_updated_in_db
    assert position_updated_in_db.position == position_updated.position


def test_delete_position(db: Session):
    position_new = create_random_position(db)
    position_deleted = crud.position.remove(db, id=position_new.id)
    positions = crud.position.get_all(db)
    assert position_deleted
    assert position_deleted not in positions
