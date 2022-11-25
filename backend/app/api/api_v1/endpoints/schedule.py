from datetime import date
from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import schemas, crud
from app.api import deps

router = APIRouter()


@router.post("/create_schedule", response_model=schemas.Schedule)
def create_schedule(
        *,
        db: Session = Depends(deps.get_db),
        schedule_in: schemas.ScheduleCreate
) -> Any:
    """
    Create schedule
    """
    schedule = crud.schedule.get_by_start_day(db, start_day=schedule_in.start_day)
    if schedule:
        raise HTTPException(
            status_code=400,
            detail="Schedule already exists"
        )
    return crud.schedule.create(db, start_day=schedule_in.start_day, day_off=schedule_in.day_off)


@router.get("/get_schedule_by_id/{id}", response_model=schemas.Schedule)
def get_schedule_by_id(
        *,
        db: Session = Depends(deps.get_db),
        id: int
) -> Any:
    """
    Get schedule by id
    """
    schedule = crud.schedule.get(db, id=id)
    if not schedule:
        raise HTTPException(
            status_code=404,
            detail="Schedule don't exists"
        )
    return schedule


@router.get("/get_schedule_id/{start_day}")
def get_schedule_id(
        *,
        db: Session = Depends(deps.get_db),
        start_day: date
) -> Any:
    """
    Get schedule id
    """
    schedule = crud.schedule.get_by_start_day(db, start_day=start_day)
    if not schedule:
        raise HTTPException(
            status_code=404,
            detail="Schedule don't exists"
        )
    return schedule.id


@router.get("/get_all_schedules", response_model=List[schemas.Schedule])
def get_all_schedules(
        *,
        db: Session = Depends(deps.get_db)
) -> Any:
    """
    Get all schedules
    """
    return crud.schedule.get_all(db)


@router.put("/update_schedule/id/{id}/start_day/{start_day}/day_off/{day_off}", response_model=schemas.Schedule)
def update_schedule(
        *,
        db: Session = Depends(deps.get_db),
        id: int,
        start_day: date,
        day_off: bool
) -> Any:
    """
    Update schedule
    """
    schedule_in_db = crud.schedule.get(db, id=id)
    if not schedule_in_db:
        raise HTTPException(
            status_code=404,
            detail="Position don't exists"
        )
    schedule_updated = schemas.ScheduleUpdate(start_day=start_day, day_off=day_off)
    return crud.schedule.update(db, db_obj=schedule_in_db, obj_in=schedule_updated)


@router.delete("/delete_schedule/{id}", response_model=schemas.Schedule)
def delete_schedule(
        *,
        db: Session = Depends(deps.get_db),
        id: int
) -> Any:
    """
    Delete schedule
    """
    schedule = crud.schedule.get(db, id=id)
    if not schedule:
        raise HTTPException(
            status_code=404,
            detail="Schedule don't exists"
        )
    return crud.schedule.remove(db, id=id)
