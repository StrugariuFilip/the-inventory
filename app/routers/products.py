from typing import List
from fastapi import APIRouter, Depends, HTTPException, Request 
from sqlalchemy.orm import Session
from app import models, schemas
from app.database import get_db

router = APIRouter(
    prefix="/api/warehouses/{warehouseId}/products",
    tags=["Product Management"]
)

@router.post("", status_code=201)
def create_product(warehouseId: int, product: schemas.ProductCreate, db: Session = Depends(get_db)):
    warehouse = db.query(models.Warehouse).filter(models.Warehouse.id == warehouseId).first()
    if not warehouse:
        raise HTTPException(status_code=404, detail="Warehouse not found")
    
    # Creăm produsul folosind datele din schemă
    new_product = models.Product(**product.model_dump(), warehouse_id=warehouseId)
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return {"id": str(new_product.id), "message": "Product created successfully"}

@router.get("", response_model=List[schemas.ProductResponse])
def get_all_products(warehouseId: int, db: Session = Depends(get_db)):
    return db.query(models.Product).filter(models.Product.warehouse_id == warehouseId).all()

@router.get("/{productId}", response_model=schemas.ProductResponse)
def get_product_by_id(warehouseId: int, productId: int, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(
        models.Product.id == productId, 
        models.Product.warehouse_id == warehouseId
    ).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.patch("/{productId}")
async def update_product_details(
    warehouseId: int, 
    productId: int, 
    product_update: schemas.ProductUpdate, 
    request: Request, 
    db: Session = Depends(get_db) 
):
    body = await request.json()
    if "stockQuantity" in body:
        raise HTTPException(
            status_code=400, 
            detail="Stock quantity update not allowed via this endpoint."
        )

    db_product = db.query(models.Product).filter(
        models.Product.id == productId, 
        models.Product.warehouse_id == warehouseId
    ).first()

    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")

    update_data = product_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_product, key, value)

    db.commit()
    return {"message": "Product updated successfully"}

@router.put("/{productId}")
async def update_or_create_product(
    warehouseId: int, 
    productId: int, 
    product_in: schemas.ProductCreate, 
    request: Request, 
    db: Session = Depends(get_db)
):
    body = await request.json()
    if "stockQuantity" in body:
        raise HTTPException(
            status_code=400, 
            detail="Stock quantity update not allowed via this endpoint."
        )
    
    db_product = db.query(models.Product).filter(models.Product.id == productId).first()
    
    if db_product:
        update_data = product_in.model_dump()
        for key, value in update_data.items():
            setattr(db_product, key, value)
    else:
        new_product = models.Product(**product_in.model_dump(), id=productId, warehouse_id=warehouseId)
        db.add(new_product)
    
    db.commit()
    return {"message": "Product updated successfully"}

@router.delete("/{productId}")
def delete_product(warehouseId: int, productId: int, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(
        models.Product.id == productId, 
        models.Product.warehouse_id == warehouseId
    ).first()
    
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    db.delete(product)
    db.commit()
    return {"message": "Product deleted successfully"}