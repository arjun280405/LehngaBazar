import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaTrash,
  FaMinus,
  FaPlus,
  FaShoppingBag,
} from "react-icons/fa";
import Navbar from "../components/Navbar";
import CheckoutModal from "../components/CheckoutModal";
import { CartContext } from "../context/CartContext";

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

const Cart = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, getTotalPrice } =
    useContext(CartContext);
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Helper function to resolve image URLs
  const resolveImageUrl = (item) => {
    const imagePath = item.imageUrl || item.image_url;
    if (!imagePath) return "https://via.placeholder.com/150x180?text=No+image";

    // Check imageMap first
    if (imageMap[imagePath]) return imageMap[imagePath];

    // Try to resolve as URL
    try {
      return new URL(imagePath.trim(), import.meta.url).href;
    } catch (err) {
      return "https://via.placeholder.com/150x180?text=No+image";
    }
  };

  const subtotal = getTotalPrice();
  const discount = Math.floor((subtotal * discountPercentage) / 100);
  const shipping = subtotal > 5000 ? 0 : 300;
  const tax = Math.floor((subtotal - discount) * 0.12);
  const total = subtotal - discount + shipping + tax;

  const handleApplyCoupon = (couponCode) => {
    const coupons = {
      WELCOME10: 10,
      SAVE20: 20,
      FLAT50: 50,
    };

    if (coupons[couponCode.toUpperCase()]) {
      setAppliedCoupon(couponCode.toUpperCase());
      setDiscountPercentage(coupons[couponCode.toUpperCase()]);
    } else {
      alert("Invalid coupon code");
    }
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    setIsCheckoutOpen(true);
  };

  return (
    <div className="cart-page">
      <Navbar />

      <style>{`
        :root {
          --deep-maroon: #4A0E0E;
          --rose-gold: #E5B4A2;
          --gold-bright: #C2A35D;
          --ivory: #FDFBF7;
          --success-green: #388e3c;
        }

        .cart-page {
          background: var(--ivory);
          min-height: 100vh;
          padding-top: 80px;
          font-family: 'Montserrat', sans-serif;
        }

        .cart-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 40px 6%;
        }

        @media (max-width: 768px) {
          .cart-container {
            padding: 25px 4%;
          }
        }

        @media (max-width: 480px) {
          .cart-container {
            padding: 20px 3%;
          }
        }

        .cart-header {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 40px;
        }

        @media (max-width: 480px) {
          .cart-header {
            gap: 10px;
            margin-bottom: 25px;
          }
        }

        .cart-back-btn {
          background: none;
          border: none;
          color: var(--deep-maroon);
          font-size: 1.3rem;
          cursor: pointer;
          transition: all 0.3s;
          padding: 8px;
        }

        @media (max-width: 480px) {
          .cart-back-btn {
            font-size: 1.1rem;
            padding: 6px;
          }
        }

        .cart-back-btn:hover {
          transform: translateX(-5px);
        }

        .cart-title {
          font-size: 2.5rem;
          color: var(--deep-maroon);
          font-weight: 700;
          margin: 0;
          font-family: 'Cormorant Garamond', serif;
        }

        @media (max-width: 768px) {
          .cart-title {
            font-size: 1.8rem;
          }
        }

        @media (max-width: 480px) {
          .cart-title {
            font-size: 1.4rem;
          }
        }

        .cart-content {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 40px;
        }

        @media (max-width: 768px) {
          .cart-content {
            grid-template-columns: 1fr;
            gap: 20px;
          }
        }

        /* Empty Cart State */
        .empty-cart {
          grid-column: 1 / -1;
          text-align: center;
          padding: 80px 40px;
          background: white;
          border-radius: 15px;
          box-shadow: 0 10px 30px rgba(74, 14, 14, 0.08);
        }

        @media (max-width: 480px) {
          .empty-cart {
            padding: 40px 20px;
            border-radius: 10px;
          }
        }

        .empty-cart-icon {
          font-size: 5rem;
          color: var(--rose-gold);
          margin-bottom: 20px;
          opacity: 0.5;
        }

        .empty-cart-text {
          font-size: 1.3rem;
          color: var(--deep-maroon);
          margin-bottom: 10px;
          font-weight: 600;
        }

        .empty-cart-subtext {
          color: #666;
          margin-bottom: 30px;
          font-size: 0.95rem;
        }

        .continue-shopping-btn {
          background: var(--gold-bright);
          color: white;
          border: none;
          padding: 12px 40px;
          border-radius: 25px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          font-size: 0.95rem;
        }

        .continue-shopping-btn:hover {
          background: var(--deep-maroon);
          transform: translateY(-2px);
        }

        /* Cart Items */
        .cart-items-section {
          background: white;
          border-radius: 15px;
          padding: 30px;
          box-shadow: 0 10px 30px rgba(74, 14, 14, 0.08);
        }

        @media (max-width: 480px) {
          .cart-items-section {
            padding: 15px;
            border-radius: 10px;
          }
        }

        .cart-item {
          display: grid;
          grid-template-columns: 150px 1fr auto;
          gap: 25px;
          padding: 20px;
          border-bottom: 1px solid #eee;
          align-items: center;
          transition: all 0.3s;
        }

        @media (max-width: 768px) {
          .cart-item {
            grid-template-columns: 120px 1fr;
            gap: 15px;
            padding: 15px;
          }
        }

        @media (max-width: 480px) {
          .cart-item {
            grid-template-columns: 100px 1fr;
            gap: 12px;
            padding: 12px;
          }
        }

        .cart-item:last-child {
          border-bottom: none;
        }

        .cart-item:hover {
          background: rgba(194, 163, 93, 0.05);
        }

        .cart-item-image {
          width: 150px;
          height: 180px;
          border-radius: 10px;
          overflow: hidden;
          background: #f5f5f5;
        }

        @media (max-width: 768px) {
          .cart-item-image {
            width: 110px;
            height: 140px;
            border-radius: 8px;
          }
        }

        @media (max-width: 480px) {
          .cart-item-image {
            width: 90px;
            height: 120px;
            border-radius: 6px;
          }
        }

        .cart-item-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .cart-item-details {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .cart-item-name {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--deep-maroon);
        }

        .cart-item-brand {
          color: #777;
          font-size: 0.9rem;
        }

        .cart-item-price {
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--gold-bright);
          margin-top: 8px;
        }

        .cart-item-actions {
          display: flex;
          align-items: center;
          gap: 40px;
        }

        @media (max-width: 768px) {
          .cart-item-actions {
            grid-column: 1 / -1;
            gap: 15px;
            margin-top: 12px;
            padding-top: 12px;
            border-top: 1px solid #eee;
            justify-content: space-between;
          }
        }

        @media (max-width: 480px) {
          .cart-item-actions {
            gap: 10px;
            margin-top: 10px;
            padding-top: 10px;
          }
        }

        .quantity-control {
          display: flex;
          align-items: center;
          border: 1px solid #ddd;
          border-radius: 5px;
          overflow: hidden;
        }

        @media (max-width: 480px) {
          .quantity-control {
            order: -1;
          }
        }

        .qty-btn {
          background: none;
          border: none;
          padding: 8px 12px;
          color: var(--deep-maroon);
          cursor: pointer;
          transition: all 0.2s;
          font-size: 0.9rem;
        }

        @media (max-width: 480px) {
          .qty-btn {
            padding: 6px 8px;
            font-size: 0.8rem;
          }
        }

        .qty-btn:hover {
          background: var(--ivory);
        }

        .qty-input {
          border: none;
          width: 50px;
          text-align: center;
          font-weight: 600;
          color: var(--deep-maroon);
          font-family: 'Montserrat', sans-serif;
        }

        @media (max-width: 480px) {
          .qty-input {
            width: 40px;
            font-size: 0.9rem;
          }
        }

        .qty-input::-webkit-outer-spin-button,
        .qty-input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        .remove-btn {
          background: #ffe5e5;
          border: none;
          padding: 10px 15px;
          border-radius: 5px;
          color: #e74c3c;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
        }

        @media (max-width: 480px) {
          .remove-btn {
            padding: 8px 10px;
            font-size: 0.8rem;
            gap: 4px;
            flex: 1;
            justify-content: center;
          }
        }

        .remove-btn:hover {
          background: #e74c3c;
          color: white;
        }

        /* Order Summary */
        .order-summary {
          background: white;
          border-radius: 15px;
          padding: 30px;
          box-shadow: 0 10px 30px rgba(74, 14, 14, 0.08);
          height: fit-content;
          position: sticky;
          top: 100px;
        }

        .order-summary {
          background: white;
          border-radius: 15px;
          padding: 30px;
          box-shadow: 0 10px 30px rgba(74, 14, 14, 0.08);
          height: fit-content;
          position: sticky;
          top: 100px;
        }

        @media (max-width: 768px) {
          .order-summary {
            position: static;
            top: auto;
          }
        }

        .summary-title {
          font-size: 1.3rem;
          font-weight: 700;
          color: var(--deep-maroon);
          margin-bottom: 25px;
          border-bottom: 2px solid var(--gold-bright);
          padding-bottom: 15px;
        }

        @media (max-width: 480px) {
          .summary-title {
            font-size: 1.1rem;
            margin-bottom: 15px;
            padding-bottom: 10px;
          }
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          color: #666;
          font-size: 0.95rem;
        }

        @media (max-width: 480px) {
          .summary-row {
            font-size: 0.85rem;
            padding: 10px 0;
          }
        }

        .summary-row.total {
          border-top: 2px solid #eee;
          padding-top: 15px;
          margin-top: 15px;
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--deep-maroon);
        }

        @media (max-width: 480px) {
          .summary-row.total {
            font-size: 1rem;
            padding-top: 10px;
            margin-top: 10px;
          }
        }

        .summary-row.discount {
          color: var(--success-green);
          font-weight: 600;
        }

        .summary-row.free-shipping {
          color: var(--success-green);
          font-weight: 600;
        }

        /* Coupon Section */
        .coupon-section {
          margin-bottom: 25px;
          padding-bottom: 20px;
          border-bottom: 1px solid #eee;
        }

        @media (max-width: 480px) {
          .coupon-section {
            margin-bottom: 15px;
            padding-bottom: 15px;
          }
        }

        .coupon-label {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--deep-maroon);
          margin-bottom: 10px;
          display: block;
        }

        @media (max-width: 480px) {
          .coupon-label {
            font-size: 0.8rem;
            margin-bottom: 8px;
          }
        }

        .coupon-input-group {
          display: flex;
          gap: 8px;
        }

        @media (max-width: 480px) {
          .coupon-input-group {
            gap: 5px;
          }
        }

        .coupon-input {
          flex: 1;
          padding: 10px 12px;
          border: 1px solid #ddd;
          border-radius: 5px;
          font-family: 'Montserrat', sans-serif;
          font-weight: 600;
          text-transform: uppercase;
          color: var(--deep-maroon);
        }

        @media (max-width: 480px) {
          .coupon-input {
            padding: 8px 10px;
            font-size: 0.85rem;
          }
        }

        .coupon-input::placeholder {
          color: #999;
        }

        .coupon-apply-btn {
          padding: 10px 20px;
          background: var(--rose-gold);
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.85rem;
          transition: all 0.3s;
          white-space: nowrap;
        }

        @media (max-width: 480px) {
          .coupon-apply-btn {
            padding: 8px 12px;
            font-size: 0.75rem;
          }
        }

        .coupon-apply-btn:hover {
          background: var(--deep-maroon);
        }

        .coupon-hint {
          font-size: 0.75rem;
          color: #999;
          margin-top: 8px;
        }

        @media (max-width: 480px) {
          .coupon-hint {
            font-size: 0.65rem;
          }
        }

        /* Checkout Button */
        .checkout-btn {
          width: 100%;
          padding: 15px;
          background: var(--gold-bright);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-top: 20px;
        }

        .checkout-btn:hover {
          background: var(--deep-maroon);
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(74, 14, 14, 0.2);
        }

        .checkout-btn:disabled {
          background: #ccc;
          cursor: not-allowed;
          transform: none;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .cart-container {
            padding: 20px 4%;
          }

          .cart-title {
            font-size: 1.8rem;
          }

          .cart-content {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .order-summary {
            position: static;
          }

          .cart-item {
            grid-template-columns: 120px 1fr;
            gap: 15px;
          }

          .cart-item-image {
            width: 120px;
            height: 150px;
          }

          .cart-item-actions {
            grid-column: 1 / -1;
            gap: 20px;
            margin-top: 10px;
            padding-top: 10px;
            border-top: 1px solid #eee;
          }

          .quantity-control {
            flex-shrink: 0;
          }

          .remove-btn {
            flex: 1;
          }
        }

        @media (max-width: 480px) {
          .cart-item {
            grid-template-columns: 100px 1fr;
            gap: 10px;
            padding: 15px;
          }

          .cart-item-image {
            width: 100px;
            height: 120px;
          }

          .cart-items-section {
            padding: 15px;
          }

          .order-summary {
            padding: 20px;
          }
        }
      `}</style>

      <div className="cart-container">
        <div className="cart-header">
          <button
            className="cart-back-btn"
            onClick={() => navigate(-1)}
            title="Go back"
          >
            <FaArrowLeft />
          </button>
          <h1 className="cart-title">My Shopping Bag</h1>
        </div>

        <div className="cart-content">
          {cart.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-cart-icon">
                <FaShoppingBag />
              </div>
              <div className="empty-cart-text">Your cart is empty</div>
              <div className="empty-cart-subtext">
                Explore our beautiful lehenga collection and add your favorites
              </div>
              <button
                className="continue-shopping-btn"
                onClick={() => navigate("/explore")}
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="cart-items-section">
                {cart.map((item) => (
                  <div key={item.cartItemId} className="cart-item">
                    <div className="cart-item-image">
                      <img
                        src={resolveImageUrl(item)}
                        alt={item.product_title || item.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://via.placeholder.com/150x180?text=No+image";
                        }}
                      />
                    </div>

                    <div className="cart-item-details">
                      <div className="cart-item-name">
                        {item.product_title || item.name}
                      </div>
                      <div className="cart-item-brand">
                        {item.brand || "SoniMahal"}
                      </div>
                      {(item.selectedSize || item.selectedColor) && (
                        <div
                          className="cart-item-options"
                          style={{
                            fontSize: "0.85rem",
                            color: "#888",
                            marginTop: "6px",
                          }}
                        >
                          {item.selectedSize && (
                            <div>Size: {item.selectedSize}</div>
                          )}
                          {item.selectedColor && (
                            <div>Color: {item.selectedColor}</div>
                          )}
                        </div>
                      )}
                      <div className="cart-item-price">{item.price}</div>
                    </div>

                    <div className="cart-item-actions">
                      <div className="quantity-control">
                        <button
                          className="qty-btn"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                        >
                          <FaMinus />
                        </button>
                        <input
                          type="number"
                          className="qty-input"
                          value={item.quantity}
                          onChange={(e) => {
                            const qty = parseInt(e.target.value) || 1;
                            if (qty > 0) {
                              updateQuantity(item.id, qty);
                            }
                          }}
                          min="1"
                        />
                        <button
                          className="qty-btn"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          <FaPlus />
                        </button>
                      </div>

                      <button
                        className="remove-btn"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <FaTrash /> Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="order-summary">
                <div className="summary-title">Order Summary</div>

                {/* Coupon Section */}
                <div className="coupon-section">
                  <label className="coupon-label">Apply Coupon</label>
                  <div className="coupon-input-group">
                    <input
                      type="text"
                      className="coupon-input"
                      placeholder="Enter code"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          const input = e.target;
                          handleApplyCoupon(input.value);
                          input.value = "";
                        }
                      }}
                    />
                    <button
                      className="coupon-apply-btn"
                      onClick={(e) => {
                        const input =
                          e.target.parentElement.querySelector(".coupon-input");
                        handleApplyCoupon(input.value);
                        input.value = "";
                      }}
                    >
                      Apply
                    </button>
                  </div>
                  <div className="coupon-hint">
                    Try: WELCOME10, SAVE20, FLAT50
                  </div>
                </div>

                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString("en-IN")}</span>
                </div>

                {discountPercentage > 0 && (
                  <div className="summary-row discount">
                    <span>
                      Discount ({appliedCoupon}) ({discountPercentage}%)
                    </span>
                    <span>-₹{discount.toLocaleString("en-IN")}</span>
                  </div>
                )}

                <div className="summary-row">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? "free-shipping" : ""}>
                    {shipping === 0 ? (
                      <>
                        <span className="free-shipping">Free</span>
                      </>
                    ) : (
                      `₹${shipping}`
                    )}
                  </span>
                </div>

                <div className="summary-row">
                  <span>Tax (12% GST)</span>
                  <span>₹{tax.toLocaleString("en-IN")}</span>
                </div>

                <div className="summary-row total">
                  <span>Total</span>
                  <span>₹{total.toLocaleString("en-IN")}</span>
                </div>

                <button
                  className="checkout-btn"
                  onClick={handleCheckout}
                  disabled={cart.length === 0}
                >
                  Proceed to Checkout
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cart}
        totalAmount={total}
      />
    </div>
  );
};

export default Cart;
