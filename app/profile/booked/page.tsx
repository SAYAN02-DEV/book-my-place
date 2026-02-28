"use client"
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

interface Ticket {
  id: number;
  createdAt: string;
  show: {
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
      latitude: number;
      longitude: number;
    };
  };
  seats: Array<{
    id: number;
    seatNo: string;
    row: string;
  }>;
}

const BookingHistoryPage = () => {
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/auth/login');
      return;
    }

    fetch('/api/v1/booking', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setTickets(data.tickets);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching bookings:', error);
        setLoading(false);
      });
  }, [router]);

  const now = new Date();
  const filteredTickets = tickets.filter(ticket => {
    const showTime = new Date(ticket.show.startTime);
    if (filter === 'upcoming') return showTime > now;
    if (filter === 'past') return showTime <= now;
    return true;
  });

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

  return (
    <div className="min-h-screen bg-base-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-5xl font-bold">My Bookings</h1>
          <Link href="/profile" className="btn btn-outline">
            Back to Profile
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="tabs tabs-boxed mb-8 max-w-md">
          <button 
            className={`tab ${filter === 'all' ? 'tab-active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({tickets.length})
          </button>
          <button 
            className={`tab ${filter === 'upcoming' ? 'tab-active' : ''}`}
            onClick={() => setFilter('upcoming')}
          >
            Upcoming ({tickets.filter(t => new Date(t.show.startTime) > now).length})
          </button>
          <button 
            className={`tab ${filter === 'past' ? 'tab-active' : ''}`}
            onClick={() => setFilter('past')}
          >
            Past ({tickets.filter(t => new Date(t.show.startTime) <= now).length})
          </button>
        </div>

        {/* Bookings List */}
        {filteredTickets.length > 0 ? (
          <div className="space-y-6">
            {filteredTickets.map((ticket) => {
              const showTime = new Date(ticket.show.startTime);
              const isPast = showTime <= now;
              const seatsList = ticket.seats.map(s => `${s.row}${s.seatNo}`).join(', ');
              const totalPrice = ticket.seats.length * ticket.show.price;

              return (
                <div 
                  key={ticket.id} 
                  className={`card bg-base-200 shadow-xl ${isPast ? 'opacity-70' : ''}`}
                >
                  <div className="card-body">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Movie Poster */}
                      <div className="w-32 h-48 flex-shrink-0">
                        <figure className="rounded-lg overflow-hidden h-full bg-base-300">
                          {ticket.show.movie.imageUrl ? (
                            <img 
                              src={ticket.show.movie.imageUrl} 
                              alt={ticket.show.movie.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full text-4xl">
                              🎬
                            </div>
                          )}
                        </figure>
                      </div>

                      {/* Booking Details */}
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h2 className="text-3xl font-bold mb-2">{ticket.show.movie.title}</h2>
                            <p className="text-sm opacity-50">Booking ID: #{ticket.id}</p>
                          </div>
                          <div className={`badge badge-lg ${isPast ? 'badge-ghost' : 'badge-success'}`}>
                            {isPast ? 'COMPLETED' : 'UPCOMING'}
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm opacity-50">Theater</p>
                            <p className="font-semibold">{ticket.show.theater.name}</p>
                            {ticket.show.theater.address && (
                              <p className="text-xs opacity-70">{ticket.show.theater.address}</p>
                            )}
                          </div>

                          <div>
                            <p className="text-sm opacity-50">Show Time</p>
                            <p className="font-semibold">
                              {showTime.toLocaleString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>

                          <div>
                            <p className="text-sm opacity-50">Seats</p>
                            <p className="font-semibold">{seatsList}</p>
                            <p className="text-xs opacity-70">{ticket.seats.length} seat(s)</p>
                          </div>

                          <div>
                            <p className="text-sm opacity-50">Total Amount</p>
                            <p className="font-bold text-xl text-primary">₹{totalPrice}</p>
                          </div>
                        </div>

                        <div className="text-xs opacity-50 mb-4">
                          Booked on {new Date(ticket.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>

                        {/* Get Directions Button */}
                        <div className="flex gap-2">
                          <Link
                            href={`/map?lat=${ticket.show.theater.latitude}&lng=${ticket.show.theater.longitude}&name=${encodeURIComponent(ticket.show.theater.name)}&address=${encodeURIComponent(ticket.show.theater.address || '')}`}
                            className="btn btn-sm btn-success"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                            </svg>
                            Get Directions
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 card bg-base-200">
            <p className="text-2xl opacity-50 mb-4">
              {filter === 'all' ? 'No bookings yet' : `No ${filter} bookings`}
            </p>
            <Link href="/movies" className="btn btn-primary">
              Book Tickets Now
            </Link>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

export default BookingHistoryPage
