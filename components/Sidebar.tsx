"use client"
import React, { useState } from 'react'
import { useMap } from '@/contexts/MapContext';
import axios from 'axios'

type Theater = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  distance: number;
}

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { addMarker, removeMarker, markers, setRoute } = useMap();
  const [data, setData] = useState<Theater[]>([]);
  const [selectedTheater, setSelectedTheater] = useState<number>();
  const [userLocation, setUserLocation] = useState({ lat: 23.4073, long: 85.4373 });

  // Get user location
  useState(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          long: pos.coords.longitude
        });
      });
    }
  });

  const handleAddMarker = async () => {
    const response = await axios.get("/api/v1/locations",
      {
      params: {
        lat: userLocation.lat,
        long: userLocation.long,
        mid: 15,
      },
    }
  );
    setData(response.data);
    response.data.forEach((theater: any) => {
      addMarker({
        id: `theater-${theater.id}`,
        longitude: theater.longitude,
        latitude: theater.latitude,
        color: '#FF0000',
        popup: `<h3>${theater.name}</h3><p>Distance: ${theater.distance.toFixed(2)} km</p>`
      });
    });


  };

  const handleSelect = async (id: number) => {
    setSelectedTheater(id);
    const selectedTheaterData = data.find(t => t.id === id);
    
    if (!selectedTheaterData) return;

    // Remove other markers
    data.forEach((theater: any) => {
      if(theater.id !== id){
        removeMarker(`theater-${theater.id}`);
      }else{
        addMarker({
          id: `theater-${theater.id}`,
          longitude: theater.longitude,
          latitude: theater.latitude,
          color: '#FF0000',
          popup: `<h3>${theater.name}</h3><p>Distance: ${theater.distance.toFixed(2)} km</p>`
        })
      }
    });

    // Fetch directions from Mapbox
    try {
      const accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_KEY;
      const response = await axios.get(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${userLocation.long},${userLocation.lat};${selectedTheaterData.longitude},${selectedTheaterData.latitude}`,
        {
          params: {
            access_token: accessToken,
            geometries: 'geojson',
            overview: 'full'
          }
        }
      );

      if (response.data.routes && response.data.routes.length > 0) {
        const routeData = response.data.routes[0];
        setRoute({
          coordinates: routeData.geometry.coordinates,
          duration: routeData.duration,
          distance: routeData.distance
        });
      }
    } catch (error) {
      console.error('Error fetching directions:', error);
    }
  }

  return (
    <div className={`absolute top-0 left-0 z-10 bg-white rounded-r-lg shadow-md h-screen w-64 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-56'}`}>
      <div className="p-4 h-full flex flex-col">
        <h2 className="text-xl font-bold mb-4">Theaters</h2>
        <button 
          onClick={handleAddMarker}
          className="mb-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Search Theaters
        </button>
        
        <div className="flex-1 overflow-y-auto space-y-3">
          {data.map((theater) => (
            <div 
              key={theater.id}
              onClick={() => handleSelect(theater.id)}
              className={`rounded-lg p-3 border transition-all cursor-pointer ${
                theater.id === selectedTheater 
                  ? 'bg-blue-100 border-blue-500 shadow-md' 
                  : 'bg-gray-50 border-gray-200 hover:shadow-md'
              }`}
            >
              <h3 className="font-semibold text-sm mb-1">{theater.name}</h3>
              <p className="text-xs text-gray-600 mb-1">
                Distance: {theater.distance.toFixed(2)} km
              </p>
              <p className="text-xs text-gray-500">
                {theater.latitude.toFixed(4)}, {theater.longitude.toFixed(4)}
              </p>
            </div>
          ))}
        </div>
      </div>
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-1/2 -translate-y-1/2 right-0 translate-x-full bg-white rounded-r-lg shadow-md py-8 px-2 hover:bg-gray-50 transition-colors border-l-0"
      >
        <svg 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  )
}

export default Sidebar