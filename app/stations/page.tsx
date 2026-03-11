"use client"
import React, { useEffect, useState } from 'react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

interface Theater {
  id: number;
  name: string;
  email: string;
  latitude: number;
  longitude: number;
  address: string | null;
  distance?: number;
}

export default function TheatersPage() {
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const location = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setUserLocation(location);
          fetch(`/api/v1/locations?lat=${location.lat}&long=${location.lng}`)
            .then(res => res.json())
            .then(data => { setTheaters(data || []); setLoading(false); })
            .catch(() => fetchAllTheaters());
        },
        () => fetchAllTheaters()
      );
    } else {
      fetchAllTheaters();
    }
  }, []);

  const fetchAllTheaters = () => {
    fetch('/api/v1/theaters')
      .then(res => res.json())
      .then(data => { setTheaters(data.theaters || []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  const THEATER_IMAGES = [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDfAMemLDB2FiBCpi-cB7cKscs2epg9-h7kVNvYTvdfBa0hHzl54RaKO8sbze5XwN4MtvfTlsioDJkJ-an05kM6IB0EQBxxG4UW3dPo5Lp6HSOqtW9SZO1Zb0PA4mntROjQbVs1G5GKka8Izd3m84TlI5qID_2Q2qXp-CY-ckSKrAHrrpUJUQNCEbVhsa4lU8V59_jSlm9TQhjhP7WpzRqWX_bkareIU_xw8eHJBiVYl1CeAIQRXlMx_cfMes8Q2CUooC96YfrEcxkd",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDAhdwC_zb7T_Z4MrCt0whWp92hrJYWQOq3J-IsXw4Fg9eYCUl431jY9NbJaBviEbOcQx1L5zRae-pdlhyzEi-ora35Pha2SzJbQLr_VoPYamIqyJDQoNaVGGWwOp-4flJ8pKwqJjS32JxX0feT8w986q01PEpiDJho9EGFEQS1eR32RYc0G7p8Y",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDcl3mQPgTUuBMqLW8v_PIGcZ-YoiHk_2LX7fZsoysA-vcA_qWZrX8w5aMzP_RNr478HJv4SY6bb2BEc4L-Nc8AKHwQLLfabLG94uMyABpct5oEGPh_bzzDynTaUrqSZYSScvqh8PhsT5spLt6MutbgkdT4JflQIU1pzpIInsRvZfkSG8lf8A2VV6wwGGy4fGGWuZcs6ynGOk1FfzY3vfFTmTEJcsmzfl77Nb3-xDJMOSaTlb2BSNLRlGIXAZDEVA8n7RdeBew2KQb_",
  ];

  return (
    <div className="bg-[#f8f6f6] text-slate-900 min-h-screen">
      {/* Sticky Navbar */}
      <nav className="sticky top-0 z-50 w-full bg-[#f8f6f6]/80 backdrop-blur-md border-b border-[#e63743]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Link href="/home" className="flex items-center gap-2 text-[#e63743]">
                <svg className="size-8" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 45.8096C19.6865 45.8096 15.4698 44.5305 11.8832 42.134C8.29667 39.7376 5.50128 36.3314 3.85056 32.3462C2.19985 28.361 1.76794 23.9758 2.60947 19.7452C3.451 15.5145 5.52816 11.6284 8.57829 8.5783C11.6284 5.52817 15.5145 3.45101 19.7452 2.60948C23.9758 1.76795 28.361 2.19986 32.3462 3.85057C36.3314 5.50129 39.7376 8.29668 42.134 11.8833C44.5305 15.4698 45.8096 19.6865 45.8096 24L24 24L24 45.8096Z" fill="currentColor" />
                </svg>
                <span className="text-xl font-black tracking-tight text-slate-900">BookMyPlace</span>
              </Link>
            </div>
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-slate-400 text-lg">search</span>
                </div>
                <input
                  className="block w-full pl-10 pr-3 py-2 border-none bg-[#e63743]/5 rounded-full text-sm placeholder-slate-500 focus:ring-2 focus:ring-[#e63743]/50 transition-all outline-none"
                  placeholder="Search for movies, theaters, or events"
                  type="text"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/movies" className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-[#e63743]/5 transition-colors">
                <span className="material-symbols-outlined text-lg">movie</span>
                <span>Movies</span>
              </Link>
              <Link href="/auth/login" className="bg-[#e63743] hover:bg-[#e63743]/90 text-white px-5 py-2 rounded-lg text-sm font-bold transition-all shadow-sm">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Movie Theaters</h1>
          <p className="text-slate-500 mt-2">Find the premium cinematic experience near you.</p>
        </div>

        {/* Location Banner */}
        <div className="mb-10 p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-blue-600 text-xl">info</span>
            </div>
            <div>
              <p className="font-bold text-blue-900 text-sm md:text-base">
                {userLocation ? 'Showing theaters near your location' : 'Showing all available theaters'}
              </p>
              <p className="text-blue-700 text-xs md:text-sm">Prices and showtimes are updated in real-time.</p>
            </div>
          </div>
        </div>

        {/* Theater Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <div className="aspect-video bg-slate-200 animate-pulse" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-slate-200 rounded animate-pulse" />
                  <div className="h-4 bg-slate-200 rounded animate-pulse w-3/4" />
                  <div className="h-10 bg-slate-200 rounded animate-pulse mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : theaters.length === 0 ? (
          <div className="text-center py-24">
            <span className="material-symbols-outlined text-6xl text-slate-200 block mb-4">location_off</span>
            <p className="text-xl text-slate-500">No theaters found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {theaters.map((theater, index) => (
              <div key={theater.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-xl transition-shadow group">
                <div className="aspect-video w-full bg-slate-200 relative overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url('${THEATER_IMAGES[index % THEATER_IMAGES.length]}')` }}
                  />
                  <div className="absolute top-3 right-3 bg-[#e63743] text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                    {index === 0 ? 'Top Rated' : 'Now Open'}
                  </div>
                </div>
                <div className="p-5 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-slate-900 leading-snug">{theater.name}</h3>
                    {theater.distance !== undefined && (
                      <span className="bg-[#e63743]/10 text-[#e63743] px-2 py-1 rounded-full text-xs font-bold whitespace-nowrap">
                        {theater.distance.toFixed(1)} km
                      </span>
                    )}
                  </div>
                  {theater.address && (
                    <p className="text-slate-500 text-sm mb-6 flex items-start gap-1">
                      <span className="material-symbols-outlined text-sm mt-0.5">location_on</span>
                      {theater.address}
                    </p>
                  )}
                  <div className="mt-auto flex gap-3">
                    <Link
                      href={`/stations/${theater.id}`}
                      className="flex-1 bg-[#e63743] text-white py-2.5 rounded-lg text-sm font-bold hover:bg-[#e63743]/90 transition-colors text-center"
                    >
                      Book Now
                    </Link>
                    <Link
                      href={`/stations/${theater.id}`}
                      className="flex-1 border border-[#e63743]/20 text-[#e63743] py-2.5 rounded-lg text-sm font-bold hover:bg-[#e63743]/5 transition-colors text-center"
                    >
                      View Shows
                    </Link>
                  </div>
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
