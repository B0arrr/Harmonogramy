from datetime import date

from pydantic import BaseModel, EmailStr


class UserBase(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    password: str
    is_active: bool
    is_superuser: bool
    is_employed: bool
    date_of_employment: date
    date_of_fired: date
    company_id: int
    employment_id: int
    position_id: int


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
    date_of_fired: date
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
    is_active: bool
    is_superuser: bool
    is_employed: bool
    date_of_employment: date
    date_of_fired: date
    company_id: int
    employment_id: int
    position_id: int

    class Config:
        orm_mode = True


class User(UserInDBBase):
    pass
