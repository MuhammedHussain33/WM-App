import React from "react";
import { Link, useNavigate } from "react-router-dom";

const CollectorLayout = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("ecoWasteUser");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-green-800 text-white shadow p-4 flex justify-between items-center">
        <div className="text-xl font-bold">EcoWaste | Collector Panel</div>
        <nav className="flex items-center space-x-6">
          <Link to="/collector-dashboard" className="hover:underline">
            Dashboard
          </Link>

          <Route
            path="/collector/manage-pickups"
            element={
              <PrivateRoute>
                <CollectorManagePickups />
              </PrivateRoute>
            }
          />

          <button
            onClick={handleLogout}
            className="bg-white text-green-700 px-3 py-1 rounded hover:bg-gray-100"
          >
            Logout
          </button>
        </nav>
      </header>

      <main className="p-6">{children}</main>
    </div>
  );
};

export default CollectorLayout;
