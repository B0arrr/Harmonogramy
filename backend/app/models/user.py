from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Date
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class User(Base):
    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, index=True)
    last_name = Column(String, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)
    is_employed = Column(Boolean, default=True)
    date_of_employment = Column(Date)
    date_of_fired = Column(Date)

    company_id = Column(Integer, ForeignKey('company.id'))
    company = relationship("Company", back_populates="user")

    employment_id = Column(Integer, ForeignKey('employment.id'))
    employment = relationship("Employment", back_populates="user")

    position_id = Column(Integer, ForeignKey('position.id'))
    position = relationship("Position", back_populates="user")

    schedule = relationship("ScheduleUser", back_populates="user")
