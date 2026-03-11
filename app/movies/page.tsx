"use client"
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

interface Movie {
  id: number;
  title: string;
  duration: number;
  imageUrl: string | null;
}

function MoviesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setIsLoggedIn(true);
    fetch('/api/v1/getmovies')
      .then(res => res.json())
      .then(data => {
        setMovies(data.movies || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDuration = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return h > 0 ? (m > 0 ? `${h}h ${m}m` : `${h}h`) : `${m}m`;
  };

  return (
    <div className="min-h-screen bg-[#f8f6f6] text-slate-900">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-[#f8f6f6]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/home" className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#e63743] text-3xl">movie_filter</span>
                <h1 className="text-xl font-extrabold tracking-tight text-slate-900">BookMyPlace</h1>
              </Link>
              <nav className="hidden md:flex items-center gap-6">
                <span className="text-sm font-semibold text-[#e63743]">Movies</span>
                <Link href="/stations" className="text-sm font-medium text-slate-600 hover:text-[#e63743] transition-colors">Theaters</Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative hidden sm:block">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
                <input
                  className="pl-10 pr-4 py-1.5 rounded-full border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-[#e63743] focus:border-transparent transition-all w-48 lg:w-64 outline-none"
                  placeholder="Quick search..."
                  type="text"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
              {isLoggedIn ? (
                <Link href="/profile" className="flex items-center justify-center size-10 rounded-full bg-[#e63743] text-white font-bold">
                  P
                </Link>
              ) : (
                <Link href="/auth/login" className="bg-[#e63743] text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-[#e63743]/90 transition-colors">
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Now Showing</h2>
            <p className="text-slate-500 mt-2">Discover the latest blockbusters hitting the screens this week.</p>
          </div>
          <div className="w-full md:w-96">
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#e63743] transition-colors">search</span>
              <input
                className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 bg-white focus:border-[#e63743] focus:ring-0 transition-all outline-none text-slate-900"
                placeholder="Search for movies, cinemas, or genres"
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Movie Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="flex flex-col">
                <div className="aspect-[2/3] rounded-xl bg-slate-200 animate-pulse mb-4" />
                <div className="h-4 bg-slate-200 rounded animate-pulse mb-2" />
                <div className="h-8 bg-slate-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : filteredMovies.length === 0 ? (
          <div className="text-center py-24">
            <span className="material-symbols-outlined text-6xl text-slate-200 block mb-4">movie_off</span>
            <p className="text-xl text-slate-500">No movies found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredMovies.map(movie => (
              <div key={movie.id} className="group flex flex-col cursor-pointer">
                <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden mb-4 shadow-lg">
                  <div
                    className="absolute inset-0 bg-center bg-cover transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: movie.imageUrl ? `url(${movie.imageUrl})` : undefined }}
                  >
                    {!movie.imageUrl && (
                      <div className="w-full h-full bg-slate-300 flex items-center justify-center">
                        <span className="material-symbols-outlined text-6xl text-slate-400">movie</span>
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-4 left-0 right-0 px-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link
                      href={`/movies/${movie.id}`}
                      className="w-full py-3 bg-[#e63743] text-white font-bold rounded-lg shadow-xl hover:bg-[#e63743]/90 transition-colors uppercase text-sm tracking-wider text-center block"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 bg-[#e63743]/10 text-[#e63743] text-[10px] font-bold rounded uppercase tracking-wide">Now Showing</span>
                    <div className="flex items-center gap-1 text-slate-500">
                      <span className="material-symbols-outlined text-sm">schedule</span>
                      <span className="text-xs font-medium">{formatDuration(movie.duration)}</span>
                    </div>
                  </div>
                  <Link href={`/movies/${movie.id}`}>
                    <h3 className="font-bold text-slate-900 leading-snug hover:text-[#e63743] transition-colors">{movie.title}</h3>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="mt-16 border-t border-slate-200 bg-white py-8 text-center">
        <p className="text-slate-400 text-sm">© 2024 BookMyPlace Entertainment Pvt. Ltd. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default function MoviesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f8f6f6] flex items-center justify-center"><span className="material-symbols-outlined text-[#e63743] text-4xl animate-spin">refresh</span></div>}>
      <MoviesContent />
    </Suspense>
  );
}


