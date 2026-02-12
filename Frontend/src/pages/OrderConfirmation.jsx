import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaCheckCircle, FaBox, FaHome, FaPrint } from "react-icons/fa";
import Navbar from "../components/Navbar";

// Import Mehndi images
import mehndiG1 from "../assets/Mehndi/g1.jpeg";
import mehndiG2 from "../assets/Mehndi/g2.jpg";
import mehndiG3 from "../assets/Mehndi/g3.jpg";
import mehndiG4 from "../assets/Mehndi/g4.jpg";
import mehndiG5 from "../assets/Mehndi/g5.jpg";
import mehndiG6 from "../assets/Mehndi/g6.webp";
import mehndiG6Side from "../assets/Mehndi/g6_6.avif";
import mehndiG6Side2 from "../assets/Mehndi/g6_6_6.avif";
import mehndiG7 from "../assets/Mehndi/g7.avif";
import mehndiG8 from "../assets/Mehndi/g8.avif";
import mehndiG8Alt from "../assets/Mehndi/g8_8.avif";
import mehndiG10 from "../assets/Mehndi/g10.webp";
import mehndiG11 from "../assets/Mehndi/g11.webp";

// Import Haldi images
import haldiY2 from "../assets/Haldi/y2.avif";
import haldiY2_2 from "../assets/Haldi/y2_2.avif";
import haldiY3 from "../assets/Haldi/y3.avif";
import haldiY3_3 from "../assets/Haldi/y3_3.avif";
import haldiY4 from "../assets/Haldi/y4.avif";
import haldiY4_4 from "../assets/Haldi/y4_4.avif";
import haldiY5 from "../assets/Haldi/y5.avif";
import haldiY5_5 from "../assets/Haldi/y5_5.avif";
import haldiY6 from "../assets/Haldi/y6.avif";
import haldiY6_6 from "../assets/Haldi/y6_6.avif";
import haldiY7 from "../assets/Haldi/y7.avif";
import haldiY8 from "../assets/Haldi/y8.avif";
import haldiY9 from "../assets/Haldi/y9.avif";
import haldiY9_9 from "../assets/Haldi/y9_9.avif";

// Image mapping for path resolution
const imageMap = {
  "../assets/Mehndi/g1.jpeg": mehndiG1,
  "../assets/Mehndi/g2.jpg": mehndiG2,
  "../assets/Mehndi/g3.jpg": mehndiG3,
  "../assets/Mehndi/g4.jpg": mehndiG4,
  "../assets/Mehndi/g5.jpg": mehndiG5,
  "../assets/Mehndi/g6.webp": mehndiG6,
  "../assets/Mehndi/g6_6.avif": mehndiG6Side,
  "../assets/Mehndi/g6_6_6.avif": mehndiG6Side2,
  "../assets/Mehndi/g7.avif": mehndiG7,
  "../assets/Mehndi/g8.avif": mehndiG8,
  "../assets/Mehndi/g8_8.avif": mehndiG8Alt,
  "../assets/Mehndi/g10.webp": mehndiG10,
  "../assets/Mehndi/g11.webp": mehndiG11,
  "/Frontend/src/assets/Haldi/y2.avif": haldiY2,
  "/Frontend/src/assets/Haldi/y2_2.avif": haldiY2_2,
  "/Frontend/src/assets/Haldi/y3.avif": haldiY3,
  "/Frontend/src/assets/Haldi/y3_3.avif": haldiY3_3,
  "/Frontend/src/assets/Haldi/y4.avif": haldiY4,
  "/Frontend/src/assets/Haldi/y4_4.avif": haldiY4_4,
  "/Frontend/src/assets/Haldi/y5.avif": haldiY5,
  "/Frontend/src/assets/Haldi/y5_5.avif": haldiY5_5,
  "/Frontend/src/assets/Haldi/y6.avif": haldiY6,
  "/Frontend/src/assets/Haldi/y6_6.avif": haldiY6_6,
  "/Frontend/src/assets/Haldi/y7.avif": haldiY7,
  "/Frontend/src/assets/Haldi/y8.avif": haldiY8,
  "/Frontend/src/assets/Haldi/y9.avif": haldiY9,
  "/Frontend/src/assets/Haldi/y9_9.avif": haldiY9_9,
};

