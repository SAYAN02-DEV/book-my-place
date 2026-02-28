"use client"
import React, { useState, useEffect } from 'react'
import { useMap } from '@/contexts/MapContext';
import axios from 'axios'

type Theater = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  distance: number;
}

interface SidebarProps {
  theaterData?: {
    lat: number;
    lng: number;
    name: string;
    address: string;
  } | null;
  userLocation?: {
    lat: number;
    lng: number;
  };
}

const Sidebar = ({ theaterData, userLocation: propUserLocation }: SidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { addMarker, removeMarker, markers, setRoute } = useMap();
  const [data, setData] = useState<Theater[]>([]);
  const [selectedTheater, setSelectedTheater] = useState<number>();
  const [userLocation, setUserLocation] = useState({ lat: 0, long: 0 });
  const [locationReady, setLocationReady] = useState(false);

  // Get user location - prioritize prop, then device location
  useEffect(() => {
    if (propUserLocation) {
      setUserLocation({
        lat: propUserLocation.lat,
        long: propUserLocation.lng
      });
      setLocationReady(true);
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            long: pos.coords.longitude
          });
          setLocationReady(true);
        },
        (error) => {
          console.error('Sidebar location error:', error);
          // Fallback to default coordinates
          setUserLocation({
            lat: 23.4073,
            long: 85.4373
          });
          setLocationReady(true);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      // Browser doesn't support geolocation
      setUserLocation({
        lat: 23.4073,
        long: 85.4373
      });
      setLocationReady(true);
    }
  }, [propUserLocation]);

  // Auto-show theater route if theaterData is provided
  useEffect(() => {
    if (theaterData && userLocation && locationReady) {
      handleDirectNavigation(theaterData);
    }
  }, [theaterData, locationReady]);

  const handleDirectNavigation = async (theater: { lat: number; lng: number; name: string; address: string }) => {
    // Add marker for the theater
    addMarker({
      id: `theater-direct`,
      longitude: theater.lng,
      latitude: theater.lat,
      color: '#FF0000',
      popup: `<h3>${theater.name}</h3><p>${theater.address || ''}</p>`
    });

    // Fetch and display route
    try {
      const accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_KEY;
      const response = await axios.get(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${userLocation.long},${userLocation.lat};${theater.lng},${theater.lat}`,
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
        setIsOpen(true); // Open sidebar to show info
      }
    } catch (error) {
      console.error('Error fetching directions:', error);
    }
  };

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
        
        {/* Direct Theater Navigation Info */}
        {theaterData && (
          <div className="mb-4 p-3 bg-green-100 border border-green-500 rounded-lg">
            <h3 className="font-semibold text-sm mb-2 text-green-800">
              📍 Navigating to:
            </h3>
            <p className="text-sm font-bold mb-1">{theaterData.name}</p>
            {theaterData.address && (
              <p className="text-xs text-gray-600">{theaterData.address}</p>
            )}
          </div>
        )}
        
        <button 
          onClick={handleAddMarker}
          disabled={!locationReady}
          className={`mb-4 px-4 py-2 rounded transition-colors ${
            locationReady 
              ? 'bg-blue-500 text-white hover:bg-blue-600' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {locationReady ? 'Search Theaters' : 'Getting Location...'}
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