from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app import models, schemas
from app.database import get_db

router = APIRouter(
    prefix="/api/warehouses/{warehouseId}/inventory",
    tags=["Stock Management"]
)

@router.get("", response_model=List[schemas.InventoryResponse])
def get_inventory(warehouseId: int, db: Session = Depends(get_db)):
    products = db.query(models.Product).filter(models.Product.warehouse_id == warehouseId).all()
    return [{"productId": p.id, "sku": p.sku, "stockQuantity": p.stockQuantity} for p in products]

@router.get("/{productId}", response_model=schemas.InventoryResponse)
def get_product_inventory(warehouseId: int, productId: int, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == productId, models.Product.warehouse_id == warehouseId).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"productId": product.id, "sku": product.sku, "stockQuantity": product.stockQuantity}

@router.post("/{productId}/increase")
def increase_stock(warehouseId: int, productId: int, req: schemas.StockIncreaseRequest, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == productId, models.Product.warehouse_id == warehouseId).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    product.stockQuantity += req.quantity
    db.commit()
    return {"message": "Stock increased successfully", "newStockQuantity": product.stockQuantity}

@router.post("/{productId}/decrease")
def decrease_stock(warehouseId: int, productId: int, req: schemas.StockDecreaseRequest, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == productId, models.Product.warehouse_id == warehouseId).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    if product.stockQuantity < req.quantity:
        raise HTTPException(status_code=400, detail="Not enough stock")
    product.stockQuantity -= req.quantity
    db.commit()
    return {"message": "Stock decreased successfully", "newStockQuantity": product.stockQuantity}

@router.post("/{productId}/transfer")
def transfer_stock(warehouseId: int, productId: int, req: schemas.StockTransferRequest, db: Session = Depends(get_db)):
    source_product = db.query(models.Product).filter(
        models.Product.id == productId, 
        models.Product.warehouse_id == warehouseId
    ).first()
    if not source_product:
        raise HTTPException(status_code=404, detail="Product not found in source warehouse")
    if source_product.stockQuantity < req.quantity:
        raise HTTPException(status_code=400, detail="Not enough stock to transfer")
    target_product = db.query(models.Product).filter(
        models.Product.sku == source_product.sku, 
        models.Product.warehouse_id == req.targetWarehouseId
    ).first()
    
    try:
        if not target_product:
            target_product = models.Product(
                name=source_product.name,
                sku=source_product.sku,
                description=source_product.description,
                price=source_product.price,
                category=source_product.category,
                supplier_id=source_product.supplier_id,
                warehouse_id=req.targetWarehouseId,
                stockQuantity=req.quantity 
            )
            db.add(target_product)
        else:
            target_product.stockQuantity += req.quantity

        source_product.stockQuantity -= req.quantity
        
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

    return {
        "message": "Stock transferred successfully", 
        "newStockQuantity": source_product.stockQuantity
    }