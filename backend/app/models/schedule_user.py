from sqlalchemy import Column, Integer, ForeignKey, DateTime
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class ScheduleUser(Base):
    schedule_id = Column(Integer, ForeignKey('schedule.id'), primary_key=True)
    user_id = Column(Integer, ForeignKey('user.id'), primary_key=True)
    shift_start = Column(DateTime)
    shift_end = Column(DateTime)

    schedule = relationship("Schedule", back_populates="user")

    user = relationship("User", back_populates="schedule")
