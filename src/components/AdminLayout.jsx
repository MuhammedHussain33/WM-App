import React from "react";
import { Link, useNavigate } from "react-router-dom";

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("ecoWasteUser"); 
    navigate("/login"); 
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6 border-r">
        <h2 className="text-2xl font-bold text-green-700 mb-8">Admin Panel</h2>
        <nav className="space-y-4">
          <Link
            to="/admin-dashboard"
            className="block text-gray-700 hover:text-green-700 font-medium"
          >
            🗂 Pickup Requests
          </Link>
          <Link
            to="/admin-users"
            className="block text-gray-700 hover:text-green-700 font-medium"
          >
            👥 Users
          </Link>
          <Link
            to="/admin-reports"
            className="block text-gray-700 hover:text-green-700 font-medium"
          >
            📊 Reports
          </Link>
          <button
            onClick={handleLogout}
            className="block text-left w-full text-red-600 hover:underline mt-10 font-medium"
          >
            🚪 Logout
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
};

export default AdminLayout;
