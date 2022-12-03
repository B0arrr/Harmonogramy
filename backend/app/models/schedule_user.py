from sqlalchemy import Column, Integer, ForeignKey, DateTime
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class ScheduleUser(Base):
    id = Column(Integer, primary_key=True, index=True)
    schedule_id = Column(Integer, ForeignKey('schedule.id'))
    user_id = Column(Integer, ForeignKey('user.id'))
    shift_start = Column(DateTime)
    shift_end = Column(DateTime)

    schedule = relationship("Schedule", back_populates="user")

    user = relationship("User", back_populates="schedule")
