import React, { useState } from "react";
import Loader from "../components/Loader";
import Notification from "../components/Notification";

const PickupForm = () => {
  const [formData, setFormData] = useState({
    address: "",
    type: "",
    date: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const today = new Date().toISOString().split("T")[0];

    if (formData.address.length < 5) {
      alert("Address must be at least 5 characters long.");
      return false;
    }

    if (!formData.type) {
      alert("Please select a waste type.");
      return false;
    }

    if (formData.date < today) {
      alert("Pickup date cannot be in the past.");
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    const user = JSON.parse(localStorage.getItem("ecoWasteUser"));
    if (!user) {
      alert("User not found. Please login again.");
      setLoading(false);
      return;
    }

    setTimeout(() => {
      const newRequest = {
        id: Date.now(),
        userId: user.id,
        userName: user.fullName || user.name,
        userEmail: user.email,
        address: formData.address,
        type: formData.type,
        date: formData.date,
        notes: formData.notes,
        createdAt: new Date().toISOString(),
        status: "Pending",
        assignedTo: null,
      };

      const existingRequests =
        JSON.parse(localStorage.getItem("pickupRequests")) || [];
      localStorage.setItem(
        "pickupRequests",
        JSON.stringify([...existingRequests, newRequest])
      );

      // Simulate email notification (can add real integration later)
      console.log(
        `Confirmation email sent to ${user.email} for pickup request on ${formData.date}`
      );
      alert(`Confirmation email sent to ${user.email}`);

      setFormData({ address: "", type: "", date: "", notes: "" });
      setLoading(false);
      setShowNotification(true);

      // Optionally play sound / animation here
      setTimeout(() => setShowNotification(false), 3000);
    }, 1500);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg mt-8 max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-green-700">
        Request Pickup
      </h2>

      {showNotification && (
        <Notification
          message="Pickup request submitted successfully!"
          type="success"
          onClose={() => setShowNotification(false)}
        />
      )}

      {loading ? (
        <Loader />
      ) : (
        <form className="space-y-4" onSubmit={handleSubmit}>
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
              <option value="Plastic">Plastic</option>
              <option value="Organic">Organic</option>
              <option value="Electronic">Electronic</option>
              <option value="Other">Other</option>
            </select>
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
          <button
            type="submit"
            className="w-full bg-green-700 text-white py-2 rounded-lg hover:bg-green-800"
          >
            Submit Request
          </button>
        </form>
      )}
    </div>
  );
};

export default PickupForm;
