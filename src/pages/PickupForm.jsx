import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import Loader from "../components/Loader";
import Notification from "../components/Notification";

const PickupForm = () => {
  const [formData, setFormData] = useState({
    address: "",
    type: "",
    weight: "",
    date: "",
    notes: "",
  });

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [error, setError] = useState("");
  const [price, setPrice] = useState(0);
  const [paid, setPaid] = useState(false);

  const pricingTable = {
    Plastic: 30,
    Organic: 20,
    Electronic: 50,
    Other: 40,
  };

  useEffect(() => {
    const loggedInUser = JSON.parse(sessionStorage.getItem("ecoWasteUser"));
    if (loggedInUser) {
      setUser(loggedInUser);
      setFormData((prev) => ({
        ...prev,
        address: loggedInUser.address || "",
      }));
    }
  }, []);

  useEffect(() => {
    if (formData.type && formData.weight) {
      const unitPrice = pricingTable[formData.type] || 0;
      const total = unitPrice * parseFloat(formData.weight);
      setPrice(isNaN(total) ? 0 : total.toFixed(2));
    } else {
      setPrice(0);
    }
  }, [formData.type, formData.weight]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const validateForm = () => {
    const today = new Date().toISOString().split("T")[0];

    if (formData.address.trim().length < 5) {
      setError("Address must be at least 5 characters.");
      return false;
    }
    if (!formData.type) {
      setError("Please select a waste type.");
      return false;
    }
    if (!formData.weight || isNaN(formData.weight) || formData.weight <= 0) {
      setError("Please enter a valid weight in kg.");
      return false;
    }
    if (!formData.date || formData.date < today) {
      setError("Pickup date cannot be in the past.");
      return false;
    }
    setError("");
    return true;
  };

  const handlePayment = () => {
    if (!validateForm()) return;

    setPaid(true);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm() || !user || !paid) {
      setError("Please complete payment before submitting.");
      return;
    }

    setLoading(true);

    const pickupRequest = {
      userId: user.id,
      userName: user.fullName,
      userEmail: user.email,
      address: formData.address,
      type: formData.type,
      weight: formData.weight,
      date: formData.date,
      notes: formData.notes,
      amountPaid: price,
    };

    try {
      const res = await axiosInstance.post("/api/requests", pickupRequest);
      console.log("Pickup Created:", res.data);

      setFormData({ address: user.address || "", type: "", weight: "", date: "", notes: "" });
      setPaid(false);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    } catch (err) {
      console.error("Pickup request failed:", err);
      setError("Failed to submit pickup request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg mt-8 max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-green-700">Request Pickup</h2>

      {showNotification && (
        <Notification
          message={paid ? "Payment successful!" : "Pickup request submitted!"}
          type="success"
          onClose={() => setShowNotification(false)}
        />
      )}

      {loading ? (
        <Loader />
      ) : !user ? (
        <p className="text-red-500 text-center">Loading user info...</p>
      ) : (
        <form className="space-y-4" onSubmit={handleSubmit}>
          {error && <div className="text-red-600 bg-red-100 p-2 rounded">{error}</div>}

          <div>
            <label className="block font-medium">Pickup Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-2"
            />
          </div>

          <div>
            <label className="block font-medium">Waste Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-2"
            >
              <option value="">Select Type</option>
              {Object.keys(pricingTable).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium">Waste Weight (kg)</label>
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              min="0.1"
              step="0.1"
              required
              className="w-full border rounded-lg p-2"
            />
          </div>

          <div>
            <label className="block font-medium">Pickup Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-2"
            />
          </div>

          <div>
            <label className="block font-medium">Additional Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
              rows="3"
            ></textarea>
          </div>

          {formData.type && formData.weight && (
            <div className="text-lg font-semibold text-green-800">
              💰 Price: ₹{pricingTable[formData.type]} x {formData.weight}kg = ₹{price}
            </div>
          )}

          {!paid && formData.type && formData.weight && (
            <button
              type="button"
              onClick={handlePayment}
              className="w-full bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition duration-300"
            >
              Proceed to Pay ₹{price}
            </button>
          )}

          <button
            type="submit"
            disabled={!paid}
            className={`w-full ${
              paid ? "bg-green-700 hover:bg-green-800" : "bg-gray-400 cursor-not-allowed"
            } text-white py-2 rounded-lg transition duration-300`}
          >
            Submit Request
          </button>
        </form>
      )}
    </div>
  );
};

export default PickupForm;
