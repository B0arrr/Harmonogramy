from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session

from app import schemas, crud
from app.api import deps

router = APIRouter()


@router.post("/create_employment", response_model=schemas.Employment)
def create_employment(
        *,
        db: Session = Depends(deps.get_db),
        employment_in: schemas.EmploymentCreate
) -> Any:
    """
    Create employment
    """
    employment = crud.employment \
        .get_by_employment(db, employment=employment_in.employment)
    if employment:
        raise HTTPException(
            status_code=400,
            detail="Employment already exists"
        )
    return crud.employment.create(db, obj_in=employment_in)


@router.get("/get_employment_by_id/{id}", response_model=schemas.Employment)
def get_employment_by_id(
        *,
        db: Session = Depends(deps.get_db),
        id: int
) -> Any:
    """
    Get employment by id
    """
    employment = crud.employment.get(db, id=id)
    if not employment:
        raise HTTPException(
            status_code=404,
            detail="Employment don't exists"
        )
    return employment


@router.get("/get_employment_id/{employment}")
def get_employment_id(
        *,
        db: Session = Depends(deps.get_db),
        employment: str
) -> Any:
    """
    Get employment id
    """
    employment = crud.employment.get_by_employment(db, employment=employment)
    if employment is None:
        raise HTTPException(
            status_code=404,
            detail="Employment don't exists"
        )
    return employment.id


@router.get("/get_all_employments", response_model=List[schemas.Employment])
def get_all_employments(
        *,
        db: Session = Depends(deps.get_db)
) -> Any:
    """
    Get all employments
    """
    return crud.employment.get_all(db)


@router.put("/update_employment_by_id/{id}/employment/{employment}",
            response_model=schemas.Employment)
def update_employment_by_id(
        *,
        db: Session = Depends(deps.get_db),
        id: int,
        employment: str
) -> Any:
    """
    Update employment by id
    """
    employment_in_db = crud.employment.get(db, id=id)
    if not employment_in_db:
        raise HTTPException(
            status_code=404,
            detail="Employment don't exists"
        )
    employment_to_update = jsonable_encoder(employment_in_db)
    employment_updated = schemas.EmploymentUpdate(**employment_to_update)
    employment_updated.employment = employment
    return crud.employment.update(db,
                                  db_obj=employment_in_db,
                                  obj_in=employment_updated)


@router.delete("/delete_employment/{id}", response_model=schemas.Employment)
def delete_employment(
        *,
        db: Session = Depends(deps.get_db),
        id: int
) -> Any:
    """
    Delete employment
    """
    employment = crud.employment.get(db, id=id)
    if not employment:
        raise HTTPException(
            status_code=404,
            detail="Employment don't exists"
        )
    return crud.employment.remove(db, id=id)
