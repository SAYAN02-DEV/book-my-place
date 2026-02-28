"use client"
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

interface User {
  name: string;
  email: string;
  created_at: string;
}

const ProfilePage = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [ticketCount, setTicketCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');

    if (!token || !email) {
      router.push('/auth/login');
      return;
    }

    // Set user from localStorage
    setUser({
      name: 'User',
      email: email,
      created_at: new Date().toISOString()
    });

    // Fetch user's booking count
    fetch('/api/v1/booking', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setTicketCount(data.tickets.length);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching bookings:', error);
        setLoading(false);
      });
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    router.push('/home');
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

  if (!user) {
    return (
      <div className="min-h-screen bg-base-100">
        <Navbar />
        <div className="flex flex-col justify-center items-center h-screen">
          <p className="text-2xl mb-4">Please login to view profile</p>
          <Link href="/auth/login" className="btn btn-primary">Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-5xl font-bold mb-12">My Profile</h1>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Profile Info Card */}
          <div className="md:col-span-2">
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-3xl mb-6">Account Information</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="text-sm opacity-50">Name</label>
                    <p className="text-xl font-semibold">{user.name}</p>
                  </div>

                  <div>
                    <label className="text-sm opacity-50">Email</label>
                    <p className="text-xl font-semibold">{user.email}</p>
                  </div>

                  <div>
                    <label className="text-sm opacity-50">Member Since</label>
                    <p className="text-xl font-semibold">
                      {new Date(user.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                <div className="divider"></div>

                <button 
                  onClick={handleLogout}
                  className="btn btn-error btn-outline"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="space-y-6">
            <div className="card bg-primary text-primary-content shadow-xl">
              <div className="card-body">
                <h3 className="card-title">Total Bookings</h3>
                <p className="text-5xl font-bold">{ticketCount}</p>
              </div>
            </div>

            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <h3 className="card-title mb-4">Quick Links</h3>
                <div className="space-y-2">
                  <Link href="/profile/booked" className="btn btn-outline w-full">
                    View All Bookings
                  </Link>
                  <Link href="/movies" className="btn btn-outline w-full">
                    Browse Movies
                  </Link>
                  <Link href="/stations" className="btn btn-outline w-full">
                    Browse Theaters
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">Recent Bookings</h2>
            <Link href="/profile/booked" className="btn btn-primary btn-sm">
              View All
            </Link>
          </div>

          {ticketCount > 0 ? (
            <div className="alert alert-info">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <span>You have {ticketCount} booking(s). Click "View All" to see details.</span>
            </div>
          ) : (
            <div className="text-center py-16 card bg-base-200">
              <p className="text-xl opacity-50 mb-4">No bookings yet</p>
              <Link href="/movies" className="btn btn-primary">
                Book Your First Ticket
              </Link>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default ProfilePage
