"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import axios from 'axios'

const RegisterPage = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!name || !email || !password) {
      setError('All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('/api/v1/register', {
        name,
        email,
        password
      });

      if (response.data.hasStored) {
        // Registration successful, redirect to login
        router.push('/auth/login?registered=true');
      } else {
        setError('Registration failed. Email might already exist.');
      }
    } catch (err: any) {
      if (err.response) {
        setError(err.response.data.message || 'Registration failed');
      } else {
        setError('Network error. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <Link href="/home" className="text-4xl font-bold hover:underline">
            🎬 BookMyPlace
          </Link>
          <p className="text-sm opacity-70 mt-2">Create your account to start booking</p>
        </div>
        
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-3xl mb-6">Register</h2>
            
            <form onSubmit={handleRegister}>
              {/* Name Input */}
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Full Name</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input input-bordered w-full"
                  required
                />
              </div>

              {/* Email Input */}
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input input-bordered w-full"
                  required
                />
              </div>

              {/* Password Input */}
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input input-bordered w-full"
                  required
                />
              </div>

              {/* Confirm Password Input */}
              <div className="form-control mb-6">
                <label className="label">
                  <span className="label-text">Confirm Password</span>
                </label>
                <input
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input input-bordered w-full"
                  required
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="alert alert-error mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span>{error}</span>
                </div>
              )}

              {/* Register Button */}
              <button 
                type="submit"
                className="btn btn-primary w-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner"></span>
                    Registering...
                  </>
                ) : (
                  'Register'
                )}
              </button>
            </form>
          </div>
        </div>
        
        <p className="text-center mt-6">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-primary hover:underline font-semibold">
            Login here
          </Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage
