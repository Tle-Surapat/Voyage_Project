import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { login } from '../components/auth';  // Import the login function
import AuthHeader from '../components/HomeHeader';
import Footer from '../components/Footer';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      router.push('/dashboard');  // Redirect after successful sign-in
    } catch (error) {
      setError(error.message);
    }
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
            <h1 className="text-4xl font-bold text-center mb-6 text-gray-900">Sign in</h1>
            <form onSubmit={handleSignIn}>
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
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  className="mt-1 p-2 border w-full rounded-md text-gray-900"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="bg-dark-green text-white w-full py-2 rounded-md hover:bg-green-700">
                Sign in
              </button>
            </form>

            {error && <p className="text-red-500 text-center mt-4">{error}</p>}

            <div className="text-center mt-4">
              <Link href="/sign-up" className="text-orange hover:underline">
                Don’t have an account? Sign up
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SignIn;
