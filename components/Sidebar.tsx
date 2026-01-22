"use client"
import React, { useState } from 'react'
import { useMap } from '@/contexts/MapContext';
import axios from 'axios'
const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { addMarker, removeMarker, markers } = useMap();

  const [data, setData] = useState();

  const handleAddMarker = async () => {
    const response = await axios.get("/api/v1/locations",
      {
      params: {
        lat: 23.4073,
        long: 85.4373,
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

  return (
    <div className={`absolute top-0 left-0 z-10 bg-white rounded-r-lg shadow-md h-screen w-64 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-56'}`}>
      <div className="p-4">
        sidebar content
        <div>destination</div>
        <button onClick={handleAddMarker}>Add Marker</button>
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