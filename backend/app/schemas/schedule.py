from datetime import date

from pydantic import BaseModel


class ScheduleBase(BaseModel):
    start_day: date
    day_off: bool


class ScheduleCreate(ScheduleBase):
    pass


class ScheduleUpdate(ScheduleBase):
    pass


class ScheduleInDBBase(ScheduleBase):
    id: int
    start_day: date
    day_off: bool

    class Config:
        orm_mode = True


class Schedule(ScheduleInDBBase):
    pass
