import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navbar */}
      <nav className="bg-green-900 text-white px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-yellow-400">WM App</div>
        <ul className="hidden md:flex gap-6 text-sm font-semibold">
          <li><Link to="/" className="hover:text-yellow-300">Home</Link></li>
          <li><Link to="/about" className="hover:text-yellow-300">About</Link></li>
          <li><Link to="/support" className="hover:text-yellow-300">Support</Link></li>
          <li><Link to="/sustainability" className="hover:text-yellow-300">Sustainability</Link></li>
        </ul>
        <div className="flex gap-3">
          <Link to="/login" className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-1 rounded-full text-sm">Login</Link>
          <Link to="/register" className="border border-yellow-400 hover:bg-yellow-400 text-white hover:text-black px-4 py-1 rounded-full text-sm">Register</Link>
        </div>
      </nav>

      
      <div
        className="flex-1 bg-cover bg-center flex items-center justify-center text-center px-4 py-20"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?auto=format&fit=crop&w=1950&q=80')" }}
      >
        <div className="bg-black bg-opacity-60 p-8 rounded-xl max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Transforming Landfills, <span className="text-yellow-300">For Tomorrow</span></h1>
          <p className="text-gray-200 mb-6 text-sm md:text-base">
            We're turning waste into opportunity. Join us in creating a sustainable future by managing waste responsibly.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/login/admin" className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg text-sm">Admin Login</Link>
            <Link to="/login/resident" className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg text-sm">Resident Login</Link>
            <Link to="/login/collector" className="bg-purple-500 hover:bg-purple-600 text-white px-5 py-2 rounded-lg text-sm">Collector Login</Link>
          </div>
        </div>
      </div>

     
      <footer className="bg-green-900 text-white text-sm text-center py-3">
        © 2025 WM Waste Management App | All rights reserved.
      </footer>
    </div>
  );
};

export default HomePage;
