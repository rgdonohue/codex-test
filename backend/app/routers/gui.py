from fastapi import APIRouter, Request, Form
from fastapi.templating import Jinja2Templates
from fastapi.responses import RedirectResponse
from typing import Optional
from datetime import datetime

from .gis import locations
from ..models import Location

router = APIRouter()

templates = Jinja2Templates(directory="app/templates")

@router.get("/admin")
async def admin_dashboard(request: Request):
    """Display admin interface for managing locations"""
    return templates.TemplateResponse("admin.html", {
        "request": request,
        "locations": locations
    })

@router.post("/admin/locations")
async def add_location(
    name: str = Form(...),
    latitude: float = Form(...),
    longitude: float = Form(...),
    description: Optional[str] = Form(None)
):
    """Add a new location via the admin form"""
    new_location = Location(
        id=len(locations) + 1,
        name=name,
        latitude=latitude,
        longitude=longitude,
        description=description,
        created_at=datetime.now()
    )
    locations.append(new_location)
    return RedirectResponse(url="/admin", status_code=303)
