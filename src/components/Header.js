import React from 'react';
import Link from 'next/link';  // นำเข้า Link component ของ Next.js

const Header = () => {
  return (
    <header className="flex justify-between items-center p-1 px-6 bg-green">
      <div className="flex items-center">
        <img src="/logo.png" alt="Logo" className="w-20 h-20 mr-2" />
        <div className="text-2xl font-bold text-orange font-sans">Voyage</div>
      </div>
      <Link href="/sign-in">  {/* ลิงก์ไปยังหน้า Sign In */}
        <button className="bg-dark-green text-cream px-4 py-2 rounded font-sans">
          Sign in
        </button>
      </Link>
    </header>
  );
};

export default Header;
