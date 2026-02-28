"use client"
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

interface Show {
  id: number;
  startTime: string;
  price: number;
  movie: {
    id: number;
    title: string;
    duration: number;
    imageUrl: string | null;
  };
}

interface Theater {
  id: number;
  name: string;
  email: string;
  latitude: number;
  longitude: number;
  address: string | null;
  shows: Show[];
}

const TheaterDetailPage = () => {
  const params = useParams();
  const theaterId = params.stationid;
  
  const [theater, setTheater] = useState<Theater | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>('');

  useEffect(() => {
    fetch(`/api/v1/theaters?id=${theaterId}`)
      .then(res => res.json())
      .then(data => {
        setTheater(data.theater);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching theater:', error);
        setLoading(false);
      });
  }, [theaterId]);

  if (loading || !theater) {
    return (
      <div className="min-h-screen bg-base-100">
        <Navbar />
        <div className="flex justify-center items-center h-screen">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </div>
    );
  }

  // Group shows by movie
  const showsByMovie: { [key: number]: { movie: any; shows: Show[] } } = {};
  theater.shows.forEach(show => {
    if (!showsByMovie[show.movie.id]) {
      showsByMovie[show.movie.id] = {
        movie: show.movie,
        shows: []
      };
    }
    showsByMovie[show.movie.id].shows.push(show);
  });

  // Get unique dates
  const uniqueDates = Array.from(new Set(theater.shows.map(show => 
    new Date(show.startTime).toDateString()
  )));

  return (
    <div className="min-h-screen bg-base-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Theater Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4">{theater.name}</h1>
          {theater.address && (
            <p className="text-lg opacity-70 mb-2">📍 {theater.address}</p>
          )}
          <p className="text-sm opacity-50">✉️ {theater.email}</p>
        </div>

        {/* Date Filter */}
        {uniqueDates.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Select Date:</h3>
            <div className="flex gap-2 flex-wrap">
              <button
                className={`btn ${!selectedDate ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setSelectedDate('')}
              >
                All Dates
              </button>
              {uniqueDates.map((date, index) => (
                <button
                  key={index}
                  className={`btn ${selectedDate === date ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setSelectedDate(date)}
                >
                  {new Date(date).toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Shows by Movie */}
        <h2 className="text-3xl font-bold mb-6">Now Showing</h2>
        
        {Object.keys(showsByMovie).length > 0 ? (
          <div className="space-y-6">
            {Object.values(showsByMovie).map(({ movie, shows }) => (
              <div key={movie.id} className="card bg-base-200 shadow-xl">
                <div className="card-body">
                  <div className="flex gap-6">
                    <div className="w-32 h-48 flex-shrink-0">
                      <figure className="rounded-lg overflow-hidden h-full bg-base-300">
                        {movie.imageUrl ? (
                          <img 
                            src={movie.imageUrl} 
                            alt={movie.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-4xl">
                            🎬
                          </div>
                        )}
                      </figure>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="card-title text-2xl mb-2">{movie.title}</h3>
                      <p className="text-sm opacity-70 mb-4">{movie.duration} mins</p>
                      
                      <div className="flex flex-wrap gap-3">
                        {shows
                          .filter(show => !selectedDate || new Date(show.startTime).toDateString() === new Date(selectedDate).toDateString())
                          .map((show) => (
                          <Link
                            key={show.id}
                            href={`/stations/${theaterId}/${show.id}`}
                            className="btn btn-outline btn-success"
                          >
                            {new Date(show.startTime).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                            <span className="badge badge-sm ml-2">₹{show.price}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-2xl opacity-50">No shows available at this theater</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

export default TheaterDetailPage
