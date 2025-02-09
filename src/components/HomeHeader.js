import React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse } from '@fortawesome/free-solid-svg-icons';  // Use pro-light icon

const HomeHeader = () => {
  return (
    <header className="flex justify-between items-center p-1 px-6 bg-green">
      {/* Left: Logo and Title */}
      <div className="flex items-center">
        <img src="/logo.png" alt="Logo" className="w-20 h-20" />
        <span className="text-3xl font-bold text-orange ml-2">Voyage</span>
      </div>

      {/* Right: Home Button */}
      <Link href="/">
        <button className="bg-orange text-white rounded-full h-12 w-12 flex items-center justify-center hover:bg-orange-600">
          <FontAwesomeIcon icon={faHouse} size="lg" />  {/* Adjusted for light version */}
        </button>
      </Link>
    </header>
  );
};

export default HomeHeader;
