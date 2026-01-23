"use client"
import React, { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import Adcarousel from '@/components/Adcarousel'
import Recommended from '@/components/Recommended'
import Footer from '@/components/Footer'

interface Movie {
  id: number;
  title: string;
  duration: number;
  imageUrl: string | null;
}

const page = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/getmovies')
      .then(res => res.json())
      .then(data => {
        setMovies(data.movies);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching movies:', error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-white">
        <Navbar/>
        <Adcarousel images={[
          'https://assets-in-gm.bmscdn.com/promotions/cms/creatives/1768459422876_lollawebbb.jpeg',
          'https://assets-in-gm.bmscdn.com/promotions/cms/creatives/1768564270470_bengalurugeneralsalesdesktop.jpg',
          'https://assets-in-gm.bmscdn.com/promotions/cms/creatives/1768459422876_lollawebbb.jpeg',
        ]}/>
        
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-gray-500">Loading movies...</div>
          </div>
        ) : (
          <Recommended movies={movies} title="Recommended Movies" />
        )}
        <Footer/>
    </div>
  )
}

export default page