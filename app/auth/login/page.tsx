"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import axios from 'axios'

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await axios.post('/api/v1/login', { email, password });
      if (response.status === 200 && response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('email', email);
        router.push('/home');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f8f6f6] min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-[480px] bg-white shadow-xl rounded-xl overflow-hidden border border-[#e63743]/10">
        {/* Header */}
        <div className="pt-10 pb-6 px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="text-[#e63743] size-10">
              <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <path d="M24 45.8096C19.6865 45.8096 15.4698 44.5305 11.8832 42.134C8.29667 39.7376 5.50128 36.3314 3.85056 32.3462C2.19985 28.361 1.76794 23.9758 2.60947 19.7452C3.451 15.5145 5.52816 11.6284 8.57829 8.5783C11.6284 5.52817 15.5145 3.45101 19.7452 2.60948C23.9758 1.76795 28.361 2.19986 32.3462 3.85057C36.3314 5.50129 39.7376 8.29668 42.134 11.8833C44.5305 15.4698 45.8096 19.6865 45.8096 24L24 24L24 45.8096Z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">BookMyPlace</h1>
          </div>
          <p className="text-slate-600 font-normal">Your perfect movie experience awaits</p>
        </div>

        {/* Image Banner */}
        <div className="px-8">
          <div
            className="w-full h-32 rounded-lg bg-center bg-cover bg-no-repeat"
            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAbAP6aXT6SmosbNg6vYToSRuwqP6f9QyzHtgVa0g3sjcWw5dIhvORAHDsmfymDGB9ZCLZ6bbWVg9fLfkuo_MYk-DiqeSWuinw68prO5pzmo_2I7wlYSPPOkWG0p23Qbdu_In-QRiIYllS77RWW14LjURdloFSWEwh0S0cBJRtje-hhpLCRgL23ucW-j_YvvAEiTn7eTMUfEluwygup51AG4zgxIKLrH7NcYUxUMdYHzEQR33Gfgcc88I2l6x62M0zWZ0BiiOofuIYn")' }}
          />
        </div>

        {/* Form Section */}
        <div className="px-8 pt-8 pb-10">
          {/* Divider */}
          <div className="relative flex py-4 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-4 text-slate-400 text-sm font-medium uppercase tracking-wider">Sign In</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSignIn} className="space-y-4 pt-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="email">
                Email Address
              </label>
              <input
                className="w-full h-11 px-4 rounded-md border border-slate-200 focus:ring-2 focus:ring-[#e63743] focus:border-transparent outline-none transition-all placeholder:text-slate-400 bg-white"
                id="email"
                placeholder="name@example.com"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-slate-700" htmlFor="password">Password</label>
                <a className="text-xs font-semibold text-[#e63743] hover:underline" href="#">Forgot password?</a>
              </div>
              <input
                className="w-full h-11 px-4 rounded-md border border-slate-200 focus:ring-2 focus:ring-[#e63743] focus:border-transparent outline-none transition-all placeholder:text-slate-400 bg-white"
                id="password"
                placeholder="••••••••"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              className="w-full bg-[#e63743] hover:bg-[#e63743]/90 text-white font-bold h-12 rounded-lg transition-colors mt-6 shadow-sm disabled:opacity-60"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center mt-8 text-slate-600 text-sm">
            Don't have an account?{' '}
            <Link href="/auth/register" className="text-[#e63743] font-bold hover:underline">Register</Link>
          </p>
        </div>

        {/* Footer */}
        <footer className="bg-[#211112] py-4 text-center">
          <p className="text-slate-400 text-[10px] uppercase tracking-widest">© 2024 BookMyPlace Global</p>
        </footer>
      </div>
    </div>
  );
}

