import React from 'react';
import Banner from '../components/Banner';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen bg-cream">
      {/* Responsive Header */}
      <header className="w-full">
        <Header />
      </header>

      {/* Main Content with Responsive Flex/Grid */}
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Banner />
      </main>

      {/* Responsive Footer */}
      <footer className="w-full">
        <Footer />
      </footer>
    </div>
  );
};

export default Home;
