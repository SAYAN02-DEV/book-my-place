"use client"
import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

export const dynamic = 'force-dynamic'

interface Seat {
  id: number;
  seatNo: string;
  row: string;
  isBooked: boolean;
  lockedAt: string | null;
}

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
  theater: {
    id: number;
    name: string;
    address: string | null;
  };
}

export default function SeatSelectionPage() {
  const params = useParams();
  const router = useRouter();
  const showId = params.seatid;
  const theaterId = params.stationid;

  const [seats, setSeats] = useState<Seat[]>([]);
  const [seatsByRow, setSeatsByRow] = useState<{ [key: string]: Seat[] }>({});
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [show, setShow] = useState<Show | null>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/v1/shows?theaterId=${theaterId}`)
      .then(res => res.json())
      .then(data => {
        const foundShow = data.shows.find((s: Show) => s.id === parseInt(showId as string));
        setShow(foundShow);
      });

    fetch(`/api/v1/seats?showId=${showId}`)
      .then(res => res.json())
      .then(data => {
        setSeats(data.seats);
        setSeatsByRow(data.seatsByRow);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [showId, theaterId]);

  const toggleSeat = (seatId: number, isBooked: boolean) => {
    if (isBooked) return;
    setSelectedSeats(prev =>
      prev.includes(seatId) ? prev.filter(id => id !== seatId) : [...prev, seatId]
    );
  };

  const handleBooking = async () => {
    if (selectedSeats.length === 0) { setError('Please select at least one seat'); return; }
    const token = localStorage.getItem('token');
    if (!token) { setError('Please login to book tickets'); setTimeout(() => router.push('/auth/login'), 2000); return; }
    setBooking(true); setError('');
    try {
      const response = await fetch('/api/v1/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ showId: parseInt(showId as string), seatIds: selectedSeats })
      });
      const data = await response.json();
      if (data.success) {
        router.push(`/stations/${theaterId}/${showId}/payment/sucess?ticketId=${data.ticket.id}`);
      } else {
        setError(data.error || 'Booking failed');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setBooking(false);
    }
  };

  if (loading || !show) {
    return (
      <div className="min-h-screen bg-[#f8f6f6] flex items-center justify-center">
        <span className="material-symbols-outlined text-[#e63743] text-4xl animate-spin">refresh</span>
      </div>
    );
  }

  const totalPrice = selectedSeats.length * show.price;
  const convenienceFee = Math.round(totalPrice * 0.05);
  const gst = Math.round((totalPrice + convenienceFee) * 0.18);
  const grandTotal = totalPrice + convenienceFee + gst;

  return (
    <div className="min-h-screen bg-[#f8f6f6] text-slate-900">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#e63743] font-bold text-xl">
            <span className="material-symbols-outlined">movie</span>BookMyPlace
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-600">
            <span>{show.movie.title}</span>
            <span className="text-slate-300">›</span>
            <span>{show.theater.name}</span>
            <span className="text-slate-300">›</span>
            <span className="text-[#e63743] font-semibold">Select Seats</span>
          </nav>
        </div>
      </header>

      {/* Show info bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold">{show.movie.title}</h1>
            <p className="text-slate-500 text-sm">
              {show.theater.name} • {new Date(show.startTime).toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-600">
            <span>₹{show.price} / seat</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        {/* Seat Map */}
        <div className="flex-1">
          {/* Screen */}
          <div className="mb-10 text-center">
            <div className="w-2/3 mx-auto h-2 rounded-t-full bg-gradient-to-r from-slate-300 via-slate-400 to-slate-300 mb-1" />
            <p className="text-xs font-semibold text-slate-400 tracking-widest uppercase">All Eyes This Way Please!</p>
          </div>

          {/* Rows */}
          <div className="space-y-3 overflow-x-auto pb-4">
            {Object.keys(seatsByRow).sort().map(row => (
              <div key={row} className="flex items-center gap-3 min-w-fit mx-auto justify-center">
                <div className="w-6 text-center text-xs font-bold text-slate-500 shrink-0">{row}</div>
                <div className="flex gap-1.5">
                  {seatsByRow[row].map(seat => (
                    <button
                      key={seat.id}
                      onClick={() => toggleSeat(seat.id, seat.isBooked)}
                      disabled={seat.isBooked}
                      title={`${row}${seat.seatNo}`}
                      className={`w-8 h-8 text-[10px] font-semibold rounded-t-md transition-all ${
                        seat.isBooked
                          ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                          : selectedSeats.includes(seat.id)
                          ? 'bg-green-500 text-white scale-110 shadow-md'
                          : 'bg-blue-500 text-white hover:bg-blue-400 hover:scale-105'
                      }`}
                    >
                      {seat.seatNo}
                    </button>
                  ))}
                </div>
                <div className="w-6 text-center text-xs font-bold text-slate-500 shrink-0">{row}</div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex justify-center gap-8 mt-10 pt-6 border-t border-slate-200">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <div className="w-5 h-5 rounded-t-md bg-blue-500" />
              Available
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <div className="w-5 h-5 rounded-t-md bg-green-500" />
              Selected
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <div className="w-5 h-5 rounded-t-md bg-slate-200" />
              Booked
            </div>
          </div>
        </div>

        {/* Booking Summary Sidebar */}
        <div className="lg:w-80 shrink-0">
          <div className="bg-white rounded-xl border border-slate-200 p-6 sticky top-24">
            <h2 className="text-lg font-bold mb-4">Booking Summary</h2>

            {selectedSeats.length > 0 ? (
              <>
                {/* Selected seats */}
                <div className="mb-4">
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-2">Selected Seats</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedSeats.map(seatId => {
                      const seat = seats.find(s => s.id === seatId);
                      return seat ? (
                        <span key={seatId} className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-md">
                          {seat.row}{seat.seatNo}
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>

                {/* Price breakdown */}
                <div className="space-y-2 text-sm border-t border-slate-100 pt-4 mb-4">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Ticket ({selectedSeats.length} × ₹{show.price})</span>
                    <span>₹{totalPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Convenience Fee</span>
                    <span>₹{convenienceFee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">GST (18%)</span>
                    <span>₹{gst}</span>
                  </div>
                  <div className="flex justify-between font-bold text-base border-t border-slate-200 pt-2">
                    <span>Total</span>
                    <span className="text-[#e63743]">₹{grandTotal}</span>
                  </div>
                </div>

                {error && (
                  <p className="text-red-600 text-sm mb-3 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
                )}

                <button
                  onClick={handleBooking}
                  disabled={booking}
                  className="w-full bg-[#e63743] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#e63743]/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {booking ? (
                    <>
                      <span className="material-symbols-outlined text-sm animate-spin">refresh</span>
                      Processing...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-sm">confirmation_number</span>
                      Confirm Booking
                    </>
                  )}
                </button>
              </>
            ) : (
              <div className="text-center py-8">
                <span className="material-symbols-outlined text-4xl text-slate-200 block mb-2">event_seat</span>
                <p className="text-slate-400 text-sm">Select seats from the map to continue</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
