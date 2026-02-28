"use client"
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'

interface Show {
  id: number;
  startTime: string;
  price: number;
  theater: {
    id: number;
    name: string;
    address: string | null;
  };
  _count: {
    seats: number;
  };
}

interface Movie {
  id: number;
  title: string;
  duration: number;
  imageUrl: string | null;
}

const MovieDetailPage = () => {
  const params = useParams();
  const movieId = params.movie;
  
  const [movie, setMovie] = useState<Movie | null>(null);
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>('');

  useEffect(() => {
    // Fetch movie details
    fetch('/api/v1/getmovies')
      .then(res => res.json())
      .then(data => {
        const foundMovie = data.movies.find((m: Movie) => m.id === parseInt(movieId as string));
        setMovie(foundMovie);
      });

    // Fetch shows for this movie
    fetch(`/api/v1/shows?movieId=${movieId}`)
      .then(res => res.json())
      .then(data => {
        setShows(data.shows);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching shows:', error);
        setLoading(false);
      });
  }, [movieId]);

  // Group shows by theater
  const showsByTheater: { [key: number]: { theater: any; shows: Show[] } } = {};
  shows.forEach(show => {
    if (!showsByTheater[show.theater.id]) {
      showsByTheater[show.theater.id] = {
        theater: show.theater,
        shows: []
      };
    }
    showsByTheater[show.theater.id].shows.push(show);
  });

  // Filter by selected date if any
  const filteredShows = selectedDate
    ? shows.filter(show => new Date(show.startTime).toDateString() === new Date(selectedDate).toDateString())
    : shows;

  // Get unique dates
  const uniqueDates = Array.from(new Set(shows.map(show => 
    new Date(show.startTime).toDateString()
  )));

  return (
    <div className="min-h-screen bg-base-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {movie ? (
          <>
            {/* Movie Header */}
            <div className="flex flex-col md:flex-row gap-8 mb-12">
              <div className="w-full md:w-1/3">
                <figure className="rounded-lg overflow-hidden shadow-xl h-96 bg-base-300">
                  {movie.imageUrl ? (
                    <img 
                      src={movie.imageUrl} 
                      alt={movie.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-6xl">
                      🎬
                    </div>
                  )}
                </figure>
              </div>
              
              <div className="flex-1">
                <h1 className="text-5xl font-bold mb-4">{movie.title}</h1>
                <div className="badge badge-lg mb-4">{movie.duration} mins</div>
                <p className="text-lg opacity-70 mb-6">
                  Book your tickets now and enjoy this amazing movie experience!
                </p>
              </div>
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

            {/* Shows by Theater */}
            <h2 className="text-3xl font-bold mb-6">Available Shows</h2>
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            ) : Object.keys(showsByTheater).length > 0 ? (
              <div className="space-y-6">
                {Object.values(showsByTheater).map(({ theater, shows: theaterShows }) => (
                  <div key={theater.id} className="card bg-base-200 shadow-xl">
                    <div className="card-body">
                      <h3 className="card-title text-2xl">{theater.name}</h3>
                      {theater.address && (
                        <p className="text-sm opacity-70 mb-4">{theater.address}</p>
                      )}
                      
                      <div className="flex flex-wrap gap-3">
                        {theaterShows
                          .filter(show => !selectedDate || new Date(show.startTime).toDateString() === new Date(selectedDate).toDateString())
                          .map((show) => (
                          <Link
                            key={show.id}
                            href={`/stations/${theater.id}/${show.id}`}
                            className="btn btn-outline btn-success"
                          >
                            {new Date(show.startTime).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                            <span className="badge badge-sm ml-2">{show._count.seats} seats</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-2xl opacity-50">No shows available for this movie</p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

export default MovieDetailPage
