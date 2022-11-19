from datetime import datetime

from pydantic import BaseModel


class ScheduleUserBase(BaseModel):
    schedule_id: int
    user_id: int
    shift_start: datetime
    shift_end: datetime


class ScheduleUserCreate(ScheduleUserBase):
    pass


class ScheduleUserUpdate(ScheduleUserBase):
    pass


class ScheduleUserInDBBase(ScheduleUserBase):
    schedule_id: int
    user_id: int
    shift_start: datetime
    shift_end: datetime

    class Config:
        orm_mode = True


class ScheduleUser(ScheduleUserInDBBase):
    pass
