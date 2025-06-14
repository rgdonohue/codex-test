from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class LocationBase(BaseModel):
    name: str
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)
    description: Optional[str] = None
    category: Optional[str] = None
    elevation: Optional[float] = None
    metadata: Optional[dict] = None

class LocationCreate(LocationBase):
    pass

class Location(LocationBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class DistanceRequest(BaseModel):
    from_lat: float = Field(..., ge=-90, le=90)
    from_lon: float = Field(..., ge=-180, le=180)
    to_lat: float = Field(..., ge=-90, le=90)
    to_lon: float = Field(..., ge=-180, le=180)

class DistanceResponse(BaseModel):
    distance_km: float
    distance_miles: float
    bearing: Optional[float] = None  # Bearing in degrees from north

class NearbyRequest(BaseModel):
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)
    radius_km: float = Field(..., gt=0)
    category: Optional[str] = None

class Cluster(BaseModel):
    center_lat: float
    center_lon: float
    radius_km: float
    locations: List[Location]
    size: int

class ClusteringRequest(BaseModel):
    radius_km: float = Field(default=5.0, gt=0)
    min_cluster_size: int = Field(default=2, gt=1)
    category_filter: Optional[str] = None
