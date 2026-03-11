"use client"
import React, { useEffect, useState, Suspense } from 'react'
import { useRouter, useParams, useSearchParams } from 'next/navigation'

export const dynamic = 'force-dynamic'

interface ShowDetails {
  movie: { title: string; duration: number; imageUrl: string | null; };
  theater: { name: string; address: string | null; };
  startTime: string;
  price: number;
}

const PaymentContent = () => {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { stationid, seatid } = params;

  const [showDetails, setShowDetails] = useState<ShowDetails | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [payMethod, setPayMethod] = useState<'upi' | 'card'>('upi');

  useEffect(() => {
    const seats = searchParams.get('seats');
    if (seats) setSelectedSeats(seats.split(','));
    fetch(`/api/v1/shows?theaterId=${stationid}`)
      .then(res => res.json())
      .then(data => {
        const show = data.shows.find((s: any) => s.id === parseInt(seatid as string));
        setShowDetails(show);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [stationid, seatid, searchParams]);

  const handlePayment = async () => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/auth/login'); return; }
    setProcessing(true);
    try {
      const response = await fetch('/api/v1/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ showId: parseInt(seatid as string), seats: selectedSeats })
      });
      const data = await response.json();
      if (response.ok) {
        router.push(`/stations/${stationid}/${seatid}/payment/sucess?ticketId=${data.ticketId}`);
      } else {
        router.push(`/stations/${stationid}/${seatid}/payment/failure`);
      }
    } catch {
      router.push(`/stations/${stationid}/${seatid}/payment/failure`);
    }
  };

  if (loading || !showDetails) {
    return (
      <div className="min-h-screen bg-[#f8f6f6] flex items-center justify-center">
        <span className="material-symbols-outlined text-[#e63743] text-4xl animate-spin">refresh</span>
      </div>
    );
  }

  const totalPrice = selectedSeats.length * showDetails.price;
  const convenienceFee = selectedSeats.length * 20;
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
          <div className="hidden md:flex items-center gap-2 text-sm text-slate-500">
            <span>{showDetails.movie.title}</span>
            <span>›</span>
            <span className="text-[#e63743] font-semibold">Payment</span>
          </div>
        </div>
      </header>

      {/* Demo banner */}
      <div className="bg-amber-50 border-b border-amber-200 text-center py-2 text-amber-700 text-sm font-medium">
        <span className="material-symbols-outlined text-sm align-middle mr-1">info</span>
        Demo Mode — No actual charges will be made
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 grid lg:grid-cols-3 gap-6">
        {/* Left: Booking Details + Payment Method */}
        <div className="lg:col-span-2 space-y-4">
          {/* Booking details card */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100">
              <h2 className="font-bold text-lg">Booking Details</h2>
            </div>
            <div className="p-5 flex gap-4">
              {showDetails.movie.imageUrl && (
                <div className="w-20 h-28 rounded-lg overflow-hidden shrink-0">
                  <img className="w-full h-full object-cover" src={showDetails.movie.imageUrl} alt={showDetails.movie.title} />
                </div>
              )}
              <div className="flex-1 space-y-2 text-sm">
                <h3 className="text-base font-bold">{showDetails.movie.title}</h3>
                <p className="text-slate-500 flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">location_on</span>
                  {showDetails.theater.name}{showDetails.theater.address ? ` • ${showDetails.theater.address}` : ''}
                </p>
                <p className="text-slate-500 flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">schedule</span>
                  {new Date(showDetails.startTime).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                </p>
                <p className="text-slate-500 flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">event_seat</span>
                  Seats: <span className="font-semibold text-slate-700">{selectedSeats.join(', ') || 'Selected from previous step'}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Payment Method card */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100">
              <h2 className="font-bold text-lg">Payment Method</h2>
            </div>
            <div className="p-5 space-y-3">
              {/* UPI */}
              <button
                onClick={() => setPayMethod('upi')}
                className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${payMethod === 'upi' ? 'border-[#e63743] bg-[#e63743]/5' : 'border-slate-200 hover:border-slate-300'}`}
              >
                <div className={`w-4 h-4 rounded-full border-2 ${payMethod === 'upi' ? 'border-[#e63743] bg-[#e63743]' : 'border-slate-300'}`} />
                <span className="material-symbols-outlined text-slate-600">phone_android</span>
                <span className="font-medium">UPI / Mobile Wallets</span>
              </button>
              {/* Card */}
              <button
                onClick={() => setPayMethod('card')}
                className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${payMethod === 'card' ? 'border-[#e63743] bg-[#e63743]/5' : 'border-slate-200 hover:border-slate-300'}`}
              >
                <div className={`w-4 h-4 rounded-full border-2 ${payMethod === 'card' ? 'border-[#e63743] bg-[#e63743]' : 'border-slate-300'}`} />
                <span className="material-symbols-outlined text-slate-600">credit_card</span>
                <span className="font-medium">Credit / Debit Card</span>
              </button>

              {payMethod === 'card' && (
                <div className="mt-4 space-y-3 px-1 pt-2">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Card Number</label>
                    <input className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#e63743] outline-none" placeholder="1234 5678 9012 3456" maxLength={19} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1">Expiry</label>
                      <input className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#e63743] outline-none" placeholder="MM / YY" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1">CVV</label>
                      <input className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#e63743] outline-none" placeholder="•••" maxLength={3} type="password" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Price Breakdown */}
        <div className="shrink-0">
          <div className="bg-white rounded-xl border border-slate-200 p-5 sticky top-24">
            <h2 className="font-bold text-lg mb-4">Price Breakdown</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Ticket ({selectedSeats.length || 1} × ₹{showDetails.price})</span>
                <span>₹{totalPrice}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Convenience Fee</span>
                <span>₹{convenienceFee}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">GST (18%)</span>
                <span>₹{gst}</span>
              </div>
              <div className="flex justify-between font-bold text-base border-t border-slate-200 pt-3">
                <span>Total</span>
                <span className="text-[#e63743]">₹{grandTotal}</span>
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={processing}
              className="mt-5 w-full bg-[#e63743] text-white py-3 rounded-xl font-bold hover:bg-[#e63743]/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {processing ? (
                <>
                  <span className="material-symbols-outlined text-sm animate-spin">refresh</span>
                  Processing...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-sm">lock</span>
                  Pay ₹{grandTotal}
                </>
              )}
            </button>
            <button
              onClick={() => router.back()}
              disabled={processing}
              className="mt-2 w-full text-slate-500 py-2 rounded-xl text-sm hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const PaymentPage = () => (
  <Suspense fallback={<div className="min-h-screen bg-[#f8f6f6] flex items-center justify-center"><span className="material-symbols-outlined text-[#e63743] animate-spin">refresh</span></div>}>
    <PaymentContent />
  </Suspense>
);

export default PaymentPage;
