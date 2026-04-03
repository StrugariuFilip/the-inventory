from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import models, schemas
from app.database import get_db

router = APIRouter(
    prefix="/api/warehouses",
    tags=["Warehouse Management"]
)

@router.post("", response_model=schemas.WarehouseResponse)
def create_warehouse(warehouse: schemas.WarehouseCreate, db: Session = Depends(get_db)):
    new_warehouse = models.Warehouse(name=warehouse.name, location=warehouse.location)
    db.add(new_warehouse)
    db.commit()
    db.refresh(new_warehouse)
    return new_warehouse

@router.get("", response_model=list[schemas.WarehouseResponse])
def get_warehouses(db: Session = Depends(get_db)):
    warehouses = db.query(models.Warehouse).all()
    return warehouses

@router.get("/{id}", response_model=schemas.WarehouseResponse)
def get_warehouse(id: int, db: Session = Depends(get_db)):
    warehouse = db.query(models.Warehouse).filter(models.Warehouse.id == id).first()
    if not warehouse:
        raise HTTPException(status_code=404, detail="Warehouse not found")
    return warehouse

@router.put("/{id}", response_model=schemas.WarehouseResponse)
def update_warehouse(id: int, updated_warehouse: schemas.WarehouseCreate, db: Session = Depends(get_db)):
    warehouse = db.query(models.Warehouse).filter(models.Warehouse.id == id).first()
    if not warehouse:
        raise HTTPException(status_code=404, detail="Warehouse not found")

    warehouse.name = updated_warehouse.name
    warehouse.location = updated_warehouse.location
    db.commit()
    db.refresh(warehouse)
    return warehouse

@router.patch("/{id}", response_model=schemas.WarehouseResponse)
def patch_warehouse(id: int, updated_fields: schemas.WarehouseUpdate, db: Session = Depends(get_db)):
    warehouse = db.query(models.Warehouse).filter(models.Warehouse.id == id).first()
    if not warehouse:
        raise HTTPException(status_code=404, detail="Warehouse not found")

    if updated_fields.name is not None:
        warehouse.name = updated_fields.name
    if updated_fields.location is not None:
        warehouse.location = updated_fields.location

    db.commit()
    db.refresh(warehouse)
    return warehouse