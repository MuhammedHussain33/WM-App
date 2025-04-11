import React, { useEffect, useState } from "react";
import CollectorLayout from "../components/CollectorLayout";

const CollectorManagePickups = () => {
  const [pickups, setPickups] = useState([]);
  const collector = JSON.parse(localStorage.getItem("ecoWasteUser"));

  useEffect(() => {
    const allRequests = JSON.parse(localStorage.getItem("pickupRequests")) || [];
    const assigned = allRequests.filter(
      (req) => req.assignedTo === collector.email
    );
    setPickups(assigned);
  }, []);

  const updateStatus = (id, newStatus) => {
    const updatedRequests = pickups.map((req) =>
      req.id === id ? { ...req, status: newStatus } : req
    );
    setPickups(updatedRequests);
    localStorage.setItem("pickupRequests", JSON.stringify(updatedRequests));
  };

  return (
    <CollectorLayout>
      <h2 className="text-2xl font-bold text-green-700 mb-4">Manage Assigned Pickups</h2>

      {pickups.length === 0 ? (
        <p className="text-gray-600">No pickups assigned.</p>
      ) : (
        <div className="space-y-4">
          {pickups.map((req) => (
            <div key={req.id} className="bg-white p-4 rounded shadow border-l-4 border-green-600">
              <p><strong>User:</strong> {req.userName}</p>
              <p><strong>Address:</strong> {req.address}</p>
              <p><strong>Type:</strong> {req.type}</p>
              <p><strong>Date:</strong> {req.date}</p>
              <p><strong>Status:</strong> <span className="font-semibold">{req.status}</span></p>

              <div className="mt-2">
                <label className="block text-sm font-medium mb-1">Update Status:</label>
                <select
                  value={req.status}
                  onChange={(e) => updateStatus(req.id, e.target.value)}
                  className="border p-2 rounded w-full"
                >
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </CollectorLayout>
  );
};

export default CollectorManagePickups;
