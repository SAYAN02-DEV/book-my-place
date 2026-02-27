"use client"
import React, { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'

interface Movie {
  id: number;
  title: string;
  duration: number;
  imageUrl: string | null;
}

const MoviesPage = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('/api/v1/getmovies')
      .then(res => res.json())
      .then(data => {
        setMovies(data.movies);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching movies:', error);
        setLoading(false);
      });
  }, []);

  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-base-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">All Movies</h1>
        
        {/* Search Bar */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search movies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input input-bordered w-full max-w-md"
          />
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredMovies.map((movie) => (
              <Link 
                key={movie.id} 
                href={`/movies/${movie.id}`}
                className="card bg-base-200 shadow-xl hover:shadow-2xl transition-all hover:scale-105"
              >
                <figure className="h-80 bg-base-300">
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
                <div className="card-body">
                  <h2 className="card-title">{movie.title}</h2>
                  <p className="text-sm opacity-70">{movie.duration} mins</p>
                  <div className="card-actions justify-end mt-2">
                    <button className="btn btn-primary btn-sm">Book Now</button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!loading && filteredMovies.length === 0 && (
          <div className="text-center py-16">
            <p className="text-2xl opacity-50">No movies found</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

export default MoviesPage
