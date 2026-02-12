import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaTrash, FaShoppingBag, FaHeart } from "react-icons/fa";
import Navbar from "../components/Navbar";
import { CartContext } from "../context/CartContext";

const Wishlist = () => {
  const navigate = useNavigate();
  const { wishlist, removeFromWishlist, addToCart } = useContext(CartContext);

  const handleAddToCart = (item) => {
    addToCart(item);
    alert("Added to cart!");
  };

  return (
    <div className="wishlist-page">
      <Navbar />

      <style>{`
        :root {
          --deep-maroon: #4A0E0E;
          --rose-gold: #E5B4A2;
          --gold-bright: #C2A35D;
          --ivory: #FDFBF7;
        }

        .wishlist-page {
          background: var(--ivory);
          min-height: 100vh;
          padding-top: 80px;
          font-family: 'Montserrat', sans-serif;
        }

        .wishlist-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 6%;
        }

        .wishlist-header {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 40px;
        }

        @media (max-width: 768px) {
          .wishlist-container {
            padding: 25px 4%;
          }
        }

        @media (max-width: 480px) {
          .wishlist-container {
            padding: 20px 3%;
          }

          .wishlist-header {
            gap: 10px;
            margin-bottom: 25px;
          }
        }

        .wishlist-back-btn {
          background: none;
          border: none;
          color: var(--deep-maroon);
          font-size: 1.3rem;
          cursor: pointer;
          transition: all 0.3s;
          padding: 8px;
          flex-shrink: 0;
        }

        @media (max-width: 480px) {
          .wishlist-back-btn {
            font-size: 1.1rem;
            padding: 6px;
          }
        }

        .wishlist-back-btn:hover {
          transform: translateX(-5px);
        }

        .wishlist-title {
          font-size: 2.5rem;
          color: var(--deep-maroon);
          font-weight: 700;
          margin: 0;
          font-family: 'Cormorant Garamond', serif;
        }

        @media (max-width: 768px) {
          .wishlist-title {
            font-size: 1.8rem;
          }
        }

        @media (max-width: 480px) {
          .wishlist-title {
            font-size: 1.4rem;
          }
        }

        /* Empty Wishlist State */
        .empty-wishlist {
          text-align: center;
          padding: 80px 40px;
          background: white;
          border-radius: 15px;
          box-shadow: 0 10px 30px rgba(74, 14, 14, 0.08);
        }

        @media (max-width: 480px) {
          .empty-wishlist {
            padding: 40px 20px;
            border-radius: 10px;
          }
        }

        .empty-wishlist-icon {
          font-size: 5rem;
          color: var(--rose-gold);
          margin-bottom: 20px;
          opacity: 0.5;
        }

        @media (max-width: 480px) {
          .empty-wishlist-icon {
            font-size: 3.5rem;
            margin-bottom: 15px;
          }
        }

        .empty-wishlist-text {
          font-size: 1.3rem;
          color: var(--deep-maroon);
          margin-bottom: 10px;
          font-weight: 600;
        }

        @media (max-width: 480px) {
          .empty-wishlist-text {
            font-size: 1.1rem;
          }
        }

        .empty-wishlist-subtext {
          color: #666;
          margin-bottom: 30px;
          font-size: 0.95rem;
        }

        @media (max-width: 480px) {
          .empty-wishlist-subtext {
            font-size: 0.85rem;
            margin-bottom: 20px;
          }
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

        @media (max-width: 480px) {
          .continue-shopping-btn {
            padding: 10px 30px;
            font-size: 0.85rem;
          }
        }

        .continue-shopping-btn:hover {
          background: var(--deep-maroon);
          transform: translateY(-2px);
        }

        /* Wishlist Grid */
        .wishlist-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 30px;
        }

        @media (max-width: 1024px) {
          .wishlist-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
          }
        }

        @media (max-width: 768px) {
          .wishlist-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
          }
        }

        @media (max-width: 480px) {
          .wishlist-grid {
            grid-template-columns: 1fr;
            gap: 15px;
          }
        }

        .wishlist-item {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(74, 14, 14, 0.08);
          transition: all 0.3s;
        }

        .wishlist-item:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 50px rgba(74, 14, 14, 0.12);
        }

        .wishlist-item-image {
          width: 100%;
          height: 300px;
          overflow: hidden;
          background: #f5f5f5;
          position: relative;
        }

        @media (max-width: 768px) {
          .wishlist-item-image {
            height: 260px;
          }
        }

        @media (max-width: 480px) {
          .wishlist-item-image {
            height: 240px;
          }
        }

        .wishlist-item-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s;
        }

        .wishlist-item:hover .wishlist-item-image img {
          transform: scale(1.05);
        }

        .wishlist-item-heart {
          position: absolute;
          top: 15px;
          right: 15px;
          font-size: 1.5rem;
          color: var(--rose-gold);
          cursor: pointer;
          background: white;
          padding: 8px 10px;
          border-radius: 50%;
          transition: all 0.3s;
          box-shadow: 0 4px 12px rgba(224, 107, 107, 0.2);
        }

        .wishlist-item-heart:hover {
          transform: scale(1.15);
        }

        .wishlist-item-details {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .wishlist-item-name {
          font-size: 1rem;
          font-weight: 600;
          color: var(--deep-maroon);
          line-height: 1.3;
        }

        .wishlist-item-brand {
          color: #777;
          font-size: 0.85rem;
        }

        .wishlist-item-price {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--gold-bright);
          margin-top: 8px;
        }

        .wishlist-item-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-top: 15px;
        }

        .wishlist-action-btn {
          padding: 10px 12px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.85rem;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .btn-add-cart {
          background: var(--gold-bright);
          color: white;
        }

        .btn-add-cart:hover {
          background: var(--deep-maroon);
          transform: translateY(-2px);
        }

        .btn-remove {
          background: #ffe5e5;
          color: #e74c3c;
        }

        .btn-remove:hover {
          background: #e74c3c;
          color: white;
        }

        @media (max-width: 768px) {
          .wishlist-container {
            padding: 20px 4%;
          }

          .wishlist-title {
            font-size: 1.8rem;
          }

          .wishlist-grid {
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 20px;
          }

          .wishlist-item-image {
            height: 240px;
          }
        }

        @media (max-width: 480px) {
          .wishlist-grid {
            grid-template-columns: 1fr;
          }

          .wishlist-item-image {
            height: 280px;
          }

          .wishlist-item-details {
            padding: 15px;
          }
        }
      `}</style>

      <div className="wishlist-container">
        <div className="wishlist-header">
          <button
            className="wishlist-back-btn"
            onClick={() => navigate(-1)}
            title="Go back"
          >
            <FaArrowLeft />
          </button>
          <h1 className="wishlist-title">My Wishlist</h1>
        </div>

        {wishlist.length === 0 ? (
          <div className="empty-wishlist">
            <div className="empty-wishlist-icon">
              <FaHeart />
            </div>
            <div className="empty-wishlist-text">Your wishlist is empty</div>
            <div className="empty-wishlist-subtext">
              Save your favorite lehengas to your wishlist and view them here
            </div>
            <button
              className="continue-shopping-btn"
              onClick={() => navigate("/explore")}
            >
              Start Exploring
            </button>
          </div>
        ) : (
          <div className="wishlist-grid">
            {wishlist.map((item) => (
              <div key={item.id} className="wishlist-item">
                <div className="wishlist-item-image">
                  <img
                    src={
                      item.image_url
                        ? new URL(item.image_url.trim(), import.meta.url).href
                        : "https://via.placeholder.com/280x300?text=No+image"
                    }
                    alt={item.product_title}
                    onClick={() =>
                      navigate(`/product/${item.id}`, { state: item })
                    }
                    style={{ cursor: "pointer" }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://via.placeholder.com/280x300?text=No+image";
                    }}
                  />
                  <div
                    className="wishlist-item-heart"
                    onClick={() => removeFromWishlist(item.id)}
                    title="Remove from wishlist"
                  >
                    <FaHeart />
                  </div>
                </div>

                <div className="wishlist-item-details">
                  <div
                    className="wishlist-item-name"
                    onClick={() =>
                      navigate(`/product/${item.id}`, { state: item })
                    }
                    style={{ cursor: "pointer" }}
                  >
                    {item.product_title}
                  </div>
                  <div className="wishlist-item-brand">{item.brand}</div>
                  <div className="wishlist-item-price">{item.price}</div>

                  <div className="wishlist-item-actions">
                    <button
                      className="wishlist-action-btn btn-add-cart"
                      onClick={() => handleAddToCart(item)}
                    >
                      <FaShoppingBag /> Add
                    </button>
                    <button
                      className="wishlist-action-btn btn-remove"
                      onClick={() => removeFromWishlist(item.id)}
                    >
                      <FaTrash /> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
