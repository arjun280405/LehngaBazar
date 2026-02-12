import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import lehengaImageUrl from "../assets/logos/logologin.png";
import { useContext, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const AdminLoginPage = () => {
  const [credentials, setCredentials] = useState({
    identifier: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { serverUrl, setUser, setIsAuthenticated } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const cleanedIdentifier = credentials.identifier.trim();
      const response = await axios.post(
        `${serverUrl}/api/auth/login`,
        {
          identifier: cleanedIdentifier,
          password: credentials.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      // Check if user has admin role
      const userData = response.data?.user;
      if (userData.role !== "admin" && userData.role !== "owner") {
        setLoading(false);
        setError("You do not have admin access. Please use customer login.");
        return;
      }

      // Store user and token
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(userData));
      console.log("Admin login successful:", response.data);

      alert(`Welcome Admin, ${userData?.name}!`);
      setUser(userData);
      setIsAuthenticated(true);

      // Redirect to admin dashboard
      navigate("/admin/dashboard");
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        "Login failed. Please check your credentials.";
      setError(errorMsg);
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-100 to-pink-100 p-4">
      <div className="bg-white rounded-lg shadow-2xl flex max-w-4xl w-full overflow-hidden">
        {/* Left side - Image */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-purple-500 to-pink-500 items-center justify-center p-8">
          <img
            src={lehengaImageUrl}
            alt="Admin"
            className="w-full h-auto object-cover rounded-lg"
          />
        </div>

        {/* Right side - Form */}
        <div className="w-full md:w-1/2 p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Admin Portal
            </h1>
            <p className="text-gray-600">Manage your store and orders</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Admin ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin ID
              </label>
              <input
                type="text"
                name="identifier"
                placeholder="arjun490"
                value={credentials.identifier}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={credentials.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition duration-300 disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login as Admin"}
            </button>

            {/* Additional Links */}
            <div className="mt-8 text-center space-y-3">
              <p className="text-sm text-gray-600">
                Not an admin?{" "}
                <a
                  href="/login"
                  className="text-purple-600 hover:underline font-medium"
                >
                  Customer Login
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
