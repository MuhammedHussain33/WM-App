import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import CarouselComponent from "../components/CarouselComponent";
import Settings from "../components/settings/SettingsAll";
import ProfilePage from "./ProfilePage";
import PickupHistory from "./PickupHistory";
import PickupRequest from "./PickupForm";
import { useAuth } from "../context/AuthContext";

const WasteManagementDashboard = () => {
  const [activePage, setActivePage] = useState("dashboard");
  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true");
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const storedFullName = user?.fullName || "User";

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const handleLogout = () => {
    logout();
    sessionStorage.removeItem("ecoWasteUser");
    navigate("/login");
  };

  const renderActivePage = () => {
    switch (activePage) {
      case "profile":
        return <ProfilePage />;
      case "pickupHistory":
        return <PickupHistory />;
      case "pickupRequest":
        return <PickupRequest />;
      case "settings":
        return <Settings />;
      default:
        return (
          <>
            <CarouselComponent />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
              <DashboardCard
                title="Request Pickup"
                description="Schedule a pickup at your location easily."
                color="from-green-400 to-green-600"
                imgSrc="/images/Waste management.gif"
                onClick={() => setActivePage("pickupRequest")}
                data-aos="fade-up"
              />
              <DashboardCard
                title="Track Status"
                description="Monitor the progress of your requests."
                color="from-yellow-400 to-yellow-600"
                imgSrc="/images/Waste management (1).gif"
                data-aos="fade-up"
                data-aos-delay="200"
              />
              <DashboardCard
                title="Pickup History"
                description="View logs of past waste pickups."
                color="from-blue-400 to-blue-600"
                imgSrc="/images/Waste management (2).gif"
                onClick={() => setActivePage("pickupHistory")}
                data-aos="fade-up"
                data-aos-delay="400"
              />
              <DashboardCard
                title="View Route on Map"
                description="See the route from your location to pickup point."
                color="from-purple-400 to-purple-600"
                imgSrc="/images/Paper map.gif"
                onClick={() => {
                  const origin = "Technopark Trivandrum";
                  const destination = "Kowdiar Trivandrum";
                  const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
                    origin
                  )}&destination=${encodeURIComponent(destination)}&travelmode=driving`;
                  window.open(mapsUrl, "_blank");
                }}
                data-aos="zoom-in"
                data-aos-delay="600"
              />
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen flex font-sans bg-gray-100 dark:bg-gray-900 transition-all">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-black text-black dark:text-white p-6 shadow-2xl rounded-r-3xl">
        <div className="flex items-center gap-4 mb-6">
          <img
            src={user?.profileImage || "https://i.pravatar.cc/100?u=ecowaste"}
            alt="Profile"
            className="w-14 h-14 rounded-full border-2 border-green-500"
          />
          <div>
            <h1 className="text-xl font-bold text-green-600 dark:text-green-400">🌱 EcoWaste</h1>
            <p className="text-sm font-medium">{storedFullName}</p>
          </div>
        </div>

        <nav className="space-y-3">
          <SidebarLink label="👤 My Profile" onClick={() => setActivePage("profile")} />
          <SidebarLink label="📝 Request Pickup" onClick={() => setActivePage("pickupRequest")} />
          <SidebarLink label="📜 Pickup History" onClick={() => setActivePage("pickupHistory")} />
          {user?.role === "admin" && <SidebarLink label="🛠️ Admin Panel" to="/admin" />}
          {user?.role === "collector" && <SidebarLink label="🚚 Collector Panel" to="/collector" />}
          <SidebarLink label="⚙️ Settings" onClick={() => setActivePage("settings")} />
          <button
            onClick={handleLogout}
            className="w-full text-left bg-red-600 hover:bg-red-700 dark:hover:bg-red-400 text-white dark:text-black rounded px-3 py-2 font-semibold transition"
          >
            🔴 Logout
          </button>

          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between mt-5">
            <span className="text-sm">🌙 Dark Mode</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only" checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
              <div className="w-11 h-6 bg-gray-300 dark:bg-gray-600 rounded-full" />
              <span className="absolute left-0.5 top-0.5 w-5 h-5 bg-white dark:bg-black rounded-full transition-all" />
            </label>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto transition-all duration-300">
        <h2 className="text-3xl font-bold text-green-600 dark:text-green-400 mb-6">
          👋 Hello, {storedFullName}!
        </h2>
        {renderActivePage()}

        {/* Footer */}
        <footer className="mt-10 text-center text-sm text-gray-500 dark:text-gray-400">
          © 2025 EcoWaste - Developed by Muhammad Hussain 🚮♻️
        </footer>
      </main>
    </div>
  );
};

const DashboardCard = ({ title, description, color, onClick, imgSrc, ...props }) => (
  <div
    onClick={onClick}
    className={`bg-gradient-to-br ${color} text-white rounded-3xl p-6 shadow-2xl hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden`}
    {...props}
  >
    {imgSrc && (
      <img
        src={imgSrc}
        alt={title}
        className="absolute right-3 bottom-3 w-24 h-24 opacity-30 pointer-events-none"
      />
    )}
    <div className="z-10 relative">
      <h3 className="text-2xl font-bold mb-2">{title}</h3>
      <p className="text-sm opacity-90">{description}</p>
    </div>
  </div>
);

const SidebarLink = ({ label, to, onClick }) => (
  <Link
    to={to || "#"}
    onClick={onClick}
    className="block px-4 py-2 rounded-lg hover:bg-green-100 dark:hover:bg-green-800 transition-all font-medium"
  >
    {label}
  </Link>
);

export default WasteManagementDashboard;
