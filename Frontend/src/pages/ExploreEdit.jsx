import React, { useState, useContext, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft, FaHeart, FaRegHeart } from "react-icons/fa";
import lehngaData from "../data/lehngaDataset.json";
import Navbar from "../components/Navbar";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

export default function ExploreEdit() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToWishlist, isInWishlist } = useContext(CartContext);
  const { serverUrl } = useContext(AuthContext);
  const [favorites, setFavorites] = useState(new Set());
  const [visibleCount, setVisibleCount] = useState(40); // initial items to show
  const PAGE_SIZE = 40;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const searchQuery = (location.state && location.state.searchQuery) || "";
  const normalizedSearch = searchQuery.toLowerCase().trim();

  const normalizeProduct = (item) => ({
    ...item,
    id: item.id || item._id,
  });

  const buildMergeKey = (item) => {
    const title = (item.product_title || item.name || "").trim().toLowerCase();
    const brand = (item.brand || "").trim().toLowerCase();
    return `${title}::${brand}`;
  };

  const mergeProducts = (apiProducts, localProducts) => {
    const merged = [];
    const seen = new Set();

    [...apiProducts, ...localProducts].forEach((item) => {
      const key = buildMergeKey(item);
      if (!key || seen.has(key)) return;
      seen.add(key);
      merged.push(item);
    });

    return merged;
  };

  const resolveImageUrl = (imageUrl) => {
    if (!imageUrl) return "https://via.placeholder.com/400x600?text=No+image";
    if (/^https?:\/\//i.test(imageUrl)) return imageUrl;
    try {
      return new URL(imageUrl.trim(), import.meta.url).href;
    } catch (err) {
      return imageUrl;
    }
  };

  useEffect(() => {
    let isMounted = true;
    const fetchProducts = async () => {
      setLoading(true);
      setFetchError("");
      try {
        const response = await axios.get(`${serverUrl}/api/products`);
        const apiProducts = (response.data.products || []).map(
          normalizeProduct,
        );
        const localProducts = lehngaData.map(normalizeProduct);
        const combinedProducts = mergeProducts(apiProducts, localProducts);
        if (isMounted) {
          setProducts(combinedProducts);
          setLoading(false);
        }
      } catch (error) {
        console.error("Failed to fetch products, using local data:", error);
        const fallbackProducts = lehngaData.map(normalizeProduct);
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
  }, [serverUrl]);

  useEffect(() => {
    if (normalizedSearch) {
      setVisibleCount(PAGE_SIZE);
    }
  }, [normalizedSearch]);

  const parsePriceValue = (value) => {
    if (typeof value === "number") return value;
    if (!value) return null;
    const digits = String(value).replace(/[^0-9]/g, "");
    return digits ? parseInt(digits, 10) : null;
  };

  const filteredProducts = useMemo(() => {
    if (!normalizedSearch) return products;
    const tokens = normalizedSearch
      .split(/\s+/)
      .filter(Boolean)
      .filter((t) => !["lehnga", "lehenga", "lehngas", "lehengas"].includes(t));
    const isFancy = /\bfancy\b/.test(normalizedSearch);
    const fancyKeywords = [
      "bridal",
      "premium",
      "velvet",
      "silk",
      "zari",
      "luxury",
      "royal",
      "regal",
      "embroidered",
      "designer",
    ];

    return products.filter((item) => {
      const haystack = `${item.product_title || ""} ${item.name || ""} ${
        item.brand || ""
      } ${item.description || ""}`
        .toLowerCase()
        .trim();

      if (isFancy) {
        const matchFancy = fancyKeywords.some((k) => haystack.includes(k));
        const price = parsePriceValue(item.price);
        return matchFancy || (price !== null && price >= 15000);
      }

      if (!tokens.length) return true;
      return tokens.some((t) => haystack.includes(t));
    });
  }, [normalizedSearch, products]);

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

  const visibleItems = filteredProducts.slice(0, visibleCount);

  return (
    <div className="explore-page">
      <Navbar />
      <div
        style={{
          padding: "80px 6% 40px",
          fontFamily: "Cormorant Garamond, serif",
        }}
        className="explore-container"
      >
        <style>{`
        .explore-header { display: flex; align-items: center; margin-bottom: 40px; gap: 15px; }
        .explore-back { background: none; border: none; color: #4A0E0E; cursor: pointer; font-size: 1.2rem; margin-right: 16px; padding: 8px; flex-shrink: 0; }
        .explore-title { font-size: 2.5rem; font-weight: 300; color: #4A0E0E; margin: 0; }
        .explore-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 28px; }
        .explore-card { background: #fff; border-radius: 10px; overflow: hidden; border: 1px solid rgba(0,0,0,0.04); cursor: pointer; transition: transform .3s, box-shadow .3s; }
        .explore-card:hover { transform: translateY(-10px); box-shadow: 0 20px 50px rgba(0,0,0,0.08); }
        .explore-image { width: 100%; height: 480px; object-fit: cover; display: block; }
        .explore-meta { padding: 18px; display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; }
        .explore-details { flex: 1; }
        .explore-name { font-weight: 600; color: #4A0E0E; margin-bottom: 4px; }
        .explore-brand { color: #777; font-size: 0.9rem; margin-bottom: 8px; }
        .explore-review { margin-bottom: 8px; color: #444; font-style: italic; font-size: 0.85rem; }
        .explore-price { color: #4A0E0E; font-weight: 700; margin-bottom: 8px; }
        .explore-fav { color: #E06B6B; cursor: pointer; transition: transform 0.2s; }
        .explore-fav:hover { transform: scale(1.2); }
        .explore-fav.active { color: #E06B6B; }
        
        @media (max-width: 1200px) { 
          .explore-grid { grid-template-columns: repeat(3, 1fr); gap: 20px; } 
          .explore-image { height: 380px; } 
        }
        
        @media (max-width: 768px) { 
          .explore-grid { grid-template-columns: repeat(2, 1fr); gap: 18px; } 
          .explore-image { height: 300px; }
          .explore-title { font-size: 1.8rem; }
        }
        
        @media (max-width: 480px) { 
          .explore-grid { grid-template-columns: 1fr; gap: 15px; }
          .explore-image { height: 280px; }
          .explore-title { font-size: 1.4rem; }
          .explore-back { font-size: 1rem; margin-right: 10px; }
          .explore-meta { padding: 12px; }
          .explore-name { font-size: 0.95rem; }
          .explore-brand { font-size: 0.8rem; }
          .explore-price { font-size: 0.95rem; }
        }
      `}</style>

        <div className="explore-header">
          <button
            className="explore-back"
            onClick={() => navigate(-1)}
            title="Go back"
          >
            ← Back
          </button>
          <h1 className="explore-title">
            {normalizedSearch
              ? `Search results for "${searchQuery}"`
              : "Explore Lehenga Collection"}
          </h1>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            Loading products...
          </div>
        ) : filteredProducts.length ? (
          <div className="explore-grid">
            {visibleItems.map((item) => {
              const productId = item.id || item._id;
              return (
                <div
                  key={productId}
                  className="explore-card"
                  onClick={() =>
                    navigate(`/product/${productId}`, {
                      state: { ...item, id: productId },
                    })
                  }
                >
                  <img
                    src={resolveImageUrl(item.image_url)}
                    alt={item.product_title}
                    className="explore-image"
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://via.placeholder.com/400x600?text=No+image";
                    }}
                  />
                  <div className="explore-meta">
                    <div className="explore-details">
                      <div className="explore-name">{item.product_title}</div>
                      <div className="explore-brand">{item.brand}</div>
                      <div className="explore-review">{item.review}</div>
                      <div className="explore-price">{item.price}</div>
                    </div>
                    <div>
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(productId);
                          addToWishlist({ ...item, id: productId });
                        }}
                        style={{ cursor: "pointer", fontSize: "1.3rem" }}
                      >
                        {favorites.has(productId) ? (
                          <FaHeart style={{ color: "#E06B6B" }} />
                        ) : (
                          <FaRegHeart style={{ color: "#999", opacity: 0.6 }} />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "40px" }}>
            No items found for "{searchQuery}".
          </div>
        )}

        {fetchError && (
          <div style={{ textAlign: "center", marginTop: 18, color: "#999" }}>
            {fetchError}
          </div>
        )}

        {visibleCount < filteredProducts.length && (
          <div style={{ textAlign: "center", marginTop: 28 }}>
            <button
              onClick={() =>
                setVisibleCount((c) =>
                  Math.min(c + PAGE_SIZE, filteredProducts.length),
                )
              }
              style={{
                background: "#4A0E0E",
                color: "#fff",
                border: "none",
                padding: "10px 18px",
                borderRadius: 8,
                cursor: "pointer",
              }}
            >
              Load more (
              {Math.min(PAGE_SIZE, filteredProducts.length - visibleCount)})
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
