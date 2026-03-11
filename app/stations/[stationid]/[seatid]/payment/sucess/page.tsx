"use client"
import React, { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

interface Ticket {
  id: number;
  createdAt: string;
  show: {
    startTime: string;
    price: number;
    movie: { title: string; duration: number; imageUrl: string | null; };
    theater: { name: string; address: string | null; latitude: number; longitude: number; };
  };
  seats: Array<{ seatNo: string; row: string; }>;
}

const BookingSuccessContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const ticketId = searchParams.get('ticketId');

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ticketId) { router.push('/home'); return; }
    const token = localStorage.getItem('token');
    if (!token) { router.push('/auth/login'); return; }
    fetch('/api/v1/booking', { headers: { 'Authorization': `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => {
        const foundTicket = data.tickets.find((t: Ticket) => t.id === parseInt(ticketId));
        setTicket(foundTicket);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [ticketId, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f6f6] flex items-center justify-center">
        <span className="material-symbols-outlined text-[#e63743] text-4xl animate-spin">refresh</span>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-[#f8f6f6] flex flex-col items-center justify-center gap-4">
        <p className="text-xl text-slate-500">Ticket not found</p>
        <Link href="/home" className="bg-[#e63743] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#e63743]/90">Go to Home</Link>
      </div>
    );
  }

  const seatsList = ticket.seats.map(s => `${s.row}${s.seatNo}`).join(', ');
  const totalPrice = ticket.seats.length * ticket.show.price;

  return (
    <div className="min-h-screen bg-[#f8f6f6] text-slate-900">
      {/* Navbar */}
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/home" className="flex items-center gap-2 text-[#e63743] font-bold text-xl">
            <span className="material-symbols-outlined">movie</span>BookMyPlace
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-12">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-green-500 text-5xl">check_circle</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">Booking Confirmed!</h1>
          <p className="text-slate-500">Your tickets have been successfully booked</p>
        </div>

        {/* Ticket Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
          {/* Movie banner */}
          {ticket.show.movie.imageUrl && (
            <div className="h-36 overflow-hidden">
              <img className="w-full h-full object-cover" src={ticket.show.movie.imageUrl} alt={ticket.show.movie.title} />
            </div>
          )}

          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold">{ticket.show.movie.title}</h2>
                <p className="text-xs text-slate-400 mt-1">Booking ID: #{ticket.id}</p>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">CONFIRMED</span>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 text-sm border-t border-dashed border-slate-200 pt-4 mt-4">
              <div>
                <p className="text-slate-400 text-xs mb-0.5">Theater</p>
                <p className="font-semibold">{ticket.show.theater.name}</p>
                {ticket.show.theater.address && <p className="text-slate-500 text-xs">{ticket.show.theater.address}</p>}
              </div>
              <div>
                <p className="text-slate-400 text-xs mb-0.5">Show Time</p>
                <p className="font-semibold">
                  {new Date(ticket.show.startTime).toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <div>
                <p className="text-slate-400 text-xs mb-0.5">Seats</p>
                <p className="font-semibold">{seatsList}</p>
                <p className="text-slate-500 text-xs">{ticket.seats.length} seat(s)</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs mb-0.5">Total Paid</p>
                <p className="font-bold text-xl text-[#e63743]">₹{totalPrice}</p>
              </div>
            </div>

            {/* Email alert */}
            <div className="flex items-start gap-3 mt-5 p-3 bg-blue-50 rounded-xl">
              <span className="material-symbols-outlined text-blue-500 shrink-0">email</span>
              <p className="text-xs text-blue-700">
                A confirmation email has been sent to <strong>{localStorage.getItem('email') || 'your email'}</strong>. Please show this at the theater entrance.
              </p>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <Link
            href={`/map?lat=${ticket.show.theater.latitude}&lng=${ticket.show.theater.longitude}&name=${encodeURIComponent(ticket.show.theater.name)}&address=${encodeURIComponent(ticket.show.theater.address || '')}`}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors"
          >
            <span className="material-symbols-outlined text-base">directions</span>
            Get Directions
          </Link>
          <Link
            href="/profile/booked"
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors"
          >
            <span className="material-symbols-outlined text-base">receipt_long</span>
            View All Bookings
          </Link>
          <Link
            href="/home"
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#e63743] text-white font-bold text-sm hover:bg-[#e63743]/90 transition-colors"
          >
            <span className="material-symbols-outlined text-base">movie</span>
            Book More
          </Link>
        </div>
      </main>
    </div>
  );
};

const BookingSuccessPage = () => (
  <Suspense fallback={<div className="min-h-screen bg-[#f8f6f6] flex items-center justify-center"><span className="material-symbols-outlined text-[#e63743] animate-spin">refresh</span></div>}>
    <BookingSuccessContent />
  </Suspense>
);

export default BookingSuccessPage;
