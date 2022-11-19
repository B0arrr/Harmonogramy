from pydantic import BaseModel


class CompanyBase(BaseModel):
    company: str


class CompanyCreate(CompanyBase):
    pass


class CompanyUpdate(CompanyBase):
    pass


class CompanyInDBBase(CompanyBase):
    id: int
    company: str

    class Config:
        orm_mode = True


class Company(CompanyInDBBase):
    pass
