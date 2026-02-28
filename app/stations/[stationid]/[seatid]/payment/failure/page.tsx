"use client"
import React from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

const PaymentFailurePage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-base-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        {/* Failure Message */}
        <div className="max-w-2xl mx-auto">
          <div className="alert alert-error shadow-lg mb-8">
            <div className="flex flex-col w-full items-center gap-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-16 w-16" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-center">
                <h3 className="font-bold text-2xl">Payment Failed!</h3>
                <p className="text-sm mt-2">Your booking could not be completed. No charges were made.</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h2 className="card-title justify-center mb-4">What would you like to do?</h2>
              
              <div className="flex flex-col gap-4">
                <button 
                  onClick={() => router.back()}
                  className="btn btn-primary btn-lg"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15l-4-4 4-4" />
                  </svg>
                  Try Again
                </button>
                
                <Link href="/movies" className="btn btn-outline btn-lg">
                  Browse Movies
                </Link>
                
                <Link href="/home" className="btn btn-ghost btn-lg">
                  Go to Home
                </Link>
              </div>

              {/* Help Section */}
              <div className="divider">Need Help?</div>
              
              <div className="alert alert-info">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current flex-shrink-0 w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div>
                  <h3 className="font-bold">Common Issues:</h3>
                  <ul className="text-sm mt-2 list-disc list-inside">
                    <li>Insufficient balance in your account</li>
                    <li>Incorrect payment details</li>
                    <li>Network connectivity issues</li>
                    <li>Bank server temporarily unavailable</li>
                  </ul>
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

export default PaymentFailurePage;
