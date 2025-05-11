import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import UserLayout from "../components/UserLayout";
import { toast } from "react-toastify";

const PickupHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserHistory();
  }, []);

  const fetchUserHistory = async () => {
    try {
      const user = JSON.parse(sessionStorage.getItem("ecoWasteUser"));
      if (!user || !user.email) {
        toast.error("User not logged in.");
        setLoading(false);
        return;
      }

      const { data } = await axiosInstance.get(`/api/requests/user/by-email`, {
        params: { email: user.email } // ✅ sending email as a param
      });
      console.log("Fetched history:", data);

      if (Array.isArray(data)) {
        setHistory(data);
      } else {
        setHistory([]);
        toast.error("Unexpected response format!");
      }
    } catch (error) {
      console.error("Failed to fetch pickup history:", error);
      toast.error("Failed to load history!");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Assigned":
        return "bg-blue-100 text-blue-700";
      case "Completed":
        return "bg-green-100 text-green-700";
      case "Rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <UserLayout>
      <div className="max-w-5xl mx-auto mt-10 p-4">
        <h2 className="text-3xl font-bold text-green-700 mb-8 text-center">
          Pickup Request History
        </h2>

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-green-500 border-t-transparent"></div>
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-lg">No pickup requests found yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {history.map((req) => (
              <div
                key={req.id}
                className="bg-white shadow-md rounded-2xl p-5 border-l-4 border-green-500 hover:shadow-lg transition duration-300"
              >
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-xl font-semibold text-gray-800 truncate">
                    {req.address}
                  </h4>
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-semibold ${getStatusBadge(req.status)}`}
                  >
                    {req.status}
                  </span>
                </div>

                <div className="text-gray-600 text-sm space-y-1">
                  <p><span className="font-medium">Type:</span> {req.type}</p>
                  <p><span className="font-medium">Date:</span> {formatDate(req.date)}</p>
                  {req.notes && <p><span className="font-medium">Notes:</span> {req.notes}</p>}
                </div>

                <div className="mt-3 text-gray-700 text-sm">
                  <p>
                    <span className="font-semibold">Collector:</span>{" "}
                    {req.assignedCollector ? req.assignedCollector : "Not assigned yet"}
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
