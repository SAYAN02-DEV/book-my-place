"use client"

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Map from '@/components/Map'
import Sidebar from '@/components/Sidebar'
import { MapProvider } from '@/contexts/MapContext'

const MapPage = () => {
    const searchParams = useSearchParams();
    const [latitude, setLatitude] = useState<number | null>(null);
    const [longitude, setLongitude] = useState<number | null>(null);
    const [locationError, setLocationError] = useState(false);
    const [theaterData, setTheaterData] = useState<{
      lat: number;
      lng: number;
      name: string;
      address: string;
    } | null>(null);
    
    useEffect(() => {
        // Get theater coordinates from URL params
        const theaterLat = searchParams.get('lat');
        const theaterLng = searchParams.get('lng');
        const theaterName = searchParams.get('name');
        const theaterAddress = searchParams.get('address');

        if (theaterLat && theaterLng) {
          setTheaterData({
            lat: parseFloat(theaterLat),
            lng: parseFloat(theaterLng),
            name: theaterName || 'Theater',
            address: theaterAddress || ''
          });
        }

        // Get user location - prioritize device location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (pos) => {
                setLatitude(pos.coords.latitude);
                setLongitude(pos.coords.longitude);
              },
              (error) => {
                console.error('Error getting location:', error);
                setLocationError(true);
                // Fallback to default coordinates only if geolocation fails
                setLatitude(23.4073);
                setLongitude(85.4373);
              },
              {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
              }
            );
        } else {
          // Browser doesn't support geolocation
          setLocationError(true);
          setLatitude(23.4073);
          setLongitude(85.4373);
        }
    }, [searchParams]);
    
    // Show loading while getting location
    if (latitude === null || longitude === null) {
      return (
        <div className="flex items-center justify-center h-screen bg-base-100">
          <div className="text-center">
            <span className="loading loading-spinner loading-lg mb-4"></span>
            <p className="text-lg">Getting your location...</p>
            {locationError && (
              <p className="text-sm text-error mt-2">
                Location access denied. Using default location.
              </p>
            )}
          </div>
        </div>
      );
    }
    
  return (
    <MapProvider>
      <div className='relative h-screen w-full'>
          <Sidebar theaterData={theaterData} userLocation={{ lat: latitude, lng: longitude }} />
          <Map latitude={latitude} longitude={longitude}></Map>
      </div>
    </MapProvider>
  )
}

export default MapPage