from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app import models, schemas
from app.database import get_db

router = APIRouter(
    prefix="/api/warehouses",
    tags=["Warehouse Management"]
)

def validate_warehouse_data(name: str = None, location: str = None):
    if name is not None and len(name.strip()) == 0:
        raise HTTPException(status_code=400, detail="Warehouse name cannot be empty.")
    if location is not None and len(location.strip()) == 0:
        raise HTTPException(status_code=400, detail="Warehouse location cannot be empty.")

@router.post("", response_model=schemas.WarehouseResponse, status_code=201)
def create_warehouse(warehouse: schemas.WarehouseCreate, db: Session = Depends(get_db)):
    validate_warehouse_data(warehouse.name, warehouse.location)
    
    existing = db.query(models.Warehouse).filter(models.Warehouse.name == warehouse.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="A warehouse with this name already exists.")

    new_warehouse = models.Warehouse(
        name=warehouse.name.strip(), 
        location=warehouse.location.strip()
    )
    db.add(new_warehouse)
    
    try:
        db.commit()
        db.refresh(new_warehouse)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Database integrity error.")
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Internal server error creating warehouse.")
        
    return new_warehouse

@router.get("", response_model=List[schemas.WarehouseResponse])
def get_warehouses(db: Session = Depends(get_db)):
    try:
        return db.query(models.Warehouse).all()
    except Exception:
        raise HTTPException(status_code=500, detail="Internal server error retrieving warehouses.")

@router.get("/{id}", response_model=schemas.WarehouseResponse)
def get_warehouse(id: int, db: Session = Depends(get_db)):
    if id <= 0:
        raise HTTPException(status_code=400, detail="Invalid ID provided.")
        
    warehouse = db.query(models.Warehouse).filter(models.Warehouse.id == id).first()
    if not warehouse:
        raise HTTPException(status_code=404, detail="Warehouse not found.")
    return warehouse

@router.put("/{id}", response_model=schemas.WarehouseResponse)
def update_warehouse(id: int, updated_warehouse: schemas.WarehouseCreate, db: Session = Depends(get_db)):
    if id <= 0:
        raise HTTPException(status_code=400, detail="Invalid ID provided.")

    validate_warehouse_data(updated_warehouse.name, updated_warehouse.location)

    warehouse = db.query(models.Warehouse).filter(models.Warehouse.id == id).first()
    if not warehouse:
        raise HTTPException(status_code=404, detail="Warehouse not found.")

    if warehouse.name != updated_warehouse.name:
        duplicate = db.query(models.Warehouse).filter(
            models.Warehouse.name == updated_warehouse.name, 
            models.Warehouse.id != id
        ).first()
        if duplicate:
            raise HTTPException(status_code=400, detail="New warehouse name is already in use.")

    warehouse.name = updated_warehouse.name.strip()
    warehouse.location = updated_warehouse.location.strip()
    
    try:
        db.commit()
        db.refresh(warehouse)
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Internal error updating warehouse.")
        
    return warehouse

@router.patch("/{id}", response_model=schemas.WarehouseResponse)
def patch_warehouse(id: int, updated_fields: schemas.WarehouseUpdate, db: Session = Depends(get_db)):
    if id <= 0:
        raise HTTPException(status_code=400, detail="Invalid ID provided.")

    validate_warehouse_data(updated_fields.name, updated_fields.location)

    warehouse = db.query(models.Warehouse).filter(models.Warehouse.id == id).first()
    if not warehouse:
        raise HTTPException(status_code=404, detail="Warehouse not found.")

    if updated_fields.name is not None:
        if warehouse.name != updated_fields.name:
            duplicate = db.query(models.Warehouse).filter(
                models.Warehouse.name == updated_fields.name, 
                models.Warehouse.id != id
            ).first()
            if duplicate:
                raise HTTPException(status_code=400, detail="Warehouse name already in use.")
        warehouse.name = updated_fields.name.strip()

    if updated_fields.location is not None:
        warehouse.location = updated_fields.location.strip()

    try:
        db.commit()
        db.refresh(warehouse)
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Internal error during partial update.")
        
    return warehouse

@router.delete("/{id}")
def delete_warehouse(id: int, db: Session = Depends(get_db)):
    warehouse = db.query(models.Warehouse).filter(models.Warehouse.id == id).first()
    if not warehouse:
        raise HTTPException(status_code=404, detail="Warehouse not found.")
    
    product_count = db.query(models.Product).filter(models.Product.warehouse_id == id).count()
    if product_count > 0:
        raise HTTPException(
            status_code=400, 
            detail=f"Cannot delete warehouse: {product_count} product(s) are currently assigned to it."
        )
    
    try:
        db.delete(warehouse)
        db.commit()
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Internal server error during deletion.")
        
    return {"message": "Warehouse deleted successfully"}