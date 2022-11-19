from sqlalchemy import Integer, Column, Date, Boolean
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class Schedule(Base):
    id = Column(Integer, primary_key=True, index=True)
    start_day = Column(Date, index=True)
    day_off = Column(Boolean, default=False)

    user = relationship("Schedule_Employee", back_populates="schedule")
