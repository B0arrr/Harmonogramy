from datetime import datetime
from typing import List

from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models import ScheduleUser
from app.schemas import ScheduleUserCreate, ScheduleUserUpdate


class CRUDScheduleUser(CRUDBase[ScheduleUser, ScheduleUserCreate, ScheduleUserUpdate]):
    def create(
            self, db: Session, *, obj_in: ScheduleUserCreate
    ) -> ScheduleUser:
        schedule_user = ScheduleUser(
            schedule_id=obj_in.schedule_id,
            user_id=obj_in.user_id,
            shift_start=obj_in.shift_start,
            shift_end=obj_in.shift_end
        )
        db.add(schedule_user)
        db.commit()
        db.refresh(schedule_user)

    def get_by_user_id_and_shift_start(
            self, db: Session, *, user_id: int, shift_start: datetime
    ) -> ScheduleUser:
        db.query(ScheduleUser).filter(ScheduleUser.user_id == user_id, ScheduleUser.shift_start == shift_start).first()

    def get_all_user_schedules(
            self, db: Session, *, user_id: int
    ) -> List[ScheduleUser]:
        return db.query(ScheduleUser).filter(ScheduleUser.user_id == user_id).all()

    def get_user_schedules(
            self, db: Session, *, user_id: int, start_date: datetime, end_date: datetime
    ) -> List[ScheduleUser]:
        return db.query(ScheduleUser) \
            .filter(ScheduleUser.user_id == user_id,
                    ScheduleUser.shift_start >= start_date,
                    ScheduleUser.shift_end <= end_date).all()

    def get_by_ids(
            self, db: Session, *, schedule_id: int, user_id: int
    ) -> ScheduleUser:
        return db.query(self.model) \
            .filter(ScheduleUser.schedule_id == schedule_id, ScheduleUser.user_id == user_id).first()

    def remove(
            self, db: Session, *, user_id: int, schedule_id: int
    ) -> ScheduleUser:
        obj = db.query(ScheduleUser) \
            .filter(ScheduleUser.schedule_id == schedule_id, ScheduleUser.user_id == user_id).first()
        db.delete(obj)
        db.commit()
        return obj


schedule_user = CRUDScheduleUser(ScheduleUser)
