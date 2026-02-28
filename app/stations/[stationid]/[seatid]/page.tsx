"use client"
import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

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

const SeatSelectionPage = () => {
  const params = useParams();
  const router = useRouter();
  const showId = params.seatid; // This is actually the show ID
  const theaterId = params.stationid;
  
  const [seats, setSeats] = useState<Seat[]>([]);
  const [seatsByRow, setSeatsByRow] = useState<{ [key: string]: Seat[] }>({});
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [show, setShow] = useState<Show | null>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch show details
    fetch(`/api/v1/shows?theaterId=${theaterId}`)
      .then(res => res.json())
      .then(data => {
        const foundShow = data.shows.find((s: Show) => s.id === parseInt(showId as string));
        setShow(foundShow);
      });

    // Fetch seats
    fetch(`/api/v1/seats?showId=${showId}`)
      .then(res => res.json())
      .then(data => {
        setSeats(data.seats);
        setSeatsByRow(data.seatsByRow);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching seats:', error);
        setLoading(false);
      });
  }, [showId, theaterId]);

  const toggleSeat = (seatId: number, isBooked: boolean) => {
    if (isBooked) return;
    
    setSelectedSeats(prev => {
      if (prev.includes(seatId)) {
        return prev.filter(id => id !== seatId);
      } else {
        return [...prev, seatId];
      }
    });
  };

  const handleBooking = async () => {
    if (selectedSeats.length === 0) {
      setError('Please select at least one seat');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please login to book tickets');
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
      return;
    }

    setBooking(true);
    setError('');

    try {
      const response = await fetch('/api/v1/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          showId: parseInt(showId as string),
          seatIds: selectedSeats
        })
      });

      const data = await response.json();

      if (data.success) {
        // Redirect to success page
        router.push(`/stations/${theaterId}/${showId}/payment/sucess?ticketId=${data.ticket.id}`);
      } else {
        setError(data.error || 'Booking failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setBooking(false);
    }
  };

  if (loading || !show) {
    return (
      <div className="min-h-screen bg-base-100">
        <Navbar />
        <div className="flex justify-center items-center h-screen">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </div>
    );
  }

  const totalPrice = selectedSeats.length * show.price;

  return (
    <div className="min-h-screen bg-base-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Show Info */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{show.movie.title}</h1>
          <p className="text-lg opacity-70">{show.theater.name}</p>
          <p className="text-sm opacity-50">
            {new Date(show.startTime).toLocaleString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>

        {/* Screen */}
        <div className="mb-8">
          <div className="w-full max-w-4xl mx-auto">
            <div className="bg-gradient-to-b from-gray-300 to-gray-400 h-2 rounded-t-full mb-2"></div>
            <p className="text-center text-sm opacity-50 mb-8">SCREEN</p>
          </div>
        </div>

        {/* Seat Map */}
        <div className="mb-8">
          <div className="max-w-4xl mx-auto">
            {Object.keys(seatsByRow).sort().map((row) => (
              <div key={row} className="flex justify-center items-center mb-3">
                <div className="w-12 text-right mr-4 font-bold">{row}</div>
                <div className="flex gap-2 flex-wrap justify-center">
                  {seatsByRow[row].map((seat) => (
                    <button
                      key={seat.id}
                      onClick={() => toggleSeat(seat.id, seat.isBooked)}
                      disabled={seat.isBooked}
                      className={`
                        w-10 h-10 text-xs font-semibold rounded-t-lg transition-all
                        ${seat.isBooked 
                          ? 'bg-gray-500 cursor-not-allowed opacity-50' 
                          : selectedSeats.includes(seat.id)
                          ? 'bg-green-500 text-white scale-110'
                          : 'bg-blue-500 text-white hover:bg-blue-600 hover:scale-105'
                        }
                      `}
                      title={`${row}${seat.seatNo} - ${seat.isBooked ? 'Booked' : 'Available'}`}
                    >
                      {seat.seatNo}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-6 mb-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-500 rounded-t-lg"></div>
            <span className="text-sm">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-green-500 rounded-t-lg"></div>
            <span className="text-sm">Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-500 rounded-t-lg opacity-50"></div>
            <span className="text-sm">Booked</span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="alert alert-error max-w-2xl mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>{error}</span>
          </div>
        )}

        {/* Booking Summary */}
        {selectedSeats.length > 0 && (
          <div className="card bg-base-200 shadow-xl max-w-2xl mx-auto">
            <div className="card-body">
              <h3 className="card-title text-2xl mb-4">Booking Summary</h3>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Selected Seats:</span>
                  <span className="font-bold">
                    {selectedSeats.map(seatId => {
                      const seat = seats.find(s => s.id === seatId);
                      return seat ? `${seat.row}${seat.seatNo}` : '';
                    }).join(', ')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Number of Seats:</span>
                  <span className="font-bold">{selectedSeats.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Price per Seat:</span>
                  <span className="font-bold">₹{show.price}</span>
                </div>
                <div className="divider"></div>
                <div className="flex justify-between text-xl">
                  <span className="font-bold">Total:</span>
                  <span className="font-bold text-primary">₹{totalPrice}</span>
                </div>
              </div>

              <button 
                className="btn btn-primary btn-lg w-full"
                onClick={handleBooking}
                disabled={booking}
              >
                {booking ? (
                  <>
                    <span className="loading loading-spinner"></span>
                    Processing...
                  </>
                ) : (
                  'Confirm Booking (Free)'
                )}
              </button>
            </div>
          </div>
        )}

        {selectedSeats.length === 0 && (
          <div className="text-center py-8">
            <p className="text-xl opacity-50">Please select seats to continue</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

export default SeatSelectionPage
