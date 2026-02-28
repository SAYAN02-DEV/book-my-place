"use client"
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Searchbar from './Searchbar'
import Cityselect from './Cityselect'
import Signin from './Signin';
import Link from 'next/link'

const Navbar = () => {
  const router = useRouter();
  const [showCitySelect, setShowCitySelect] = useState(false);
  const [showSignin, setShowSignin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    if (token && email) {
      setIsLoggedIn(true);
      setUserEmail(email);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    setIsLoggedIn(false);
    setUserEmail('');
    router.push('/home');
  };

  return (
    <>
      <div className="navbar bg-white shadow-sm">
          <div className="navbar-brand mr-6">
            <Link href="/home">
              <img src="/logo.png" alt="Logo" className="h-8 cursor-pointer" />
            </Link>
          </div>
          <div>
              <Searchbar width="w-full sm:w-80 md:w-[500px] lg:w-[700px]"/>
          </div>
          <div>
              <button 
                className='btn'
                onClick={() => setShowCitySelect(true)}
              >
                  City
              </button>
          </div>
          <div>
            {isLoggedIn ? (
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                  <div className="w-10 rounded-full bg-primary text-primary-content flex items-center justify-center">
                    <span className="text-xl">{userEmail.charAt(0).toUpperCase()}</span>
                  </div>
                </label>
                <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                  <li className="menu-title">
                    <span>{userEmail}</span>
                  </li>
                  <li>
                    <Link href="/profile">
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link href="/profile/booked">
                      My Bookings
                    </Link>
                  </li>
                  <li>
                    <Link href="/movies">
                      Browse Movies
                    </Link>
                  </li>
                  <li>
                    <Link href="/stations">
                      Browse Theaters
                    </Link>
                  </li>
                  <li>
                    <button onClick={handleLogout}>
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <button
                className='btn'
                onClick={() => setShowSignin(true)}
              >
                Signin
              </button>
            )}
          </div>
      </div>

      {/* City Select Overlay */}
      {showCitySelect && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-y-auto">
            <button
              onClick={() => setShowCitySelect(false)}
              className="sticky top-4 right-4 z-10 w-8 h-8 ml-auto mr-4 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <Cityselect />
          </div>
        </div>        
      )}
      {showSignin && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl">
            <Signin onClose={() => {
              setShowSignin(false);
              // Refresh auth state after signin
              const token = localStorage.getItem('token');
              const email = localStorage.getItem('email');
              if (token && email) {
                setIsLoggedIn(true);
                setUserEmail(email);
              }
            }} />
          </div>
        </div>        
      )}
      
    </>
  )
}

export default Navbar
