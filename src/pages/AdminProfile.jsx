import React, { useEffect, useState } from "react";

const AdminProfile = () => {
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("ecoWasteCurrentUser"));
    setAdmin(currentUser);
  }, []);

  return (
    <div className="bg-white rounded-xl shadow p-6 max-w-lg">
      <h2 className="text-2xl font-semibold mb-4 text-green-700">Admin Profile</h2>
      {admin ? (
        <div className="flex gap-6 items-center">
          <img
            src={admin.imageUrl || `https://i.pravatar.cc/100?u=${admin.email}`}
            alt="Profile"
            className="w-24 h-24 rounded-full border"
          />
          <div>
            <p className="text-lg font-medium">{admin.fullName}</p>
            <p className="text-sm text-gray-600">{admin.email}</p>
            <p className="text-sm"><span className="font-medium">Role:</span> {admin.role}</p>
            <p className="text-sm"><span className="font-medium">Phone:</span> {admin.phone}</p>
            <p className="text-sm"><span className="font-medium">Age:</span> {admin.age}</p>
          </div>
        </div>
      ) : (
        <p className="text-gray-500">Loading profile...</p>
      )}
    </div>
  );
};

export default AdminProfile;
