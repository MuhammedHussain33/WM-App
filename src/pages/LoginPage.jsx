import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import api from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [detectedRole, setDetectedRole] = useState(null);

  const navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
    const userInSession = sessionStorage.getItem("ecoWasteUser");
    if (userInSession) {
      const { role } = JSON.parse(userInSession);
      if (role === "admin") navigate("/admin");
      else if (role === "collector") navigate("/collector");
      else navigate("/dashboard");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/api/users/login", { email, password });
      const user = res.data;

      if (user?.role) {
        setUser(user);
        sessionStorage.setItem("ecoWasteUser", JSON.stringify(user));
        setDetectedRole(user.role);

        toast.success(`Welcome ${user.fullName || user.role}! Redirecting...`);
        setTimeout(() => {
          if (user.role === "admin") navigate("/admin");
          else if (user.role === "collector") navigate("/collector");
          else navigate("/dashboard");
        }, 1500);
      } else {
        toast.error("User role not found.");
      }
    } catch (err) {
      toast.error("Invalid email or password!");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-100 px-4">
      <Toaster />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: -50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center text-green-700 mb-1">
          Login to EcoWaste
        </h2>
        <p className="text-center text-sm text-gray-500 mb-4">
          Enter your credentials to continue
        </p>

        {detectedRole && (
          <p className="text-center text-sm text-green-600 font-medium mb-3">
            🎉 Role Detected:{" "}
            <span className="capitalize text-green-700">{detectedRole}</span>
          </p>
        )}

        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="block text-sm font-semibold mb-1">Email</label>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg p-2 pr-10 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg font-medium text-white transition duration-300 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-700 hover:bg-green-800"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="text-center text-sm mt-4 text-gray-600">
          Don’t have an account?{" "}
          <a href="/register" className="text-green-700 font-semibold">
            Sign up
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
