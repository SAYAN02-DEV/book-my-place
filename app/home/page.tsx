"use client"
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Movie {
  id: number;
  title: string;
  duration: number;
  imageUrl: string | null;
}

const BMP_LOGO = (
  <svg className="size-8" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 45.8096C19.6865 45.8096 15.4698 44.5305 11.8832 42.134C8.29667 39.7376 5.50128 36.3314 3.85056 32.3462C2.19985 28.361 1.76794 23.9758 2.60947 19.7452C3.451 15.5145 5.52816 11.6284 8.57829 8.5783C11.6284 5.52817 15.5145 3.45101 19.7452 2.60948C23.9758 1.76795 28.361 2.19986 32.3462 3.85057C36.3314 5.50129 39.7376 8.29668 42.134 11.8833C44.5305 15.4698 45.8096 19.6865 45.8096 24L24 24L24 45.8096Z" fill="currentColor" />
  </svg>
);

export default function HomePage() {
  const router = useRouter();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [carouselIndex, setCarouselIndex] = useState(0);

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

  const heroMovies = movies.slice(0, 3);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/movies?search=${encodeURIComponent(searchTerm)}`);
    } else {
      router.push('/movies');
    }
  };

  const formatDuration = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return h > 0 ? (m > 0 ? `${h}h ${m}m` : `${h}h`) : `${m}m`;
  };

  return (
    <div className="min-h-screen bg-[#f8f6f6] text-slate-900">
      {/* Sticky Navbar */}
      <nav className="sticky top-0 z-50 w-full bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            <Link href="/home" className="flex items-center gap-2 shrink-0 text-[#e63743]">
              {BMP_LOGO}
              <span className="text-xl font-bold tracking-tight text-slate-900">BookMyPlace</span>
            </Link>
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-slate-400">search</span>
                </div>
                <input
                  className="block w-full pl-10 pr-3 py-2 border-none bg-slate-100 rounded-full text-sm placeholder-slate-500 focus:ring-2 focus:ring-[#e63743]/20 outline-none"
                  placeholder="Search for movies, events, plays, sports and activities"
                  type="text"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
            </form>
            <div className="flex items-center gap-4">
              <Link href="/stations" className="flex items-center gap-1 text-sm font-medium hover:text-[#e63743] transition-colors">
                <span>Theaters</span>
                <span className="material-symbols-outlined text-sm">expand_more</span>
              </Link>
              {isLoggedIn ? (
                <Link href="/profile" className="bg-[#e63743] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#e63743]/90 transition-colors flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">person</span>
                  Profile
                </Link>
              ) : (
                <Link href="/auth/login" className="bg-[#e63743] text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-[#e63743]/90 transition-colors">
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Search */}
      <div className="md:hidden px-4 py-3 bg-white border-b border-slate-200">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-slate-400">search</span>
          </div>
          <input
            className="block w-full pl-10 pr-3 py-2 border-none bg-slate-100 rounded-lg text-sm placeholder-slate-500 outline-none"
            placeholder="Search movies..."
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <main>
        {/* Hero Banner Carousel */}
        <section className="relative w-full bg-slate-900 overflow-hidden h-[300px]">
          {!loading && heroMovies.length > 0 ? (
            <>
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent z-10" />
              <img
                className="w-full h-full object-cover"
                src={heroMovies[carouselIndex]?.imageUrl || ''}
                alt={heroMovies[carouselIndex]?.title || ''}
              />
              <div className="absolute bottom-12 left-8 md:left-20 z-20 max-w-lg">
                <h2 className="text-white text-3xl md:text-4xl font-bold mb-2">
                  {heroMovies[carouselIndex]?.title}
                </h2>
                <p className="text-slate-200 mb-4">
                  {formatDuration(heroMovies[carouselIndex]?.duration)} • Now Showing
                </p>
                <Link
                  href={`/movies/${heroMovies[carouselIndex]?.id}`}
                  className="bg-[#e63743] text-white px-8 py-3 rounded-lg font-bold inline-block hover:bg-[#e63743]/90 transition-colors"
                >
                  Book Now
                </Link>
              </div>
              {heroMovies.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-2">
                  {heroMovies.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCarouselIndex(i)}
                      className={`w-2 h-2 rounded-full transition-colors ${i === carouselIndex ? 'bg-white' : 'bg-white/40'}`}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent z-10" />
              <div className="w-full h-full bg-slate-700" />
              <div className="absolute bottom-12 left-8 md:left-20 z-20 max-w-lg">
                <h2 className="text-white text-3xl md:text-4xl font-bold mb-2">BookMyPlace</h2>
                <p className="text-slate-200 mb-4">Experience the best movies on the big screen.</p>
                <Link href="/movies" className="bg-[#e63743] text-white px-8 py-3 rounded-lg font-bold inline-block">
                  Browse Movies
                </Link>
              </div>
            </>
          )}
        </section>

        {/* Recommended Movies Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold">Recommended Movies</h3>
            <Link href="/movies" className="text-[#e63743] text-sm font-semibold hover:underline">See All ›</Link>
          </div>
          {loading ? (
            <div className="flex gap-6 overflow-x-hidden">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="flex-none w-48 md:w-56">
                  <div className="aspect-[2/3] rounded-xl bg-slate-200 animate-pulse mb-3" />
                  <div className="h-4 bg-slate-200 rounded animate-pulse mb-2" />
                  <div className="h-3 bg-slate-200 rounded animate-pulse w-2/3" />
                </div>
              ))}
            </div>
          ) : (
            <div className="relative group">
              <div className="flex overflow-x-auto gap-6 no-scrollbar pb-4 snap-x">
                {movies.map(movie => (
                  <Link
                    key={movie.id}
                    href={`/movies/${movie.id}`}
                    className="flex-none w-48 md:w-56 snap-start group/card"
                  >
                    <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-3 shadow-sm transition-transform duration-300 group-hover/card:scale-[1.02]">
                      {movie.imageUrl ? (
                        <img className="w-full h-full object-cover" src={movie.imageUrl} alt={movie.title} />
                      ) : (
                        <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                          <span className="material-symbols-outlined text-4xl text-slate-400">movie</span>
                        </div>
                      )}
                      <div className="absolute bottom-2 left-2">
                        <span className="bg-black/70 text-white text-[10px] px-2 py-1 rounded-md backdrop-blur-sm font-medium">
                          {formatDuration(movie.duration)}
                        </span>
                      </div>
                    </div>
                    <h4 className="font-bold text-base truncate">{movie.title}</h4>
                    <p className="text-slate-500 text-sm">Now Showing</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Category Section */}
        <section className="bg-[#e63743]/5 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-xl font-bold mb-8">What are you looking for?</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/movies" className="bg-white p-6 rounded-xl shadow-sm text-center border border-slate-100 hover:border-[#e63743] transition-colors cursor-pointer block">
                <span className="material-symbols-outlined text-4xl text-[#e63743] mb-3 block">movie</span>
                <p className="font-bold">Movies</p>
              </Link>
              <div className="bg-white p-6 rounded-xl shadow-sm text-center border border-slate-100 hover:border-[#e63743] transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-4xl text-[#e63743] mb-3 block">event</span>
                <p className="font-bold">Events</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm text-center border border-slate-100 hover:border-[#e63743] transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-4xl text-[#e63743] mb-3 block">theater_comedy</span>
                <p className="font-bold">Plays</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm text-center border border-slate-100 hover:border-[#e63743] transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-4xl text-[#e63743] mb-3 block">sports_soccer</span>
                <p className="font-bold">Sports</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
            <div className="flex items-center gap-2">
              <div className="text-[#e63743]/60">
                <svg className="size-6" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 45.8096C19.6865 45.8096 15.4698 44.5305 11.8832 42.134C8.29667 39.7376 5.50128 36.3314 3.85056 32.3462C2.19985 28.361 1.76794 23.9758 2.60947 19.7452C3.451 15.5145 5.52816 11.6284 8.57829 8.5783C11.6284 5.52817 15.5145 3.45101 19.7452 2.60948C23.9758 1.76795 28.361 2.19986 32.3462 3.85057C36.3314 5.50129 39.7376 8.29668 42.134 11.8833C44.5305 15.4698 45.8096 19.6865 45.8096 24L24 24L24 45.8096Z" fill="currentColor" />
                </svg>
              </div>
              <span className="text-lg font-bold text-slate-400">BookMyPlace</span>
            </div>
            <div className="flex gap-6 text-sm text-slate-500 font-medium">
              <a href="#" className="hover:text-[#e63743] transition-colors">Help</a>
              <a href="#" className="hover:text-[#e63743] transition-colors">Privacy</a>
              <a href="#" className="hover:text-[#e63743] transition-colors">Terms</a>
              <a href="#" className="hover:text-[#e63743] transition-colors">Offers</a>
            </div>
          </div>
          <p className="text-center text-xs text-slate-400">© 2024 BookMyPlace Entertainment Pvt. Ltd. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}
