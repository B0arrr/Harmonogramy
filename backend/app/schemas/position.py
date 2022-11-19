from pydantic import BaseModel


class PositionBase(BaseModel):
    position: str


class PositionCreate(PositionBase):
    pass


class PositionUpdate(PositionBase):
    pass


class PositionInDBBase(PositionBase):
    id: int
    position: str

    class Config:
        orm_mode = True


class Position(PositionInDBBase):
    pass
