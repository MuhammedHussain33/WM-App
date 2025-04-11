import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CarouselComponent from "../components/CarouselComponent";
import Settings from "./SettingsAll";

const WasteManagementDashboard = () => {
  const [activePage, setActivePage] = useState("dashboard");
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("ecoWasteUser"));

  const handleLogout = () => {
    localStorage.removeItem("ecoWasteUser");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex bg-gray-900 text-white dark:bg-white dark:text-black transition-all">
      {/* Sidebar */}
      <aside className="w-64 bg-black dark:bg-gray-100 text-white dark:text-black p-5 space-y-6 shadow-xl">
        <h1 className="text-2xl font-extrabold text-green-400 dark:text-green-600">
          🌱 EcoWaste
        </h1>
        <nav className="space-y-4">
          <a
            href="/profile"
            className="block px-3 py-2 rounded hover:bg-gray-800 dark:hover:bg-gray-200"
          >
            👤 My Profile
          </a>
          <Link
            to="/pickup-request"
            className="block px-3 py-2 rounded hover:bg-gray-800 dark:hover:bg-gray-200"
          >
            🚛 Request Pickup
          </Link>
          <Link
            to="/pickup-history"
            className="block px-3 py-2 rounded hover:bg-gray-800 dark:hover:bg-gray-200"
          >
            📜 Pickup History
          </Link>
          {user?.role === "admin" && (
            <a
              href="/admin"
              className="block px-3 py-2 rounded hover:bg-gray-800 dark:hover:bg-gray-200"
            >
              🛠️ Admin Panel
            </a>
          )}
          {user?.role === "collector" && (
            <a
              href="/collector"
              className="block px-3 py-2 rounded hover:bg-gray-800 dark:hover:bg-gray-200"
            >
              🚚 Collector Panel
            </a>
          )}
          <button
            onClick={() => setActivePage("settings")}
            className="block hover:bg-green-600 dark:hover:bg-green-300 rounded px-3 py-2 text-left w-full"
          >
            ⚙️ Settings
          </button>
          <button
            onClick={handleLogout}
            className="w-full text-left bg-red-600 hover:bg-red-700 dark:hover:bg-red-400 rounded px-3 py-2 mt-4 font-semibold"
          >
            🔴 Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h2 className="text-3xl font-bold text-green-300 dark:text-green-600 mb-4">
          👋 Welcome, {user?.fullName || "User"}!
        </h2>

        {activePage === "settings" ? (
          <Settings />
        ) : (
          <>
            {/* Carousel Section */}
            <CarouselComponent />

            {/* 3D Styled Cards */}
            <div className="flex flex-wrap justify-center gap-6 mt-6">
              <div className="bg-white text-black shadow-2xl rounded-2xl p-6 w-72 text-center transform transition duration-300 hover:-translate-y-2 hover:shadow-green-400 dark:bg-gray-100">
                <h3 className="text-xl font-bold text-green-600">
                  🚚 Request Pickup
                </h3>
                <p className="text-gray-600 mt-2">
                  Schedule a pickup at your address.
                </p>
              </div>
              <div className="bg-white text-black shadow-2xl rounded-2xl p-6 w-72 text-center transform transition duration-300 hover:-translate-y-2 hover:shadow-yellow-400 dark:bg-gray-100">
                <h3 className="text-xl font-bold text-yellow-600">
                  📊 Track Status
                </h3>
                <p className="text-gray-600 mt-2">
                  Check the progress of your requests.
                </p>
              </div>
              <div className="bg-white text-black shadow-2xl rounded-2xl p-6 w-72 text-center transform transition duration-300 hover:-translate-y-2 hover:shadow-blue-400 dark:bg-gray-100">
                <h3 className="text-xl font-bold text-blue-600">
                  🕒 Pickup History
                </h3>
                <p className="text-gray-600 mt-2">
                  View your previous pickup logs.
                </p>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default WasteManagementDashboard;
