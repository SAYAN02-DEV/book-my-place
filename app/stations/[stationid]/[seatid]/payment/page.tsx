"use client"
import React, { useEffect, useState } from 'react'
import { useRouter, useParams, useSearchParams } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const dynamic = 'force-dynamic'

interface ShowDetails {
  movie: {
    title: string;
    duration: number;
  };
  theater: {
    name: string;
    address: string | null;
  };
  startTime: string;
  price: number;
}

const PaymentPage = () => {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { stationid, seatid } = params;
  
  const [showDetails, setShowDetails] = useState<ShowDetails | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const seats = searchParams.get('seats');
    if (seats) {
      setSelectedSeats(seats.split(','));
    }

    // Fetch show details
    fetch(`/api/v1/shows?theaterId=${stationid}`)
      .then(res => res.json())
      .then(data => {
        const show = data.shows.find((s: any) => s.id === parseInt(seatid as string));
        setShowDetails(show);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching show details:', error);
        setLoading(false);
      });
  }, [stationid, seatid, searchParams]);

  const handlePayment = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    setProcessing(true);

    try {
      const response = await fetch('/api/v1/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          showId: parseInt(seatid as string),
          seats: selectedSeats
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Payment successful
        router.push(`/stations/${stationid}/${seatid}/payment/sucess?ticketId=${data.ticketId}`);
      } else {
        // Payment failed
        router.push(`/stations/${stationid}/${seatid}/payment/failure`);
      }
    } catch (error) {
      console.error('Payment error:', error);
      router.push(`/stations/${stationid}/${seatid}/payment/failure`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-100">
        <Navbar />
        <div className="flex justify-center items-center h-screen">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </div>
    );
  }

  if (!showDetails) {
    return (
      <div className="min-h-screen bg-base-100">
        <Navbar />
        <div className="flex flex-col justify-center items-center h-screen">
          <p className="text-2xl mb-4">Show not found</p>
          <button onClick={() => router.back()} className="btn btn-primary">Go Back</button>
        </div>
      </div>
    );
  }

  const totalPrice = selectedSeats.length * showDetails.price;
  const convenienceFee = selectedSeats.length * 20;
  const gst = Math.round((totalPrice + convenienceFee) * 0.18);
  const grandTotal = totalPrice + convenienceFee + gst;

  return (
    <div className="min-h-screen bg-base-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Payment Summary</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Booking Details */}
            <div className="lg:col-span-2">
              <div className="card bg-base-200 shadow-xl mb-6">
                <div className="card-body">
                  <h2 className="card-title">Booking Details</h2>
                  
                  <div className="divider"></div>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm opacity-70">Movie</p>
                      <p className="font-semibold text-lg">{showDetails.movie.title}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm opacity-70">Theater</p>
                      <p className="font-semibold">{showDetails.theater.name}</p>
                      {showDetails.theater.address && (
                        <p className="text-sm opacity-70">{showDetails.theater.address}</p>
                      )}
                    </div>
                    
                    <div>
                      <p className="text-sm opacity-70">Show Time</p>
                      <p className="font-semibold">
                        {new Date(showDetails.startTime).toLocaleString('en-IN', {
                          dateStyle: 'medium',
                          timeStyle: 'short'
                        })}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm opacity-70">Selected Seats</p>
                      <p className="font-semibold">{selectedSeats.join(', ')}</p>
                      <p className="text-sm opacity-70">{selectedSeats.length} seat(s)</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="card bg-base-200 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title">Payment Method</h2>
                  
                  <div className="divider"></div>
                  
                  <div className="alert alert-info">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current flex-shrink-0 w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span>This is a demo payment. No actual charges will be made.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="lg:col-span-1">
              <div className="card bg-base-200 shadow-xl sticky top-4">
                <div className="card-body">
                  <h2 className="card-title">Price Breakdown</h2>
                  
                  <div className="divider"></div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Ticket Price</span>
                      <span>₹{totalPrice}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Convenience Fee</span>
                      <span>₹{convenienceFee}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>GST (18%)</span>
                      <span>₹{gst}</span>
                    </div>
                    
                    <div className="divider my-2"></div>
                    
                    <div className="flex justify-between text-xl font-bold">
                      <span>Total Amount</span>
                      <span>₹{grandTotal}</span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={handlePayment}
                    disabled={processing}
                    className="btn btn-primary btn-block mt-6"
                  >
                    {processing ? (
                      <>
                        <span className="loading loading-spinner"></span>
                        Processing...
                      </>
                    ) : (
                      `Pay ₹${grandTotal}`
                    )}
                  </button>
                  
                  <button 
                    onClick={() => router.back()}
                    disabled={processing}
                    className="btn btn-ghost btn-block mt-2"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PaymentPage;
