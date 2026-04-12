from fastapi import FastAPI
from app.database import engine
from app import models
from app.routers import warehouses  , suppliers , products , stock


models.Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="The Inventory API",
    description="Microservice for Inventory Management",
    version="1.0.0"
)


app.include_router(warehouses.router)
app.include_router(suppliers.router)
app.include_router(products.router)
app.include_router(stock.router)