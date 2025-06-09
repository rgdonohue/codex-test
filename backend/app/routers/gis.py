from fastapi import APIRouter, HTTPException
from geopy.distance import geodesic
from typing import List
from datetime import datetime
from shapely.geometry import Point
from rtree import index
from ..models import Location, LocationCreate, DistanceRequest, DistanceResponse, NearbyRequest

router = APIRouter(prefix="/gis", tags=["gis"])

# In-memory storage for locations (replace with database in production)
locations: List[Location] = []
# Spatial index for efficient nearby queries
spatial_index = index.Index()

def update_spatial_index():
    """Update the spatial index with current locations"""
    spatial_index = index.Index()
    for i, location in enumerate(locations):
        spatial_index.insert(i, (location.longitude, location.latitude, location.longitude, location.latitude))
    return spatial_index

@router.post("/locations", response_model=Location)
async def create_location(location: LocationCreate):
    """Create a new location"""
    new_location = Location(
        id=len(locations) + 1,
        **location.model_dump(),
        created_at=datetime.now()
    )
    locations.append(new_location)
    update_spatial_index()
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
    """Find locations within a radius using spatial indexing"""
    center = Point(request.longitude, request.latitude)
    # Convert radius from km to degrees (approximate)
    radius_degrees = request.radius_km / 111.32  # 1 degree ≈ 111.32 km at equator
    
    # Create bounding box for initial filtering
    bbox = (
        request.longitude - radius_degrees,
        request.latitude - radius_degrees,
        request.longitude + radius_degrees,
        request.latitude + radius_degrees
    )
    
    # Get potential candidates using spatial index
    candidates = list(spatial_index.intersection(bbox))
    nearby = []
    
    # Refine results with exact distance calculation
    for idx in candidates:
        location = locations[idx]
        point = Point(location.longitude, location.latitude)
        distance = geodesic(
            (request.latitude, request.longitude),
            (location.latitude, location.longitude)
        ).kilometers
        
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

@router.get("/clusters", response_model=List[List[Location]])
async def get_location_clusters(radius_km: float = 5.0):
    """Find clusters of nearby locations using DBSCAN-like approach"""
    if not locations:
        return []
    
    clusters = []
    unassigned = set(range(len(locations)))
    
    while unassigned:
        # Start new cluster with first unassigned location
        cluster_idx = unassigned.pop()
        cluster = [locations[cluster_idx]]
        
        # Find all locations within radius of any location in cluster
        to_check = {cluster_idx}
        while to_check:
            current_idx = to_check.pop()
            current = locations[current_idx]
            
            # Find nearby locations
            bbox = (
                current.longitude - radius_km/111.32,
                current.latitude - radius_km/111.32,
                current.longitude + radius_km/111.32,
                current.latitude + radius_km/111.32
            )
            
            for idx in spatial_index.intersection(bbox):
                if idx in unassigned:
                    nearby = locations[idx]
                    distance = geodesic(
                        (current.latitude, current.longitude),
                        (nearby.latitude, nearby.longitude)
                    ).kilometers
                    
                    if distance <= radius_km:
                        cluster.append(nearby)
                        unassigned.remove(idx)
                        to_check.add(idx)
        
        if len(cluster) > 1:  # Only add clusters with more than one location
            clusters.append(cluster)
    
    return clusters 