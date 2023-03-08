from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import schemas, crud
from app.api import deps
from app.core.security import get_password_hash

router = APIRouter()


@router.post("/create_user", response_model=schemas.User)
def create_user(
        *,
        db: Session = Depends(deps.get_db),
        user_in: schemas.UserCreate
) -> Any:
    """
    Create user
    """
    user = crud.user.get_user_by_email(db, email=user_in.email)
    if user:
        raise HTTPException(
            status_code=400,
            detail="User already exists"
        )
    user_in.password = get_password_hash(user_in.password)
    return crud.user.create(db, obj_in=user_in)


@router.get("/get_user_by_id/{id}", response_model=schemas.User)
def get_user_by_id(
        *,
        db: Session = Depends(deps.get_db),
        id: int
) -> Any:
    """
    Get user by id
    """
    user = crud.user.get(db, id=id)
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User don't exists"
        )
    return user


@router.get("/get_user_by_email/{email}", response_model=schemas.User)
def get_user_by_email(
        *,
        db: Session = Depends(deps.get_db),
        email: str
) -> Any:
    """
    Get user by email
    """
    user = crud.user.get_user_by_email(db, email=email)
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User don't exists"
        )
    return user


@router.get("/get_user_id_by_email/{email}")
def get_user_id(
        *,
        db: Session = Depends(deps.get_db),
        email: str
) -> Any:
    """
    Get user id
    """
    user = crud.user.get_user_by_email(db, email=email)
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User don't exists"
        )
    return user.id


@router.get("/get_all_users_from_company_by_id/{company_id}",
            response_model=List[schemas.User])
def get_all_users_from_company_by_id(
        *,
        db: Session = Depends(deps.get_db),
        company_id: int
) -> Any:
    """
    Get users from company by company id
    """
    return crud.user.get_users_from_company_by_id(db, company_id=company_id)


@router.get("/get_all_users_from_company/{company}",
            response_model=List[schemas.User])
def get_all_users_from_company(
        *,
        db: Session = Depends(deps.get_db),
        company: str
) -> Any:
    """
    Get users from company by company
    """
    company = crud.company.get_by_company(db, company=company)
    if not company:
        raise HTTPException(
            status_code=404,
            detail="Company don't exists"
        )
    return crud.user.get_users_from_company_by_id(db, company_id=company.id)


@router.get("/get_all_users_with_employment_id/{employment_id}",
            response_model=List[schemas.User])
def get_all_users_with_employment_id(
        *,
        db: Session = Depends(deps.get_db),
        employment_id: int
) -> Any:
    """
    Get users with employment by employment id
    """
    return crud.user.get_users_with_employment(db, employment_id=employment_id)


@router.get("/get_all_users_with_employment/{employment}",
            response_model=List[schemas.User])
def get_all_users_with_employment(
        *,
        db: Session = Depends(deps.get_db),
        employment: str
) -> Any:
    """
    Get users with employment by employment
    """
    employment = crud.employment.get_by_employment(db, employment=employment)
    if not employment:
        raise HTTPException(
            status_code=404,
            detail="Employment don't exists"
        )
    return crud.user.get_users_with_employment(db, employment_id=employment.id)


@router.get("/get_all_users_on_position_id/{position_id}",
            response_model=List[schemas.User])
def get_all_users_on_position_id(
        *,
        db: Session = Depends(deps.get_db),
        position_id: int
) -> Any:
    """
    Get users on position by position id
    """
    return crud.user.get_users_on_position(db, position_id=position_id)


@router.get("/get_all_users_on_position/{position}",
            response_model=List[schemas.User])
def get_all_users_on_position(
        *,
        db: Session = Depends(deps.get_db),
        position: str
) -> Any:
    """
    Get users on position by position
    """
    position = crud.position.get_by_position(db, position=position)
    if not position:
        raise HTTPException(
            status_code=404,
            detail="Position don't exists"
        )
    return crud.user.get_users_on_position(db, position_id=position.id)


@router.get("/get_all_users", response_model=List[schemas.User])
def get_all_users(
        *,
        db: Session = Depends(deps.get_db)
) -> Any:
    return crud.user.get_all(db)


@router.put("/update_user_by_id/{id}", response_model=schemas.User)
def update_user(
        *,
        db: Session = Depends(deps.get_db),
        id: int,
        user_update: schemas.UserUpdate
) -> Any:
    """
    Update user
    """
    user_in_db = crud.user.get(db, id=id)
    if not user_in_db:
        raise HTTPException(
            status_code=404,
            detail="User don't exists"
        )
    user_updated = schemas.UserUpdate(
        first_name=user_update.first_name,
        last_name=user_update.last_name,
        email=user_update.email,
        is_active=user_update.is_active,
        is_superuser=user_update.is_superuser,
        is_employed=user_update.is_employed,
        date_of_employment=user_update.date_of_employment,
        date_of_fired=user_update.date_of_fired,
        company_id=user_update.company_id,
        employment_id=user_update.employment_id,
        position_id=user_update.position_id
    )
    return crud.user.update(db, db_obj=user_in_db, obj_in=user_updated)


@router.put("/update_user_password/{id}", response_model=schemas.User)
def update_user_password(
        *,
        db: Session = Depends(deps.get_db),
        id: int,
        user_update: schemas.UserUpdatePassword
) -> Any:
    """
    Update user password
    """
    user_in_db = crud.user.get(db, id=id)
    if not user_in_db:
        raise HTTPException(
            status_code=404,
            detail="User don't exists"
        )
    user_updated = schemas.UserUpdatePassword(
        password=get_password_hash(user_update.password)
    )
    return crud.user.update(db, db_obj=user_in_db, obj_in=user_updated)


@router.delete("/delete_user/{id}", response_model=schemas.User)
def delete_user(
        *,
        db: Session = Depends(deps.get_db),
        id: int
) -> Any:
    """
    Delete user
    """
    user = crud.user.get(db, id=id)
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User don't exists"
        )
    return crud.user.remove(db, id=id)
