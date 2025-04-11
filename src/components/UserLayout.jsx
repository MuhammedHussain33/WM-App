import React from "react";
import { Link, useNavigate } from "react-router-dom";

const UserLayout = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("ecoWasteUser");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <header className="bg-green-700 text-white shadow p-4 flex justify-between items-center">
        <div className="text-xl font-bold">EcoWaste | User Dashboard</div>
        <nav className="flex items-center space-x-6">
          <Link to="/pickup-form" className="hover:underline">
            Request Pickup
          </Link>
          <Link to="/pickup-history" className="hover:underline">
            Pickup History
          </Link>
          <Link to="/user-profile" className="hover:underline">
            Profile
          </Link>
          <button
            onClick={handleLogout}
            className="bg-white text-green-700 px-3 py-1 rounded hover:bg-gray-100"
          >
            Logout
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="p-6">{children}</main>
    </div>
  );
};

export default UserLayout;
