from sqlalchemy import Integer, Column, String
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class Position(Base):
    id = Column(Integer, primary_key=True, index=True)
    position = Column(String)

    user = relationship("User", back_populates="position")
