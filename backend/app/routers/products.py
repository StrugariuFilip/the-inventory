from typing import List
from fastapi import APIRouter, Depends, HTTPException, Request 
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app import models, schemas
from app.database import get_db

router = APIRouter(
    prefix="/api/warehouses/{warehouseId}/products",
    tags=["Product Management"]
)


@router.get("/all", response_model=List[schemas.ProductResponse])
def get_absolutely_all_products(db: Session = Depends(get_db)):
    return db.query(models.Product).all()

@router.post("", status_code=201)
def create_product(warehouseId: int, product: schemas.ProductCreate, db: Session = Depends(get_db)):
    warehouse = db.query(models.Warehouse).filter(models.Warehouse.id == warehouseId).first()
    if not warehouse:
        raise HTTPException(status_code=404, detail="Specified warehouse does not exist.")
    
    supplier = db.query(models.Supplier).filter(models.Supplier.id == product.supplier_id).first()
    if not supplier:
        raise HTTPException(status_code=404, detail=f"Supplier with ID {product.supplier_id} not found.")

    if product.price <= 0:
        raise HTTPException(status_code=400, detail="Product price must be greater than 0.")

    if not product.sku or len(product.sku.strip()) == 0:
        raise HTTPException(status_code=400, detail="SKU code cannot be empty.")
        
    existing_sku = db.query(models.Product).filter(models.Product.sku == product.sku).first()
    if existing_sku:
        raise HTTPException(status_code=400, detail="This SKU code already exists in the system.")
    new_product = models.Product(**product.model_dump(), warehouse_id=warehouseId)
    db.add(new_product)
    
    try:
        db.commit()
        db.refresh(new_product)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Data integrity error. Please verify input fields.")
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="An internal error occurred while saving the product.")

    return {"id": str(new_product.id), "message": "Product created successfully"}


@router.get("", response_model=List[schemas.ProductResponse])
def get_all_products(warehouseId: int, db: Session = Depends(get_db)):
    warehouse = db.query(models.Warehouse).filter(models.Warehouse.id == warehouseId).first()
    if not warehouse:
        raise HTTPException(status_code=404, detail="Warehouse does not exist.")
        
    return db.query(models.Product).filter(models.Product.warehouse_id == warehouseId).all()


@router.get("/{productId}", response_model=schemas.ProductResponse)
def get_product_by_id(warehouseId: int, productId: int, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(
        models.Product.id == productId, 
        models.Product.warehouse_id == warehouseId
    ).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found in this warehouse.")
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
            detail="Stock updates are not allowed via this endpoint."
        )

    db_product = db.query(models.Product).filter(
        models.Product.id == productId, 
        models.Product.warehouse_id == warehouseId
    ).first()

    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found.")

    if product_update.price is not None and product_update.price <= 0:
        raise HTTPException(status_code=400, detail="The new price must be greater than 0.")

    if product_update.supplier_id is not None:
        supplier = db.query(models.Supplier).filter(models.Supplier.id == product_update.supplier_id).first()
        if not supplier:
            raise HTTPException(status_code=404, detail="Specified supplier does not exist.")

    if product_update.sku is not None:
        if len(product_update.sku.strip()) == 0:
            raise HTTPException(status_code=400, detail="SKU cannot be empty.")
        duplicate = db.query(models.Product).filter(models.Product.sku == product_update.sku, models.Product.id != productId).first()
        if duplicate:
            raise HTTPException(status_code=400, detail="Specified SKU is already used by another product.")

    update_data = product_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_product, key, value)

    try:
        db.commit()
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Internal error updating the product.")

    return {"message": "Product updated successfully"}


@router.put("/{productId}")
async def update_or_create_product(
    warehouseId: int, 
    productId: int, 
    product_in: schemas.ProductBase, 
    request: Request, 
    db: Session = Depends(get_db)
):
    body = await request.json()
    if "stockQuantity" in body:
        raise HTTPException(
            status_code=400, 
            detail="Stock updates are not allowed via this endpoint."
        )
    
    if product_in.price <= 0:
        raise HTTPException(status_code=400, detail="Price must be strictly positive.")
        
    warehouse = db.query(models.Warehouse).filter(models.Warehouse.id == warehouseId).first()
    if not warehouse:
        raise HTTPException(status_code=404, detail="Warehouse does not exist.")

    supplier = db.query(models.Supplier).filter(models.Supplier.id == product_in.supplier_id).first()
    if not supplier:
        raise HTTPException(status_code=404, detail="Specified supplier does not exist.")
    
    db_product = db.query(models.Product).filter(models.Product.id == productId).first()
    
    if db_product:
        if db_product.sku != product_in.sku:
            duplicate = db.query(models.Product).filter(models.Product.sku == product_in.sku).first()
            if duplicate:
                raise HTTPException(status_code=400, detail="SKU already exists.")

        update_data = product_in.model_dump()
        update_data.pop("stockQuantity", None)
        for key, value in update_data.items():
            setattr(db_product, key, value)
    else:
        duplicate = db.query(models.Product).filter(models.Product.sku == product_in.sku).first()
        if duplicate:
            raise HTTPException(status_code=400, detail="SKU already exists.")

        new_product = models.Product(**product_in.model_dump(), id=productId, warehouse_id=warehouseId)
        db.add(new_product)
    
    try:
        db.commit()
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Internal error processing PUT request.")

    return {"message": "Product updated successfully"}


@router.delete("/{productId}")
def delete_product(warehouseId: int, productId: int, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(
        models.Product.id == productId, 
        models.Product.warehouse_id == warehouseId
    ).first()
    
    if not product:
        raise HTTPException(status_code=404, detail="Product not found.")
    
    try:
        db.delete(product)
        db.commit()
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Could not delete product. Please check active dependencies.")
        
    return {"message": "Product deleted successfully"}
