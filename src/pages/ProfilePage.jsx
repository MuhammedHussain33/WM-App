import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const ProfilePage = () => {
  const storedUser = JSON.parse(localStorage.getItem("ecoWasteUser"));
  const [user, setUser] = useState(storedUser);
  const [editing, setEditing] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [formData, setFormData] = useState({ ...storedUser });
  const [passwords, setPasswords] = useState({ current: "", newPass: "", confirm: "" });
  const [pickupCount, setPickupCount] = useState(0);

  useEffect(() => {
    const allRequests = JSON.parse(localStorage.getItem("pickupRequests")) || [];
    const count = allRequests.filter(r => r.email === storedUser.email).length;
    setPickupCount(count);
  }, [storedUser]);

  const handleEditToggle = () => {
    setEditing(!editing);
    setShowPasswordChange(false);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    const allUsers = JSON.parse(localStorage.getItem("ecoWasteUsersDB")) || [];
    const updatedUsers = allUsers.map(u =>
      u.email === user.email ? { ...u, ...formData } : u
    );

    localStorage.setItem("ecoWasteUsersDB", JSON.stringify(updatedUsers));
    localStorage.setItem("ecoWasteUser", JSON.stringify(formData));
    setUser(formData);
    setEditing(false);
  };

  const handlePasswordUpdate = () => {
    if (passwords.newPass !== passwords.confirm) {
      alert("New passwords do not match!");
      return;
    }

    const allUsers = JSON.parse(localStorage.getItem("ecoWasteUsersDB")) || [];
    const updatedUsers = allUsers.map(u =>
      u.email === user.email && u.password === passwords.current
        ? { ...u, password: passwords.newPass }
        : u
    );

    const isUpdated = updatedUsers.some(u => u.email === user.email && u.password === passwords.newPass);

    if (isUpdated) {
      localStorage.setItem("ecoWasteUsersDB", JSON.stringify(updatedUsers));
      alert("Password updated successfully.");
      setPasswords({ current: "", newPass: "", confirm: "" });
      setShowPasswordChange(false);
    } else {
      alert("Incorrect current password.");
    }
  };

  const statsData = [{ name: "Pickups", count: pickupCount }];

  if (!user) return <p className="p-6 text-red-500">No user found.</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-300 flex justify-center items-center py-10">
      <div className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-md transform hover:scale-105 transition duration-300">
        <div className="text-center">
          <img
            src="https://cdn-icons-png.flaticon.com/512/147/147144.png"
            alt="User Avatar"
            className="w-24 h-24 mx-auto rounded-full shadow-lg mb-4 border-4 border-green-200"
          />
          <h2 className="text-3xl font-bold text-green-800 mb-2">
            {user.fullName} 👋
          </h2>
          <p className="text-gray-500 capitalize">🌟 {user.role}</p>
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
                  type={field === "age" ? "number" : "text"}
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
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
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

        {/* Pickup Stats Chart */}
        <div className="mt-8">
          <h3 className="text-lg font-bold text-gray-800 text-center mb-2">📊 Your Pickup Stats</h3>
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
