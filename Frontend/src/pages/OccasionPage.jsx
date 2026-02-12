import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaHeart, FaStar } from "react-icons/fa";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

// Import datasets
import lehngaDataset from "../data/lehngaDataset.json";
import lehngaMehndi from "../data/lehngaMehndi.json";
import lehngaHaldi from "../data/lehngaHaldi.json";

// Import all product images
import logoDefault from "../assets/logos/logo.png";
import mehndiCatImg from "../assets/categories/Mehndi.webp";
import haldiCatImg from "../assets/categories/Haldi.jpeg";

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

import lehenga01 from "../assets/products/lehenga-01.avif";
import lehenga02 from "../assets/products/lehenga-02.avif";
import lehenga03 from "../assets/products/lehenga-03.avif";
import lehenga04 from "../assets/products/lehenga-04.avif";
import lehenga05 from "../assets/products/lehenga-05.avif";
import lehenga06 from "../assets/products/lehenga-06.avif";
import lehenga07 from "../assets/products/lehenga-07.avif";
import lehenga08 from "../assets/products/lehenga-08.avif";
import lehenga09 from "../assets/products/lehenga-09.avif";
import lehenga10 from "../assets/products/lehenga-10.avif";
import lehenga11 from "../assets/products/lehenga-11.avif";
import lehenga12 from "../assets/products/lehenga-12.avif";
import lehenga13 from "../assets/products/lehenga-13.avif";
import lehenga14 from "../assets/products/lehenga-14.avif";
import lehenga15 from "../assets/products/lehenga-15.avif";
import lehenga16 from "../assets/products/lehenga-16.avif";
import lehenga17 from "../assets/products/lehenga-17.avif";
import lehenga18 from "../assets/products/lehenga-18.avif";
import lehenga19 from "../assets/products/lehenga-19.avif";

// Image mapping utility
const imageMap = {
  "../assets/categories/Mehndi.webp": mehndiCatImg,
  "../assets/categories/Haldi.jpeg": haldiCatImg,
  // Mehndi images
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
  // Haldi images
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
  "../assets/products/lehenga-01.avif": lehenga01,
  "../assets/products/lehenga-02.avif": lehenga02,
  "../assets/products/lehenga-03.avif": lehenga03,
  "../assets/products/lehenga-04.avif": lehenga04,
  "../assets/products/lehenga-05.avif": lehenga05,
  "../assets/products/lehenga-06.avif": lehenga06,
  "../assets/products/lehenga-07.avif": lehenga07,
  "../assets/products/lehenga-08.avif": lehenga08,
  "../assets/products/lehenga-09.avif": lehenga09,
  "../assets/products/lehenga-10.avif": lehenga10,
  "../assets/products/lehenga-11.avif": lehenga11,
  "../assets/products/lehenga-12.avif": lehenga12,
  "../assets/products/lehenga-13.avif": lehenga13,
  "../assets/products/lehenga-14.avif": lehenga14,
  "../assets/products/lehenga-15.avif": lehenga15,
  "../assets/products/lehenga-16.avif": lehenga16,
  "../assets/products/lehenga-17.avif": lehenga17,
  "../assets/products/lehenga-18.avif": lehenga18,
  "../assets/products/lehenga-19.avif": lehenga19,
};

