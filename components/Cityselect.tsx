import React, { useState } from 'react'
import Searchbar from './Searchbar'

const Cityselect = () => {
  const [showAllCities, setShowAllCities] = useState(false)

  const popularCities = [
    { name: 'Mumbai', icon: '/mumbai.png' },
    { name: 'Delhi-NCR', icon: '/delhi.png' },
    { name: 'Bengaluru', icon: '/bengaluru.png' },
    { name: 'Hyderabad', icon: '/hyderabad.png' },
    { name: 'Chandigarh', icon: '/chandigarh.png' },
    { name: 'Ahmedabad', icon: '/ahmedabad.png' },
    { name: 'Pune', icon: '/pune.png' },
    { name: 'Chennai', icon: '/chennai.png' },
    { name: 'Kolkata', icon: '/kolkata.png' },
    { name: 'Kochi', icon: '/kochi.png' },
  ]

  const otherCities = [
    'Aalo', 'Abohar', 'Abu Road', 'Achampet', 'Acharapakkam',
    'Addanki', 'Adilabad', 'Adimali', 'Adipur', 'Adoni',
    'Agar Malwa', 'Agartala', 'Agiripal', 'Agra', 'Ahilyanagar (Ahmednagar)',
    'Ahmedgarh', 'Ahore', 'Aizawl', 'Ajmer', 'Akaltara',
    'Akbarpur', 'Akividu', 'Akluj', 'Akola', 'Akot',
    'Alakode', 'Alangudi', 'Alangulam', 'Alappuzha', 'Alathur',
    'Alibaug', 'Aligarh', 'Alipurduar', 'Allagadda', 'Almora',
  ]

  return (
    <div className="px-6 pb-6 bg-white">
      {/* Search Bar */}
      <div className="mb-4">
        <Searchbar width="w-full" placeholder="Search for your city" />
        
        {/* Detect Location */}
        <button className="flex items-center gap-2 mt-3 text-red-500 hover:text-red-600 font-medium text-sm">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          Detect my location
        </button>
      </div>

      {/* Popular Cities */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">Popular Cities</h2>
        <div className="grid grid-cols-5 md:grid-cols-10 gap-4">
          {popularCities.map((city) => (
            <button
              key={city.name}
              className="flex flex-col items-center gap-1 hover:opacity-70 transition-opacity"
            >
              <div className="w-12 h-12 flex items-center justify-center">
                {city.icon.startsWith('/') ? (
                  <img src={city.icon} alt={city.name} className="w-full h-full object-contain" />
                ) : (
                  <span className="text-3xl">{city.icon}</span>
                )}
              </div>
              <span className="text-xs text-gray-700 text-center">{city.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Other Cities */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">Other Cities</h2>
        <div className={`grid grid-cols-2 md:grid-cols-5 gap-x-6 gap-y-2 text-sm ${!showAllCities ? 'max-h-48 overflow-hidden' : ''}`}>
          {otherCities.map((city) => (
            <button
              key={city}
              className="text-left text-gray-500 hover:text-gray-700 transition-colors"
            >
              {city}
            </button>
          ))}
        </div>
        
        {/* Toggle Button */}
        <button
          onClick={() => setShowAllCities(!showAllCities)}
          className="text-red-500 hover:text-red-600 font-medium text-sm mt-4 mx-auto block"
        >
          {showAllCities ? 'Hide all cities' : 'Show all cities'}
        </button>
      </div>
    </div>
  )
}

export default Cityselect