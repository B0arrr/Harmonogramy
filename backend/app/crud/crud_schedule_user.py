from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models import ScheduleUser
from app.schemas import ScheduleUserCreate, ScheduleUserUpdate


class CRUDScheduleUser(CRUDBase[ScheduleUser, ScheduleUserCreate, ScheduleUserUpdate]):
    def get_by_ids(
            self, db: Session, schedule_id: int, user_id: int
    ) -> ScheduleUser:
        return db.query(self.model) \
            .filter(ScheduleUser.schedule_id == schedule_id, ScheduleUser.user_id == user_id).first()


schedule_user = CRUDScheduleUser(ScheduleUser)
