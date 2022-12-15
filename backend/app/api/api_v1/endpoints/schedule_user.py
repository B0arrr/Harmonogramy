from datetime import datetime
from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import schemas, crud
from app.api import deps

router = APIRouter()


@router.post("/create_schedule_user", response_model=schemas.ScheduleUser)
def create_schedule_user(
        *,
        db: Session = Depends(deps.get_db),
        schedule_in: schemas.ScheduleUserCreate
) -> Any:
    """
    Create schedule for user
    """
    schedule = crud.schedule.get(db, id=schedule_in.schedule_id)
    if not schedule:
        raise HTTPException(
            status_code=404,
            detail="Schedule don't exists"
        )
    user = crud.user.get(db, id=schedule_in.user_id)
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User don't exists"
        )
    schedule_user = crud.schedule_user \
        .get_by_user_id_and_shift_start(db, user_id=schedule_in.user_id, shift_start=schedule_in.shift_start)
    if schedule_user:
        raise HTTPException(
            status_code=400,
            detail="User has already schedule for this day"
        )
    return crud.schedule_user.create(db, obj_in=schedule_in)


@router.get("/get_all_schedules_for_user/{user_id}", response_model=List[schemas.ScheduleUser])
def get_all_schedules_for_user(
        *,
        db: Session = Depends(deps.get_db),
        user_id: int
) -> Any:
    return crud.schedule_user.get_all_user_schedules(db, user_id=user_id)


@router.get("/get_user_schedules/{user_id}/from/{start_date}/end/{end_date}", response_model=List[schemas.ScheduleUser])
def get_user_schedules(
        *,
        db: Session = Depends(deps.get_db),
        user_id: int,
        start_date: datetime,
        end_date: datetime
) -> Any:
    return crud.schedule_user.get_user_schedules(db, user_id=user_id, start_date=start_date, end_date=end_date)


@router.put("/update_schedule_for_user/{user_id}/schedule_id/{schedule_id}/", response_model=schemas.ScheduleUser)
def update_schedule_for_user(
        *,
        db: Session = Depends(deps.get_db),
        user_id: int,
        schedule_id: int,
        schedule_user_in: schemas.ScheduleUserIn
) -> Any:
    schedule_user_in_db = crud.schedule_user.get_by_ids(db, user_id=user_id, schedule_id=schedule_id)
    if not schedule_user_in_db:
        raise HTTPException(
            status_code=404,
            detail="User schedule don't exists"
        )
    schedule_user_updated = schemas.ScheduleUserUpdate(
        user_id=user_id,
        schedule_id=schedule_id,
        shift_start=schedule_user_in.shift_start,
        shift_end=schedule_user_in.shift_end
    )
    return crud.schedule_user.update(db, db_obj=schedule_user_in_db, obj_in=schedule_user_updated)


@router.delete("/delete_schedule_user/user_id/{user_id}/schedule_id/{schedule_id}", response_model=schemas.ScheduleUser)
def delete_schedule_user(
        *,
        db: Session = Depends(deps.get_db),
        user_id: int,
        schedule_id: int
) -> Any:
    schedule_user_in_db = crud.schedule_user.get_by_ids(db, user_id=user_id, schedule_id=schedule_id)
    if not schedule_user_in_db:
        raise HTTPException(
            status_code=404,
            detail="User schedule don't exists"
        )
    return crud.schedule_user.remove(db, id=schedule_user_in_db.id)
