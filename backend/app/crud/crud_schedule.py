from datetime import date

from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models import Schedule
from app.schemas import ScheduleCreate, ScheduleUpdate


class CRUDSchedule(CRUDBase[Schedule, ScheduleCreate, ScheduleUpdate]):
    def create(
            self, db: Session, *, start_day: date, day_off: bool
    ) -> Schedule:
        schedule = Schedule(start_day=start_day, day_off=day_off)
        db.add(schedule)
        db.commit()
        db.refresh(schedule)
        return schedule

    def get_id(
            self, db: Session, *, start_day: date, day_off: bool
    ) -> int:
        return db \
            .query(self.model) \
            .filter(Schedule.start_day == start_day, Schedule.day_off == day_off).first().id

    def get_by_start_day(
            self, db: Session, *, start_day: date
    ) -> Schedule:
        return db.query(self.model).filter(Schedule.start_day == start_day).first()


schedule = CRUDSchedule(Schedule)
