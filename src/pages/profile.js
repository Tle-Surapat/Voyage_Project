import React, { useState } from 'react';
import { updatePassword } from 'firebase/auth';
import { useRouter } from 'next/router';
import AuthHeader from '../components/AuthHeader';
import Footer from '../components/Footer';
import { auth } from '../components/firebase';

const ProfilePage = () => {
  const user = auth.currentUser;
  const router = useRouter();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await updatePassword(user, newPassword);
      setSuccess('Password updated successfully');
      setNewPassword('');
      setConfirmPassword('');

      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (err) {
      setError('Error updating password: ' + err.message);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-cream">
      <AuthHeader />

      {/* Main content */}
      <div className="flex-grow flex items-center justify-center px-4 py-8">
        <div className="bg-white shadow-md rounded-lg p-6 md:p-10 w-full max-w-md md:max-w-lg">
          <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-6 md:mb-8">Profile</h1>

          {/* Profile Information Section */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Profile</h2>
            <p className="text-gray-600">
              <strong>Email:</strong> {user ? user.email : 'Loading...'}
            </p>
          </div>

          {/* Edit Password Section */}
          <div className="mb-4">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Edit Password</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {success && <p className="text-green-500 mb-4">{success}. Redirecting to dashboard...</p>}

            <form onSubmit={handlePasswordUpdate}>
              <div className="mb-4">
                <label className="block text-m font-semibold text-gray-800 mb-2">New Password</label>
                <input
                  type="password"
                  className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-m font-semibold text-gray-800 mb-2">Confirm New Password</label>
                <input
                  type="password"
                  className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <div className="mt-6 text-center">
                <button
                  type="submit"
                  className="bg-dark-green text-white py-3 px-6 rounded-lg font-semibold hover:bg-green hover:text-gray-500 transition duration-300"
                >
                  Update Password
                </button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <button
                className="bg-gray-500 text-white py-2 px-6 rounded-lg font-semibold hover:bg-gray-700"
                onClick={() => router.push('/dashboard')}
              >
                Back
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProfilePage;
