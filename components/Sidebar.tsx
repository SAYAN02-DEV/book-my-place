"use client"
import React, { useState } from 'react'
import { useMap } from '@/contexts/MapContext';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { addMarker, removeMarker, markers } = useMap();

  const handleAddMarker = () => {
    addMarker({
      id: `marker-${Date.now()}`,
      longitude: 85.4373,
      latitude: 23.4073,
      color: '#FF0000',
      popup: '<h3>Times Square</h3>'
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