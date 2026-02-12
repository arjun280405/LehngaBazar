import React, { useState, useEffect, useRef, useContext } from "react";
import { useLocation, useParams } from "react-router-dom";
import lehngaData from "../data/lehngaDataset.json";
import lehngaMehndi from "../data/lehngaMehndi.json";
import lehngaHaldi from "../data/lehngaHaldi.json";
import Navbar from "../components/Navbar";
import OptionsModal from "../components/OptionsModal";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import {
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaShoppingBag,
  FaBolt,
  FaWhatsapp,
  FaArrowLeft,
  FaCheckCircle,
  FaHeart,
  FaRegHeart,
} from "react-icons/fa";

// Product Images
import productMain from "../assets/products/lehenga-01.avif";
import thumb1 from "../assets/products/lehenga-13.avif";
import thumb2 from "../assets/products/lehenga-13-thumb1.avif";

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
};

const ProductDetail = () => {
  const location = useLocation();
  const params = useParams();
  const { addToCart, addToWishlist, isInWishlist } = useContext(CartContext);
  const { serverUrl } = useContext(AuthContext);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isOptionsModalOpen, setIsOptionsModalOpen] = useState(false);
  const [apiProduct, setApiProduct] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(false);

  // Prefer navigation state; if not present (direct link), find by id in all datasets
  const stateProduct = location.state?.product || location.state || {};

  // Search across all datasets
  const findProductById = (id) => {
    const allProducts = [...lehngaData, ...lehngaMehndi, ...lehngaHaldi];
    return (
      allProducts.find((p) => p.id === parseInt(id)) ||
      allProducts.find((p) => p.id === id) ||
      {}
    );
  };

  const prodFromList = params?.id ? findProductById(params.id) : {};

  const normalizeProduct = (item) =>
    item
      ? {
          ...item,
          id: item.id || item._id,
        }
      : {};

  const hasStateProduct = Object.keys(stateProduct || {}).length > 0;
  const prod = hasStateProduct
    ? normalizeProduct(stateProduct)
    : normalizeProduct(apiProduct || prodFromList);

  useEffect(() => {
    if (!params?.id || hasStateProduct) return;
    let isMounted = true;
    const fetchProduct = async () => {
      setLoadingProduct(true);
      try {
        const response = await axios.get(
          `${serverUrl}/api/products/${params.id}`,
        );
        const fetched = response.data.product
          ? normalizeProduct(response.data.product)
          : null;
        if (isMounted) {
          setApiProduct(fetched);
          setLoadingProduct(false);
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
        if (isMounted) {
          setLoadingProduct(false);
        }
      }
    };

    fetchProduct();
    return () => {
      isMounted = false;
    };
  }, [params?.id, serverUrl, hasStateProduct]);

  const resolveImg = (path) => {
    if (!path) return null;

    // Check if path exists in imageMap first
    if (imageMap[path]) return imageMap[path];

    // If path is an import-resolved absolute-ish path (starts with '/'), return it
    if (typeof path === "string" && path.startsWith("/")) return path.trim();
    try {
      return new URL(path.trim(), import.meta.url).href;
    } catch (err) {
      // For other strings, return trimmed value so imported module strings still work
      if (typeof path === "string") return path.trim();
      return null;
    }
  };

  // Build gallery: prefer product fields (image_url, imageUrl, sideUrl, thumb1, thumb2, gallery array), then other fallbacks
  const galleryRaw = [
    prod.image_url,
    prod.imageUrl,
    prod.sideUrl,
    prod.thumb1,
    prod.thumb2,
    ...(Array.isArray(prod.gallery) ? prod.gallery : []),
    prod.back_image_url,
    prod.alt_image_url,
    prod.img,
    prod.backImg,
    thumb1,
    thumb2,
  ].filter(Boolean);

  // Resolve and remove duplicates while preserving order
  const galleryThumbs = Array.from(
    new Set(galleryRaw.map((p) => resolveImg(p)).filter(Boolean)),
  );

  const initialMain = galleryThumbs.length
    ? galleryThumbs[0]
    : resolveImg(productMain) || productMain;
  const [selectedImg, setSelectedImg] = useState(initialMain);

  // Ensure main image updates when product changes (route reuse)
  useEffect(() => {
    setSelectedImg(initialMain);
  }, [initialMain]);

  // --- Zoom & Autoplay (slideshow) ---
  const [zoom, setZoom] = useState(1); // 1x to 3x
  const [origin, setOrigin] = useState({ x: 50, y: 50 }); // transform-origin in %
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const autoplayRef = useRef(null);
  const resumeAutoplayTimeoutRef = useRef(null);

  // Autoplay interval
  useEffect(() => {
    if (!isAutoplay || galleryThumbs.length <= 1) return;
    if (autoplayRef.current) clearInterval(autoplayRef.current);
    autoplayRef.current = setInterval(() => {
      setSelectedImg((current) => {
        const idx = galleryThumbs.indexOf(current);
        const nextIdx = (idx + 1) % galleryThumbs.length;
        return galleryThumbs[nextIdx];
      });
    }, 4000);

    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, [galleryThumbs, isAutoplay]);

  // Reset zoom when main image changes
  useEffect(() => {
    setZoom(1);
    setOrigin({ x: 50, y: 50 });
  }, [selectedImg]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
      if (resumeAutoplayTimeoutRef.current)
        clearTimeout(resumeAutoplayTimeoutRef.current);
    };
  }, []);

  // Wheel to zoom handler
  const handleWheel = (e) => {
    e.preventDefault();
    const delta = -e.deltaY / 200; // smaller increment per wheel
    const nextZoom = Math.min(3, Math.max(1, +(zoom + delta).toFixed(2)));
    if (nextZoom !== zoom) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setOrigin({ x, y });
      setZoom(nextZoom);

      // Pause autoplay temporarily
      setIsAutoplay(false);
      if (resumeAutoplayTimeoutRef.current)
        clearTimeout(resumeAutoplayTimeoutRef.current);
      resumeAutoplayTimeoutRef.current = setTimeout(
        () => setIsAutoplay(true),
        3000,
      );
    }
  };

  const handleMouseMove = (e) => {
    if (zoom <= 1) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setOrigin({ x, y });
  };

  // Flipkart-style Star Rating Logic
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) stars.push(<FaStar key={i} className="star-filled" />);
      else if (i - 0.5 <= rating)
        stars.push(<FaStarHalfAlt key={i} className="star-filled" />);
      else stars.push(<FaRegStar key={i} className="star-empty" />);
    }
    return stars;
  };

  // Initialize wishlist state
  useEffect(() => {
    setIsWishlisted(isInWishlist(prod.id));
  }, [prod.id, isInWishlist]);

  const formatPrice = (value, fallback) => {
    if (value === undefined || value === null || value === "") return fallback;
    if (typeof value === "number") {
      return `₹${value.toLocaleString("en-IN")}`;
    }
    return value;
  };

  const handleAddToCart = () => {
    setIsOptionsModalOpen(true);
  };

  const handleOptionsModalAddToCart = (productWithOptions) => {
    addToCart(productWithOptions);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleWishlist = () => {
    addToWishlist(prod);
    setIsWishlisted(!isWishlisted);
  };

  return (
    <div className="product-page-root">
      <Navbar />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600&family=Montserrat:wght@300;400;600&display=swap');

        :root {
          --deep-maroon: #4A0E0E;
          --rose-gold: #E5B4A2;
          --gold-bright: #C2A35D;
          --ivory: #FDFBF7;
          --success-green: #388e3c;
        }

        .product-page-root {
          background: var(--ivory);
          min-height: 100vh;
          padding: 120px 8% 60px;
          font-family: 'Montserrat', sans-serif;
        }

        @media (max-width: 768px) {
          .product-page-root {
            padding: 80px 5% 40px;
          }
        }

        @media (max-width: 480px) {
          .product-page-root {
            padding: 70px 4% 30px;
          }
        }

        .back-btn {
          display: flex; align-items: center; gap: 10px;
          color: var(--deep-maroon); text-decoration: none;
          font-weight: 600; font-size: 0.9rem; margin-bottom: 30px;
          cursor: pointer; transition: 0.3s;
        }
        .back-btn:hover { transform: translateX(-5px); }

        .product-container {
          display: grid; grid-template-columns: 1fr 1.2fr;
          gap: 60px; background: white; padding: 40px;
          box-shadow: 0 20px 50px rgba(74, 14, 14, 0.05);
          border-radius: 20px;
        }

        @media (max-width: 968px) {
          .product-container {
            grid-template-columns: 1fr;
            gap: 30px;
            padding: 25px;
          }
        }

        @media (max-width: 480px) {
          .product-container {
            gap: 20px;
            padding: 15px;
            border-radius: 12px;
          }
        }

        /* --- INTELLIGENT GALLERY --- */
        .gallery-side { display: flex; flex-direction: column; gap: 20px; }
        
        .main-img-container {
          width: 100%; height: 600px;
          border-radius: 15px; overflow: hidden;
          background: #f9f9f9; display: flex;
          align-items: center; justify-content: center;
          border: 1px solid #eee;
        }

        @media (max-width: 768px) {
          .main-img-container {
            height: 380px;
          }
        }

        @media (max-width: 480px) {
          .main-img-container {
            height: 320px;
            border-radius: 10px;
          }
        }

        .main-img-container img {
          max-width: 100%; max-height: 100%;
          object-fit: contain;
          transition: 0.5s ease;
        }

        .thumbnail-list { 
          display: flex; gap: 15px; justify-content: center; 
          overflow-x: auto;
          padding-bottom: 8px;
        }

        @media (max-width: 480px) {
          .thumbnail-list {
            gap: 10px;
          }
        }

        .thumb {
          width: 80px; height: 100px; border-radius: 8px;
          overflow: hidden; cursor: pointer; border: 2px solid transparent;
          transition: 0.3s; opacity: 0.6;
          flex-shrink: 0;
        }

        @media (max-width: 480px) {
          .thumb {
            width: 60px;
            height: 80px;
          }
        }

        .thumb.active { border-color: var(--gold-bright); opacity: 1; transform: scale(1.05); }
        .thumb img { width: 100%; height: 100%; object-fit: cover; }

        /* --- DETAILS SIDE --- */
        .details-side { display: flex; flex-direction: column; }
        .brand-tag { color: var(--gold-bright); font-weight: 600; letter-spacing: 2px; font-size: 0.8rem; text-transform: uppercase; }
        .product-title { font-family: 'Cormorant Garamond', serif; font-size: 3rem; color: var(--deep-maroon); margin: 10px 0; }
        
        /* Star Rating Section */
        .rating-box { display: flex; align-items: center; gap: 15px; margin-bottom: 20px; }
        .stars { color: #ff9f00; display: flex; gap: 2px; font-size: 1.1rem; }
        .rating-text { font-size: 0.9rem; color: #878787; font-weight: 600; }
        .verified-purchase { color: var(--success-green); font-size: 0.8rem; display: flex; align-items: center; gap: 5px; }

        .price-row { display: flex; align-items: center; gap: 20px; margin: 25px 0; }
        .current-price { font-size: 2.2rem; font-weight: 600; color: var(--deep-maroon); }
        .old-price { font-size: 1.4rem; color: #878787; text-decoration: line-through; }
        .discount-tag { color: var(--success-green); font-weight: 600; }

        /* --- BUTTONS --- */
        .action-btns { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 30px; }
        .btn {
          padding: 18px; border: none; border-radius: 8px; font-family: 'Montserrat';
          font-weight: 600; text-transform: uppercase; letter-spacing: 1px;
          cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px;
          transition: 0.3s;
        }
        .btn-add { background: #ff9f00; color: white; }
        .btn-buy { background: #fb641b; color: white; box-shadow: 0 4px 15px rgba(251, 100, 27, 0.3); }
        .btn-whatsapp { grid-column: span 2; background: #25D366; color: white; margin-top: 10px; }
        .btn:hover { filter: brightness(1.1); transform: translateY(-2px); }

        /* --- REVIEWS SECTION --- */
        .reviews-section { margin-top: 60px; }
        .review-card {
          background: white; padding: 25px; border-radius: 12px;
          margin-bottom: 20px; border-left: 5px solid var(--gold-bright);
        }
        .review-header { display: flex; justify-content: space-between; margin-bottom: 10px; }
        .reviewer-name { font-weight: 600; color: var(--deep-maroon); }
        .review-comment { font-size: 0.95rem; line-height: 1.6; color: #444; font-style: italic; }

        @media (max-width: 968px) {
          .product-container { grid-template-columns: 1fr; }
          .main-img-container { height: 400px; }
        }
      `}</style>

      <div className="back-btn" onClick={() => window.history.back()}>
        <FaArrowLeft /> Back to Collection
      </div>

      {loadingProduct && (
        <div style={{ textAlign: "center", marginBottom: 20, color: "#888" }}>
          Loading product details...
        </div>
      )}

      <div className="product-container">
        {/* LEFT: GALLERY */}
        <div className="gallery-side">
          <div className="main-img-container">
            <img
              src={selectedImg}
              alt={prod.product_title || "Lehenga Main View"}
              onWheel={handleWheel}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => {
                setIsHovering(true);
                setIsAutoplay(false);
              }}
              onMouseLeave={() => {
                setIsHovering(false);
                setIsAutoplay(true);
              }}
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: `${origin.x}% ${origin.y}%`,
                transition: "transform 0.15s ease",
                cursor: zoom > 1 ? "zoom-in" : "zoom-in",
              }}
              draggable={false}
            />
          </div>
          <div className="thumbnail-list">
            {galleryThumbs.map((img, i) => (
              <div
                key={i}
                className={`thumb ${selectedImg === img ? "active" : ""}`}
                onClick={() => {
                  setSelectedImg(img);
                  setZoom(1);
                  // Pause autoplay briefly when user interacts
                  setIsAutoplay(false);
                  if (resumeAutoplayTimeoutRef.current)
                    clearTimeout(resumeAutoplayTimeoutRef.current);
                  resumeAutoplayTimeoutRef.current = setTimeout(
                    () => setIsAutoplay(true),
                    1000,
                  );
                }}
              >
                <img src={img} alt={`Thumb ${i}`} />
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: DETAILS */}
        <div className="details-side">
          <span className="brand-tag">Lahnga Bazar Couture</span>
          <h1 className="product-title">
            {prod.product_title || "The Royal Peacock Empress Lehenga"}
          </h1>

          <div className="rating-box">
            <div className="stars">
              {renderStars(
                prod && prod.review
                  ? parseFloat((prod.review.match(/[\d.]+/) || [4.5])[0])
                  : 4.5,
              )}
            </div>
            <span className="rating-text">
              {prod.review || "4.8 (1,240 Ratings & 458 Reviews)"}
            </span>
            <span className="verified-purchase">
              <FaCheckCircle /> Verified
            </span>
          </div>

          <div className="price-row">
            <span className="current-price">
              {formatPrice(prod.price, "₹1,45,000")}
            </span>
            <span className="old-price">
              {formatPrice(prod.originalPrice || prod.oldPrice, "₹1,95,000")}
            </span>
            <span className="discount-tag">
              {prod.discount
                ? `${prod.discount}% OFF`
                : prod.savings || "25% OFF"}
            </span>
          </div>

          <p style={{ lineHeight: "1.8", color: "#555", fontSize: "0.95rem" }}>
            A masterpiece of Zardosi craftsmanship. This velvet ensemble
            features hand-carved peacock motifs encrusted with semi-precious
            stones and golden metallic threads. Perfect for the bride who wants
            to embody eternal grace.
          </p>

          <div className="action-btns">
            <button
              className="btn btn-add"
              onClick={handleAddToCart}
              style={{
                background: addedToCart ? "#388e3c" : "#ff9f00",
                transition: "all 0.3s ease",
              }}
            >
              <FaShoppingBag /> {addedToCart ? "Added to Bag!" : "Add to Cart"}
            </button>
            <button
              className="btn btn-buy"
              onClick={handleWishlist}
              style={{
                background: isWishlisted ? "#E06B6B" : "#E5B4A2",
              }}
            >
              {isWishlisted ? <FaHeart /> : <FaRegHeart />}{" "}
              {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
            </button>
            <button className="btn btn-whatsapp">
              <FaWhatsapp /> Inquire on WhatsApp
            </button>
          </div>

          <div
            style={{
              marginTop: "30px",
              borderTop: "1px solid #eee",
              paddingTop: "20px",
            }}
          >
            <h4 style={{ marginBottom: "15px", color: "var(--deep-maroon)" }}>
              Product Highlights
            </h4>
            <ul
              style={{
                fontSize: "0.85rem",
                color: "#666",
                listStyle: "none",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "10px",
              }}
            >
              <li>✨ Authentic Hand-Embroidery</li>
              <li>👗 Custom Tailoring Available</li>
              <li>🚚 Free Insured Shipping</li>
              <li>💎 Semi-Precious Stone Work</li>
            </ul>
          </div>
        </div>
      </div>

      {/* REVIEWS SECTION */}
      <div className="reviews-section">
        <h3
          style={{
            fontFamily: "Cormorant Garamond",
            fontSize: "2rem",
            marginBottom: "30px",
          }}
        >
          Voices of Our Brides
        </h3>

        <div className="review-card">
          <div className="review-header">
            <span className="reviewer-name">Ananya Sharma</span>
            <div className="stars" style={{ fontSize: "0.8rem" }}>
              {renderStars(5)}
            </div>
          </div>
          <p className="review-comment">
            "I wore this for my wedding in Udaipur, and I have never felt more
            beautiful. The weight of the lehenga is perfect, and the peacock
            embroidery looks even more stunning in person than in the photos. It
            truly is an heirloom piece!"
          </p>
        </div>

        <div className="review-card">
          <div className="review-header">
            <span className="reviewer-name">Priyanka V.</span>
            <div className="stars" style={{ fontSize: "0.8rem" }}>
              {renderStars(4.5)}
            </div>
          </div>
          <p className="review-comment">
            "The fit was perfect thanks to the custom sizing. The fabric quality
            is top-notch silk-velvet. The only thing is that delivery took 3
            days longer than expected, but the product was worth the wait."
          </p>
        </div>
      </div>

      {/* Options Modal */}
      <OptionsModal
        isOpen={isOptionsModalOpen}
        onClose={() => setIsOptionsModalOpen(false)}
        product={prod}
        onAddToCart={handleOptionsModalAddToCart}
      />
    </div>
  );
};

export default ProductDetail;
