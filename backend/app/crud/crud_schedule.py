from datetime import date

from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models import Schedule
from app.schemas import ScheduleCreate, ScheduleUpdate


class CRUDSchedule(CRUDBase[Schedule, ScheduleCreate, ScheduleUpdate]):
    def get_id(
            self, db: Session, *, start_day: date, day_off: bool
    ) -> int:
        return db \
            .query(self.model) \
            .filter(Schedule.start_day == start_day, Schedule.day_off == day_off).first().id


schedule = CRUDSchedule(Schedule)
