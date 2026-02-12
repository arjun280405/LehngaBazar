import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBox,
  FaCheckCircle,
  FaTruck,
  FaShippingFast,
  FaHome,
} from "react-icons/fa";
import Navbar from "../components/Navbar";

const MyOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    // Get user data from localStorage
    const user = localStorage.getItem("user");
    let userIdValue = null;
    let email = null;

    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        userIdValue = parsedUser._id || parsedUser.id;
        email = parsedUser.email;
      } catch (e) {
        console.error("Error parsing user data:", e);
      }
    }

    if (userIdValue) {
      setUserEmail(email);
      fetchOrders(userIdValue);
    } else {
      setError("Please login to view your orders");
      setLoading(false);
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    }
  }, [navigate]);

  const fetchOrders = async (userId) => {
    try {
      console.log(`📦 Fetching orders for user ID: ${userId}`);
      const response = await fetch(
        `http://localhost:8000/api/payment/user/${userId}/orders`,
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch orders");
      }

      console.log(`✅ Received ${data.orders?.length || 0} orders`);
      setOrders(data.orders || []);
    } catch (err) {
      console.error("❌ Error fetching orders:", err);
      setError(err.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status) => {
    const statusMap = {
      confirmed: {
        label: "Order Received",
        icon: <FaCheckCircle />,
        color: "#388e3c",
        step: 1,
      },
      processing: {
        label: "Processing",
        icon: <FaBox />,
        color: "#1976d2",
        step: 2,
      },
      shipped: {
        label: "Shipped",
        icon: <FaTruck />,
        color: "#f57c00",
        step: 3,
      },
      "out-for-delivery": {
        label: "Out for Delivery",
        icon: <FaShippingFast />,
        color: "#7b1fa2",
        step: 4,
      },
      delivered: {
        label: "Delivered",
        icon: <FaCheckCircle />,
        color: "#2e7d32",
        step: 5,
      },
    };

    return statusMap[status] || statusMap.confirmed;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatPrice = (price) => {
    return typeof price === "number"
      ? `₹${price.toLocaleString("en-IN")}`
      : price;
  };

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
  };

  const handleCloseDetails = () => {
    setSelectedOrder(null);
  };

  if (loading) {
    return (
      <div className="my-orders-page">
        <Navbar />
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-orders-page">
        <Navbar />
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={() => navigate("/")} className="btn-home">
            <FaHome /> Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="my-orders-page">
      <Navbar />

      <style>{`
        :root {
          --deep-maroon: #4A0E0E;
          --rose-gold: #E5B4A2;
          --gold-bright: #C2A35D;
          --ivory: #FDFBF7;
        }

        .my-orders-page {
          background: linear-gradient(135deg, var(--ivory), #f9f5f0);
          min-height: 100vh;
          padding-top: 80px;
          font-family: 'Montserrat', sans-serif;
        }

        .orders-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 6%;
        }

        .orders-header {
          margin-bottom: 30px;
        }

        .orders-title {
          font-size: 2.5rem;
          color: var(--deep-maroon);
          font-weight: 700;
          font-family: 'Cormorant Garamond', serif;
          margin-bottom: 10px;
        }

        .orders-subtitle {
          color: #666;
          font-size: 1rem;
        }

        .orders-list {
          display: grid;
          gap: 20px;
        }

        .order-card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
          cursor: pointer;
          transition: all 0.3s;
        }

        .order-card:hover {
          box-shadow: 0 8px 25px rgba(74, 14, 14, 0.15);
          transform: translateY(-3px);
        }

        .order-card-header {
          display: flex;
          justify-content: space-between;
          align-items: start;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 15px;
        }

        .order-info {
          flex: 1;
          min-width: 200px;
        }

        .order-id {
          font-size: 0.85rem;
          color: #888;
          margin-bottom: 5px;
        }

        .order-id-value {
          font-weight: 700;
          color: var(--deep-maroon);
          font-family: 'Courier New', monospace;
        }

        .order-date {
          color: #666;
          font-size: 0.9rem;
        }

        .order-status-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          white-space: nowrap;
        }

        .order-card-body {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 20px;
          border-top: 1px solid #eee;
          flex-wrap: wrap;
          gap: 15px;
        }

        .order-items-preview {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .item-count {
          color: #666;
          font-size: 0.9rem;
        }

        .order-total {
          text-align: right;
        }

        .total-label {
          font-size: 0.85rem;
          color: #888;
          margin-bottom: 5px;
        }

        .total-amount {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--deep-maroon);
        }

        .order-details-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 20px;
          animation: fadeIn 0.3s;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .modal-content {
          background: white;
          border-radius: 15px;
          max-width: 900px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
          animation: slideUp 0.3s;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .modal-header {
          padding: 30px;
          border-bottom: 2px solid #eee;
          position: sticky;
          top: 0;
          background: white;
          z-index: 10;
          border-radius: 15px 15px 0 0;
        }

        .modal-title {
          font-size: 1.8rem;
          color: var(--deep-maroon);
          font-weight: 700;
          margin-bottom: 10px;
        }

        .close-btn {
          position: absolute;
          top: 20px;
          right: 20px;
          background: none;
          border: none;
          font-size: 2rem;
          color: #666;
          cursor: pointer;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all 0.3s;
        }

        .close-btn:hover {
          background: #f5f5f5;
          color: var(--deep-maroon);
        }

        .modal-body {
          padding: 30px;
        }

        .status-timeline {
          margin: 30px 0;
          padding: 30px;
          background: var(--ivory);
          border-radius: 10px;
        }

        .timeline-title {
          font-size: 1.1rem;
          color: var(--deep-maroon);
          font-weight: 700;
          margin-bottom: 25px;
        }

        .timeline-steps {
          display: flex;
          justify-content: space-between;
          position: relative;
          padding: 0 20px;
        }

        .timeline-line {
          position: absolute;
          top: 20px;
          left: 20px;
          right: 20px;
          height: 3px;
          background: #ddd;
        }

        .timeline-line-progress {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          background: var(--gold-bright);
          transition: width 0.5s;
        }

        .timeline-step {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          flex: 1;
        }

        .step-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: white;
          border: 3px solid #ddd;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          transition: all 0.3s;
        }

        .step-icon.active {
          background: var(--gold-bright);
          border-color: var(--gold-bright);
          color: white;
        }

        .step-icon.completed {
          background: var(--deep-maroon);
          border-color: var(--deep-maroon);
          color: white;
        }

        .step-label {
          font-size: 0.75rem;
          color: #999;
          text-align: center;
          max-width: 80px;
          line-height: 1.3;
        }

        .step-label.active {
          color: var(--gold-bright);
          font-weight: 600;
        }

        .step-label.completed {
          color: var(--deep-maroon);
          font-weight: 600;
        }

        .details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
          margin-bottom: 30px;
        }

        @media (max-width: 768px) {
          .details-grid {
            grid-template-columns: 1fr;
          }
          
          .timeline-steps {
            flex-direction: column;
            padding: 0;
          }
          
          .timeline-line {
            left: 20px;
            right: auto;
            width: 3px;
            height: calc(100% - 40px);
            top: 20px;
          }
          
          .timeline-step {
            flex-direction: row;
            justify-content: flex-start;
            gap: 15px;
            margin-bottom: 20px;
          }
          
          .step-label {
            text-align: left;
          }
        }

        .detail-section {
          background: var(--ivory);
          padding: 20px;
          border-radius: 10px;
          border-left: 4px solid var(--gold-bright);
        }

        .detail-section h3 {
          font-size: 1rem;
          color: var(--deep-maroon);
          font-weight: 700;
          margin-bottom: 15px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .detail-row {
          margin-bottom: 10px;
          font-size: 0.9rem;
        }

        .detail-label {
          color: #666;
          font-weight: 600;
          display: inline-block;
          width: 130px;
        }

        .detail-value {
          color: #333;
        }

        .items-section {
          margin-top: 30px;
        }

        .items-section h3 {
          font-size: 1.1rem;
          color: var(--deep-maroon);
          font-weight: 700;
          margin-bottom: 20px;
        }

        .items-grid {
          display: grid;
          gap: 15px;
        }

        .item-card {
          display: grid;
          grid-template-columns: 80px 1fr auto;
          gap: 15px;
          padding: 15px;
          background: var(--ivory);
          border-radius: 10px;
          align-items: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .item-card:hover {
          background: white;
          box-shadow: 0 4px 12px rgba(74, 14, 14, 0.1);
          transform: translateX(5px);
        }

        .item-image {
          width: 80px;
          height: 100px;
          border-radius: 8px;
          background: white;
          border: 1px solid #eee;
          overflow: hidden;
        }

        .item-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .item-info {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .item-name {
          font-weight: 600;
          color: var(--deep-maroon);
          font-size: 0.95rem;
        }

        .item-price {
          color: var(--gold-bright);
          font-weight: 600;
          font-size: 0.9rem;
        }

        .item-qty {
          color: #999;
          font-size: 0.85rem;
        }

        .item-subtotal {
          text-align: right;
          font-weight: 700;
          color: var(--deep-maroon);
          font-size: 1.1rem;
        }

        .order-summary {
          background: var(--ivory);
          padding: 20px;
          border-radius: 10px;
          margin-top: 30px;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid #ddd;
        }

        .summary-row:last-child {
          border-bottom: none;
          padding-top: 15px;
          border-top: 2px solid var(--gold-bright);
          font-size: 1.3rem;
          font-weight: 700;
          color: var(--deep-maroon);
        }

        .loading-container, .error-container {
          text-align: center;
          padding: 80px 20px;
        }

        .spinner {
          width: 50px;
          height: 50px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid var(--gold-bright);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 20px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .error-message {
          color: #d32f2f;
          font-size: 1.1rem;
          margin-bottom: 20px;
        }

        .btn-home {
          background: var(--gold-bright);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          transition: all 0.3s;
        }

        .btn-home:hover {
          background: var(--deep-maroon);
          transform: translateY(-2px);
        }

        .empty-orders {
          text-align: center;
          padding: 60px 20px;
        }

        .empty-icon {
          font-size: 4rem;
          color: #ccc;
          margin-bottom: 20px;
        }

        .empty-message {
          font-size: 1.2rem;
          color: #666;
          margin-bottom: 30px;
        }

        @media (max-width: 768px) {
          .orders-title {
            font-size: 2rem;
          }
          
          .order-card {
            padding: 20px;
          }
          
          .modal-content {
            border-radius: 0;
            max-height: 100vh;
          }
          
          .modal-header, .modal-body {
            padding: 20px;
          }
        }
      `}</style>

      <div className="orders-container">
        <div className="orders-header">
          <h1 className="orders-title">My Orders</h1>
          <p className="orders-subtitle">{userEmail}</p>
        </div>

        {orders.length === 0 ? (
          <div className="empty-orders">
            <div className="empty-icon">
              <FaBox />
            </div>
            <p className="empty-message">You haven't placed any orders yet</p>
            <button onClick={() => navigate("/")} className="btn-home">
              <FaHome /> Start Shopping
            </button>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => {
              const statusInfo = getStatusInfo(order.status);
              return (
                <div
                  key={order._id}
                  className="order-card"
                  onClick={() => handleOrderClick(order)}
                >
                  <div className="order-card-header">
                    <div className="order-info">
                      <div className="order-id">
                        Order ID:{" "}
                        <span className="order-id-value">{order._id}</span>
                      </div>
                      <div className="order-date">
                        Placed on {formatDate(order.orderDate)}
                      </div>
                    </div>
                    <div
                      className="order-status-badge"
                      style={{ background: statusInfo.color, color: "white" }}
                    >
                      {statusInfo.icon} {statusInfo.label}
                    </div>
                  </div>
                  <div className="order-card-body">
                    <div className="order-items-preview">
                      <FaBox style={{ color: "#C2A35D" }} />
                      <span className="item-count">
                        {order.items.length}{" "}
                        {order.items.length === 1 ? "item" : "items"}
                      </span>
                    </div>
                    <div className="order-total">
                      <div className="total-label">Total Amount</div>
                      <div className="total-amount">
                        ₹{order.totalAmount.toLocaleString("en-IN")}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="order-details-modal" onClick={handleCloseDetails}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Order Details</h2>
              <button className="close-btn" onClick={handleCloseDetails}>
                ×
              </button>
              <div className="order-id">
                Order ID:{" "}
                <span className="order-id-value">{selectedOrder._id}</span>
              </div>
              <div className="order-date">
                Placed on {formatDate(selectedOrder.orderDate)}
              </div>
            </div>

            <div className="modal-body">
              {/* Status Timeline */}
              <div className="status-timeline">
                <h3 className="timeline-title">Order Status</h3>
                <div className="timeline-steps">
                  <div className="timeline-line">
                    <div
                      className="timeline-line-progress"
                      style={{
                        width: `${(getStatusInfo(selectedOrder.status).step / 5) * 100}%`,
                      }}
                    ></div>
                  </div>
                  {[
                    { status: "confirmed", label: "Order Received" },
                    { status: "processing", label: "Processing" },
                    { status: "shipped", label: "Shipped" },
                    { status: "out-for-delivery", label: "Out for Delivery" },
                    { status: "delivered", label: "Delivered" },
                  ].map((step, index) => {
                    const stepInfo = getStatusInfo(step.status);
                    const currentStep = getStatusInfo(
                      selectedOrder.status,
                    ).step;
                    const isCompleted = index + 1 < currentStep;
                    const isActive = index + 1 === currentStep;

                    return (
                      <div key={step.status} className="timeline-step">
                        <div
                          className={`step-icon ${isCompleted ? "completed" : ""} ${isActive ? "active" : ""}`}
                        >
                          {stepInfo.icon}
                        </div>
                        <div
                          className={`step-label ${isCompleted ? "completed" : ""} ${isActive ? "active" : ""}`}
                        >
                          {step.label}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Details Grid */}
              <div className="details-grid">
                <div className="detail-section">
                  <h3>Customer Details</h3>
                  <div className="detail-row">
                    <span className="detail-label">Name:</span>
                    <span className="detail-value">
                      {selectedOrder.customerName}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">{selectedOrder.email}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Phone:</span>
                    <span className="detail-value">{selectedOrder.phone}</span>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Delivery Address</h3>
                  <div className="detail-row">
                    <span className="detail-value">
                      {selectedOrder.address}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-value">
                      {selectedOrder.city}, {selectedOrder.state} -{" "}
                      {selectedOrder.zipcode}
                    </span>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Payment Details</h3>
                  <div className="detail-row">
                    <span className="detail-label">Method:</span>
                    <span className="detail-value">
                      {selectedOrder.paymentMethod.toUpperCase()}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Status:</span>
                    <span className="detail-value">
                      {selectedOrder.paymentStatus}
                    </span>
                  </div>
                  {selectedOrder.razorpayPaymentId && (
                    <div className="detail-row">
                      <span className="detail-label">Payment ID:</span>
                      <span
                        className="detail-value"
                        style={{ fontSize: "0.85rem" }}
                      >
                        {selectedOrder.razorpayPaymentId}
                      </span>
                    </div>
                  )}
                </div>

                <div className="detail-section">
                  <h3>Delivery Date</h3>
                  <div className="detail-row">
                    <span className="detail-label">Estimated:</span>
                    <span className="detail-value">
                      {selectedOrder.estimatedDeliveryDate
                        ? formatDate(selectedOrder.estimatedDeliveryDate)
                        : "5-7 days"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="items-section">
                <h3>Order Items</h3>
                <div className="items-grid">
                  {selectedOrder.items.map((item, index) => (
                    <div
                      key={index}
                      className="item-card"
                      onClick={() => {
                        if (item.id) {
                          navigate(`/product/${item.id}`);
                          handleCloseDetails();
                        }
                      }}
                      title="Click to view product details"
                    >
                      <div className="item-image">
                        <img
                          src={
                            item.image_url || item.image || "/placeholder.jpg"
                          }
                          alt={item.name || item.product_title}
                          onError={(e) => {
                            e.target.src = "/placeholder.jpg";
                          }}
                        />
                      </div>
                      <div className="item-info">
                        <div className="item-name">
                          {item.name || item.product_title}
                        </div>
                        <div className="item-price">
                          {formatPrice(item.price)}
                        </div>
                        <div className="item-qty">Qty: {item.quantity}</div>
                      </div>
                      <div className="item-subtotal">
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="order-summary">
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>
                    ₹{selectedOrder.totalAmount.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="summary-row">
                  <span>Delivery Charges:</span>
                  <span style={{ color: "#2e7d32" }}>FREE</span>
                </div>
                <div className="summary-row">
                  <span>Total Amount:</span>
                  <span>
                    ₹{selectedOrder.totalAmount.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
