import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuth, AuthProvider } from "./context/AuthContext";
import PickupConfirmation from "./pages/PickupConfirmation";

// Lazy load all pages
const HomePage = lazy(() => import("./pages/HomePage"));
const Login = lazy(() => import("./pages/LoginPage"));
const LoginRegister = lazy(() => import("./pages/LoginRegister"));
const Signup = lazy(() => import("./pages/Signup"));
const WasteManagementDashboard = lazy(() => import("./pages/WasteManagementDashboard"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminUsers = lazy(() => import("./pages/AdminUsers"));
const AdminReports = lazy(() => import("./pages/AdminReports"));
const CollectorDashboard = lazy(() => import("./pages/CollectorDashboard"));
const CollectorManagePickups = lazy(() => import("./pages/CollectorManagePickups"));
const ResidentDashboard = lazy(() => import("./pages/ResidentDashboard"));
const PickupForm = lazy(() => import("./pages/PickupForm"));
const PickupHistory = lazy(() => import("./pages/PickupHistory"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));

const NotFound = () => (
  <h2 className="text-center mt-20 text-2xl">404 - Page Not Found</h2>
);

// 🔐 Protected Route
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="text-center mt-20">Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={<div className="text-center mt-20">Loading...</div>}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
            <Route path="/register" element={<LoginRegister />} />
            <Route path="/login/admin" element={<Login role="admin" />} />
            <Route path="/login/resident" element={<Login role="resident" />} />
            <Route path="/login/collector" element={<Login role="collector" />} />
            <Route path="/pickup/confirm" element={<PickupConfirmation />} />


            {/* Protected Routes */}
            <Route path="/dashboard" element={<PrivateRoute><WasteManagementDashboard /></PrivateRoute>} />
            <Route path="/admin" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
            <Route path="/admin-users" element={<PrivateRoute><AdminUsers /></PrivateRoute>} />
            <Route path="/admin-reports" element={<PrivateRoute><AdminReports /></PrivateRoute>} />
            <Route path="/collector" element={<PrivateRoute><CollectorDashboard /></PrivateRoute>} />
            <Route path="/collector/manage-pickups" element={<PrivateRoute><CollectorManagePickups /></PrivateRoute>} />
            <Route path="/resident-dashboard" element={<PrivateRoute><ResidentDashboard /></PrivateRoute>} />
            <Route path="/pickup-request" element={<PrivateRoute><PickupForm /></PrivateRoute>} />
            <Route path="/pickup-history" element={<PrivateRoute><PickupHistory /></PrivateRoute>} />

            {/* Catch-all for 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Router>
      <Toaster position="top-right" />
    </AuthProvider>
  );
};

export default App;