"use client"
import React from 'react'
import Signin from '@/components/Signin'
import Link from 'next/link'

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <Link href="/home" className="text-4xl font-bold hover:underline">
            🎬 BookMyPlace
          </Link>
          <p className="text-sm opacity-70 mt-2">Book your movie tickets in seconds</p>
        </div>
        
        <Signin />
        
        <p className="text-center mt-6">
          Don't have an account?{' '}
          <Link href="/auth/register" className="text-primary hover:underline font-semibold">
            Register here
          </Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage
