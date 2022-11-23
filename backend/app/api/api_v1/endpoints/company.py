from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session

from app import schemas, crud
from app.api import deps

router = APIRouter()


@router.post("/create_company", response_model=schemas.Company)
def create_company(
        *,
        db: Session = Depends(deps.get_db),
        company_in: schemas.CompanyCreate
) -> Any:
    """
    Create company
    """
    company = crud.company.get_by_company(db, company=company_in.company)
    if company is not None:
        raise HTTPException(
            status_code=400,
            detail="Company already exists"
        )
    return crud.company.create(db, obj_in=company_in)


@router.get("/get_company_by_id/{id}", response_model=schemas.Company)
def get_company_by_id(
        *,
        db: Session = Depends(deps.get_db),
        id: int
) -> Any:
    """
    Get company by id
    """
    company = crud.company.get(db, id=id)
    if company is None:
        raise HTTPException(
            status_code=404,
            detail="Company don't exists"
        )
    return company


@router.get("/get_company_id/{company}")
def get_company_id(
        *,
        db: Session = Depends(deps.get_db),
        company: str
) -> Any:
    """
    Get company id
    """
    company = crud.company.get_by_company(db, company=company)
    if company is None:
        raise HTTPException(
            status_code=404,
            detail="Company don't exists"
        )
    return company.id


@router.get("/get_all_companies", response_model=List[schemas.Company])
def get_all_companies(
        *,
        db: Session = Depends(deps.get_db)
) -> Any:
    """
    Get all companies
    """
    return crud.company.get_all(db)


@router.put("/update_company_by_id/{id}/company/{company}", response_model=schemas.Company)
def update_company_by_id(
        *,
        db: Session = Depends(deps.get_db),
        id: int,
        company: str
) -> Any:
    company_in_db = crud.company.get(db, id=id)
    if not company_in_db:
        raise HTTPException(
            status_code=404,
            detail="Company don't exists"
        )
    company_to_update = jsonable_encoder(company_in_db)
    company_updated = schemas.CompanyUpdate(**company_to_update)
    company_updated.company = company
    return crud.company.update(db, db_obj=company_in_db, obj_in=company_updated)


@router.delete("/delete_company/{id}", response_model=schemas.Company)
def delete_company(
        *,
        db: Session = Depends(deps.get_db),
        id: int
) -> Any:
    """
    Delete company
    """
    company = crud.company.get(db, id=id)
    if not company:
        raise HTTPException(
            status_code=404,
            detail="Company don't exists"
        )
    return crud.company.remove(db, id=id)
