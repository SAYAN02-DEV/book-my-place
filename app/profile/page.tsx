"use client"
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default function ProfilePage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [ticketCount, setTicketCount] = useState(0);
  const [activeTab, setActiveTab] = useState<'bookings' | 'settings'>('bookings');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedEmail = localStorage.getItem('email');
    if (!token || !storedEmail) { router.push('/auth/login'); return; }
    setEmail(storedEmail);
    fetch('/api/v1/booking', { headers: { 'Authorization': `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => { if (data.success) setTicketCount(data.tickets.length); setLoading(false); })
      .catch(() => setLoading(false));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    router.push('/home');
  };

  const initials = email ? email.slice(0, 2).toUpperCase() : 'U';
  const displayName = email ? email.split('@')[0] : 'User';

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f6f6] flex items-center justify-center">
        <span className="material-symbols-outlined text-[#e63743] text-4xl animate-spin">refresh</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f6f6] text-slate-900">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/home" className="flex items-center gap-2 text-[#e63743] font-bold text-xl">
            <span className="material-symbols-outlined">movie</span>BookMyPlace
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/movies" className="text-slate-600 hover:text-[#e63743] transition-colors">Movies</Link>
            <Link href="/stations" className="text-slate-600 hover:text-[#e63743] transition-colors">Theaters</Link>
            <div className="w-8 h-8 rounded-full bg-[#e63743] flex items-center justify-center text-white text-xs font-bold">
              {initials}
            </div>
          </nav>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-10 flex flex-col md:flex-row gap-6">
        {/* Left Sidebar */}
        <aside className="md:w-72 shrink-0 space-y-4">
          {/* Avatar Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center">
            <div className="w-20 h-20 rounded-full bg-[#e63743] flex items-center justify-center text-white text-2xl font-black mx-auto mb-3">
              {initials}
            </div>
            <h2 className="text-lg font-bold capitalize">{displayName}</h2>
            <p className="text-slate-500 text-sm truncate">{email}</p>
            <p className="text-xs text-slate-400 mt-1">Member since {new Date().getFullYear()}</p>

            <button
              onClick={handleLogout}
              className="mt-4 w-full flex items-center justify-center gap-2 py-2 border border-red-200 text-red-500 rounded-xl text-sm font-semibold hover:bg-red-50 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">logout</span>
              Logout
            </button>
          </div>

          {/* Loyalty Card */}
          <div className="bg-gradient-to-br from-[#e63743] to-[#b52c36] rounded-2xl p-5 text-white">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-widest opacity-80">Loyalty Status</span>
              <span className="material-symbols-outlined text-lg">star</span>
            </div>
            <p className="text-2xl font-black">{ticketCount >= 10 ? 'Gold' : ticketCount >= 5 ? 'Silver' : 'Bronze'}</p>
            <p className="text-xs opacity-70 mt-1">{ticketCount} bookings completed</p>
            <div className="mt-3 h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all"
                style={{ width: `${Math.min((ticketCount / 10) * 100, 100)}%` }}
              />
            </div>
            <p className="text-[10px] opacity-60 mt-1">{Math.max(10 - ticketCount, 0)} more to reach Gold</p>
          </div>
        </aside>

        {/* Right Main Content */}
        <div className="flex-1 space-y-4">
          {/* Stats */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h3 className="font-bold text-base mb-4">Account Stats</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-[#e63743]/5 rounded-xl">
                <p className="text-3xl font-black text-[#e63743]">{ticketCount}</p>
                <p className="text-xs text-slate-500 mt-1">Total Bookings</p>
              </div>
              <div className="text-center p-3 bg-slate-50 rounded-xl">
                <p className="text-3xl font-black text-slate-700">0</p>
                <p className="text-xs text-slate-500 mt-1">Upcoming</p>
              </div>
              <div className="text-center p-3 bg-slate-50 rounded-xl">
                <p className="text-3xl font-black text-slate-700">{ticketCount}</p>
                <p className="text-xs text-slate-500 mt-1">Watched</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="flex border-b border-slate-100">
              <button
                onClick={() => setActiveTab('bookings')}
                className={`flex-1 py-3 text-sm font-semibold transition-colors ${activeTab === 'bookings' ? 'text-[#e63743] border-b-2 border-[#e63743]' : 'text-slate-500'}`}
              >
                Booking History
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`flex-1 py-3 text-sm font-semibold transition-colors ${activeTab === 'settings' ? 'text-[#e63743] border-b-2 border-[#e63743]' : 'text-slate-500'}`}
              >
                Settings
              </button>
            </div>

            <div className="p-6">
              {activeTab === 'bookings' ? (
                ticketCount > 0 ? (
                  <div className="text-center py-4">
                    <span className="material-symbols-outlined text-4xl text-slate-200 block mb-3">receipt_long</span>
                    <p className="text-slate-600 mb-4">You have <strong>{ticketCount}</strong> booking(s)</p>
                    <Link
                      href="/profile/booked"
                      className="inline-flex items-center gap-2 bg-[#e63743] text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-[#e63743]/90 transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">receipt_long</span>
                      View All Bookings
                    </Link>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <span className="material-symbols-outlined text-5xl text-slate-200 block mb-3">movie</span>
                    <p className="text-slate-500 mb-4">No bookings yet</p>
                    <Link
                      href="/movies"
                      className="inline-flex items-center gap-2 bg-[#e63743] text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-[#e63743]/90 transition-colors"
                    >
                      Book Your First Ticket
                    </Link>
                  </div>
                )
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-slate-100">
                    <div>
                      <p className="font-medium text-sm">Email Address</p>
                      <p className="text-slate-500 text-xs">{email}</p>
                    </div>
                    <button className="text-xs text-[#e63743] font-medium hover:underline">Edit</button>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-slate-100">
                    <div>
                      <p className="font-medium text-sm">Notifications</p>
                      <p className="text-slate-500 text-xs">Booking confirmations & alerts</p>
                    </div>
                    <div className="w-10 h-5 bg-[#e63743] rounded-full flex items-center justify-end px-0.5">
                      <div className="w-4 h-4 bg-white rounded-full shadow" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium text-sm">Password</p>
                      <p className="text-slate-500 text-xs">Last changed recently</p>
                    </div>
                    <button className="text-xs text-[#e63743] font-medium hover:underline">Change</button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3">
            <Link href="/movies" className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3 hover:border-[#e63743] transition-colors group">
              <span className="material-symbols-outlined text-[#e63743]">movie</span>
              <span className="font-medium text-sm">Browse Movies</span>
            </Link>
            <Link href="/stations" className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3 hover:border-[#e63743] transition-colors group">
              <span className="material-symbols-outlined text-[#e63743]">location_on</span>
              <span className="font-medium text-sm">Find Theaters</span>
            </Link>
          </div>
        </div>
      </div>

      <footer className="mt-8 border-t border-slate-200 bg-white py-6 text-center">
        <p className="text-slate-400 text-sm">© 2024 BookMyPlace Entertainment Pvt. Ltd. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
