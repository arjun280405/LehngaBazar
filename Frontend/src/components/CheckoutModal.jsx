import { useState, useCallback, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import "../styles/CheckoutModal.css";

const CheckoutModal = ({ isOpen, onClose, cartItems, totalAmount }) => {
  const navigate = useNavigate();
  const { clearCart } = useContext(CartContext);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Single step for delivery details only
  const [step, setStep] = useState(1);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipcode: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Check if user is authenticated when modal opens
  useEffect(() => {
    if (isOpen) {
      const user = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      console.log("🔍 CheckoutModal Auth Check:");
      console.log("  User in localStorage:", user ? "Yes" : "No");
      console.log("  Token in localStorage:", token ? "Yes" : "No");

      if (!user || !token) {
        console.log("❌ User not authenticated - showing login prompt");
        setError("Please log in to checkout");
        setIsAuthenticated(false);
        // Close modal after 2 seconds if user is not logged in
        const timer = setTimeout(() => {
          onClose();
          navigate("/login");
        }, 2000);
        return () => clearTimeout(timer);
      } else {
        console.log("✅ User authenticated - allowing checkout");
        setIsAuthenticated(true);
        setError("");

        // Pre-fill form data from user info if available
        try {
          const parsedUser = JSON.parse(user);
          setFormData((prev) => ({
            ...prev,
            name: parsedUser.name || prev.name,
            email: parsedUser.email || prev.email,
          }));
        } catch (e) {
          console.error("Error parsing user data:", e);
        }
      }
    }
  }, [isOpen, navigate, onClose]);

  // Input change handlers
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  // Validation function
  const validateDeliveryDetails = () => {
    if (
      !formData.email ||
      !formData.name ||
      !formData.phone ||
      !formData.address
    ) {
      setError("Please fill all required fields");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Invalid email format");
      return false;
    }
    const phoneDigits = formData.phone.replace(/\D/g, "");
    if (phoneDigits.length < 10) {
      setError("Invalid phone number");
      return false;
    }
    return true;
  };

  // Razorpay Payment Handler
  const handleRazorpayPayment = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const createRes = await fetch(
        "http://localhost:8000/api/payment/razorpay/create-order",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: totalAmount,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            cartItems: cartItems,
          }),
        },
      );

      const createData = await createRes.json();
      if (!createRes.ok)
        throw new Error(createData.message || "Failed to create payment order");

      const { order, key } = createData;

      const options = {
        key: key,
        amount: order.amount,
        currency: order.currency,
        name: "SoniMahal",
        description: "Order Payment",
        order_id: order.id,
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        handler: async function (response) {
          console.log("🎉 Payment Successful! Response from Razorpay:");
          console.log("  Order ID:", response.razorpay_order_id);
          console.log("  Payment ID:", response.razorpay_payment_id);

          try {
            setLoading(true);
            setError("");

            console.log("\n📤 Sending verification request to backend...");

            // Extract userId from localStorage
            let userId = null;
            try {
              const userStr = localStorage.getItem("user");
              if (userStr) {
                const parsedUser = JSON.parse(userStr);
                userId = parsedUser._id || parsedUser.id;
                console.log("👤 User ID found:", userId);
              }
            } catch (e) {
              console.error("Error extracting userId:", e);
            }

            const payloadData = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              userId: userId,
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
              address: formData.address,
              city: formData.city,
              state: formData.state,
              zipcode: formData.zipcode,
              cartItems: cartItems,
              amount: totalAmount,
            };

            console.log("📋 Payload:", payloadData);

            const verifyRes = await fetch(
              "http://localhost:8000/api/payment/razorpay/verify",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payloadData),
              },
            );

            console.log("\n📥 Backend Response Status:", verifyRes.status);

            const verifyData = await verifyRes.json();

            console.log("📦 Backend Response Data:", verifyData);

            if (!verifyRes.ok || !verifyData.orderId) {
              console.error("❌ Backend returned error or invalid response");
              throw new Error(
                verifyData.message ||
                  `Server error (Status: ${verifyRes.status})`,
              );
            }

            console.log("✅ Order Created Successfully!");
            console.log("   Order ID:", verifyData.orderId);

            setSuccess(true);
            clearCart();

            console.log("🔄 Redirecting to order confirmation page...");
            setTimeout(() => {
              navigate(`/order-confirmation/${verifyData.orderId}`);
              onClose();
            }, 1500);
          } catch (err) {
            console.error("❌ Payment verification failed:", err.message);
            setError(err.message || "Payment verification failed");
            setLoading(false);
          }
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      // Load Razorpay script and open checkout
      const existing = document.querySelector(
        "script[src='https://checkout.razorpay.com/v1/checkout.js']",
      );
      if (!existing) {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        script.onload = () => {
          const rzp = new window.Razorpay(options);
          rzp.open();
        };
        document.body.appendChild(script);
      } else {
        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (err) {
      setError(err.message || "Payment failed. Please try again.");
      console.error("Razorpay create/open error:", err);
      setLoading(false);
    }
  }, [formData, totalAmount, cartItems, navigate, onClose, clearCart]);

  const handleNextStep = () => {
    if (validateDeliveryDetails()) {
      handleRazorpayPayment();
    }
  };

  const handlePrevStep = () => {
    // Not needed for single-step checkout
  };

  if (!isOpen) return null;

  return (
    <div className="checkout-overlay" onClick={onClose}>
      <div className="checkout-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="checkout-header">
          <h2>Secure Checkout</h2>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="checkout-content">
          {!isAuthenticated ? (
            <div className="auth-error-message">
              <div className="error-icon">⚠️</div>
              <h3>Authentication Required</h3>
              <p>Please log in to proceed with checkout.</p>
              <p>Redirecting to login page...</p>
            </div>
          ) : success ? (
            <div className="success-message">
              <div className="success-icon">✓</div>
              <h3>Payment Successful!</h3>
              <p>Redirecting to order confirmation...</p>
            </div>
          ) : (
            <>
              <div className="form-step">
                <h3>Delivery Details</h3>
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    placeholder="Enter your full name"
                    disabled={loading}
                  />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    placeholder="Enter your email"
                    disabled={loading}
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleFormChange}
                    placeholder="Enter your phone number"
                    disabled={loading}
                  />
                </div>
                <div className="form-group">
                  <label>Address *</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleFormChange}
                    placeholder="Enter your street address"
                    disabled={loading}
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleFormChange}
                      placeholder="City"
                      disabled={loading}
                    />
                  </div>
                  <div className="form-group">
                    <label>State</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleFormChange}
                      placeholder="State"
                      disabled={loading}
                    />
                  </div>
                  <div className="form-group">
                    <label>Zip Code</label>
                    <input
                      type="text"
                      name="zipcode"
                      value={formData.zipcode}
                      onChange={handleFormChange}
                      placeholder="Zip code"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div
                  className="payment-info"
                  style={{
                    marginTop: "20px",
                    padding: "15px",
                    backgroundColor: "#f0f8ff",
                    borderRadius: "8px",
                    borderLeft: "4px solid #1976d2",
                  }}
                >
                  <p
                    style={{ margin: 0, color: "#1565c0", fontSize: "0.9rem" }}
                  >
                    💳 You'll be redirected to Razorpay's secure payment gateway
                    after submitting your details.
                  </p>
                </div>
              </div>

              {/* Error message */}
              {error && (
                <div className="error-message">
                  <span>⚠️</span> {error}
                </div>
              )}

              {/* Order Summary */}
              <div className="order-summary">
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>₹{totalAmount.toFixed(2)}</span>
                </div>
                <div className="summary-row highlight">
                  <span>Total Amount:</span>
                  <span>₹{totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer buttons */}
        {!success && isAuthenticated && (
          <div className="checkout-footer">
            <button
              className="btn-primary"
              onClick={handleNextStep}
              disabled={loading}
              style={{ width: "100%" }}
            >
              {loading ? (
                <>
                  <span className="spinner"></span> Processing...
                </>
              ) : (
                `Proceed to Payment (₹${totalAmount.toFixed(2)})`
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutModal;
