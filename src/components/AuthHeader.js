import React, { useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router'; // Import useRouter from Next.js

const AuthHeader = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Dialog visibility state
  const router = useRouter(); // Initialize router

  // Toggle dialog visibility
  const toggleDialog = () => {
    setIsDialogOpen(!isDialogOpen);
  };

  // Sign out function
  const handleSignOut = () => {
    console.log('Sign out clicked');
    setIsDialogOpen(false); // Close dialog after signing out

    // Redirect to home page
    router.push('/');
  };

  return (
    <header className="flex justify-between items-center p-1 px-6 bg-green">
      {/* Left: Logo and Title */}
      <div className="flex items-center">
        <img src="/logo.png" alt="Logo" className="w-20 h-20" />
        <span className="text-3xl font-bold text-orange ml-2">Voyage</span>
      </div>

      {/* Right: Profile Button */}
      <button
        className="bg-orange text-white rounded-full h-12 w-12 flex items-center justify-center hover:bg-orange-600"
        onClick={toggleDialog}
      >
        <FontAwesomeIcon icon={faUser} size="lg" />
      </button>

      {/* Profile Dialog */}
      {isDialogOpen && (
        <div className="absolute top-16 right-6 bg-white shadow-md rounded-lg p-4 w-64 z-50">
          <ul className="space-y-4">
            
            {/* Edit Password */}
            <li>
              <Link href="/profile" className="block text-gray-700 hover:text-gray-900">
                Edit Password
              </Link>
            </li>

            {/* Sign Out */}
            <li>
              <button
                onClick={handleSignOut}
                className="block w-full text-left text-red-600 hover:text-red-800"
              >
                Sign Out
              </button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default AuthHeader;
