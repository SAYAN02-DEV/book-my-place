"use client"

import React, { useState, useEffect } from 'react'
import Map from '@/components/Map'
import Sidebar from '@/components/Sidebar'
import { MapProvider } from '@/contexts/MapContext'

const page = () => {
    const [latitude, setLatitude] = useState(23.4073);
    const [longitude, setLongitude] = useState(85.4373);
    
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                setLatitude(pos.coords.latitude);
                setLongitude(pos.coords.longitude);
            });
        }
        console.log(latitude, longitude);
    }, []);
    
  return (
    <MapProvider>
      <div className='relative h-screen w-full'>
          <Sidebar/>
          <Map latitude={latitude} longitude={longitude}></Map>
      </div>
    </MapProvider>
  )
}



export default page