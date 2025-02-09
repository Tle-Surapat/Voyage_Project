import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { register } from '../components/auth';  // Import the register function
import AuthHeader from '../components/HomeHeader';
import Footer from '../components/Footer';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await register(email, password, name);
      setShowDialog(true);  // Show success dialog after registration
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please sign in or use a different email.');
      } else {
        setError(error.message);  // Handle other errors
      }
    }
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    router.push('/sign-in');  // Redirect to sign-in page
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <AuthHeader />
      <main className="flex-grow flex">
        <div className="w-1/2 flex items-center justify-center bg-dark-green">
          <img src="/Welcome.png" className="" alt="Welcome"></img>
        </div>

        <div className="w-1/2 flex items-center justify-center bg-cream">
          <div className="bg-white p-8 rounded-lg shadow-md w-3/4">
            <h1 className="text-4xl font-bold text-center mb-6 text-gray-900">Sign up</h1>
            <form onSubmit={handleSignUp}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  className="mt-1 p-2 border w-full rounded-md text-gray-900"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Username</label>
                <input
                  type="text"
                  className="mt-1 p-2 border w-full rounded-md text-gray-900"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  className="mt-1 p-2 border w-full rounded-md text-gray-900"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="bg-orange text-white w-full py-2 rounded-md hover:bg-orange-600">
                Sign up
              </button>
            </form>

            {error && <p className="text-red-500 text-center mt-4">{error}</p>}

            <div className="text-center mt-4">
              <Link href="/sign-in" className="text-orange hover:underline">
                Already have an account? Sign in
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-gray-900">
            <h2 className="text-xl font-bold mb-4 text-center">Sign up successful!</h2>
            <p className="text-center">You have successfully signed up.</p>

            <div className="flex justify-center mt-4">
              <button
                onClick={handleCloseDialog}
                className="bg-orange text-white py-2 px-4 rounded hover:bg-orange-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignUp;
