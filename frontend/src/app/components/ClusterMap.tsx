'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface Location {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  description?: string;
  category?: string;
  elevation?: number;
}

interface Cluster {
  center_lat: number;
  center_lon: number;
  radius_km: number;
  locations: Location[];
  size: number;
}

export default function ClusterMap() {
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [radius, setRadius] = useState<number>(5.0);
  const [minSize, setMinSize] = useState<number>(2);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchClusters = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/gis/clusters`, {
        params: {
          radius_km: radius,
          min_cluster_size: minSize
        }
      });
      setClusters(response.data);
    } catch (error) {
      console.error('Error fetching clusters:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchClusters();
  }, [radius, minSize]);

  return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-4 text-white">Location Clusters</h2>
      
      {/* Controls */}
      <div className="mb-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Cluster Radius (km)
          </label>
          <input
            type="number"
            value={radius}
            onChange={(e) => setRadius(parseFloat(e.target.value))}
            className="w-full p-2 rounded bg-gray-700 text-white"
            min="0.1"
            step="0.1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Minimum Cluster Size
          </label>
          <input
            type="number"
            value={minSize}
            onChange={(e) => setMinSize(parseInt(e.target.value))}
            className="w-full p-2 rounded bg-gray-700 text-white"
            min="2"
            step="1"
          />
        </div>
      </div>

      {/* Clusters List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center text-gray-400">Loading clusters...</div>
        ) : clusters.length > 0 ? (
          clusters.map((cluster, index) => (
            <div
              key={index}
              className="p-4 bg-gray-700 rounded-lg text-white"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold">Cluster {index + 1}</h3>
                <span className="text-sm bg-blue-500 px-2 py-1 rounded">
                  {cluster.size} locations
                </span>
              </div>
              <p className="text-sm text-gray-300 mb-2">
                Center: {cluster.center_lat.toFixed(4)}, {cluster.center_lon.toFixed(4)}
              </p>
              <p className="text-sm text-gray-300 mb-2">
                Radius: {cluster.radius_km.toFixed(1)} km
              </p>
              <div className="mt-2 space-y-2">
                {cluster.locations.map((location) => (
                  <div
                    key={location.id}
                    className="pl-4 border-l-2 border-gray-600"
                  >
                    <p className="font-medium">{location.name}</p>
                    <p className="text-sm text-gray-400">
                      {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                      {location.elevation && ` (${location.elevation}m)`}
                    </p>
                    {location.category && (
                      <span className="text-xs bg-gray-600 px-2 py-1 rounded">
                        {location.category}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-400">
            No clusters found with current parameters
          </div>
        )}
      </div>
    </div>
  );
} 