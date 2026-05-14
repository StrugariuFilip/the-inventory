from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware 
from app.database import engine
from app import models
from app.routers import warehouses, suppliers, products, stock

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="The Inventory API",
    description="Microservice for Inventory Management",
    version="1.0.0"
)

origins = [
    "http://localhost:5173",            
    "http://localhost:3000",
    "https://fermo.top",                
    "https://www.fermo.top",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(warehouses.router)
app.include_router(suppliers.router)
app.include_router(products.router)
app.include_router(stock.router)