// Helper function to resolve image URL
const getImageUrl = (imageUrl) => {
  if (!imageUrl) return logoDefault;
  if (/^https?:\/\//i.test(imageUrl)) return imageUrl;
  return imageMap[imageUrl] || logoDefault;
};

const OccasionPage = () => {
  const { occasion } = useParams();
  const navigate = useNavigate();
  const { serverUrl } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [imageErrors, setImageErrors] = useState({});
  const [favorites, setFavorites] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const toggleFavorite = (id) => {
    setFavorites((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const normalizeProduct = (item) => ({
    ...item,
    id: item.id || item._id,
  });

  // Load products based on occasion
  useEffect(() => {
    const getFallbackData = () => {
      switch (occasion) {
        case "mehndi":
          return lehngaMehndi;
        case "haldi":
          return lehngaHaldi;
        case "wedding":
        case "reception":
          return lehngaDataset;
        default:
          return lehngaDataset;
      }
    };

    let isMounted = true;
    const fetchProducts = async () => {
      setLoading(true);
      setFetchError("");

      const categoryMap = {
        mehndi: "Mehndi",
        haldi: "Haldi",
        wedding: "Bridal",
        reception: "Traditional",
      };
      const category = categoryMap[occasion];
      const url = category
        ? `${serverUrl}/api/products?category=${encodeURIComponent(category)}`
        : `${serverUrl}/api/products`;

      try {
        const response = await axios.get(url);
        const apiProducts = (response.data.products || []).map(
          normalizeProduct,
        );
        if (isMounted) {
          if (apiProducts.length > 0) {
            setProducts(apiProducts);
          } else {
            const fallbackProducts = getFallbackData().map(normalizeProduct);
            setProducts(fallbackProducts);
          }
          setLoading(false);
        }
      } catch (error) {
        console.error("Failed to fetch products, using local data:", error);
        const fallbackProducts = getFallbackData().map(normalizeProduct);
        if (isMounted) {
          setProducts(fallbackProducts);
          setFetchError("Using local product data. Backend unavailable.");
          setLoading(false);
        }
      }
    };

    fetchProducts();
    return () => {
      isMounted = false;
    };
  }, [occasion, serverUrl]);

  const handleImageError = (productId) => {
    setImageErrors((prev) => ({ ...prev, [productId]: true }));
  };

  const getOccasionTitle = () => {
    switch (occasion) {
      case "mehndi":
        return "Mehndi Collection";
      case "haldi":
        return "Haldi Collection";
      case "wedding":
        return "Wedding Collection";
      case "reception":
        return "Reception Collection";
      default:
        return "Collection";
    }
  };

  const getBackgroundColor = () => {
    switch (occasion) {
      case "mehndi":
        return "linear-gradient(180deg, rgba(255,235,59,0.1), rgba(255,193,7,0.1))";
      case "haldi":
        return "linear-gradient(180deg, rgba(255,215,0,0.1), rgba(255,235,59,0.1))";
      case "wedding":
        return "linear-gradient(180deg, rgba(229,11,11,0.05), rgba(229,180,162,0.05))";
      case "reception":
        return "linear-gradient(180deg, rgba(74,14,14,0.05), rgba(229,180,162,0.1))";
      default:
        return "linear-gradient(180deg, #fff, #fbf8f6)";
    }
  };

  const parsePriceValue = (value) => {
    if (value === undefined || value === null) return null;
    if (typeof value === "number") return value;
    if (typeof value === "string") {
      const cleaned = value.replace(/[^0-9]/g, "");
      if (!cleaned) return null;
      return Number(cleaned);
    }
    return null;
  };

  const formatRupees = (value) => {
    if (value === undefined || value === null) return "Rs. --";
    if (typeof value === "number") {
      return `Rs. ${value.toLocaleString("en-IN")}`;
    }
    if (typeof value === "string") {
      const numeric = parsePriceValue(value);
      return numeric ? `Rs. ${numeric.toLocaleString("en-IN")}` : value;
    }
    return "Rs. --";
  };

  const getOldPriceValue = (product, priceValue) => {
    const rawOld =
      product?.oldPrice ||
      product?.originalPrice ||
      product?.mrp ||
      product?.compareAtPrice;
    const parsed = parsePriceValue(rawOld);
    if (parsed) return parsed;
    return priceValue ? Math.round(priceValue * 1.35) : null;
  };

  const getDiscountPercent = (priceValue, oldPriceValue) => {
    if (!priceValue || !oldPriceValue || oldPriceValue <= priceValue) {
      return null;
    }
    return Math.round(((oldPriceValue - priceValue) / oldPriceValue) * 100);
  };

  const getRatingValue = (product) => {
    if (product?.rating) return Number(product.rating);
    if (product?.review) {
      const match = product.review.match(/([\d.]+)\//);
      if (match) return Number(match[1]);
    }
    return 4.3;
  };

  const getRatingCount = (product) => {
    return product?.ratingCount || product?.likes || "1.6k";
  };

  const shouldShowFewLeft = (product) => {
    if (!product) return false;
    return product.stock === undefined ? true : product.stock <= 10;
  };

  return (
    <div style={{ background: getBackgroundColor(), minHeight: "100vh" }}>
      <Navbar />
      <div
        style={{
          padding: "80px 6% 40px",
          fontFamily: "Cormorant Garamond, serif",
        }}
      >
        <style>{`
        .occasion-header { display: flex; align-items: center; margin-bottom: 40px; gap: 15px; }
        .occasion-back { background: none; border: none; color: #4A0E0E; cursor: pointer; font-size: 1.2rem; margin-right: 16px; padding: 8px; flex-shrink: 0; transition: transform 0.2s; }
        .occasion-back:hover { transform: translateX(-4px); }
        .occasion-title { font-size: 2.5rem; font-weight: 300; color: #4A0E0E; margin: 0; }
        .occasion-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 28px; }
        .occasion-card { background: #fff; border-radius: 10px; overflow: hidden; border: 1px solid rgba(0,0,0,0.06); cursor: pointer; transition: transform .25s, box-shadow .25s; }
        .occasion-card:hover { transform: translateY(-6px); box-shadow: 0 16px 36px rgba(0,0,0,0.12); }
        .occasion-image-wrap { position: relative; clip-path: path("M 0 12% Q 50% 0% 100% 12% L 100% 100% L 0 100% Z"); }
        .occasion-image { width: 100%; height: 420px; object-fit: cover; display: block; }
        .occasion-rating { position: absolute; top: 10px; left: 10px; display:flex; gap:6px; align-items:center; background: #fff; padding:6px 10px; border-radius:8px; font-weight:800; font-size:0.85rem; color:#111; box-shadow: 0 8px 18px rgba(0,0,0,0.12); }
        .occasion-rating .rating-star { color: #00a36c; }
        .occasion-rating .rating-count { color: #555; font-weight: 700; }
        .occasion-meta { padding: 14px 16px 16px; display: flex; flex-direction: column; gap: 8px; }
        .occasion-name { font-weight: 800; color: #1e1e1e; margin-bottom: 2px; font-size: 1rem; letter-spacing: 0.6px; text-transform: uppercase; }
        .occasion-desc { color: #666; font-size: 0.9rem; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
        .occasion-price-row { display:flex; flex-wrap: wrap; align-items: baseline; gap: 8px; }
        .occasion-price { color: #111; font-weight: 800; font-size: 1rem; }
        .occasion-old-price { color:#999; text-decoration: line-through; font-size:0.85rem; }
        .occasion-discount { color:#ff3b30; font-weight:800; font-size:0.85rem; }
        .occasion-stock { color:#ff5a1f; font-weight:800; font-size:0.85rem; }
        .occasion-fav { color: #E06B6B; cursor: pointer; transition: transform 0.2s; font-size: 1.3rem; }
        .occasion-fav:hover { transform: scale(1.2); }
        .no-products { text-align: center; padding: 60px 20px; font-size: 1.2rem; color: #999; }
        
        @media (max-width: 1200px) { 
          .occasion-grid { grid-template-columns: repeat(3, 1fr); gap: 20px; } 
          .occasion-image { height: 360px; } 
          .occasion-image-wrap { clip-path: path("M 0 12% Q 50% 0% 100% 12% L 100% 100% L 0 100% Z"); } 
        }
        
        @media (max-width: 768px) { 
          .occasion-grid { grid-template-columns: repeat(2, 1fr); gap: 18px; } 
          .occasion-image { height: 300px; }
          .occasion-image-wrap { clip-path: path("M 0 14% Q 50% 0% 100% 14% L 100% 100% L 0 100% Z"); } 
          .occasion-title { font-size: 1.8rem; }
        }
        
        @media (max-width: 480px) { 
          .occasion-grid { grid-template-columns: 1fr; gap: 15px; }
          .occasion-image { height: 280px; }
          .occasion-image-wrap { clip-path: path("M 0 16% Q 50% 0% 100% 16% L 100% 100% L 0 100% Z"); } 
          .occasion-title { font-size: 1.4rem; }
          .occasion-back { font-size: 1rem; margin-right: 10px; }
          .occasion-meta { padding: 12px; }
          .occasion-name { font-size: 0.95rem; }
          .occasion-price { font-size: 0.95rem; }
        }
      `}</style>

        <div className="occasion-header">
          <button
            className="occasion-back"
            onClick={() => navigate("/")}
            title="Go back"
          >
            ← Back
          </button>
          <h1 className="occasion-title">{getOccasionTitle()}</h1>
        </div>

        {loading ? (
          <div className="no-products">Loading products...</div>
        ) : products.length > 0 ? (
          <div className="occasion-grid">
            {products.map((p) => {
              const productId = p.id || p._id;
              return (
                <div
                  key={productId}
                  className="occasion-card"
                  onClick={() =>
                    navigate(`/product/${productId}`, {
                      state: { ...p, id: productId },
                    })
                  }
                >
                  <div className="occasion-image-wrap">
                    <img
                      src={
                        imageErrors[productId]
                          ? logoDefault
                          : getImageUrl(p.image_url || p.imageUrl)
                      }
                      alt={p.name || p.product_title}
                      className="occasion-image"
                      loading="lazy"
                      onError={() => handleImageError(productId)}
                    />
                    <div className="occasion-rating">
                      <span>{getRatingValue(p).toFixed(1)}</span>
                      <FaStar className="rating-star" />
                      <span className="rating-count">{getRatingCount(p)}</span>
                    </div>
                  </div>
                  <div className="occasion-meta">
                    <div className="occasion-name">
                      {p.name || p.product_title}
                    </div>
                    <div className="occasion-desc">
                      {p.description || "Beautiful lehenga design"}
                    </div>
                    <div className="occasion-price-row">
                      <span className="occasion-price">
                        {formatRupees(parsePriceValue(p.price) || p.price)}
                      </span>
                      {(() => {
                        const priceValue = parsePriceValue(p.price);
                        const oldPriceValue = getOldPriceValue(p, priceValue);
                        const discountPercent = getDiscountPercent(
                          priceValue,
                          oldPriceValue,
                        );
                        return (
                          <>
                            {oldPriceValue ? (
                              <span className="occasion-old-price">
                                {formatRupees(oldPriceValue)}
                              </span>
                            ) : null}
                            {discountPercent ? (
                              <span className="occasion-discount">
                                ({discountPercent}% OFF)
                              </span>
                            ) : null}
                          </>
                        );
                      })()}
                    </div>
                    {shouldShowFewLeft(p) ? (
                      <div className="occasion-stock">Only Few Left!</div>
                    ) : null}
                    <div>
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(productId);
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        {favorites.has(productId) ? (
                          <FaHeart
                            style={{ color: "#E06B6B", fontSize: "1.3rem" }}
                          />
                        ) : (
                          <FaHeart
                            style={{
                              color: "#999",
                              opacity: 0.3,
                              fontSize: "1.3rem",
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="no-products">
            <p>No products available for this occasion</p>
            <button
              onClick={() => navigate("/")}
              style={{
                marginTop: "20px",
                background: "#4A0E0E",
                color: "#fff",
                border: "none",
                padding: "10px 18px",
                borderRadius: 8,
                cursor: "pointer",
              }}
            >
              ← Back Home
            </button>
          </div>
        )}
        {fetchError && (
          <div style={{ textAlign: "center", marginTop: 18, color: "#999" }}>
            {fetchError}
          </div>
        )}
      </div>
    </div>
  );
};

export default OccasionPage;
