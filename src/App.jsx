import React, { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AdminUsers from "./pages/AdminUsers";
import AdminReports from "./pages/AdminReports";
import ResidentDashboard from "./pages/ResidentDashboard";
import HomePage from "./pages/HomePage";
import CollectorManagePickups from "./pages/CollectorManagePickups";

// Lazy load pages
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const WasteManagementDashboard = lazy(() =>
  import("./pages/WasteManagementDashboard")
);
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const CollectorDashboard = lazy(() => import("./pages/CollectorDashboard"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const PickupForm = lazy(() => import("./pages/PickupForm"));
const PickupHistory = lazy(() => import("./pages/PickupHistory"));

const NotFound = () => (
  <h2 className="text-center mt-20 text-2xl">404 - Page Not Found</h2>
);

// Protected Route
const PrivateRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("ecoWasteUser"));
  return user ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <Router>
      <Suspense fallback={<div className="text-center mt-20">Loading...</div>}>
        <Routes>
        <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/admin-users" element={<AdminUsers />} />
          <Route path="/admin-reports" element={<AdminReports />} />
          <Route path="/resident-dashboard" element={<ResidentDashboard />} />
          <Route path="/login/admin" element={<Login role="admin" />} />
          <Route path="/login/resident" element={<Login role="resident" />} />
          <Route path="/login/collector" element={<Login role="collector" />} />
          <Route path="/pickup-form" element={<PickupForm/>} />
          <Route path="/pickup-history" element={<PickupHistory />} />
          <Route path="/user-profile" element={<ProfilePage />} />


          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <AdminDashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/collector"
            element={
              <PrivateRoute>
                <CollectorDashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <WasteManagementDashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />

          <Route
            path="/pickup-request"
            element={
              <PrivateRoute>
                <PickupForm />
              </PrivateRoute>
            }
          />

          <Route
            path="/pickup-history"
            element={
              <PrivateRoute>
                <PickupHistory />
              </PrivateRoute>
            }
          />

<Route
  path="/collector/manage-pickups"
  element={
    <PrivateRoute>
      <CollectorManagePickups />
    </PrivateRoute>
  }
/>


          {/* Removed duplicate AdminDashboard route */}
          {/* 404 Page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;

