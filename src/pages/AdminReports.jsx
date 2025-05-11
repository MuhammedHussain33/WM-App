import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import AdminLayout from "../components/AdminLayout";

const COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444"];

const AdminReports = () => {
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(""); // Error state for API call

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch users and requests from the backend API
        const usersResponse = await axios.get("/api/users");
        const requestsResponse = await axios.get("/api/requests");

        // Log the response to verify the structure
        console.log("Users Response:", usersResponse.data);
        console.log("Requests Response:", requestsResponse.data);

        // Ensure response data is an array
        setUsers(Array.isArray(usersResponse.data) ? usersResponse.data : []);
        setRequests(Array.isArray(requestsResponse.data) ? requestsResponse.data : []);
      } catch (error) {
        console.error("Error fetching data from backend:", error);
        setError("Error fetching data. Please try again later.");
      } finally {
        setLoading(false); // Set loading to false once the data is fetched
      }
    };

    fetchData();
  }, []);

  // Check for loading or error state
  if (loading) {
    return (
      <AdminLayout>
        <h2 className="text-3xl font-semibold mb-6 text-green-700">
          Reports & Analytics (Loading...)
        </h2>
        {/* Loading spinner */}
        <div className="text-center">Loading...</div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <h2 className="text-3xl font-semibold mb-6 text-green-700">
          Reports & Analytics
        </h2>
        <div className="text-center text-red-600">{error}</div>
      </AdminLayout>
    );
  }

  if (!users.length || !requests.length) {
    return (
      <AdminLayout>
        <h2 className="text-3xl font-semibold mb-6 text-green-700">
          Reports & Analytics
        </h2>
        <div className="text-center">No data available</div>
      </AdminLayout>
    );
  }

  // Prepare data for the charts
  const requestStatusData = [
    { name: "Pending", value: requests.filter((r) => r.status === "Pending").length },
    { name: "In Progress", value: requests.filter((r) => r.status === "In Progress").length },
    { name: "Completed", value: requests.filter((r) => r.status === "Completed").length },
  ];

  const roleData = ["Admin", "Collector", "Resident"].map((role) => ({
    name: role,
    value: users.filter((u) => (u.role || "Resident") === role).length,
  }));

  return (
    <AdminLayout>
      <h2 className="text-3xl font-semibold mb-6 text-green-700">Reports & Analytics</h2>

      {/* User statistics cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-gray-500">Total Users</p>
          <p className="text-2xl font-bold text-green-700">{users.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-gray-500">Pickup Requests</p>
          <p className="text-2xl font-bold text-green-700">{requests.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-gray-500">Collectors</p>
          <p className="text-2xl font-bold text-green-700">
            {users.filter((u) => u.role === "Collector").length}
          </p>
        </div>
      </div>

      {/* Charts for Request Status and User Roles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Request Status Bar Chart */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h4 className="text-lg font-semibold mb-4 text-gray-800">Pickup Request Status</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={requestStatusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* User Roles Pie Chart */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h4 className="text-lg font-semibold mb-4 text-gray-800">User Roles Distribution</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={roleData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
              >
                {roleData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminReports;
