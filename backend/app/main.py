from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import gis, gui

app = FastAPI(
    title="GIS API",
    description="A simple GIS API for location-based services",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(gis.router)
app.include_router(gui.router)

@app.get("/")
async def root():
    return {
        "message": "Welcome to the GIS API",
        "docs_url": "/docs",
        "endpoints": {
            "locations": "/gis/locations",
            "distance": "/gis/distance",
            "nearby": "/gis/nearby"
        }
    }

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}
