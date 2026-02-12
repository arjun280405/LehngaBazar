import React, { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  FaBox,
  FaShoppingCart,
  FaUsers,
  FaTachometerAlt,
  FaSignOutAlt,
  FaUserPlus,
} from "react-icons/fa";
import axios from "axios";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, serverUrl, isAdmin, setUser, setIsAuthenticated } =
    useContext(AuthContext);
  const [stats, setStats] = useState({
    total: 0,
    confirmed: 0,
    processing: 0,
    shipped: 0,
    outForDelivery: 0,
    delivered: 0,
    cancelled: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState(0);

  // Check admin access
  useEffect(() => {
    if (!user || !isAdmin) {
      navigate("/admin/login");
    }
  }, [user, isAdmin, navigate]);

  // Fetch dashboard stats
  useEffect(() => {
    if (isAdmin) {
      fetchStats();
      fetchProductCount();
    }
  }, [isAdmin]);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${serverUrl}/api/admin/orders/stats/overview`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setStats(response.data.stats);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
      setLoading(false);
    }
  };

  const fetchProductCount = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${serverUrl}/api/products/admin/my-products`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setProducts(response.data.count);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
    navigate("/admin/login");
  };

  if (!isAdmin) {
    return null;
  }

  const StatCard = ({ icon: Icon, title, value, color }) => (
    <div
      className={`${color} rounded-lg p-6 text-white shadow-lg hover:shadow-xl transition`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm opacity-80 font-medium">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <Icon className="text-5xl opacity-30" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-purple-100">Welcome, {user?.name || "Admin"}!</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Link
            to="/admin/products"
            className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition text-center"
          >
            <FaBox className="text-2xl mx-auto text-purple-600 mb-2" />
            <p className="font-semibold text-gray-800">Manage Products</p>
            <p className="text-sm text-gray-600 mt-1">{products} items</p>
          </Link>

          <Link
            to="/admin/orders"
            className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition text-center"
          >
            <FaShoppingCart className="text-2xl mx-auto text-pink-600 mb-2" />
            <p className="font-semibold text-gray-800">Manage Orders</p>
            <p className="text-sm text-gray-600 mt-1">{stats.total} orders</p>
          </Link>

          <Link
            to="/admin/users"
            className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition text-center opacity-50 cursor-not-allowed"
          >
            <FaUsers className="text-2xl mx-auto text-blue-600 mb-2" />
            <p className="font-semibold text-gray-800">Users</p>
            <p className="text-sm text-gray-600 mt-1">Coming Soon</p>
          </Link>

          <Link
            to="/admin/owners/create"
            className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition text-center"
          >
            <FaUserPlus className="text-2xl mx-auto text-indigo-600 mb-2" />
            <p className="font-semibold text-gray-800">Create Owner</p>
            <p className="text-sm text-gray-600 mt-1">Secure access</p>
          </Link>

          <button
            onClick={fetchStats}
            className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition text-center"
          >
            <FaTachometerAlt className="text-2xl mx-auto text-green-600 mb-2" />
            <p className="font-semibold text-gray-800">Refresh Stats</p>
            <p className="text-sm text-gray-600 mt-1">Last updated</p>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={FaShoppingCart}
            title="Total Orders"
            value={stats.total}
            color="bg-gradient-to-br from-blue-500 to-blue-600"
          />
          <StatCard
            icon={FaBox}
            title="Confirmed"
            value={stats.confirmed}
            color="bg-gradient-to-br from-green-500 to-green-600"
          />
          <StatCard
            icon={FaBox}
            title="Shipped"
            value={stats.shipped}
            color="bg-gradient-to-br from-orange-500 to-orange-600"
          />
          <StatCard
            icon={FaBox}
            title="Delivered"
            value={stats.delivered}
            color="bg-gradient-to-br from-purple-500 to-purple-600"
          />
        </div>

        {/* Order Status Overview */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600 mb-1">Processing</p>
            <p className="text-2xl font-bold text-yellow-600">
              {stats.processing}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600 mb-1">Out for Delivery</p>
            <p className="text-2xl font-bold text-indigo-600">
              {stats.outForDelivery}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600 mb-1">Cancelled</p>
            <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow col-span-2 md:col-span-1">
            <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
            <p className="text-2xl font-bold text-green-600">
              ₹{stats.totalRevenue.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              to="/admin/products/add"
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg text-center font-semibold hover:shadow-lg transition"
            >
              ➕ Add New Product
            </Link>
            <Link
              to="/admin/orders"
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg text-center font-semibold hover:shadow-lg transition"
            >
              📦 View All Orders
            </Link>
            <Link
              to="/admin/owners/create"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg text-center font-semibold hover:shadow-lg transition"
            >
              👤 Create Owner
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
