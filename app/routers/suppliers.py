from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app import models, schemas
from app.database import get_db

router = APIRouter(
    prefix="/api/suppliers",
    tags=["Supplier Management"]
)

def validate_supplier_data(name: str = None, email: str = None, phone: str = None):
    if name is not None and len(name.strip()) == 0:
        raise HTTPException(status_code=400, detail="Supplier name cannot be empty.")
    
    if email is not None and len(email.strip()) == 0:
        raise HTTPException(status_code=400, detail="Contact email cannot be empty.")
            
    if phone is not None and len(phone.strip()) == 0:
        raise HTTPException(status_code=400, detail="Phone number cannot be empty.")


@router.post("", response_model=schemas.SupplierResponse, status_code=201)
def create_supplier(supplier: schemas.SupplierCreate, db: Session = Depends(get_db)):
    validate_supplier_data(supplier.name, supplier.contact_email, supplier.phone_number)
    
    existing_supplier = db.query(models.Supplier).filter(
        models.Supplier.contact_email == supplier.contact_email
    ).first()
    
    if existing_supplier:
        raise HTTPException(status_code=400, detail="A supplier with this email already exists.")

    new_supplier = models.Supplier(
        name=supplier.name.strip(), 
        contact_email=supplier.contact_email.strip(),
        phone_number=supplier.phone_number.strip()
    )
    db.add(new_supplier)
    
    try:
        db.commit()
        db.refresh(new_supplier)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Database integrity constraint violated. Check duplicate data.")
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="An internal error occurred while creating the supplier.")
        
    return new_supplier


@router.get("", response_model=List[schemas.SupplierResponse])
def get_suppliers(db: Session = Depends(get_db)):
    try:
        return db.query(models.Supplier).all()
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to retrieve suppliers due to an internal error.")


@router.get("/{id}", response_model=schemas.SupplierResponse)
def get_supplier(id: int, db: Session = Depends(get_db)):
    if id <= 0:
        raise HTTPException(status_code=400, detail="Invalid supplier ID.")
        
    supplier = db.query(models.Supplier).filter(models.Supplier.id == id).first()
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier not found.")
    return supplier


@router.put("/{id}", response_model=schemas.SupplierResponse)
def update_supplier(id: int, updated_supplier: schemas.SupplierCreate, db: Session = Depends(get_db)):
    if id <= 0:
        raise HTTPException(status_code=400, detail="Invalid supplier ID.")

    validate_supplier_data(updated_supplier.name, updated_supplier.contact_email, updated_supplier.phone_number)

    supplier = db.query(models.Supplier).filter(models.Supplier.id == id).first()
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier not found.")
    
    if supplier.contact_email != updated_supplier.contact_email:
        duplicate_email = db.query(models.Supplier).filter(
            models.Supplier.contact_email == updated_supplier.contact_email
        ).first()
        if duplicate_email:
            raise HTTPException(status_code=400, detail="Email address is already used by another supplier.")

    supplier.name = updated_supplier.name.strip()
    supplier.contact_email = updated_supplier.contact_email.strip()
    supplier.phone_number = updated_supplier.phone_number.strip()
    
    try:
        db.commit()
        db.refresh(supplier)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Database integrity error during update.")
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Internal server error updating supplier.")
        
    return supplier


@router.patch("/{id}", response_model=schemas.SupplierResponse)
def patch_supplier(id: int, updated_fields: schemas.SupplierUpdate, db: Session = Depends(get_db)):
    if id <= 0:
        raise HTTPException(status_code=400, detail="Invalid supplier ID.")

    validate_supplier_data(updated_fields.name, updated_fields.contact_email, updated_fields.phone_number)

    supplier = db.query(models.Supplier).filter(models.Supplier.id == id).first()
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier not found.")

    if updated_fields.contact_email is not None and supplier.contact_email != updated_fields.contact_email:
        duplicate_email = db.query(models.Supplier).filter(
            models.Supplier.contact_email == updated_fields.contact_email
        ).first()
        if duplicate_email:
            raise HTTPException(status_code=400, detail="Email address is already used by another supplier.")

    if updated_fields.name is not None:
        supplier.name = updated_fields.name.strip()
    if updated_fields.contact_email is not None:
        supplier.contact_email = updated_fields.contact_email.strip()
    if updated_fields.phone_number is not None:
        supplier.phone_number = updated_fields.phone_number.strip()

    try:
        db.commit()
        db.refresh(supplier)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Database integrity error during partial update.")
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Internal server error applying partial update.")
        
    return supplier

@router.delete("/{id}", status_code=204)
def delete_supplier(id: int, db: Session = Depends(get_db)):
    if id <= 0:
        raise HTTPException(status_code=400, detail="Invalid supplier ID.")
        
    supplier = db.query(models.Supplier).filter(models.Supplier.id == id).first()
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier not found.")
    
    try:
        db.delete(supplier)
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Cannot delete supplier: linked products detected.")
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Internal server error during deletion.")
        
    return None