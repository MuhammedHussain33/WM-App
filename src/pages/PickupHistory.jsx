import React, { useEffect, useState } from "react";
import UserLayout from "../components/UserLayout";

const PickupHistory = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("ecoWasteUser"));
    const allRequests = JSON.parse(localStorage.getItem("pickupRequests")) || [];

    if (user) {
      const userRequests = allRequests.filter((req) => req.userEmail === user.email);
      setHistory(userRequests);
    }
  }, []);

  return (
    <UserLayout>
      <div className="max-w-4xl mx-auto mt-8 p-4">
        <h2 className="text-2xl font-semibold text-green-700 mb-6">Pickup Request History</h2>

        {history.length === 0 ? (
          <p className="text-gray-600">No pickup requests found.</p>
        ) : (
          <div className="space-y-6">
            {history.map((req) => (
              <div
                key={req.id}
                className="bg-white shadow rounded-xl p-4 border-l-4 border-green-500"
              >
                <div className="flex justify-between items-center">
                  <h4 className="text-lg font-bold">{req.address}</h4>
                  <span
                    className={`text-sm px-3 py-1 rounded-full ${
                      req.assignedTo
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {req.assignedTo ? "Assigned" : "Pending"}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mt-1">Type: {req.type}</p>
                <p className="text-sm text-gray-600">Date: {req.date}</p>
                {req.notes && <p className="text-sm text-gray-500">Notes: {req.notes}</p>}

                <div className="mt-3">
                  <p className="text-sm text-gray-800">
                    <span className="font-medium">Collector:</span>{" "}
                    {req.assignedTo ? req.assignedTo : "Not assigned yet"}
                  </p>
                  <p className="text-sm text-gray-800">
                    <span className="font-medium">Status:</span> {req.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </UserLayout>
  );
};

export default PickupHistory;
