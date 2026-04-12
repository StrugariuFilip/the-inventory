from sqlalchemy import Column, Integer, String, ForeignKey , Float
from sqlalchemy.orm import relationship
from app.database import Base

class Warehouse(Base):
    __tablename__ = "warehouses"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    location = Column(String)

    products = relationship("Product", back_populates="warehouse")

class Supplier(Base):
    __tablename__ = "suppliers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    contact_email = Column(String)
    phone_number = Column(String)

class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    sku = Column(String, unique=True, index=True)
    description = Column(String)
    price = Column(Float)
    category = Column(String)
    stockQuantity = Column(Integer, default=0)
    warehouse_id = Column(Integer, ForeignKey("warehouses.id"))
    supplier_id = Column(Integer, ForeignKey("suppliers.id"))
    warehouse = relationship("Warehouse", back_populates="products")