import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import Notification from "../components/Notification";
import Loader from "../components/Loader";

const pricingMap = {
  Plastic: 30,
  Organic: 20,
  Electronic: 50,
  Other: 25,
};

const PickupConfirmation = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [showNotification, setShowNotification] = React.useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.post("/api/requests", state);
      console.log("Pickup confirmed:", res.data);
      setShowNotification(true);
      setTimeout(() => {
        navigate("/dashboard"); // Redirect after confirmation
      }, 3000);
    } catch (err) {
      console.error("Error submitting final request:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!state) {
    return <p className="text-red-500 text-center mt-8">No data to confirm.</p>;
  }

  const cost = pricingMap[state.type] || 20;

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg mt-10 max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-green-700">Confirm Pickup Request</h2>

      {showNotification && (
        <Notification
          message="Pickup request confirmed successfully!"
          type="success"
          onClose={() => setShowNotification(false)}
        />
      )}

      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="space-y-2 mb-4">
            <p><strong>Address:</strong> {state.address}</p>
            <p><strong>Waste Type:</strong> {state.type}</p>
            <p><strong>Date:</strong> {state.date}</p>
            <p><strong>Notes:</strong> {state.notes || "N/A"}</p>
            <p className="text-lg mt-3">
              💵 <strong>Total Cost:</strong> ₹{cost}
            </p>
          </div>

          <button
            onClick={handleConfirm}
            className="w-full bg-green-700 text-white py-2 rounded-lg hover:bg-green-800 transition duration-300"
          >
            Confirm & Submit
          </button>
        </>
      )}
    </div>
  );
};

export default PickupConfirmation;
