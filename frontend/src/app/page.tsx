'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import LocationMap from './components/LocationMap';

export default function Home() {
  const [apiStatus, setApiStatus] = useState<string>('loading');

  useEffect(() => {
    const checkApiHealth = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/health');
        setApiStatus(response.data.status);
      } catch (error) {
        setApiStatus('error');
      }
    };

    checkApiHealth();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-8">
          GIS Location Manager
        </h1>

        <div className="max-w-4xl mx-auto">
          <div className="mb-8 bg-gray-800 rounded-lg shadow-xl p-6">
            <h2 className="text-2xl font-semibold mb-4">System Status</h2>
            <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
              <span className="text-lg">Backend API</span>
              <span className={`px-3 py-1 rounded-full text-sm ${
                apiStatus === 'healthy'
                  ? 'bg-green-500 text-white'
                  : apiStatus === 'error'
                  ? 'bg-red-500 text-white'
                  : 'bg-yellow-500 text-white'
              }`}>
                {apiStatus}
              </span>
            </div>
          </div>

          <LocationMap />
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-400">
            Built with Next.js and FastAPI
          </p>
        </div>
      </div>
    </main>
  );
}
