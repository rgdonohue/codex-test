from fastapi import APIRouter, HTTPException
from geopy.distance import geodesic
from typing import List
from datetime import datetime
from ..models import Location, LocationCreate, DistanceRequest, DistanceResponse, NearbyRequest

router = APIRouter(prefix="/gis", tags=["gis"])

# In-memory storage for locations (replace with database in production)
locations: List[Location] = []

@router.post("/locations", response_model=Location)
async def create_location(location: LocationCreate):
    """Create a new location"""
    new_location = Location(
        id=len(locations) + 1,
        **location.model_dump(),
        created_at=datetime.now()
    )
    locations.append(new_location)
    return new_location

@router.get("/locations", response_model=List[Location])
async def get_locations():
    """Get all locations"""
    return locations

@router.post("/distance", response_model=DistanceResponse)
async def calculate_distance(request: DistanceRequest):
    """Calculate distance between two points"""
    point1 = (request.from_lat, request.from_lon)
    point2 = (request.to_lat, request.to_lon)
    
    distance = geodesic(point1, point2)
    
    return DistanceResponse(
        distance_km=round(distance.kilometers, 2),
        distance_miles=round(distance.miles, 2)
    )

@router.post("/nearby", response_model=List[Location])
async def find_nearby_locations(request: NearbyRequest):
    """Find locations within a radius"""
    center = (request.latitude, request.longitude)
    nearby = []
    
    for location in locations:
        point = (location.latitude, location.longitude)
        distance = geodesic(center, point).kilometers
        
        if distance <= request.radius_km:
            nearby.append(location)
    
    return nearby

@router.get("/locations/{location_id}", response_model=Location)
async def get_location(location_id: int):
    """Get a specific location by ID"""
    for location in locations:
        if location.id == location_id:
            return location
    raise HTTPException(status_code=404, detail="Location not found") 