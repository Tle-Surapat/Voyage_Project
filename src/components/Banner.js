'use client';

import { useEffect } from 'react';
import 'flowbite';  // Import Flowbite

const Banner = () => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // ให้ Flowbite ทำงานใน client-side เท่านั้น
    }
  }, []);

  return (
    <div id="gallery" className="relative w-full" data-carousel="slide">
      <div className="relative w-full h-[500px] md:h-[700px] overflow-hidden rounded-lg">
        <div className="duration-700 ease-in-out" data-carousel-item="active">
          <img src="/banner-02.png" className="block w-full h-full object-cover" alt="Banner 02" />
        </div>

        <div className="duration-700 ease-in-out" data-carousel-item="active">
          <img src="/banner-03.png" className="block w-full h-full object-cover" alt="Banner 03" />
        </div>

        <div className="duration-700 ease-in-out" data-carousel-item="active">
          <img src="/banner-04.png" className="block w-full h-full object-cover" alt="Banner 04" />
        </div>

        <div className="duration-700 ease-in-out" data-carousel-item="active">
          <img src="/banner-01.png" className="block w-full h-full object-cover" alt="Banner 01" />
        </div>
      </div>

      {/* ปุ่ม Previous */}
      <button
        type="button"
        className="absolute top-1/2 left-5 z-30 flex items-center justify-center w-12 h-12 bg-white bg-opacity-30 hover:bg-opacity-50 rounded-full transform -translate-y-1/2 focus:outline-none"
        data-carousel-prev
      >
        <svg
          className="w-6 h-6 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 6 10"
        >
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1 1 5l4 4" />
        </svg>
        <span className="sr-only">Previous</span>
      </button>

      {/* ปุ่ม Next */}
      <button
        type="button"
        className="absolute top-1/2 right-5 z-30 flex items-center justify-center w-12 h-12 bg-white bg-opacity-30 hover:bg-opacity-50 rounded-full transform -translate-y-1/2 focus:outline-none"
        data-carousel-next
      >
        <svg
          className="w-6 h-6 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 6 10"
        >
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
        </svg>
        <span className="sr-only">Next</span>
      </button>
    </div>
  );
};

export default Banner;
