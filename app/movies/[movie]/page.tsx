"use client"
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

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

export default function MovieDetailPage() {
  const params = useParams();
  const movieId = params.movie;

  const [movie, setMovie] = useState<Movie | null>(null);
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>('');

  useEffect(() => {
    fetch('/api/v1/getmovies')
      .then(res => res.json())
      .then(data => {
        const foundMovie = data.movies.find((m: Movie) => m.id === parseInt(movieId as string));
        setMovie(foundMovie || null);
      });

    fetch(`/api/v1/shows?movieId=${movieId}`)
      .then(res => res.json())
      .then(data => {
        setShows(data.shows || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [movieId]);

  const showsByTheater: { [key: number]: { theater: any; shows: Show[] } } = {};
  shows.forEach(show => {
    if (!showsByTheater[show.theater.id]) {
      showsByTheater[show.theater.id] = { theater: show.theater, shows: [] };
    }
    showsByTheater[show.theater.id].shows.push(show);
  });

  const uniqueDates = Array.from(new Set(shows.map(show =>
    new Date(show.startTime).toDateString()
  )));

  const formatDuration = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return h > 0 ? (m > 0 ? `${h}h ${m}m` : `${h}h`) : `${m}m`;
  };

  return (
    <div className="min-h-screen bg-[#f8f6f6] text-slate-900">
      {/* Navbar */}
      <header className="border-b border-[#e63743]/10 bg-[#f8f6f6] px-4 md:px-10 py-3 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-8">
            <Link href="/home" className="flex items-center gap-2 text-[#e63743]">
              <span className="material-symbols-outlined text-3xl font-bold">theater_comedy</span>
              <h2 className="text-slate-900 text-xl font-bold leading-tight tracking-tight">BookMyPlace</h2>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/movies" className="text-[#e63743] text-sm font-medium transition-colors">Movies</Link>
              <Link href="/stations" className="text-slate-600 hover:text-[#e63743] text-sm font-medium transition-colors">Theaters</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth/login" className="bg-[#e63743] text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-[#e63743]/90 transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 mb-8 text-sm font-medium">
          <Link href="/home" className="text-[#e63743] hover:underline">Home</Link>
          <span className="material-symbols-outlined text-slate-400 text-xs">chevron_right</span>
          <Link href="/movies" className="text-[#e63743] hover:underline">Movies</Link>
          <span className="material-symbols-outlined text-slate-400 text-xs">chevron_right</span>
          <span className="text-slate-500">{movie?.title || 'Loading...'}</span>
        </nav>

        {movie ? (
          <>
            {/* Movie Detail Section */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 mb-12">
              {/* Poster */}
              <div className="md:col-span-4 lg:col-span-3">
                <div className="rounded-xl overflow-hidden shadow-2xl border border-[#e63743]/10 aspect-[2/3] bg-slate-200">
                  {movie.imageUrl ? (
                    <img className="w-full h-full object-cover" src={movie.imageUrl} alt={movie.title} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-6xl text-slate-400">movie</span>
                    </div>
                  )}
                </div>
              </div>
              {/* Info */}
              <div className="md:col-span-8 lg:col-span-9 flex flex-col justify-center">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="bg-[#e63743] text-white text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">Now Showing</span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-4 leading-tight">{movie.title}</h1>
                <div className="flex flex-wrap items-center gap-6 mb-6 text-slate-600 font-medium">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[#e63743] text-xl">schedule</span>
                    <span>{formatDuration(movie.duration)}</span>
                  </div>
                </div>
                <div className="h-px w-full bg-slate-200 my-6" />
                <div className="space-y-4 max-w-3xl">
                  <h3 className="text-lg font-bold">About the movie</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Book your tickets now and enjoy this incredible cinematic experience on the big screen.
                  </p>
                  <div className="flex gap-4 pt-2">
                    <a href="#shows" className="bg-[#e63743] hover:bg-[#e63743]/90 text-white px-8 py-3 rounded-lg font-bold transition-all flex items-center gap-2">
                      <span className="material-symbols-outlined">confirmation_number</span>
                      Book Tickets
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Date Filter */}
            {uniqueDates.length > 0 && (
              <div className="mb-10 overflow-x-auto">
                <div className="flex gap-3 pb-2">
                  <button
                    onClick={() => setSelectedDate('')}
                    className={`whitespace-nowrap px-6 py-3 rounded-full font-bold text-sm transition-all ${!selectedDate ? 'bg-[#e63743] text-white shadow-md' : 'bg-white border border-slate-200 text-slate-700 hover:border-[#e63743]'}`}
                  >
                    All Dates
                  </button>
                  {uniqueDates.map((date, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedDate(date)}
                      className={`whitespace-nowrap px-6 py-3 rounded-full font-bold text-sm transition-all ${selectedDate === date ? 'bg-[#e63743] text-white shadow-md' : 'bg-white border border-slate-200 text-slate-700 hover:border-[#e63743]'}`}
                    >
                      <div className="text-xs font-normal opacity-70">
                        {new Date(date).toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()}
                      </div>
                      <div>{new Date(date).toLocaleDateString('en-US', { day: '2-digit', month: 'short' }).toUpperCase()}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Available Shows */}
            <div id="shows" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Available Shows</h2>
                <div className="flex items-center gap-4 text-sm text-slate-500">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500 inline-block" />Available</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#e63743]/20 border border-[#e63743] inline-block" />Filling Fast</span>
                </div>
              </div>

              {loading ? (
                <div className="space-y-4">
                  {[1, 2].map(i => <div key={i} className="h-32 bg-slate-200 rounded-xl animate-pulse" />)}
                </div>
              ) : Object.keys(showsByTheater).length > 0 ? (
                Object.values(showsByTheater).map(({ theater, shows: theaterShows }) => {
                  const filteredShows = theaterShows.filter(show =>
                    !selectedDate || new Date(show.startTime).toDateString() === selectedDate
                  );
                  if (filteredShows.length === 0) return null;
                  return (
                    <div key={theater.id} className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
                        <div className="lg:col-span-1">
                          <div className="flex items-start gap-2">
                            <span className="material-symbols-outlined text-[#e63743] mt-1">theater_comedy</span>
                            <div>
                              <h4 className="font-bold text-lg">{theater.name}</h4>
                              {theater.address && (
                                <p className="text-sm text-slate-500 mt-1">{theater.address}</p>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="lg:col-span-3 flex flex-wrap gap-4">
                          {filteredShows.map(show => (
                            <Link
                              key={show.id}
                              href={`/stations/${theater.id}/${show.id}`}
                              className="group flex flex-col items-center justify-center min-w-[100px] p-3 rounded-lg border border-green-500/30 bg-green-500/5 hover:bg-green-500 hover:text-white transition-all"
                            >
                              <span className="text-sm font-bold">
                                {new Date(show.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                              <span className="text-[10px] opacity-80 mt-1 uppercase">{show._count?.seats || 0} Seats</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-16">
                  <span className="material-symbols-outlined text-6xl text-slate-200 block mb-4">event_busy</span>
                  <p className="text-xl text-slate-500">No shows available for this movie</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex justify-center items-center h-64">
            <span className="material-symbols-outlined text-[#e63743] text-4xl animate-spin">refresh</span>
          </div>
        )}
      </main>

      <footer className="mt-16 border-t border-slate-200 bg-white py-8 text-center">
        <p className="text-slate-400 text-sm">© 2024 BookMyPlace Entertainment Pvt. Ltd. All Rights Reserved.</p>
      </footer>
    </div>
  );
}


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
