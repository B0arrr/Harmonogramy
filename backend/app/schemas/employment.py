from pydantic import BaseModel


class EmploymentBase(BaseModel):
    employment: str
    max_hours_per_week: int
    max_hours_per_day: int


class EmploymentCreate(EmploymentBase):
    pass


class EmploymentUpdate(EmploymentBase):
    pass


class EmploymentInDBBase(EmploymentBase):
    id: int
    employment: str
    max_hours_per_week: int
    max_hours_per_day: int

    class Config:
        orm_mode = True


class Employment(EmploymentInDBBase):
    pass
