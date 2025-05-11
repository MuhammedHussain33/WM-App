import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const COLORS = ["#4ade80", "#facc15", "#f87171"]; // Green, Yellow, Red

const CollectorDashboard = () => {
  const [stats, setStats] = useState(null);
  const [collector, setCollector] = useState(null);
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const requestsPerPage = 4;
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("ecoWasteUser"));
    setCollector(user);

    if (user?.email) {
      axiosInstance.get(`/api/requests/collector/${user.email}`)
        .then(res => {
          setRequests(res.data);
          setFilteredRequests(res.data);
        })
        .catch(err => console.error("Request fetch error:", err));

      axiosInstance.get(`/api/requests/collector/stats/${user.email}`)
        .then(res => setStats(res.data))
        .catch(err => console.error("Stats fetch error:", err));
    }
  }, []);

  const updateStatus = async (requestId, newStatus) => {
    try {
      const response = await axiosInstance.put(`/api/requests/update-status/${requestId}`, { status: newStatus });

      if (response.status === 200) {
        const updatedList = requests.map(req =>
          req.id === requestId ? { ...req, status: newStatus } : req
        );
        setRequests(updatedList);
        setFilteredRequests(updatedList);
        toast.success(`Marked as ${newStatus}`);
      } else {
        toast.error("Failed to update status.");
      }
    } catch (error) {
      console.error("Status update failed:", error);
      toast.error("Status update failed!");
    }
  };

  const chartData = stats
    ? [
        { name: "Completed", value: stats.completed },
        { name: "Pending", value: stats.pending },
      ]
    : [];

  const indexOfLast = currentPage * requestsPerPage;
  const indexOfFirst = indexOfLast - requestsPerPage;
  const currentRequests = filteredRequests.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredRequests.length / requestsPerPage);

  const handleLogout = () => {
    sessionStorage.removeItem("ecoWasteUser");
    navigate("/login");
  };

  return (
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"} transition-colors duration-300 p-6 min-h-screen`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-green-600">Collector Dashboard</h1>
        <div className="space-x-2">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600"
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
          <button
            onClick={handleLogout}
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Collector Info */}
      {collector && (
        <motion.div
          className="mb-6 p-4 rounded-xl bg-white dark:bg-gray-800 shadow flex items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <img src={`https://ui-avatars.com/api/?name=${collector.name}`} className="w-12 h-12 rounded-full" alt="Avatar" />
          <div>
            <h3 className="text-lg font-bold">{collector.name}</h3>
            <p className="text-sm text-gray-500">{collector.email}</p>
          </div>
        </motion.div>
      )}

      {/* Chart */}
      {stats && (
        <div className="bg-white dark:bg-gray-800 shadow p-4 rounded-xl mb-6">
          <h2 className="text-lg font-semibold mb-2">Pickup Stats</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Search */}
      <input
        type="text"
        placeholder="Search by name or address..."
        className="border px-4 py-2 rounded mb-4 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
        onChange={(e) => {
          const value = e.target.value.toLowerCase();
          const filtered = requests.filter(req =>
            req.name.toLowerCase().includes(value) ||
            req.address.toLowerCase().includes(value)
          );
          setFilteredRequests(filtered);
          setCurrentPage(1);
        }}
      />

      {/* Pickup Cards */}
      {currentRequests.length === 0 ? (
        <p className="text-center text-gray-500">No assigned pickups found.</p>
      ) : (
        <div className="grid gap-4">
          {currentRequests.map((req) => (
            <motion.div
              key={req.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 border-l-4 border-green-500"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h4 className="text-lg font-semibold">{req.name}</h4>
              <p className="text-sm">{req.address}</p>
              <p className="text-sm">Date: {req.date}</p>
              <p className="text-sm">Waste Type: {req.type}</p>
              <p className="text-sm">
                Status:{" "}
                <span className={`inline-block px-2 py-0.5 text-xs rounded-full font-medium ${
                  req.status === "Completed" ? "bg-green-100 text-green-700" :
                  req.status === "In Progress" ? "bg-yellow-100 text-yellow-700" :
                  "bg-red-100 text-red-700"
                }`}>
                  {req.status}
                </span>
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {req.status !== "Completed" && (
                  <>
                    <button
                      onClick={() => updateStatus(req.id, "In Progress")}
                      className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
                    >
                      In Progress
                    </button>
                    <button
                      onClick={() => updateStatus(req.id, "Completed")}
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                    >
                      Completed
                    </button>
                  </>
                )}
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(req.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                >
                  View Map
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="mt-6 flex justify-center gap-2 flex-wrap">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === i + 1 ? "bg-green-600 text-white" : "bg-gray-300 hover:bg-gray-400"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CollectorDashboard;
