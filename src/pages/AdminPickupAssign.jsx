import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance"; // <-- updated import
import AdminLayout from "../components/AdminLayout";

const AdminPickupAssign = () => {
  const [requests, setRequests] = useState([]);
  const [collectors, setCollectors] = useState([]);

  useEffect(() => {
    fetchUnassignedRequests();
    fetchCollectors();
  }, []);

  const fetchUnassignedRequests = async () => {
    try {
      const res = await axiosInstance.get("/api/requests/unassigned");
      setRequests(res.data);
    } catch (err) {
      console.error("Error fetching pickup requests:", err);
    }
  };

  const fetchCollectors = async () => {
    try {
      const res = await axiosInstance.get("/api/users/collectors");
      setCollectors(res.data);
    } catch (err) {
      console.error("Error fetching collectors:", err);
    }
  };

  const assignCollector = async (requestId, collectorEmail) => {
    if (!collectorEmail) return;

    try {
      const res = await axiosInstance.put(`/api/requests/${requestId}`, {
        assignedCollector: collectorEmail,
        status: "Assigned",
        notes: "Assigned by Admin",
      });
      console.log("Assignment response:", res.data);
      fetchUnassignedRequests(); // Refresh list
    } catch (err) {
      console.error("Error assigning collector:", err);
    }
  };

  return (
    <AdminLayout>
      <h2 className="text-3xl font-semibold text-green-700 mb-6">
        Assign Pickups to Collectors
      </h2>

      {requests.length === 0 ? (
        <p className="text-gray-600">All pickup requests are assigned.</p>
      ) : (
        <div className="grid gap-6">
          {requests.map((req) => (
            <div
              key={req.id}
              className="bg-white p-4 rounded-xl shadow border-l-4 border-green-600"
            >
              <h4 className="text-lg font-semibold">{req.name}</h4>
              <p className="text-sm text-gray-600">Address: {req.address}</p>
              <p className="text-sm text-gray-600">Type: {req.type}</p>
              <p className="text-sm text-gray-600">Date: {req.date}</p>

              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assign Collector
                </label>
                <select
                  defaultValue=""
                  onChange={(e) => assignCollector(req.id, e.target.value)}
                  className="w-full border border-gray-300 rounded p-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">-- Select Collector --</option>
                  {collectors.map((collector) => (
                    <option key={collector.id} value={collector.email}>
                      {collector.fullname || collector.email}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminPickupAssign;
