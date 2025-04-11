import React, { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";

const AdminPickupAssign = () => {
  const [requests, setRequests] = useState([]);
  const [collectors, setCollectors] = useState([]);

  useEffect(() => {
    const allRequests = JSON.parse(localStorage.getItem("pickupRequests")) || [];
    const allUsers = JSON.parse(localStorage.getItem("ecoWasteUsersDB")) || [];

    // Ensure each request has an ID
    const requestsWithId = allRequests.map((req, index) => ({
      id: req.id || index + 1,
      ...req,
    }));

    const unassigned = requestsWithId.filter((r) => !r.assignedTo);
    const collectorUsers = allUsers.filter((u) => u.role === "collector");

    setRequests(unassigned);
    setCollectors(collectorUsers);
  }, []);

  const assignCollector = (requestId, collectorEmail) => {
    const allRequests = JSON.parse(localStorage.getItem("pickupRequests")) || [];

    const updatedRequests = allRequests.map((r) =>
      (r.id || allRequests.indexOf(r) + 1) === requestId
        ? { ...r, assignedTo: collectorEmail }
        : r
    );

    localStorage.setItem("pickupRequests", JSON.stringify(updatedRequests));

    const unassigned = updatedRequests.filter((r) => !r.assignedTo);
    setRequests(unassigned);
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
                  onChange={(e) => assignCollector(req.id, e.target.value)}
                  className="w-full border border-gray-300 rounded p-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">-- Select Collector --</option>
                  {collectors.map((collector) => (
                    <option key={collector.email} value={collector.email}>
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
