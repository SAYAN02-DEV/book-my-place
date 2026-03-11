"use client"
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
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

export default function TheaterDetailPage() {
  const params = useParams();
  const theaterId = params.stationid;

  const [theater, setTheater] = useState<Theater | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>('');

  useEffect(() => {
    fetch(`/api/v1/theaters?id=${theaterId}`)
      .then(res => res.json())
      .then(data => { setTheater(data.theater); setLoading(false); })
      .catch(() => setLoading(false));
  }, [theaterId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f6f6] flex items-center justify-center">
        <span className="material-symbols-outlined text-[#e63743] text-4xl animate-spin">refresh</span>
      </div>
    );
  }

  if (!theater) {
    return (
      <div className="min-h-screen bg-[#f8f6f6] flex items-center justify-center">
        <p className="text-slate-500">Theater not found.</p>
      </div>
    );
  }

  const showsByMovie: { [key: number]: { movie: any; shows: Show[] } } = {};
  theater.shows.forEach(show => {
    if (!showsByMovie[show.movie.id]) {
      showsByMovie[show.movie.id] = { movie: show.movie, shows: [] };
    }
    showsByMovie[show.movie.id].shows.push(show);
  });

  const uniqueDates = Array.from(new Set(theater.shows.map(show =>
    new Date(show.startTime).toDateString()
  )));

  const formatDuration = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return h > 0 ? (m > 0 ? `${h}h ${m}m` : `${h}h`) : `${m}m`;
  };

  return (
    <div className="bg-[#f8f6f6] text-slate-900 min-h-screen">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-[#f8f6f6]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/home" className="flex items-center gap-2">
              <div className="bg-[#e63743] p-1.5 rounded-lg flex items-center justify-center text-white">
                <span className="material-symbols-outlined">movie</span>
              </div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">BookMyPlace</h1>
            </Link>
          </div>
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
              <input
                className="w-full bg-slate-100 border-none rounded-xl py-2 pl-10 pr-4 focus:ring-2 focus:ring-[#e63743] text-sm transition-all outline-none"
                placeholder="Search movies, theaters..."
                type="text"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/auth/login" className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-100 rounded-lg transition-colors text-sm font-medium">
              <span className="material-symbols-outlined text-slate-600">account_circle</span>
              <span className="hidden sm:inline">Sign In</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8">
        {/* Theater Header */}
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center mb-10">
          <div className="w-32 h-32 shrink-0 rounded-xl overflow-hidden shadow-lg ring-4 ring-white">
            <div
              className="w-full h-full bg-cover bg-center bg-slate-200"
              style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD1DUBWa5KE56GICSguB-EvtPj_ZrhssF_E1U_o1ftjPZQKys1o5cuvAjJubMMbOeePti6O6BDB-4TlBnSPPnYXs_rClZNMJMAGHOD4pdNwUqKpTlj1y0tAPijt4Af_fgNs_a8v4-rgwQlEFUOZ2tgtOyCwfo6TKrzu2VzcPchDzlzjlSqYOoioMnSMcDXdiIBYAppykymxo4FkLBZ6yjLO0McI0to51WQTZLlePCsu2IYEQNDWFRDmeMLI3ZZsf45iXc0kvOYiCyGi')" }}
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 bg-[#e63743]/10 text-[#e63743] text-[10px] font-bold uppercase rounded tracking-wider">Top Rated</span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 leading-tight">{theater.name}</h2>
            {theater.address && (
              <p className="text-slate-500 flex items-center gap-1 mt-1 text-sm">
                <span className="material-symbols-outlined text-sm">location_on</span>
                {theater.address}
              </p>
            )}
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block" />
                Open Now
              </span>
              <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full">Parking Available</span>
            </div>
          </div>
        </div>

        {/* Date Selection */}
        {uniqueDates.length > 0 && (
          <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedDate('')}
              className={`flex-shrink-0 px-5 py-3 rounded-xl font-semibold text-sm transition-all border ${!selectedDate ? 'bg-[#e63743] text-white border-[#e63743] shadow-md' : 'bg-white border-slate-200 text-slate-700 hover:border-[#e63743]'}`}
            >
              All Dates
            </button>
            {uniqueDates.map((date, i) => (
              <button
                key={i}
                onClick={() => setSelectedDate(date)}
                className={`flex-shrink-0 px-5 py-3 rounded-xl font-semibold text-sm transition-all border ${selectedDate === date ? 'bg-[#e63743] text-white border-[#e63743] shadow-md' : 'bg-white border-slate-200 text-slate-700 hover:border-[#e63743]'}`}
              >
                <div className="text-xs font-normal opacity-70">
                  {new Date(date).toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()}
                </div>
                <div>{new Date(date).toLocaleDateString('en-US', { month: 'short', day: '2-digit' }).toUpperCase()}</div>
              </button>
            ))}
          </div>
        )}

        {/* Shows by Movie */}
        <h2 className="text-2xl font-bold mb-6">Now Showing</h2>
        {Object.keys(showsByMovie).length > 0 ? (
          <div className="space-y-6">
            {Object.values(showsByMovie).map(({ movie, shows }) => {
              const filteredShows = shows.filter(show =>
                !selectedDate || new Date(show.startTime).toDateString() === selectedDate
              );
              if (filteredShows.length === 0) return null;
              return (
                <div key={movie.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="flex flex-col md:flex-row p-5 gap-5">
                    <div className="w-full md:w-28 h-40 md:h-auto flex-shrink-0 rounded-lg overflow-hidden bg-slate-100">
                      {movie.imageUrl ? (
                        <img className="w-full h-full object-cover" src={movie.imageUrl} alt={movie.title} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="material-symbols-outlined text-4xl text-slate-300">movie</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-1">{movie.title}</h3>
                      <p className="text-sm text-slate-500 mb-4">{formatDuration(movie.duration)}</p>
                      <div className="flex flex-wrap gap-3">
                        {filteredShows.map(show => (
                          <Link
                            key={show.id}
                            href={`/stations/${theaterId}/${show.id}`}
                            className="group flex flex-col items-center justify-center min-w-[90px] p-3 rounded-lg border border-green-500/30 bg-green-500/5 hover:bg-green-500 hover:text-white transition-all"
                          >
                            <span className="text-sm font-bold">
                              {new Date(show.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <span className="text-[10px] opacity-80 mt-1">₹{show.price}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <span className="material-symbols-outlined text-6xl text-slate-200 block mb-4">event_busy</span>
            <p className="text-xl text-slate-500">No shows available at this theater</p>
          </div>
        )}
      </main>

      <footer className="mt-16 border-t border-slate-200 bg-white py-8 text-center">
        <p className="text-slate-400 text-sm">© 2024 BookMyPlace Entertainment Pvt. Ltd. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
