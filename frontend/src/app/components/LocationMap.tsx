'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

interface Location {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  description?: string;
}

export default function LocationMap() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [newLocation, setNewLocation] = useState({
    name: '',
    latitude: 0,
    longitude: 0,
    description: ''
  });
  const [distance, setDistance] = useState<{ km: number; miles: number } | null>(null);
  const [fromId, setFromId] = useState<number | null>(null);
  const [toId, setToId] = useState<number | null>(null);

  useEffect(() => {
    fetchLocations();
  }, []);

  useEffect(() => {
    if (fromId !== null && toId !== null) {
      const from = locations.find((l) => l.id === fromId);
      const to = locations.find((l) => l.id === toId);
      if (from && to) {
        calculateDistance(from, to);
      }
    }
  }, [fromId, toId, locations]);

  const fetchLocations = async () => {
    try {
      const response = await axios.get('http://localhost:8000/gis/locations');
      setLocations(response.data);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/gis/locations', newLocation);
      setNewLocation({ name: '', latitude: 0, longitude: 0, description: '' });
      fetchLocations();
    } catch (error) {
      console.error('Error creating location:', error);
    }
  };

  const calculateDistance = async (from: Location, to: Location) => {
    try {
      const response = await axios.post('http://localhost:8000/gis/distance', {
        from_lat: from.latitude,
        from_lon: from.longitude,
        to_lat: to.latitude,
        to_lon: to.longitude
      });
      setDistance({
        km: response.data.distance_km,
        miles: response.data.distance_miles
      });
    } catch (error) {
      console.error('Error calculating distance:', error);
    }
  };

  return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-4 text-white">Location Manager</h2>
      
      {/* Add Location Form */}
      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <div>
          <input
            type="text"
            placeholder="Location Name"
            value={newLocation.name}
            onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })}
            className="w-full p-2 rounded bg-gray-700 text-white"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            placeholder="Latitude"
            value={newLocation.latitude}
            onChange={(e) => setNewLocation({ ...newLocation, latitude: parseFloat(e.target.value) })}
            className="w-full p-2 rounded bg-gray-700 text-white"
            step="any"
            required
          />
          <input
            type="number"
            placeholder="Longitude"
            value={newLocation.longitude}
            onChange={(e) => setNewLocation({ ...newLocation, longitude: parseFloat(e.target.value) })}
            className="w-full p-2 rounded bg-gray-700 text-white"
            step="any"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Add Location
        </button>
      </form>

      {/* Locations List */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">Saved Locations</h3>
        {locations.map((location) => (
          <div
            key={location.id}
            className="p-4 bg-gray-700 rounded-lg text-white"
          >
            <h4 className="font-bold">{location.name}</h4>
            <p className="text-sm text-gray-300">
              Lat: {location.latitude}, Lon: {location.longitude}
            </p>
            {location.description && (
              <p className="text-sm text-gray-400">{location.description}</p>
            )}
          </div>
        ))}
      </div>

      {/* Distance Calculator */}
      {locations.length >= 2 && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-white mb-4">Calculate Distance</h3>
          <div className="grid grid-cols-2 gap-4">
            <select
              className="p-2 rounded bg-gray-700 text-white"
              value={fromId ?? ''}
              onChange={(e) => {
                const id = parseInt(e.target.value);
                setFromId(isNaN(id) ? null : id);
              }}
            >
              <option value="">Select first location</option>
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name}
                </option>
              ))}
            </select>
            <select
              className="p-2 rounded bg-gray-700 text-white"
              value={toId ?? ''}
              onChange={(e) => {
                const id = parseInt(e.target.value);
                setToId(isNaN(id) ? null : id);
              }}
            >
              <option value="">Select second location</option>
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>
          {distance && (
            <div className="mt-4 p-4 bg-gray-700 rounded-lg text-white">
              <p>Distance: {distance.km} km ({distance.miles} miles)</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 