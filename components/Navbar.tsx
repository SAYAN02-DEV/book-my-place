import React, { useState } from 'react'
import Searchbar from './Searchbar'
import Cityselect from './Cityselect'
import Signin from './Signin';

const Navbar = () => {
  const [showCitySelect, setShowCitySelect] = useState(false);
  const [showSignin, setShowSignin] = useState(false);

  return (
    <>
      <div className="navbar bg-white shadow-sm">
          <div className="navbar-brand mr-6">
            <img src="/logo.png" alt="Logo" className="h-8" />
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
            <button
                className='btn'
                onClick={() => setShowSignin(true)}
                >
                Signin
            </button>
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
            <Signin onClose={() => setShowSignin(false)} />
          </div>
        </div>        
      )}
      
    </>
  )
}

export default Navbar