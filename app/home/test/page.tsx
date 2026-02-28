"use client"
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Menu, 
  User, 
  ChevronRight, 
  ChevronLeft, 
  Star, 
  Play, 
  Calendar, 
  Music, 
  Trophy, 
  Theater,
  Smartphone,
  Facebook, 
  Twitter, 
  Instagram, 
  Bell,
  Ticket,
  ExternalLink,
  Users,
  Clock,
  Globe,
  Filter,
  ArrowRight
} from 'lucide-react';

const App = () => {
  const [currentHero, setCurrentHero] = useState(0);
  const [activeCategory, setActiveCategory] = useState('Movies');

  const heroBanners = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1485846234645-a62644ef7467?auto=format&fit=crop&q=80&w=1200",
      title: "Indie Film Festival 2024",
      subtitle: "Join 50,000+ enthusiasts for the world's largest independent cinema collective.",
      tag: "Limited Premiere",
      location: "Royal Albert Hall",
      date: "Oct 24-28"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&q=80&w=1200",
      title: "The Midnight Symphony",
      subtitle: "A neoclassical journey through light and sound. Strictly 500 passes only.",
      tag: "Live Music",
      location: "The O2 Arena",
      date: "Nov 12"
    }
  ];

  const categories = [
    { name: 'Movies', icon: Play, count: '124' },
    { name: 'Premiere', icon: Ticket, count: '12' },
    { name: 'Concerts', icon: Music, count: '45' },
    { name: 'Theater', icon: Theater, count: '18' },
    { name: 'Sports', icon: Trophy, count: '08' },
    { name: 'Exhibitions', icon: Calendar, count: '22' },
  ];

  const curatedMovies = [
    { 
      id: 1, 
      title: "The Midnight Waltz", 
      rating: "9.4", 
      genre: "Drama", 
      status: "Filling Fast",
      duration: "2h 15m",
      lang: "English",
      image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=400" 
    },
    { 
      id: 2, 
      title: "L'Avenue", 
      rating: "8.9", 
      genre: "Foreign", 
      status: "New",
      duration: "1h 45m",
      lang: "French",
      image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&q=80&w=400" 
    },
    { 
      id: 3, 
      title: "Noir Reflections", 
      rating: "8.5", 
      genre: "Mystery", 
      status: "Exclusive",
      duration: "2h 05m",
      lang: "English",
      image: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&q=80&w=400" 
    },
    { 
      id: 4, 
      title: "Silent Echoes", 
      rating: "9.1", 
      genre: "Art House", 
      status: "Pre-book",
      duration: "1h 55m",
      lang: "German",
      image: "https://images.unsplash.com/photo-1518133835878-5a93cc3f89e5?auto=format&fit=crop&q=80&w=400" 
    },
  ];

  const partners = ["Cineworld", "PVR Cinemas", "Royal Opera", "O2 Arena", "The Globe", "Stadium X"];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHero((prev) => (prev + 1) % heroBanners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#111111] font-sans selection:bg-yellow-400">
      {/* Devfolio-style Top Bar Notice */}
      <div className="bg-black text-white py-2 px-4 text-center text-[10px] font-bold tracking-[0.2em] uppercase">
        <span className="text-yellow-400">Live:</span> 12,402 people are currently booking tickets across 14 cities
      </div>

      {/* Main Navbar */}
      <nav className="bg-white border-b-2 border-black sticky top-0 z-50 py-4">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <h1 className="text-2xl font-black tracking-tighter text-black flex items-center gap-2">
              <div className="w-10 h-10 bg-yellow-400 border-2 border-black rounded-xl flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <Ticket className="w-6 h-6 text-black" />
              </div>
              <span>SHOWSTREAM</span>
            </h1>
            
            <div className="hidden lg:flex items-center gap-10 text-[13px] font-black uppercase tracking-widest text-gray-400">
              <a href="#" className="text-black border-b-2 border-yellow-400 pb-1">Discover</a>
              <a href="#" className="hover:text-black transition-colors">Premieres</a>
              <a href="#" className="hover:text-black transition-colors">Community</a>
              <a href="#" className="hover:text-black transition-colors">Host Event</a>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center relative group">
              <Search className="absolute left-3 w-4 h-4 text-gray-400 group-focus-within:text-black" />
              <input 
                type="text" 
                placeholder="Find your next experience..."
                className="bg-gray-100 border-2 border-transparent rounded-xl py-2 pl-10 pr-4 text-sm focus:bg-white focus:border-black transition-all outline-none w-72 font-medium"
              />
            </div>
            <button className="hidden sm:block text-sm font-black uppercase tracking-widest hover:text-yellow-600 transition-colors">
              Sign In
            </button>
            <button className="bg-yellow-400 text-black text-sm font-black uppercase tracking-widest px-6 py-3 border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
              Apply for Pass
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        
        {/* Dynamic Hero Section */}
        <section className="mb-20 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-8 relative rounded-[2rem] border-2 border-black overflow-hidden bg-black aspect-[21/9] lg:aspect-auto shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <img 
              src={heroBanners[currentHero].image} 
              className="w-full h-full object-cover opacity-70" 
              alt="Hero"
            />
            <div className="absolute inset-0 p-8 md:p-14 flex flex-col justify-end bg-gradient-to-t from-black via-black/30 to-transparent">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="bg-yellow-400 border-2 border-black text-black text-[10px] font-black uppercase px-3 py-1.5 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  {heroBanners[currentHero].tag}
                </span>
                <span className="bg-white/10 backdrop-blur-md text-white text-xs font-black uppercase px-3 py-1.5 rounded-lg border border-white/20 flex items-center gap-2">
                  <Calendar className="w-3 h-3 text-yellow-400" /> {heroBanners[currentHero].date}
                </span>
                <span className="bg-white/10 backdrop-blur-md text-white text-xs font-black uppercase px-3 py-1.5 rounded-lg border border-white/20 flex items-center gap-2">
                  <MapPin className="w-3 h-3 text-yellow-400" /> {heroBanners[currentHero].location}
                </span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-[1.1] tracking-tighter uppercase">
                {heroBanners[currentHero].title}
              </h2>
              <p className="text-white/80 max-w-xl mb-10 text-base md:text-lg font-medium leading-relaxed">
                {heroBanners[currentHero].subtitle}
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="bg-white text-black font-black uppercase tracking-widest py-4 px-10 border-2 border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all flex items-center gap-3">
                  View Schedule <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-white border-2 border-black p-8 rounded-[2rem] flex-1 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center justify-between mb-8">
                <h4 className="font-black text-sm uppercase tracking-[0.2em]">Curated Feed</h4>
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse"></div>
                  <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse delay-75"></div>
                  <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse delay-150"></div>
                </div>
              </div>
              <div className="space-y-6">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex gap-4 items-center group cursor-pointer border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                    <div className="w-14 h-14 bg-gray-100 border-2 border-black rounded-2xl overflow-hidden shrink-0 group-hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all">
                      <img src={`https://picsum.photos/seed/${item+99}/150/150`} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="font-black text-xs uppercase tracking-tight group-hover:text-yellow-600 leading-tight">London Indie Shorts Finale</p>
                      <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mt-1">Today • 8:00 PM</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-black text-white p-8 rounded-[2rem] border-2 border-black shadow-[6px_6px_0px_0px_rgba(250,204,21,1)] relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 text-yellow-400/20">
                  <Users className="w-20 h-20 -mr-4 -mt-4 rotate-12" />
               </div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-yellow-400 mb-2">Member Special</p>
              <h4 className="font-black text-2xl mb-6 leading-tight uppercase italic">Join the show collective</h4>
              <button className="bg-yellow-400 text-black text-xs font-black uppercase tracking-[0.2em] py-4 rounded-xl w-full border-2 border-black hover:bg-white transition-all">
                Become a Member
              </button>
            </div>
          </div>
        </section>

        {/* Partners Ticker */}
        <section className="mb-20">
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8 opacity-40 grayscale hover:grayscale-0 transition-all">
            {partners.map((p, i) => (
              <span key={i} className="text-sm font-black uppercase tracking-[0.4em] text-black">{p}</span>
            ))}
          </div>
        </section>

        {/* Categories Grid */}
        <section className="mb-20">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-2xl font-black uppercase tracking-tighter">Explore Categories</h3>
            <div className="h-[2px] bg-black/5 flex-1 mx-10 hidden md:block"></div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((cat) => (
              <button 
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className={`group relative flex flex-col items-center justify-center p-8 rounded-[2rem] border-2 transition-all ${
                  activeCategory === cat.name 
                  ? 'bg-white border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] -translate-y-1' 
                  : 'bg-white border-gray-200 hover:border-black text-gray-400 hover:text-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                }`}
              >
                <div className={`mb-4 p-3 rounded-xl transition-colors ${activeCategory === cat.name ? 'bg-yellow-400 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'bg-gray-50'}`}>
                   <cat.icon className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-black uppercase tracking-widest">{cat.name}</span>
                <span className="absolute top-4 right-4 text-[9px] font-black bg-black text-white px-1.5 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                   {cat.count}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Filters Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10 p-2 border-2 border-black rounded-2xl bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-2">
             <button className="px-6 py-2 bg-black text-white rounded-xl text-xs font-black uppercase tracking-widest">Trending</button>
             <button className="px-6 py-2 hover:bg-gray-100 rounded-xl text-xs font-black uppercase tracking-widest text-gray-500">Upcoming</button>
             <button className="px-6 py-2 hover:bg-gray-100 rounded-xl text-xs font-black uppercase tracking-widest text-gray-500">Popular</button>
          </div>
          <button className="flex items-center gap-2 px-6 py-2 text-xs font-black uppercase tracking-widest">
            <Filter className="w-4 h-4" /> Filter & Sort
          </button>
        </div>

        {/* Featured Events Grid */}
        <section className="mb-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {curatedMovies.map((movie) => (
              <div key={movie.id} className="bg-white border-2 border-black rounded-[2rem] overflow-hidden hover:shadow-[8px_8px_0px_0px_rgba(250,204,21,1)] transition-all group flex flex-col">
                <div className="relative aspect-[4/3] border-b-2 border-black overflow-hidden">
                  <img src={movie.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={movie.title} />
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <span className="bg-white border-2 border-black text-[10px] font-black px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                      <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" /> {movie.rating}
                    </span>
                    <span className="bg-black text-yellow-400 text-[9px] font-black uppercase px-2.5 py-1.5 rounded-lg border-2 border-black flex items-center gap-2">
                       <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse"></div> {movie.status}
                    </span>
                  </div>
                </div>
                <div className="p-7 flex-1 flex flex-col">
                  <h4 className="font-black text-xl mb-4 group-hover:text-yellow-600 transition-colors leading-tight uppercase tracking-tighter">
                    {movie.title}
                  </h4>
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="text-[9px] font-black uppercase tracking-widest bg-gray-100 border border-gray-200 text-gray-500 px-2 py-1 rounded-md flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" /> {movie.duration}
                    </span>
                    <span className="text-[9px] font-black uppercase tracking-widest bg-gray-100 border border-gray-200 text-gray-500 px-2 py-1 rounded-md flex items-center gap-1">
                      <Globe className="w-2.5 h-2.5" /> {movie.lang}
                    </span>
                  </div>
                  <div className="mt-auto">
                    <button className="w-full bg-black text-white text-xs font-black uppercase tracking-[0.2em] py-4 rounded-2xl hover:bg-yellow-400 hover:text-black border-2 border-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-none translate-x-0 group-hover:translate-x-[2px] group-hover:translate-y-[2px]">
                      Book Tickets
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Professional Community Layout */}
        <section className="mb-20">
          <div className="bg-black text-white rounded-[3rem] p-10 md:p-16 relative overflow-hidden border-[6px] border-yellow-400">
            <div className="absolute top-0 right-0 w-full h-full opacity-[0.03]">
               <div className="w-full h-full" style={{backgroundImage: 'radial-gradient(#fff 2px, transparent 2px)', backgroundSize: '32px 32px'}}></div>
            </div>
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <span className="text-xs font-black uppercase tracking-[0.4em] text-yellow-400">ShowStream Network</span>
                </div>
                <h3 className="text-4xl md:text-5xl font-black mb-8 leading-[1.1] uppercase tracking-tighter italic">
                  Join the world's <br/> finest arts guild
                </h3>
                <p className="text-gray-400 mb-10 max-w-md text-lg leading-relaxed font-medium">
                  Direct access to exclusive film sets, theater rehearsals, and community workshops. Only on ShowStream.
                </p>
                <div className="flex flex-wrap gap-4 mb-10">
                   <div className="bg-white/10 px-6 py-4 rounded-2xl border border-white/10">
                      <p className="text-2xl font-black text-white">45k+</p>
                      <p className="text-[10px] uppercase font-black tracking-widest text-gray-500">Members</p>
                   </div>
                   <div className="bg-white/10 px-6 py-4 rounded-2xl border border-white/10">
                      <p className="text-2xl font-black text-white">120+</p>
                      <p className="text-[10px] uppercase font-black tracking-widest text-gray-500">Film Guilds</p>
                   </div>
                </div>
                <button className="bg-yellow-400 text-black font-black py-5 px-12 rounded-2xl hover:bg-white transition-all text-sm uppercase tracking-[0.2em] border-2 border-yellow-400 shadow-[8px_8px_0px_0px_rgba(255,255,255,0.15)]">
                  Explore The Guild
                </button>
              </div>
              <div className="hidden lg:block">
                <div className="relative">
                   <div className="absolute -inset-4 bg-yellow-400 blur-2xl opacity-20 animate-pulse"></div>
                   <div className="relative bg-white/5 border-2 border-white/10 p-4 rounded-[2rem] rotate-2">
                      <img src="https://images.unsplash.com/photo-1540575861501-7c91b70f43b2?auto=format&fit=crop&q=80&w=800" className="rounded-2xl" alt="Community" />
                   </div>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Structured Multi-Column Footer */}
      <footer className="bg-white border-t-2 border-black py-24">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-20">
            <div className="col-span-1 md:col-span-5">
              <h1 className="text-3xl font-black tracking-tighter text-black flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-yellow-400 border-2 border-black rounded-xl flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  <Ticket className="w-6 h-6 text-black" />
                </div>
                <span>SHOWSTREAM</span>
              </h1>
              <p className="text-lg text-gray-500 leading-relaxed mb-10 max-w-md font-medium">
                Designing the future of entertainment access. One ticket, one community, and thousands of experiences at a time.
              </p>
              <div className="flex gap-4">
                <a href="#" className="p-4 bg-white border-2 border-black rounded-2xl hover:bg-yellow-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all"><Twitter className="w-5 h-5" /></a>
                <a href="#" className="p-4 bg-white border-2 border-black rounded-2xl hover:bg-yellow-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all"><Instagram className="w-5 h-5" /></a>
                <a href="#" className="p-4 bg-white border-2 border-black rounded-2xl hover:bg-yellow-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all"><Facebook className="w-5 h-5" /></a>
              </div>
            </div>
            
            <div className="col-span-1 md:col-span-2">
              <h5 className="text-xs font-black uppercase tracking-[0.3em] text-black mb-8">Ecosystem</h5>
              <ul className="space-y-5 text-sm text-gray-400 font-black uppercase tracking-widest">
                <li className="hover:text-yellow-600 cursor-pointer transition-colors">Movies</li>
                <li className="hover:text-yellow-600 cursor-pointer transition-colors">Live Concerts</li>
                <li className="hover:text-yellow-600 cursor-pointer transition-colors">Film Guilds</li>
                <li className="hover:text-yellow-600 cursor-pointer transition-colors">Theater</li>
              </ul>
            </div>
            
            <div className="col-span-1 md:col-span-2">
              <h5 className="text-xs font-black uppercase tracking-[0.3em] text-black mb-8">Organization</h5>
              <ul className="space-y-5 text-sm text-gray-400 font-black uppercase tracking-widest">
                <li className="hover:text-yellow-600 cursor-pointer transition-colors">Host Event</li>
                <li className="hover:text-yellow-600 cursor-pointer transition-colors">Guidelines</li>
                <li className="hover:text-yellow-600 cursor-pointer transition-colors">Brand Assets</li>
                <li className="hover:text-yellow-600 cursor-pointer transition-colors">Blog</li>
              </ul>
            </div>
            
            <div className="col-span-1 md:col-span-3">
               <div className="bg-gray-50 p-8 rounded-3xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                 <h5 className="text-xs font-black uppercase tracking-widest mb-4">Stay Synchronized</h5>
                 <p className="text-[10px] text-gray-500 font-bold uppercase mb-4 tracking-widest">Get early access to premieres</p>
                 <div className="flex gap-2">
                    <input type="text" className="bg-white border-2 border-black p-3 rounded-xl text-xs flex-1 outline-none" placeholder="Email" />
                    <button className="bg-black p-3 rounded-xl text-yellow-400">
                       <ArrowRight className="w-5 h-5" />
                    </button>
                 </div>
               </div>
            </div>
          </div>
          
          <div className="pt-12 border-t-2 border-black flex flex-col md:flex-row items-center justify-between gap-8 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
            <div className="flex flex-wrap items-center justify-center gap-10">
              <p>© 2024 SHOWSTREAM GLOBAL ENTERTAINMENT</p>
              <a href="#" className="hover:text-black">Terms of Service</a>
              <a href="#" className="hover:text-black">Privacy Policy</a>
            </div>
            <div className="flex items-center gap-4">
               <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
               <span className="text-black">Systems Operational</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Nav - Neubrutalist Style */}
      <div className="lg:hidden fixed bottom-6 left-6 right-6 bg-white border-[3px] border-black py-4 px-8 flex justify-between items-center z-50 rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex flex-col items-center gap-1 text-black">
          <div className="w-8 h-8 bg-yellow-400 border-2 border-black rounded-lg flex items-center justify-center">
            <Play className="w-4 h-4 fill-black" />
          </div>
          <span className="text-[8px] font-black uppercase tracking-tighter">Cinema</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-gray-300">
          <Search className="w-6 h-6" />
          <span className="text-[8px] font-black uppercase tracking-tighter">Search</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-gray-300">
          <Ticket className="w-6 h-6" />
          <span className="text-[8px] font-black uppercase tracking-tighter">Passes</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-gray-300">
          <User className="w-6 h-6" />
          <span className="text-[8px] font-black uppercase tracking-tighter">Profile</span>
        </div>
      </div>
    </div>
  );
};

export default App;