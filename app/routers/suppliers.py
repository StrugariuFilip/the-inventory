from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import models, schemas
from app.database import get_db

router = APIRouter(
    prefix="/api/suppliers",
    tags=["Supplier Management"]
)


@router.post("", response_model=schemas.SupplierResponse)
def create_supplier(supplier: schemas.SupplierCreate, db: Session = Depends(get_db)):
    new_supplier = models.Supplier(
        name=supplier.name, 
        contact_email=supplier.contact_email,
        phone_number=supplier.phone_number
    )
    db.add(new_supplier)
    db.commit()
    db.refresh(new_supplier)
    return new_supplier


@router.get("", response_model=list[schemas.SupplierResponse])
def get_suppliers(db: Session = Depends(get_db)):
    return db.query(models.Supplier).all()

@router.get("/{id}", response_model=schemas.SupplierResponse)
def get_supplier(id: int, db: Session = Depends(get_db)):
    supplier = db.query(models.Supplier).filter(models.Supplier.id == id).first()
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier not found")
    return supplier

@router.put("/{id}", response_model=schemas.SupplierResponse)
def update_supplier(id: int, updated_supplier: schemas.SupplierCreate, db: Session = Depends(get_db)):
    supplier = db.query(models.Supplier).filter(models.Supplier.id == id).first()
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier not found")
    
    supplier.name = updated_supplier.name
    supplier.contact_email = updated_supplier.contact_email
    supplier.phone_number = updated_supplier.phone_number
    
    db.commit()
    db.refresh(supplier)
    return supplier

@router.patch("/{id}", response_model=schemas.SupplierResponse)
def patch_supplier(id: int, updated_fields: schemas.SupplierUpdate, db: Session = Depends(get_db)):
    supplier = db.query(models.Supplier).filter(models.Supplier.id == id).first()
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier not found")

    if updated_fields.name is not None:
        supplier.name = updated_fields.name
    if updated_fields.contact_email is not None:
        supplier.contact_email = updated_fields.contact_email
    if updated_fields.phone_number is not None:
        supplier.phone_number = updated_fields.phone_number

    db.commit()
    db.refresh(supplier)
    return supplier