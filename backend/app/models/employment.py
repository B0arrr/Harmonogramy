from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class Employment(Base):
    id = Column(Integer, primary_key=True, index=True)
    employment = Column(String, index=True)
    max_hours_per_week = Column(Integer)
    max_hours_per_day = Column(Integer)

    user = relationship("User", back_populates="employment")
