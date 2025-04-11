import React, { useEffect, useState } from "react";

const ResidentDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedIn = JSON.parse(localStorage.getItem("loggedInUser"));
    const allRequests = JSON.parse(localStorage.getItem("pickupRequests")) || [];
    const userRequests = allRequests.filter((r) => r.email === loggedIn?.email);

    setUser(loggedIn);
    setRequests(userRequests);
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h2 className="text-3xl font-semibold text-green-700 mb-4">
        Welcome, {user?.fullname || "Resident"}
      </h2>
      <p className="text-gray-600 mb-6">Your pickup request history:</p>

      {requests.length === 0 ? (
        <p className="text-gray-500">
          You haven’t submitted any pickup requests yet.
        </p>
      ) : (
        <div className="grid gap-4">
          {requests.map((req) => (
            <div
              key={req.id}
              className="bg-white p-4 shadow rounded-lg border-l-4 border-green-500"
            >
              <h4 className="text-lg font-semibold text-gray-800">{req.type} Waste</h4>
              <p className="text-sm text-gray-600">Date: {req.date}</p>
              <p className="text-sm text-gray-600">Address: {req.address}</p>
              <p className="text-sm">
                Status:{" "}
                <span
                  className={`inline-block px-2 py-0.5 text-xs rounded-full font-medium ${
                    req.status === "Completed"
                      ? "bg-green-100 text-green-700"
                      : req.status === "In Progress"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {req.status}
                </span>
              </p>
              {req.assignedTo && (
                <p className="text-sm text-gray-500 mt-1">
                  Assigned Collector: {req.assignedTo}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResidentDashboard;