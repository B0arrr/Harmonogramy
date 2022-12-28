from datetime import date
from typing import Optional

from pydantic import BaseModel, EmailStr


class UserBase(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    password: str
    is_active: Optional[bool] = False
    is_superuser: Optional[bool] = False
    is_employed: Optional[bool] = True
    date_of_employment: Optional[date] = date.today()
    date_of_fired: Optional[date]
    company_id: Optional[int]
    employment_id: Optional[int]
    position_id: Optional[int]


class UserCreate(UserBase):
    pass


class UserUpdate(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    is_active: bool
    is_superuser: bool
    is_employed: bool
    date_of_employment: date
    date_of_fired: Optional[date]
    company_id: int
    employment_id: int
    position_id: int


class UserUpdatePassword(BaseModel):
    password: str


class UserInDBBase(UserBase):
    id: int
    first_name: str
    last_name: str
    email: EmailStr
    password: str
    is_active: Optional[bool]
    is_superuser: Optional[bool]
    is_employed: Optional[bool]
    date_of_employment: Optional[date]
    date_of_fired: Optional[date]
    company_id: Optional[int]
    employment_id: Optional[int]
    position_id: Optional[int]

    class Config:
        orm_mode = True


class User(UserInDBBase):
    pass
