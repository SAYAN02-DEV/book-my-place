"use client"
import React, { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'

interface Ticket {
  id: number;
  createdAt: string;
  show: {
    startTime: string;
    price: number;
    movie: {
      title: string;
      duration: number;
    };
    theater: {
      name: string;
      address: string | null;
    };
  };
  seats: Array<{
    seatNo: string;
    row: string;
  }>;
}

const BookingSuccessPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const ticketId = searchParams.get('ticketId');
  
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ticketId) {
      router.push('/home');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    // Fetch ticket details
    fetch('/api/v1/booking', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        const foundTicket = data.tickets.find((t: Ticket) => t.id === parseInt(ticketId));
        setTicket(foundTicket);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching ticket:', error);
        setLoading(false);
      });
  }, [ticketId, router]);

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

  if (!ticket) {
    return (
      <div className="min-h-screen bg-base-100">
        <Navbar />
        <div className="flex flex-col justify-center items-center h-screen">
          <p className="text-2xl mb-4">Ticket not found</p>
          <Link href="/home" className="btn btn-primary">Go to Home</Link>
        </div>
      </div>
    );
  }

  const seatsList = ticket.seats.map(s => `${s.row}${s.seatNo}`).join(', ');
  const totalPrice = ticket.seats.length * ticket.show.price;

  return (
    <div className="min-h-screen bg-base-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        {/* Success Message */}
        <div className="text-center mb-12">
          <div className="inline-block p-6 bg-green-100 rounded-full mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold text-green-600 mb-4">Booking Confirmed!</h1>
          <p className="text-xl opacity-70">Your tickets have been successfully booked</p>
        </div>

        {/* Ticket Details */}
        <div className="max-w-3xl mx-auto">
          <div className="card bg-base-200 shadow-2xl">
            <div className="card-body">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-3xl font-bold mb-2">{ticket.show.movie.title}</h2>
                  <p className="text-sm opacity-70">Booking ID: #{ticket.id}</p>
                </div>
                <div className="badge badge-success badge-lg">CONFIRMED</div>
              </div>

              <div className="divider"></div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Theater & Show Info */}
                <div className="space-y-4">
                  <div>
                    <p className="text-sm opacity-50 mb-1">Theater</p>
                    <p className="font-semibold text-lg">{ticket.show.theater.name}</p>
                    {ticket.show.theater.address && (
                      <p className="text-sm opacity-70">{ticket.show.theater.address}</p>
                    )}
                  </div>

                  <div>
                    <p className="text-sm opacity-50 mb-1">Show Time</p>
                    <p className="font-semibold">
                      {new Date(ticket.show.startTime).toLocaleString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>

                {/* Booking Info */}
                <div className="space-y-4">
                  <div>
                    <p className="text-sm opacity-50 mb-1">Seats</p>
                    <p className="font-semibold text-lg">{seatsList}</p>
                    <p className="text-sm opacity-70">{ticket.seats.length} seat(s)</p>
                  </div>

                  <div>
                    <p className="text-sm opacity-50 mb-1">Total Amount</p>
                    <p className="font-bold text-2xl text-primary">₹{totalPrice}</p>
                    <p className="text-xs opacity-50">Paid (Free for now)</p>
                  </div>

                  <div>
                    <p className="text-sm opacity-50 mb-1">Booked On</p>
                    <p className="font-semibold">
                      {new Date(ticket.createdAt).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>

              <div className="divider"></div>

              {/* Important Info */}
              <div className="alert alert-info">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <div>
                  <h3 className="font-bold">Important</h3>
                  <div className="text-xs">
                    Please arrive 15 minutes before the show time. Present this booking confirmation at the theater entrance.
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="card-actions justify-center mt-8 gap-4">
                <Link href="/profile/booked" className="btn btn-outline">
                  View All Bookings
                </Link>
                <Link href="/home" className="btn btn-primary">
                  Book More Tickets
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default BookingSuccessPage
