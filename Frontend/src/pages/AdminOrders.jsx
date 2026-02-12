import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const AdminOrders = () => {
  const navigate = useNavigate();
  const { user, serverUrl, isAdmin, socket } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusUpdate, setStatusUpdate] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate("/admin/login");
    } else {
      fetchOrders();
    }
  }, [user, isAdmin, navigate]);

  // Listen for real-time order updates
  useEffect(() => {
    if (socket) {
      socket.on("orderStatusUpdated", (data) => {
        console.log("Order updated:", data);
        fetchOrders();
      });

      return () => socket.off("orderStatusUpdated");
    }
  }, [socket]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      let url = `${serverUrl}/api/admin/orders`;

      if (filter !== "all") {
        url += `?status=${filter}`;
      }

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(response.data.orders);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      setLoading(false);
    }
  };

  const handleStatusChange = async () => {
    if (!selectedOrder || !statusUpdate) {
      alert("Please select a status");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${serverUrl}/api/admin/orders/${selectedOrder._id}/status`,
        {
          status: statusUpdate,
          trackingNumber: trackingNumber,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      alert("Order status updated successfully!");
      setSelectedOrder(null);
      setStatusUpdate("");
      setTrackingNumber("");
      fetchOrders();
    } catch (error) {
      console.error("Failed to update order:", error);
      alert("Failed to update order status");
    }
  };

  const filteredOrders =
    filter === "all"
      ? orders
      : orders.filter((order) => order.status === filter);

  if (!isAdmin) return null;

  const getStatusColor = (status) => {
    const colors = {
      confirmed: "bg-blue-100 text-blue-800",
      processing: "bg-yellow-100 text-yellow-800",
      shipped: "bg-orange-100 text-orange-800",
      "out-for-delivery": "bg-indigo-100 text-indigo-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">Manage Orders</h1>
          <p className="text-purple-100">Track and update order status</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {[
            { value: "all", label: "All Orders", count: orders.length },
            {
              value: "confirmed",
              label: "Confirmed",
              count: orders.filter((o) => o.status === "confirmed").length,
            },
            {
              value: "processing",
              label: "Processing",
              count: orders.filter((o) => o.status === "processing").length,
            },
            {
              value: "shipped",
              label: "Shipped",
              count: orders.filter((o) => o.status === "shipped").length,
            },
            {
              value: "delivered",
              label: "Delivered",
              count: orders.filter((o) => o.status === "delivered").length,
            },
            {
              value: "cancelled",
              label: "Cancelled",
              count: orders.filter((o) => o.status === "cancelled").length,
            },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => {
                setFilter(tab.value);
                setLoading(true);
              }}
              className={`px-4 py-2 rounded-lg whitespace-nowrap font-medium transition ${
                filter === tab.value
                  ? "bg-purple-600 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:border-purple-500"
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Loading orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-600 text-lg">No orders found</p>
          </div>
        ) : (
          /* Orders Table */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Orders List */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100 border-b-2 border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                          Order ID
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                          Customer
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((order) => (
                        <tr
                          key={order._id}
                          className="border-b hover:bg-gray-50 transition cursor-pointer"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <td className="px-6 py-4 font-mono text-sm text-gray-800">
                            {order._id.substring(0, 8)}...
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-medium text-gray-800">
                                {order.customerName}
                              </p>
                              <p className="text-sm text-gray-600">
                                {order.email}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-semibold text-gray-800">
                            ₹{order.totalAmount}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                                order.status,
                              )}`}
                            >
                              {order.status.charAt(0).toUpperCase() +
                                order.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedOrder(order);
                              }}
                              className="text-purple-600 hover:text-purple-800 font-medium text-sm"
                            >
                              Update
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Order Details */}
            {selectedOrder && (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">
                    Order Details
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-gray-600">Order ID</p>
                      <p className="font-mono font-semibold text-gray-800">
                        {selectedOrder._id}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Customer</p>
                      <p className="font-semibold text-gray-800">
                        {selectedOrder.customerName}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Email</p>
                      <p className="text-gray-800">{selectedOrder.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Phone</p>
                      <p className="text-gray-800">{selectedOrder.phone}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Address</p>
                      <p className="text-gray-800">{selectedOrder.address}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Total Amount</p>
                      <p className="text-xl font-bold text-purple-600">
                        ₹{selectedOrder.totalAmount}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Items</p>
                      <p className="text-gray-800">
                        {selectedOrder.items.length} item(s)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Status Update */}
                <div className="border-t pt-6">
                  <h4 className="font-bold text-gray-800 mb-4">
                    Update Status
                  </h4>
                  <div className="space-y-3">
                    <select
                      value={statusUpdate}
                      onChange={(e) => setStatusUpdate(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                    >
                      <option value="">Select Status</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="out-for-delivery">Out for Delivery</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>

                    <input
                      type="text"
                      placeholder="Tracking Number (optional)"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                    />

                    <button
                      onClick={handleStatusChange}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition"
                    >
                      Update Order
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminOrders;
