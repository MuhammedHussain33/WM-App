import React, { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { Truck } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axiosInstance from "../api/axiosInstance";

const AdminDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetchRequests();
  }, []);

  // Fetch all pickup requests from the backend
  const fetchRequests = async () => {
    try {
      const response = await axiosInstance.get("/api/requests");
      setRequests(response.data);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  // Update the status of a request (Approve/Reject)
  const updateStatus = async (id, newStatus) => {
    try {
      const requestToUpdate = requests.find((req) => req.id === id);
      if (!requestToUpdate) return;

      const updatedReq = {
        ...requestToUpdate,
        status: newStatus,
      };

      // Update status on the backend
      await axiosInstance.put(`/api/requests/${id}`, updatedReq);

      // Refresh the request list after update
      fetchRequests();
    } catch (error) {
      console.error("Error updating request status:", error);
    }
  };

  // Count the number of requests by status
  const statusCounts = {
    All: requests.length,
    Pending: requests.filter((r) => r.status === "Pending").length,
    Approved: requests.filter((r) => r.status === "Approved").length,
    Rejected: requests.filter((r) => r.status === "Rejected").length,
  };

  // Filter requests based on selected filter (All, Pending, Approved, Rejected)
  const filteredRequests = requests.filter((req) =>
    filter === "All" ? true : req.status === filter
  );

  // Pie chart data for status distribution
  const COLORS = ["#facc15", "#22c55e", "#ef4444"];
  const chartData = [
    { name: "Pending", value: statusCounts.Pending },
    { name: "Approved", value: statusCounts.Approved },
    { name: "Rejected", value: statusCounts.Rejected },
  ];

  return (
    <AdminLayout>
      <div className="mb-6">
        <h2 className="text-4xl font-bold text-green-700 flex items-center gap-2">
          <Truck className="w-8 h-8" /> Pickup Requests 🚛
        </h2>
        <p className="text-gray-600 mt-1">
          Manage all waste pickup requests efficiently.
        </p>
      </div>

      {/* Filter buttons for status */}
      <div className="flex flex-wrap gap-4 mb-6">
        {"All,Pending,Approved,Rejected".split(",").map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-full border font-semibold transition ${
              filter === status
                ? "bg-green-600 text-white shadow"
                : "bg-white text-gray-800 border-green-400"
            }`}
          >
            {status === "All" && "📋"}
            {status === "Pending" && "⏳"}
            {status === "Approved" && "✅"}
            {status === "Rejected" && "❌"} {status} ({statusCounts[status]})
          </button>
        ))}
      </div>

      {/* Pie Chart */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold text-green-700 mb-4">
          📊 Pickup Stats
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Request List */}
      {filteredRequests.length === 0 ? (
        <p className="text-gray-500 italic">
          No {filter.toLowerCase()} requests found.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredRequests.map((req) => (
            <div
              key={req.id}
              className="bg-white shadow-md rounded-xl p-5 border-l-4 border-green-600 hover:shadow-xl transition"
            >
              <p className="text-lg font-bold mb-2">🄐 Request #{req.id}</p>
              <p>
                <span className="font-semibold">🗑️ Waste Type:</span> {req.type}
              </p>
              <p>
                <span className="font-semibold">📅 Date:</span> {req.date}
              </p>
              <p>
                <span className="font-semibold">📍 Address:</span> {req.address}
              </p>
              <p>
                <span className="font-semibold">📌 Status:</span>{" "}
                <span
                  className={`font-semibold ${
                    req.status === "Approved"
                      ? "text-green-700"
                      : req.status === "Rejected"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {req.status}
                </span>
              </p>
              {req.notes && (
                <p>
                  <span className="font-semibold">📝 Notes:</span> {req.notes}
                </p>
              )}
              {req.status === "Pending" && (
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => updateStatus(req.id, "Approved")}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                  >
                    ✅ Approve
                  </button>
                  <button
                    onClick={() => updateStatus(req.id, "Rejected")}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                  >
                    ❌ Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminDashboard;
