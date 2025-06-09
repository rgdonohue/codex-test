import sys
from pathlib import Path

# allow importing the backend app
sys.path.append(str(Path(__file__).resolve().parents[1] / 'backend'))

from fastapi.testclient import TestClient
from app.main import app
from app.routers.gis import locations

client = TestClient(app)


def setup_function(function):
    """Clear the in-memory locations before each test."""
    locations.clear()


def test_health_check():
    response = client.get('/api/health')
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}


def test_root_endpoint():
    response = client.get('/')
    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "Welcome to the GIS API"
    assert "docs_url" in data
    assert "endpoints" in data


def test_create_and_get_locations():
    payload = {"name": "Park", "latitude": 10.0, "longitude": 20.0, "description": "Nice"}
    create_resp = client.post('/gis/locations', json=payload)
    assert create_resp.status_code == 200
    loc = create_resp.json()
    assert loc["name"] == payload["name"]
    assert loc["latitude"] == payload["latitude"]
    assert loc["longitude"] == payload["longitude"]

    list_resp = client.get('/gis/locations')
    assert list_resp.status_code == 200
    locations_list = list_resp.json()
    assert len(locations_list) == 1
    assert locations_list[0]["id"] == loc["id"]


def test_get_location_by_id():
    payload = {"name": "Park", "latitude": 0.0, "longitude": 0.0}
    loc = client.post('/gis/locations', json=payload).json()
    resp = client.get(f'/gis/locations/{loc["id"]}')
    assert resp.status_code == 200
    assert resp.json()["id"] == loc["id"]

    resp = client.get('/gis/locations/999')
    assert resp.status_code == 404


def test_distance_calculation():
    client.post('/gis/locations', json={"name": "A", "latitude": 0.0, "longitude": 0.0})
    client.post('/gis/locations', json={"name": "B", "latitude": 0.0, "longitude": 1.0})

    resp = client.post('/gis/distance', json={
        "from_lat": 0.0, "from_lon": 0.0, "to_lat": 0.0, "to_lon": 1.0
    })
    assert resp.status_code == 200
    data = resp.json()
    assert "distance_km" in data and "distance_miles" in data
    assert abs(data["distance_km"] - 111) < 2


def test_find_nearby_locations():
    client.post('/gis/locations', json={"name": "A", "latitude": 0.0, "longitude": 0.0})
    client.post('/gis/locations', json={"name": "B", "latitude": 0.0, "longitude": 1.0})

    resp = client.post('/gis/nearby', json={"latitude": 0.0, "longitude": 0.0, "radius_km": 150})
    assert resp.status_code == 200
    assert len(resp.json()) == 2

    resp = client.post('/gis/nearby', json={"latitude": 0.0, "longitude": 0.0, "radius_km": 50})
    assert resp.status_code == 200
    assert len(resp.json()) == 1
