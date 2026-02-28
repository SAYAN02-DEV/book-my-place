"use client"
import React, { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'

interface Theater {
  id: number;
  name: string;
  email: string;
  latitude: number;
  longitude: number;
  address: string | null;
  distance?: number;
}

const TheatersPage = () => {
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const location = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(location);
        
        // Fetch nearby theaters
        fetch(`/api/v1/locations?lat=${location.lat}&long=${location.lng}`)
          .then(res => res.json())
          .then(data => {
            setTheaters(data);
            setLoading(false);
          })
          .catch(error => {
            console.error('Error fetching theaters:', error);
            setLoading(false);
          });
      }, () => {
        // If location denied, fetch all theaters
        fetchAllTheaters();
      });
    } else {
      fetchAllTheaters();
    }
  }, []);

  const fetchAllTheaters = () => {
    fetch('/api/v1/theaters')
      .then(res => res.json())
      .then(data => {
        setTheaters(data.theaters);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching theaters:', error);
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen bg-base-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Movie Theaters</h1>
        
        {userLocation && (
          <div className="alert alert-info mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span>Showing theaters near your location</span>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {theaters.map((theater) => (
              <Link
                key={theater.id}
                href={`/stations/${theater.id}`}
                className="card bg-base-200 shadow-xl hover:shadow-2xl transition-all hover:scale-105"
              >
                <div className="card-body">
                  <h2 className="card-title">{theater.name}</h2>
                  {theater.address && (
                    <p className="text-sm opacity-70">{theater.address}</p>
                  )}
                  {theater.distance !== undefined && (
                    <div className="badge badge-primary">
                      {theater.distance.toFixed(1)} km away
                    </div>
                  )}
                  <div className="card-actions justify-end mt-4">
                    <button className="btn btn-primary btn-sm">View Shows</button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!loading && theaters.length === 0 && (
          <div className="text-center py-16">
            <p className="text-2xl opacity-50">No theaters found</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

export default TheatersPage
