import React, { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const AdminLogin = () => {
  const { api, setToken, navigate } = useAppContext();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Login Handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    try {
      // Login API
      const { data } = await api.post("/api/user/login", {
        email,
        password,
      });

      if (!data.success) {
        toast.error(data.message);
        return;
      }

      // Save token (interceptor will handle headers)
      localStorage.setItem("token", data.token);
      setToken(data.token);

      // Fetch user role
      const userRes = await api.get("/api/user/data");

      if (userRes.data.user?.role !== "admin") {
        toast.error("Access denied: Admin only");

        // Logout immediately
        localStorage.removeItem("token");
        setToken(null);

        return;
      }

      toast.success("Admin login successful");

      navigate("/admin/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm p-6 bg-white rounded-lg shadow"
      >
        <h1 className="text-2xl font-semibold text-center mb-6">Admin Login</h1>

        {/* Email */}
        <input
          type="email"
          placeholder="Admin Email"
          className="w-full p-2 mb-4 border rounded outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-4 border rounded outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white py-2 rounded hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
