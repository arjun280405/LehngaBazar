import React, { useState } from "react";
import { FaTimes, FaShoppingBag } from "react-icons/fa";

const OptionsModal = ({ isOpen, onClose, product, onAddToCart }) => {
  const [selectedSize, setSelectedSize] = useState("L");
  const [selectedColor, setSelectedColor] = useState("Maroon");
  const [quantity, setQuantity] = useState(1);

  if (!isOpen) return null;

  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const colors = ["Maroon", "Gold", "Red", "Wine", "Coral"];

  const handleAddToCart = () => {
    onAddToCart({
      ...product,
      selectedSize,
      selectedColor,
      quantity: parseInt(quantity),
    });
    setSelectedSize("L");
    setSelectedColor("Maroon");
    setQuantity(1);
    onClose();
  };

  return (
    <div className="options-modal-overlay" onClick={onClose}>
      <style>{`
        .options-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .options-modal-content {
          background: white;
          border-radius: 15px;
          padding: 40px;
          max-width: 500px;
          width: 90%;
          box-shadow: 0 20px 60px rgba(74, 14, 14, 0.2);
          animation: slideUp 0.3s ease;
          font-family: 'Montserrat', sans-serif;
        }

        @keyframes slideUp {
          from {
            transform: translateY(30px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .options-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          border-bottom: 2px solid #f0f0f0;
          padding-bottom: 15px;
        }

        .options-modal-title {
          font-size: 1.8rem;
          font-weight: 700;
          color: #4a0e0e;
          font-family: 'Cormorant Garamond', serif;
        }

        .options-modal-close {
          background: none;
          border: none;
          font-size: 1.8rem;
          cursor: pointer;
          color: #999;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: 0.3s;
        }

        .options-modal-close:hover {
          color: #4a0e0e;
          transform: rotate(90deg);
        }

        .options-group {
          margin-bottom: 28px;
        }

        .options-label {
          display: block;
          font-weight: 700;
          color: #4a0e0e;
          margin-bottom: 12px;
          font-size: 0.95rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .options-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
          gap: 10px;
        }

        .option-btn {
          padding: 12px;
          border: 2px solid #ddd;
          border-radius: 8px;
          background: white;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.9rem;
          transition: all 0.3s;
          color: #333;
          font-family: 'Montserrat', sans-serif;
        }

        .option-btn:hover {
          border-color: #c2a35d;
          background: #fdf9f4;
        }

        .option-btn.active {
          background: #4a0e0e;
          color: white;
          border-color: #4a0e0e;
          box-shadow: 0 4px 12px rgba(74, 14, 14, 0.3);
        }

        .quantity-section {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .quantity-control {
          display: flex;
          align-items: center;
          border: 2px solid #ddd;
          border-radius: 8px;
          background: white;
          overflow: hidden;
        }

        .qty-btn {
          background: none;
          border: none;
          padding: 10px 12px;
          cursor: pointer;
          color: #4a0e0e;
          font-size: 1rem;
          transition: 0.3s;
          font-weight: 600;
        }

        .qty-btn:hover {
          background: #f5f5f5;
        }

        .qty-input {
          border: none;
          outline: none;
          width: 50px;
          text-align: center;
          font-size: 0.95rem;
          font-weight: 600;
          padding: 0 5px;
        }

        .qty-input::-webkit-outer-spin-button,
        .qty-input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        .qty-display {
          font-weight: 600;
          color: #4a0e0e;
          margin-left: auto;
        }

        .options-footer {
          display: flex;
          gap: 15px;
          margin-top: 35px;
          padding-top: 25px;
          border-top: 2px solid #f0f0f0;
        }

        .options-cancel-btn {
          flex: 1;
          padding: 15px;
          border: 2px solid #ddd;
          background: white;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 700;
          font-size: 0.95rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          transition: 0.3s;
          color: #333;
          font-family: 'Montserrat', sans-serif;
        }

        .options-cancel-btn:hover {
          background: #f5f5f5;
          border-color: #ccc;
        }

        .options-add-btn {
          flex: 1;
          padding: 15px;
          background: #4a0e0e;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 700;
          font-size: 0.95rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          font-family: 'Montserrat', sans-serif;
        }

        .options-add-btn:hover {
          background: #6b1414;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(74, 14, 14, 0.3);
        }

        .options-add-btn:active {
          transform: translateY(0);
        }

        @media (max-width: 480px) {
          .options-modal-content {
            padding: 25px;
          }

          .options-modal-title {
            font-size: 1.4rem;
          }

          .options-grid {
            grid-template-columns: repeat(3, 1fr);
          }

          .options-footer {
            flex-direction: column;
          }

          .options-footer button {
            width: 100%;
          }
        }
      `}</style>

      <div
        className="options-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="options-modal-header">
          <h2 className="options-modal-title">Select Options</h2>
          <button className="options-modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {/* Size Selection */}
        <div className="options-group">
          <label className="options-label">Size</label>
          <div className="options-grid">
            {sizes.map((size) => (
              <button
                key={size}
                className={`option-btn ${selectedSize === size ? "active" : ""}`}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Color Selection */}
        <div className="options-group">
          <label className="options-label">Color</label>
          <div className="options-grid">
            {colors.map((color) => (
              <button
                key={color}
                className={`option-btn ${selectedColor === color ? "active" : ""}`}
                onClick={() => setSelectedColor(color)}
              >
                {color}
              </button>
            ))}
          </div>
        </div>

        {/* Quantity Selection */}
        <div className="options-group">
          <label className="options-label">Quantity</label>
          <div className="quantity-section">
            <div className="quantity-control">
              <button
                className="qty-btn"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                −
              </button>
              <input
                type="number"
                className="qty-input"
                value={quantity}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 1;
                  setQuantity(Math.max(1, val));
                }}
              />
              <button
                className="qty-btn"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </button>
            </div>
            <div className="qty-display">x {quantity}</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="options-footer">
          <button className="options-cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="options-add-btn" onClick={handleAddToCart}>
            <FaShoppingBag /> Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default OptionsModal;
