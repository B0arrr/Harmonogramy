from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session

from app import schemas, crud
from app.api import deps

router = APIRouter()


@router.post("/create_position", response_model=schemas.Position)
def create_position(
        *,
        db: Session = Depends(deps.get_db),
        position_in: schemas.PositionCreate
) -> Any:
    """
    Create position
    """
    position = crud.position.get_by_position(db, obj_in=position_in)
    if position:
        raise HTTPException(
            status_code=400,
            detail="Position already exists"
        )
    return crud.position.create(db, obj_in=position_in)


@router.get("/get_position_by_id/{id}", response_model=schemas.Position)
def get_position_by_id(
        *,
        db: Session = Depends(deps.get_db),
        id: int
) -> Any:
    """
    Get position by id
    """
    position = crud.employment.get(db, id=id)
    if not position:
        raise HTTPException(
            status_code=404,
            detail="Position don't exists"
        )
    return position


@router.get("/get_position_id/{position}")
def get_position_id(
        *,
        db: Session = Depends(deps.get_db),
        position: str
) -> Any:
    """
    Get position id
    """
    position = crud.position.get_by_position(db, position=position)
    if position is None:
        raise HTTPException(
            status_code=404,
            detail="Position don't exists"
        )
    return position.id


@router.get("/get_all_positions", response_model=List[schemas.Position])
def get_all_positions(
        *,
        db: Session = Depends(deps.get_db)
) -> Any:
    """
    Get all positions
    """
    return crud.position.get_all(db)


@router.put("/update_position_by_id/{id}/position/{position}", response_model=schemas.Position)
def update_position_by_id(
        *,
        db: Session = Depends(deps.get_db),
        id: int,
        position: str
) -> Any:
    """
    Update position by id
    """
    position_in_db = crud.position.get(db, id=id)
    if not position_in_db:
        raise HTTPException(
            status_code=404,
            detail="Position don't exists"
        )
    position_to_update = jsonable_encoder(position_in_db)
    position_updated = schemas.EmploymentUpdate(**position_to_update)
    position_updated.position = position
    return crud.employment.update(db, db_obj=position_in_db, obj_in=position_updated)


@router.delete("/delete_position/{id}", response_model=schemas.Position)
def delete_position(
        *,
        db: Session = Depends(deps.get_db),
        id: int
) -> Any:
    """
    Delete position
    """
    position = crud.position.get(db, id=id)
    if not position:
        raise HTTPException(
            status_code=404,
            detail="Position don't exists"
        )
    return crud.position.remove(db, id=id)
