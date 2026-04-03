from pydantic import BaseModel
from typing import Optional

class WarehouseCreate(BaseModel):
    name: str
    location: str

class WarehouseResponse(BaseModel):
    id: int
    name: str
    location: str

    class Config:
        from_attributes = True

class WarehouseUpdate(BaseModel):
    name: Optional[str] = None
    location: Optional[str] = None

# -------------------------
# SUPPLIER SCHEMAS
# -------------------------
class SupplierCreate(BaseModel):
    name: str
    contact_email: str
    phone_number: str

class SupplierResponse(BaseModel):
    id: int
    name: str
    contact_email: str
    phone_number: str

    class Config:
        from_attributes = True

class SupplierUpdate(BaseModel):
    name: Optional[str] = None
    contact_email: Optional[str] = None
    phone_number: Optional[str] = None