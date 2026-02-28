import React from 'react'

interface SearchbarProps {
  width?: string;
  placeholder?: string;
}

const Searchbar = ({ width = "w-full sm:w-64 md:w-80 lg:w-96", placeholder = "Search" }: SearchbarProps) => {
  return (
    <div className={width}>
        <label className="input bg-white text-gray-500 border-2 border-gray-300 w-full">
            <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2.5"
                fill="none"
                stroke="currentColor"
                >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
                </g>
            </svg>
            <input type="search" required placeholder={placeholder} />
        </label>
    </div>
  )
}

export default Searchbar