// Helper function to resolve image URLs
const resolveImageUrl = (item) => {
  const imagePath = item.imageUrl || item.image_url;
  if (!imagePath) return "https://via.placeholder.com/100x120?text=No+image";

  // Check imageMap first
  if (imageMap[imagePath]) return imageMap[imagePath];

  // Return the path as is (for already resolved URLs)
  return imagePath;
};

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    if (!orderId) {
      setError("Order ID not found");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8000/api/payment/order/${orderId}`,
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch order details");
      }

      setOrder(data.order);
    } catch (err) {
      setError(err.message || "Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="order-confirmation-page">
      <Navbar />

      <style>{`
        :root {
          --deep-maroon: #4A0E0E;
          --rose-gold: #E5B4A2;
          --gold-bright: #C2A35D;
          --ivory: #FDFBF7;
          --success-green: #388e3c;
        }

        .order-confirmation-page {
          background: linear-gradient(135deg, var(--ivory), #f9f5f0);
          min-height: 100vh;
          padding-top: 80px;
          font-family: 'Montserrat', sans-serif;
        }

        .confirmation-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 40px 6%;
        }

        .confirmation-header {
          text-align: center;
          margin-bottom: 40px;
          animation: slideDown 0.5s ease;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .success-icon-container {
          margin-bottom: 20px;
        }

        .success-icon {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, var(--success-green), #66bb6a);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          font-size: 3rem;
          color: white;
          animation: scaleIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        @keyframes scaleIn {
          from {
            transform: scale(0);
          }
          to {
            transform: scale(1);
          }
        }

        .confirmation-title {
          font-size: 2.5rem;
          color: var(--deep-maroon);
          font-weight: 700;
          margin: 20px 0 10px;
          font-family: 'Cormorant Garamond', serif;
        }

        .confirmation-subtitle {
          font-size: 1.1rem;
          color: var(--success-green);
          font-weight: 600;
          margin-bottom: 30px;
        }

        .confirmation-content {
          background: white;
          border-radius: 15px;
          padding: 40px;
          box-shadow: 0 15px 40px rgba(74, 14, 14, 0.08);
          margin-bottom: 30px;
          animation: slideUp 0.5s ease;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .order-details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
          margin-bottom: 30px;
        }

        @media (max-width: 768px) {
          .order-details-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
        }

        .detail-section {
          border-left: 4px solid var(--gold-bright);
          padding-left: 20px;
        }

        .detail-section h3 {
          font-size: 1rem;
          color: var(--deep-maroon);
          font-weight: 700;
          margin-bottom: 12px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .detail-row {
          margin-bottom: 10px;
          font-size: 0.95rem;
          color: #555;
        }

        .detail-label {
          font-weight: 600;
          color: var(--deep-maroon);
          display: inline-block;
          width: 140px;
        }

        .detail-value {
          color: #333;
        }

        .order-id {
          background: var(--ivory);
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 20px;
          border-left: 4px solid var(--gold-bright);
        }

        .order-id-text {
          font-size: 0.85rem;
          color: #888;
          margin-bottom: 5px;
        }

        .order-id-value {
          font-size: 1.3rem;
          font-weight: 700;
          color: var(--deep-maroon);
          font-family: 'Courier New', monospace;
        }

        .order-items {
          margin-top: 30px;
          padding-top: 30px;
          border-top: 2px solid #eee;
        }

        .order-items h3 {
          font-size: 1.1rem;
          color: var(--deep-maroon);
          font-weight: 700;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .items-list {
          display: grid;
          gap: 15px;
        }

        .item-card {
          display: grid;
          grid-template-columns: 100px 1fr auto;
          gap: 20px;
          padding: 15px;
          background: var(--ivory);
          border-radius: 10px;
          align-items: center;
        }

        @media (max-width: 768px) {
          .item-card {
            grid-template-columns: 80px 1fr auto;
            gap: 15px;
          }
        }

        .item-image {
          width: 100px;
          height: 120px;
          border-radius: 8px;
          overflow: hidden;
          background: white;
          border: 1px solid #eee;
        }

        .item-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .item-details {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .item-name {
          font-weight: 600;
          color: var(--deep-maroon);
          font-size: 0.95rem;
        }

        .item-price {
          color: var(--gold-bright);
          font-weight: 600;
        }

        .item-quantity {
          color: #999;
          font-size: 0.85rem;
        }

        .item-subtotal {
          text-align: right;
          font-weight: 700;
          color: var(--deep-maroon);
          min-width: 100px;
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
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--deep-maroon);
        }

        .summary-label {
          color: #666;
          font-weight: 600;
        }

        .summary-value {
          color: #333;
          font-weight: 600;
        }

        .status-badge {
          display: inline-block;
          padding: 6px 16px;
          background: var(--success-green);
          color: white;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-top: 10px;
        }

        .action-buttons {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin-top: 30px;
        }

        @media (max-width: 600px) {
          .action-buttons {
            grid-template-columns: 1fr;
          }
        }

        .action-btn {
          padding: 14px 24px;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          text-decoration: none;
        }

        .btn-home {
          background: var(--gold-bright);
          color: white;
        }

        .btn-home:hover {
          background: var(--deep-maroon);
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(74, 14, 14, 0.2);
        }

        .btn-print {
          background: white;
          color: var(--deep-maroon);
          border: 2px solid var(--gold-bright);
        }

        .btn-print:hover {
          background: var(--ivory);
          border-color: var(--deep-maroon);
        }

        .loading-spinner {
          text-align: center;
          padding: 60px 20px;
        }

        .spinner {
          border: 4px solid var(--ivory);
          border-top: 4px solid var(--gold-bright);
          border-radius: 50%;
          width: 50px;
          height: 50px;
          animation: spin 1s linear infinite;
          margin: 0 auto 20px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .error-message {
          background: #ffebee;
          color: #c62828;
          padding: 20px;
          border-radius: 10px;
          text-align: center;
          margin-top: 20px;
          border-left: 4px solid #c62828;
        }

        @media print {
          .action-buttons,
          .confirmation-subtitle {
            display: none;
          }

          .confirmation-content {
            box-shadow: none;
            border: 1px solid #ddd;
          }
        }

        @media (max-width: 600px) {
          .confirmation-container {
            padding: 25px 4%;
          }

          .confirmation-title {
            font-size: 1.8rem;
          }

          .order-details-grid {
            grid-template-columns: 1fr;
          }

          .confirmation-content {
            padding: 25px;
          }
        }
      `}</style>

      <div className="confirmation-container">
        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p style={{ color: "var(--deep-maroon)", fontWeight: "600" }}>
              Loading order details...
            </p>
          </div>
        ) : error ? (
          <>
            <div className="confirmation-header">
              <div className="confirmation-title">Oops!</div>
              <p style={{ color: "#c62828", fontSize: "1.05rem" }}>{error}</p>
            </div>
            <div className="action-buttons">
              <button
                className="action-btn btn-home"
                onClick={() => navigate("/")}
              >
                <FaHome /> Back to Home
              </button>
            </div>
          </>
        ) : order ? (
          <>
            <div className="confirmation-header">
              <div className="success-icon-container">
                <div className="success-icon">
                  <FaCheckCircle />
                </div>
              </div>
              <h1 className="confirmation-title">Order Confirmed!</h1>
              <p className="confirmation-subtitle">
                Thank you for your purchase. Your order has been successfully
                placed.
              </p>
            </div>

            <div className="confirmation-content">
              <div className="order-id">
                <div className="order-id-text">Order ID</div>
                <div className="order-id-value">{order._id}</div>
                <div className="status-badge">{order.paymentStatus}</div>
              </div>

              <div className="order-details-grid">
                <div className="detail-section">
                  <h3>📦 Shipping Details</h3>
                  <div className="detail-row">
                    <span className="detail-label">Name:</span>
                    <span className="detail-value">{order.customerName}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">{order.email}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Phone:</span>
                    <span className="detail-value">{order.phone}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Address:</span>
                    <span className="detail-value">{order.address}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">City:</span>
                    <span className="detail-value">{order.city}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">State:</span>
                    <span className="detail-value">{order.state}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">PIN Code:</span>
                    <span className="detail-value">{order.zipcode}</span>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>💳 Payment Details</h3>
                  <div className="detail-row">
                    <span className="detail-label">Payment Method:</span>
                    <span className="detail-value">
                      {order.paymentMethod === "card"
                        ? "Credit/Debit Card"
                        : order.paymentMethod === "razorpay"
                          ? "Razorpay"
                          : order.paymentMethod}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Status:</span>
                    <span
                      className="detail-value"
                      style={{
                        color: "var(--success-green)",
                        fontWeight: "700",
                      }}
                    >
                      ✓ {order.paymentStatus}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Order Date:</span>
                    <span className="detail-value">
                      {new Date(order.orderDate).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Order Time:</span>
                    <span className="detail-value">
                      {new Date(order.orderDate).toLocaleTimeString("en-IN")}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Est. Delivery:</span>
                    <span
                      className="detail-value"
                      style={{ color: "var(--gold-bright)", fontWeight: "600" }}
                    >
                      {order.estimatedDeliveryDate
                        ? new Date(
                            order.estimatedDeliveryDate,
                          ).toLocaleDateString("en-IN", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "Will be updated soon"}
                    </span>
                  </div>
                </div>
              </div>

              {order.items && order.items.length > 0 && (
                <div className="order-items">
                  <h3>
                    <FaBox /> Order Items
                  </h3>
                  <div className="items-list">
                    {order.items.map((item) => (
                      <div key={item.id} className="item-card">
                        <div className="item-image">
                          <img
                            src={resolveImageUrl(item)}
                            alt={item.name || item.product_title}
                            onError={(e) => {
                              e.target.src =
                                "https://via.placeholder.com/100x120?text=No+image";
                            }}
                          />
                        </div>
                        <div className="item-details">
                          <div className="item-name">
                            {item.name || item.product_title}
                          </div>
                          <div className="item-price">
                            ₹{(item.price || 0).toLocaleString("en-IN")}
                          </div>
                          <div className="item-quantity">
                            Quantity: {item.quantity}
                          </div>
                        </div>
                        <div className="item-subtotal">
                          ₹
                          {(
                            (item.price || 0) * (item.quantity || 1)
                          ).toLocaleString("en-IN")}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="order-summary">
                    <div className="summary-row">
                      <span className="summary-label">Subtotal:</span>
                      <span className="summary-value">
                        ₹{(order.totalAmount || 0).toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="summary-row">
                      <span className="summary-label">Total Amount:</span>
                      <span className="summary-value">
                        ₹{(order.totalAmount || 0).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="action-buttons">
              <button
                className="action-btn btn-home"
                onClick={() => navigate("/")}
              >
                <FaHome /> Back to Home
              </button>
              <button className="action-btn btn-print" onClick={handlePrint}>
                <FaPrint /> Print Receipt
              </button>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default OrderConfirmation;
