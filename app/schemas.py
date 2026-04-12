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

class ProductBase(BaseModel):
    name: str
    sku: str
    description: Optional[str] = None
    price: float  
    category: str
    supplier_id: int
    stockQuantity: int = 0

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    sku: Optional[str] = None 
    description: Optional[str] = None
    price: Optional[float] = None
    category: Optional[str] = None
    supplier_id: Optional[int] = None


class ProductResponse(ProductBase):
    id: int
    warehouse_id: int
    class Config:
        from_attributes = True