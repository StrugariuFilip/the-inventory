from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app import models, schemas
from app.database import get_db

router = APIRouter(
    prefix="/api/warehouses/{warehouseId}/inventory",
    tags=["Stock Management"]
)
MAX_QTY = 9999

@router.get("", response_model=List[schemas.InventoryResponse])
def get_inventory(warehouseId: int, db: Session = Depends(get_db)):
    warehouse = db.query(models.Warehouse).filter(models.Warehouse.id == warehouseId).first()
    if not warehouse:
        raise HTTPException(status_code=404, detail="Specified warehouse does not exist.")
        
    products = db.query(models.Product).filter(models.Product.warehouse_id == warehouseId).all()
    return [{"productId": p.id, "sku": p.sku, "stockQuantity": p.stockQuantity} for p in products]


@router.get("/{productId}", response_model=schemas.InventoryResponse)
def get_product_inventory(warehouseId: int, productId: int, db: Session = Depends(get_db)):
    warehouse = db.query(models.Warehouse).filter(models.Warehouse.id == warehouseId).first()
    if not warehouse:
        raise HTTPException(status_code=404, detail="Specified warehouse does not exist.")

    product = db.query(models.Product).filter(
        models.Product.id == productId, 
        models.Product.warehouse_id == warehouseId
    ).first()
    
    if not product:
        raise HTTPException(status_code=404, detail="Product not found in the specified warehouse.")
        
    return {"productId": product.id, "sku": product.sku, "stockQuantity": product.stockQuantity}


@router.post("/{productId}/increase")
def increase_stock(warehouseId: int, productId: int, req: schemas.StockIncreaseRequest, db: Session = Depends(get_db)):
    if req.quantity <= 0 or req.quantity > MAX_QTY:
        raise HTTPException(status_code=400, detail=f"Quantity must be between 1 and {MAX_QTY}.")

    warehouse = db.query(models.Warehouse).filter(models.Warehouse.id == warehouseId).first()
    if not warehouse:
        raise HTTPException(status_code=404, detail="Specified warehouse does not exist.")

    supplier = db.query(models.Supplier).filter(models.Supplier.id == req.supplierId).first()
    if not supplier:
        raise HTTPException(status_code=404, detail=f"Supplier with ID {req.supplierId} does not exist.")

    product = db.query(models.Product).filter(
        models.Product.id == productId, 
        models.Product.warehouse_id == warehouseId
    ).first()
    
    if not product:
        raise HTTPException(status_code=404, detail="Product not found in the specified warehouse.")
        
    try:
        product.stockQuantity += req.quantity
        db.commit()
        db.refresh(product)
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Internal error occurred while increasing stock.")
        
    return {
        "message": "Stock increased successfully", 
        "newStockQuantity": product.stockQuantity
    }


@router.post("/{productId}/decrease")
def decrease_stock(warehouseId: int, productId: int, req: schemas.StockDecreaseRequest, db: Session = Depends(get_db)):
    if req.quantity <= 0 or req.quantity > MAX_QTY:
        raise HTTPException(status_code=400, detail=f"Quantity must be between 1 and {MAX_QTY}.")

    warehouse = db.query(models.Warehouse).filter(models.Warehouse.id == warehouseId).first()
    if not warehouse:
        raise HTTPException(status_code=404, detail="Specified warehouse does not exist.")

    product = db.query(models.Product).filter(
        models.Product.id == productId, 
        models.Product.warehouse_id == warehouseId
    ).first()
    
    if not product:
        raise HTTPException(status_code=404, detail="Product not found in the specified warehouse.")
        
    if product.stockQuantity < req.quantity:
        raise HTTPException(
            status_code=400, 
            detail=f"Insufficient stock. Available: {product.stockQuantity}, Requested: {req.quantity}."
        )
    
    if not req.reason or req.reason.strip() == "":
        raise HTTPException(
            status_code=400, 
            detail="Transaction reason is mandatory."
        )   
    try:
        product.stockQuantity -= req.quantity
        db.commit()
        db.refresh(product)
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Internal error occurred while decreasing stock.")
        
    reason_text = getattr(req, 'reason', 'Nespecificat')
    
    return {
        "message": f"Stock decreased successfully (Reason: {reason_text})", 
        "newStockQuantity": product.stockQuantity,
        "reason": reason_text
    }


@router.post("/{productId}/transfer")
def transfer_stock(warehouseId: int, productId: int, req: schemas.StockTransferRequest, db: Session = Depends(get_db)):
    if req.quantity <= 0 or req.quantity > MAX_QTY:
        raise HTTPException(status_code=400, detail=f"Quantity must be between 1 and {MAX_QTY}.")

    if warehouseId == req.targetWarehouseId:
        raise HTTPException(status_code=400, detail="Source and target warehouses cannot be the same.")

    source_product = db.query(models.Product).filter(
        models.Product.id == productId, 
        models.Product.warehouse_id == warehouseId
    ).first()
    
    if not source_product:
        raise HTTPException(status_code=404, detail="Source product not found in this warehouse.")
        
    if source_product.stockQuantity < req.quantity:
        raise HTTPException(status_code=400, detail=f"Not enough stock. Available: {source_product.stockQuantity}")

    target_warehouse = db.query(models.Warehouse).filter(models.Warehouse.id == req.targetWarehouseId).first()
    if not target_warehouse:
        raise HTTPException(status_code=404, detail="Target warehouse does not exist.")

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
        db.refresh(source_product)
        if target_product:
            db.refresh(target_product)
            
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Internal server error during transfer.")

    reason_text = getattr(req, 'reason', 'Unspecified')

    return {
        "message": f"Transfer successful (Motiv: {reason_text})",
        "sourceWarehouseId": warehouseId,
        "targetWarehouseId": req.targetWarehouseId,
        "remainingSourceStock": source_product.stockQuantity,
        "targetProductId": target_product.id,
        "reason": reason_text
    }