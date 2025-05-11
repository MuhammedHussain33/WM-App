import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../api/axiosInstance"; // Import your axiosInstance

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const ProfilePage = () => {
  const { user: authUser, setUser } = useAuth();
  const [user, setUserState] = useState(null);
  const [formData, setFormData] = useState({});
  const [editing, setEditing] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwords, setPasswords] = useState({ current: "", newPass: "", confirm: "" });
  const [pickupCount, setPickupCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const userEmail = authUser?.email;

  useEffect(() => {
    if (userEmail) {
      axiosInstance
        .get(`/api/users/email/${userEmail}`)
        .then((res) => {
          setUserState(res.data);
          setFormData(res.data);
        })
        .catch((err) => {
          console.error("❌ Error fetching profile:", err);
          toast.error("❌ Error fetching user profile.");
        })
        .finally(() => setLoading(false));

      axiosInstance
        .get(`/api/pickups/count?email=${userEmail}`)
        .then((res) => setPickupCount(res.data))
        .catch((err) => console.error("❌ Pickup count error:", err));
    } else {
      setLoading(false);
    }
  }, [userEmail]);

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handlePasswordChange = (e) => setPasswords({ ...passwords, [e.target.name]: e.target.value });

  const handleEditToggle = () => {
    setEditing(!editing);
    setFormData(user); // Reset form
    setShowPasswordChange(false);
  };

  const handleSave = () => {
    setLoading(true); // Disable UI while saving
    axiosInstance
      .put(`/api/users/${user.id}`, formData)
      .then((res) => {
        setUserState(res.data);
        setUser(res.data);  // Update user in AuthContext
        sessionStorage.setItem("loggedInUser", JSON.stringify(res.data)); // Use sessionStorage
        toast.success("✅ Profile updated successfully!");
        setEditing(false);
      })
      .catch((err) => {
        console.error("❌ Profile update failed:", err);
        toast.error("❌ Failed to update profile.");
      })
      .finally(() => setLoading(false));
  };

  const handlePasswordUpdate = () => {
    if (passwords.newPass !== passwords.confirm) {
      toast.error("❌ Passwords do not match");
      return;
    }
    if (passwords.newPass.length < 6) {
      toast.error("❌ Password must be at least 6 characters.");
      return;
    }

    axiosInstance
      .post(`/api/users/change-password`, {
        email: user.email,
        currentPassword: passwords.current,
        newPassword: passwords.newPass,
      })
      .then(() => {
        toast.success("🔐 Password updated successfully!");
        setPasswords({ current: "", newPass: "", confirm: "" });
        setTimeout(() => setShowPasswordChange(false), 2000); // Auto-hide after success
      })
      .catch((err) => {
        console.error("❌ Password update error:", err);
        toast.error("❌ Incorrect current password.");
      });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-500"></div>
      </div>
    );
  }
  if (!user) return <p className="p-6 text-red-500">❌ No user found.</p>;

  const statsData = [{ name: "Pickups", count: pickupCount }];
  const defaultProfileImage = "https://cdn-icons-png.flaticon.com/512/147/147144.png";

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-300 flex justify-center items-center py-10">
      <ToastContainer />
      <div className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-md">
        <div className="text-center">
          <img
            src={user.image ? `data:image/png;base64,${user.image}` : defaultProfileImage}
            alt="User"
            className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-green-200 shadow-lg"
          />
          <h2 className="text-3xl font-bold text-green-800 mb-2">
            {user.fullName} 👋
          </h2>
          <p className="text-gray-500">{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</p>
        </div>

        <div className="mt-6 space-y-3">
          {["email", "phone", "age"].map((field) => (
            <div key={field}>
              <label className="block font-semibold text-gray-700">
                {field === "email" && "📧 Email:"}
                {field === "phone" && "📱 Phone:"}
                {field === "age" && "🎂 Age:"}
              </label>
              {editing ? (
                <input
                  type={field === "email" ? "email" : field === "age" ? "number" : "text"}
                  name={field}
                  value={formData[field]}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg p-2"
                />
              ) : (
                <p>{user[field]}</p>
              )}
            </div>
          ))}
        </div>

        {showPasswordChange && (
          <div className="mt-6 space-y-3">
            <h3 className="text-lg font-bold text-gray-700">🔐 Change Password</h3>
            <input
              type="password"
              name="current"
              placeholder="Current Password"
              value={passwords.current}
              onChange={handlePasswordChange}
              className="w-full border p-2 rounded"
            />
            <input
              type="password"
              name="newPass"
              placeholder="New Password"
              value={passwords.newPass}
              onChange={handlePasswordChange}
              className="w-full border p-2 rounded"
            />
            <input
              type="password"
              name="confirm"
              placeholder="Confirm New Password"
              value={passwords.confirm}
              onChange={handlePasswordChange}
              className="w-full border p-2 rounded"
            />
            <button
              onClick={handlePasswordUpdate}
              className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
            >
              ✅ Update Password
            </button>
          </div>
        )}

        <div className="mt-6 flex justify-between">
          {editing ? (
            <>
              <button
                onClick={handleSave}
                disabled={loading}
                className={`bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 ${loading && "opacity-50 cursor-not-allowed"}`}
              >
                💾 Save
              </button>
              <button
                onClick={handleEditToggle}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              >
                ❌ Cancel
              </button>
            </>
          ) : (
            <div className="w-full flex flex-col gap-3">
              <button
                onClick={handleEditToggle}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                ✏️ Edit Profile
              </button>
              <button
                onClick={() => setShowPasswordChange(!showPasswordChange)}
                className="w-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600"
              >
                🔐 Change Password
              </button>
            </div>
          )}
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-bold text-gray-800 text-center mb-2">
            📊 Your Pickup Stats
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={statsData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#16a34a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
