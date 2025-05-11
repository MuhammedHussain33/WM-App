import React, { useEffect, useState } from "react";
import axios from "../axiosInstance";
import CollectorLayout from "../components/CollectorLayout";

const CollectorManagePickups = () => {
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Safe parsing of sessionStorage
  const storedUser = sessionStorage.getItem("ecoWasteUser");
  const collector = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    if (!collector || !collector.email) {
      setError("Collector is not logged in.");
      setLoading(false);
      return;
    }

    axios
      .get(`/requests/collector/${collector.email}`)
      .then((response) => {
        setPickups(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch pickup requests", err);
        setError("Failed to fetch pickup requests.");
        setLoading(false);
      });
  }, [collector]);

  const updateStatus = (id, newStatus) => {
    const request = pickups.find((req) => req.id === id);
    if (!request) {
      setError("Request not found.");
      return;
    }

    const updatedRequest = {
      status: newStatus,
      assignedCollector: collector?.email,
      notes: request?.notes || "",
    };

    axios
      .put(`/requests/${id}`, updatedRequest)
      .then(() => {
        setPickups((prev) =>
          prev.map((req) =>
            req.id === id ? { ...req, status: newStatus } : req
          )
        );
      })
      .catch((err) => {
        console.error("Failed to update status", err);
        setError("Failed to update the status.");
      });
  };

  if (loading) return <div className="text-blue-600">Loading pickups...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <CollectorLayout>
      <h2 className="text-2xl font-bold text-green-700 mb-4">
        Manage Assigned Pickups
      </h2>

      {pickups.length === 0 ? (
        <p className="text-gray-600">No pickups assigned.</p>
      ) : (
        <div className="space-y-4">
          {pickups.map((req) => (
            <div
              key={req.id}
              className={`bg-white p-4 rounded shadow-md border-l-4 transition duration-200 ${
                req.status === "Completed"
                  ? "border-green-600"
                  : req.status === "Rejected"
                  ? "border-red-600"
                  : "border-yellow-500"
              }`}
            >
              <p className="mb-1">
                <strong>Pickup ID:</strong> #{req.id}
              </p>
              <p className="mb-1">
                <strong>Address:</strong> {req.address}
              </p>
              <p className="mb-1">
                <strong>Type:</strong> {req.type}
              </p>
              <p className="mb-1">
                <strong>Date:</strong> {req.date}
              </p>
              <p className="mb-1">
                <strong>Status:</strong>{" "}
                <span className="font-semibold">{req.status}</span>
              </p>
              <p className="mb-3">
                <strong>Notes:</strong> {req.notes || "None"}
              </p>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Update Status:
                </label>
                <select
                  value={req.status}
                  onChange={(e) => updateStatus(req.id, e.target.value)}
                  className="border border-gray-300 p-2 rounded w-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
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
