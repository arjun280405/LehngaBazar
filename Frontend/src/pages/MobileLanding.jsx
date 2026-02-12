import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowRight,
  FaHeart,
  FaShoppingBag,
  FaSearch,
  FaTruck,
  FaCheck,
  FaGift,
  FaStar,
} from "react-icons/fa";
import Navbar from "../components/Navbar";
import { CartContext } from "../context/CartContext";

// Import hero and collection images
import heroImg from "../assets/logos/Gemini_Generated_Image_6pdsvp6pdsvp6pds.png";
import mehndiImg from "../assets/Mehndi/g1.jpeg";
import haldiImg from "../assets/Haldi/y2.avif";
import weddingImg from "../assets/products/lehenga-07.avif";
import receptionImg from "../assets/products/lehenga-03.avif";
import bridalImg from "../assets/products/bridal-collection.avif";
import trendingImg1 from "../assets/products/lehenga-12.avif";
import trendingImg2 from "../assets/products/lehenga-15.avif";
import trendingImg3 from "../assets/products/lehenga-18.avif";

const MobileLanding = () => {
  const navigate = useNavigate();
  const { cart } = useContext(CartContext);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const collections = [
    {
      id: 1,
      title: "Mehndi",
      image: mehndiImg,
      color: "#2d5f2e",
      path: "/occasion/mehndi",
      accent: "#8fbc8f",
    },
    {
      id: 2,
      title: "Haldi",
      image: haldiImg,
      color: "#d4af37",
      path: "/occasion/haldi",
      accent: "#ffd700",
    },
    {
      id: 3,
      title: "Wedding",
      image: weddingImg,
      color: "#8b0000",
      path: "/occasion/wedding",
      accent: "#ff1744",
    },
    {
      id: 4,
      title: "Reception",
      image: receptionImg,
      color: "#c41e6b",
      path: "/occasion/reception",
      accent: "#ff4081",
    },
  ];

  const features = [
    { icon: <FaTruck size={28} />, text: "Fast Delivery", color: "#ff6b6b" },
    { icon: <FaCheck size={28} />, text: "Best Quality", color: "#4ecdc4" },
    { icon: <FaGift size={28} />, text: "Special Offers", color: "#ffd93d" },
    { icon: <FaStar size={28} />, text: "Trusted Brand", color: "#95e1d3" },
  ];

  const stats = [
    { label: "Curated Designs", value: "1256+" },
    { label: "Happy Brides", value: "8k+" },
    { label: "Premium Fabric", value: "100%" },
  ];

  const trending = [
    {
      id: 1,
      title: "Royal Maroon",
      price: "INR 9,999",
      image: trendingImg1,
    },
    {
      id: 2,
      title: "Blush Rose",
      price: "INR 8,499",
      image: trendingImg2,
    },
    {
      id: 3,
      title: "Velvet Wine",
      price: "INR 10,999",
      image: trendingImg3,
    },
  ];

  const testimonials = [
    {
      id: 1,
      name: "Aanya",
      text: "Perfect fit and stunning details. Everyone loved it!",
    },
    {
      id: 2,
      name: "Ishita",
      text: "The fabric feels premium and the work is beautiful.",
    },
  ];

  return (
    <div className="mobile-landing">
      <Navbar />

      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes glow {
          0%, 100% {
            box-shadow: 0 5px 20px rgba(229, 180, 162, 0.4);
          }
          50% {
            box-shadow: 0 5px 30px rgba(229, 180, 162, 0.8);
          }
        }

        @keyframes slideIn {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .mobile-landing {
          background: linear-gradient(135deg, #fdfbf7 0%, #f5ede5 100%);
          min-height: 100vh;
          padding-top: 70px;
          font-family: 'Montserrat', sans-serif;
          overflow-x: hidden;
        }

        /* Mobile Hero Banner */
        .mobile-hero {
          background: linear-gradient(135deg, #4A0E0E 0%, #8b4545 50%, #c41e7c 100%);
          color: white; 
          padding: 30px 20px 40px;
          text-align: center;
          clip-path: polygon(0 0, 100% 0, 100% 85%, 0 100%);
          position: relative;
          overflow: hidden;
        }

        .mobile-hero::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          animation: shimmer 3s infinite;
          z-index: 1;
        }

        .mobile-hero-title {
          font-size: 2.2rem;
          font-weight: 700;
          margin-bottom: 8px;
          font-family: 'Cormorant Garamond', serif;
          animation: fadeInDown 0.8s ease-out;
          position: relative;
          z-index: 2;
        }

        .mobile-hero-subtitle {
          font-size: 0.95rem;
          opacity: 0.95;
          margin-bottom: 25px;
          letter-spacing: 2px;
          animation: fadeInDown 1s ease-out 0.2s both;
          position: relative;
          z-index: 2;
        }

        .mobile-hero-img {
          width: 100%;
          height: 240px;
          border-radius: 20px;
          overflow: hidden;
          margin-bottom: 25px;
          box-shadow: 0 15px 40px rgba(0,0,0,0.3);
          animation: fadeInUp 1s ease-out 0.4s both;
          position: relative;
          z-index: 2;
          border: 3px solid rgba(255,255,255,0.2);
          transform: perspective(1000px) rotateX(2deg);
        }

        .mobile-hero-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .mobile-hero-img:hover img {
          transform: scale(1.05);
        }

        .mobile-cta-btn {
          background: linear-gradient(135deg, #E5B4A2, #d4a5a5);
          color: #4A0E0E;
          border: none;
          padding: 14px 32px;
          border-radius: 30px;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-size: 0.98rem;
          transition: all 0.3s;
          box-shadow: 0 8px 25px rgba(229, 180, 162, 0.4);
          animation: fadeInUp 1s ease-out 0.6s both;
          position: relative;
          z-index: 2;
        }

        .mobile-cta-btn:active {
          transform: scale(0.92);
          box-shadow: 0 4px 12px rgba(229, 180, 162, 0.3);
        }

        /* Stats Strip */
        .mobile-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          padding: 18px 15px 5px;
          margin-top: -12px;
        }

        .mobile-stat-card {
          background: white;
          border-radius: 14px;
          padding: 12px 10px;
          text-align: center;
          box-shadow: 0 6px 16px rgba(74, 14, 14, 0.08);
          border: 1px solid rgba(229, 180, 162, 0.2);
        }

        .mobile-stat-value {
          font-size: 1.05rem;
          font-weight: 800;
          color: #4A0E0E;
        }

        .mobile-stat-label {
          font-size: 0.7rem;
          color: #8b4545;
          margin-top: 4px;
          font-weight: 600;
          letter-spacing: 0.3px;
        }

        /* Collections Section */
        .mobile-collections {
          padding: 35px 15px;
        }

        .mobile-section-title {
          font-size: 1.4rem;
          color: #4A0E0E;
          margin-bottom: 25px;
          font-weight: 700;
          padding: 0 10px;
          animation: fadeInUp 0.8s ease-out;
          font-family: 'Cormorant Garamond', serif;
          position: relative;
        }

        .mobile-section-title::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 10px;
          width: 40px;
          height: 3px;
          background: linear-gradient(90deg, #E5B4A2, #d4af37);
          border-radius: 2px;
        }

        .mobile-collection-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
        }

        .mobile-collection-card {
          background: white;
          border-radius: 18px;
          padding: 0;
          text-align: center;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-shadow: 0 6px 20px rgba(74, 14, 14, 0.1);
          border: 2px solid transparent;
          overflow: hidden;
          animation: fadeInUp 0.6s ease-out;
          animation-fill-mode: both;
        }

        .mobile-collection-card:nth-child(1) { animation-delay: 0.1s; }
        .mobile-collection-card:nth-child(2) { animation-delay: 0.2s; }
        .mobile-collection-card:nth-child(3) { animation-delay: 0.3s; }
        .mobile-collection-card:nth-child(4) { animation-delay: 0.4s; }

        .mobile-collection-card:active {
          transform: translateY(-6px) scale(0.98);
          box-shadow: 0 12px 30px rgba(74, 14, 14, 0.15);
        }

        .mobile-collection-icon {
          width: 100%;
          height: 140px;
          overflow: hidden;
          position: relative;
          background: linear-gradient(135deg, #f5f5f5, #e8e8e8);
        }

        .mobile-collection-icon img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .mobile-collection-card:hover .mobile-collection-icon img {
          transform: scale(1.08) rotate(1deg);
        }

        .mobile-collection-info {
          padding: 15px;
        }

        .mobile-collection-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: #4A0E0E;
          margin-bottom: 6px;
          font-family: 'Cormorant Garamond', serif;
        }

        .mobile-collection-text {
          font-size: 0.8rem;
          color: #E5B4A2;
          font-weight: 600;
        }

        /* Trending Picks */
        .mobile-trending {
          padding: 30px 15px 10px;
        }

        .mobile-trending-strip {
          display: flex;
          gap: 12px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
        }

        .mobile-trending-card {
          flex-shrink: 0;
          min-width: 190px;
          background: white;
          border-radius: 18px;
          box-shadow: 0 8px 22px rgba(74, 14, 14, 0.1);
          overflow: hidden;
          border: 1px solid rgba(229, 180, 162, 0.2);
          scroll-snap-align: start;
        }

        .mobile-trending-img {
          height: 160px;
          overflow: hidden;
        }

        .mobile-trending-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .mobile-trending-card:active .mobile-trending-img img {
          transform: scale(1.05);
        }

        .mobile-trending-info {
          padding: 12px 14px 14px;
        }

        .mobile-trending-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: #4A0E0E;
        }

        .mobile-trending-price {
          font-size: 0.85rem;
          color: #8b4545;
          margin-top: 4px;
          font-weight: 600;
        }

        .mobile-trending-cta {
          margin-top: 8px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8rem;
          color: #E5B4A2;
          font-weight: 700;
        }

        /* Features Section */
        .mobile-features {
          background: white;
          padding: 30px 15px;
          margin: 20px 15px;
          border-radius: 20px;
          box-shadow: 0 8px 25px rgba(74, 14, 14, 0.08);
          animation: fadeInUp 0.8s ease-out;
          border: 1px solid rgba(229, 180, 162, 0.2);
        }

        .mobile-features-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 18px;
        }

        .mobile-feature-item {
          text-align: center;
          padding: 20px;
          background: linear-gradient(135deg, #fdfbf7, #f5ede5);
          border-radius: 15px;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          border: 1px solid rgba(229, 180, 162, 0.2);
          animation: fadeInUp 0.6s ease-out;
          animation-fill-mode: both;
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }

        .mobile-feature-item:nth-child(1) { animation-delay: 0.5s; }
        .mobile-feature-item:nth-child(2) { animation-delay: 0.6s; }
        .mobile-feature-item:nth-child(3) { animation-delay: 0.7s; }
        .mobile-feature-item:nth-child(4) { animation-delay: 0.8s; }

        .mobile-feature-item::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(229, 180, 162, 0.2), transparent);
          animation: shimmer 3s infinite;
        }

        .mobile-feature-item:active {
          transform: translateY(-4px) scale(0.98);
          box-shadow: 0 10px 25px rgba(74, 14, 14, 0.1);
        }

        .mobile-feature-icon {
          font-size: 2.2rem;
          margin-bottom: 12px;
          color: #E5B4A2;
          transition: transform 0.3s ease;
          position: relative;
          z-index: 1;
        }

        .mobile-feature-item:active .mobile-feature-icon {
          transform: scale(1.1) rotate(-10deg);
        }

        .mobile-feature-text {
          font-size: 0.9rem;
          font-weight: 700;
          color: #4A0E0E;
          position: relative;
          z-index: 1;
        }

        /* Testimonials */
        .mobile-testimonials {
          padding: 25px 15px 10px;
        }

        .mobile-testimonial-card {
          background: white;
          border-radius: 18px;
          padding: 18px 16px;
          margin-bottom: 12px;
          box-shadow: 0 8px 22px rgba(74, 14, 14, 0.08);
          border: 1px solid rgba(229, 180, 162, 0.2);
          position: relative;
          overflow: hidden;
        }

        .mobile-testimonial-card::after {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 80px;
          height: 80px;
          background: radial-gradient(circle, rgba(229, 180, 162, 0.25), transparent 65%);
        }

        .mobile-testimonial-text {
          font-size: 0.88rem;
          color: #4A0E0E;
          line-height: 1.5;
          font-weight: 600;
        }

        .mobile-testimonial-name {
          margin-top: 10px;
          font-size: 0.8rem;
          font-weight: 700;
          color: #8b4545;
        }

        /* Brand Story */
        .mobile-brand-story {
          margin: 25px 15px 5px;
          background: linear-gradient(135deg, #fff5ef, #f5ede5);
          border-radius: 20px;
          padding: 18px;
          border: 1px solid rgba(229, 180, 162, 0.25);
          box-shadow: 0 8px 20px rgba(74, 14, 14, 0.06);
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          align-items: center;
        }

        .mobile-brand-text h3 {
          font-size: 1.1rem;
          color: #4A0E0E;
          margin-bottom: 6px;
          font-family: 'Cormorant Garamond', serif;
        }

        .mobile-brand-text p {
          font-size: 0.8rem;
          color: #8b4545;
          line-height: 1.4;
          font-weight: 600;
        }

        .mobile-brand-img {
          height: 110px;
          border-radius: 14px;
          overflow: hidden;
        }

        .mobile-brand-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* Quick Actions */
        .mobile-quick-actions {
          padding: 30px 15px;
          display: flex;
          gap: 12px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          animation: fadeInUp 0.8s ease-out;
        }

        .mobile-quick-actions::-webkit-scrollbar {
          height: 4px;
        }

        .mobile-quick-actions::-webkit-scrollbar-track {
          background: rgba(229, 180, 162, 0.1);
          border-radius: 10px;
        }

        .mobile-quick-actions::-webkit-scrollbar-thumb {
          background: #E5B4A2;
          border-radius: 10px;
        }

        .mobile-quick-action {
          flex-shrink: 0;
          background: linear-gradient(135deg, #E5B4A2, #d4a5a5);
          color: white;
          padding: 0;
          border-radius: 15px;
          text-align: center;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          scroll-snap-align: start;
          box-shadow: 0 8px 25px rgba(229, 180, 162, 0.3);
          min-width: 160px;
          overflow: hidden;
          border: 2px solid rgba(255,255,255,0.3);
          position: relative;
        }

        .mobile-quick-action::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          animation: shimmer 2s infinite;
          z-index: 1;
        }

        .mobile-quick-action:active {
          transform: scale(0.92) translateY(-2px);
          box-shadow: 0 12px 30px rgba(229, 180, 162, 0.5);
        }

        .mobile-quick-action-icon {
          width: 100%;
          height: 100px;
          overflow: hidden;
          background: linear-gradient(135deg, rgba(74, 14, 14, 0.1), rgba(74, 14, 14, 0.05));
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 2;
        }

        .mobile-quick-action-icon img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .mobile-quick-action:hover .mobile-quick-action-icon img {
          transform: scale(1.1);
        }

        .mobile-quick-action-text {
          font-size: 0.9rem;
          font-weight: 700;
          line-height: 1.3;
          padding: 12px;
          position: relative;
          z-index: 2;
        }

        /* Bottom Section */
        .mobile-bottom-cta {
          padding: 30px 20px;
          background: linear-gradient(135deg, #4A0E0E 0%, #8b4545 100%);
          color: white;
          margin: 30px 15px;
          border-radius: 20px;
          text-align: center;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-shadow: 0 12px 35px rgba(74, 14, 14, 0.25);
          animation: fadeInUp 0.8s ease-out;
          border: 2px solid rgba(229, 180, 162, 0.3);
          position: relative;
          overflow: hidden;
        }

        .mobile-bottom-cta::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          animation: shimmer 3s infinite;
          z-index: 1;
        }

        .mobile-bottom-cta:active {
          transform: scale(0.96) translateY(-3px);
          box-shadow: 0 15px 40px rgba(74, 14, 14, 0.3);
        }

        .mobile-bottom-title {
          font-size: 1.4rem;
          font-weight: 700;
          margin-bottom: 10px;
          font-family: 'Cormorant Garamond', serif;
          position: relative;
          z-index: 2;
        }

        .mobile-bottom-text {
          font-size: 0.95rem;
          opacity: 0.95;
          margin-bottom: 18px;
          position: relative;
          z-index: 2;
        }

        .mobile-bottom-btn {
          background: #E5B4A2;
          color: #4A0E0E;
          border: none;
          padding: 12px 26px;
          border-radius: 25px;
          font-weight: 700;
          cursor: pointer;
          font-size: 0.95rem;
          transition: all 0.3s;
          position: relative;
          z-index: 2;
        }

        .mobile-bottom-btn:active {
          transform: scale(0.92);
        }

        /* Footer */
        .mobile-footer {
          padding: 30px 15px 60px;
          text-align: center;
          color: #666;
          font-size: 0.85rem;
          border-top: 2px solid rgba(229, 180, 162, 0.3);
          margin-top: 30px;
          animation: fadeInUp 0.8s ease-out;
        }

        .mobile-footer-link {
          color: #4A0E0E;
          text-decoration: none;
          font-weight: 700;
          margin: 0 10px;
          cursor: pointer;
          transition: all 0.3s;
          position: relative;
        }

        .mobile-footer-link:active {
          color: #E5B4A2;
          transform: scale(1.1);
        }

        /* Floating Cart Badge */
        .mobile-float-cart {
          position: fixed;
          bottom: 25px;
          right: 25px;
          background: linear-gradient(135deg, #E5B4A2, #d4a5a5);
          color: #4A0E0E;
          width: 70px;
          height: 70px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 1.6rem;
          box-shadow: 0 8px 30px rgba(229, 180, 162, 0.5);
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          z-index: 100;
          border: 3px solid rgba(255,255,255,0.5);
          animation: float 3s ease-in-out infinite, fadeInUp 0.8s ease-out;
        }

        .mobile-float-cart:active {
          transform: scale(0.85);
          animation: none;
        }

        .mobile-cart-badge {
          position: absolute;
          top: -8px;
          right: -8px;
          background: linear-gradient(135deg, #ff3b30, #ff1744);
          color: white;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          font-weight: 700;
          box-shadow: 0 4px 12px rgba(255, 59, 48, 0.4);
          border: 2px solid white;
          animation: pulse 2s ease-in-out infinite;
        }
      `}</style>

      {/* Hero Banner */}
      <div className="mobile-hero">
        <h1 className="mobile-hero-title">Lehnga Bazar</h1>
        <p className="mobile-hero-subtitle">Premium Lehengas Collection</p>
        <div className="mobile-hero-img">
          <img src={heroImg} alt="Featured Lehenga" />
        </div>
        <button className="mobile-cta-btn" onClick={() => navigate("/explore")}>
          Shop Now <FaArrowRight size={14} />
        </button>
      </div>

      {/* Stats */}
      <div className="mobile-stats">
        {stats.map((stat) => (
          <div key={stat.label} className="mobile-stat-card">
            <div className="mobile-stat-value">{stat.value}</div>
            <div className="mobile-stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Collections */}
      <div className="mobile-collections">
        <h2 className="mobile-section-title">Shop By Occasion</h2>
        <div className="mobile-collection-grid">
          {collections.map((item) => (
            <div
              key={item.id}
              className="mobile-collection-card"
              onClick={() => navigate(item.path)}
            >
              <div className="mobile-collection-icon">
                <img src={item.image} alt={item.title} />
              </div>
              <div className="mobile-collection-info">
                <div className="mobile-collection-title">{item.title}</div>
                <div className="mobile-collection-text">Explore →</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Picks */}
      <div className="mobile-trending">
        <h2 className="mobile-section-title">Trending Picks</h2>
        <div className="mobile-trending-strip">
          {trending.map((item) => (
            <div
              key={item.id}
              className="mobile-trending-card"
              onClick={() => navigate("/explore")}
            >
              <div className="mobile-trending-img">
                <img src={item.image} alt={item.title} />
              </div>
              <div className="mobile-trending-info">
                <div className="mobile-trending-title">{item.title}</div>
                <div className="mobile-trending-price">{item.price}</div>
                <div className="mobile-trending-cta">
                  View Style <FaArrowRight size={12} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="mobile-features">
        <div className="mobile-features-grid">
          {features.map((feature, index) => (
            <div key={index} className="mobile-feature-item">
              <div className="mobile-feature-icon">{feature.icon}</div>
              <div className="mobile-feature-text">{feature.text}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Brand Story */}
      <div className="mobile-brand-story">
        <div className="mobile-brand-text">
          <h3>Heritage Craft</h3>
          <p>
            Handpicked embroidery, made for modern brides who love tradition.
          </p>
        </div>
        <div className="mobile-brand-img">
          <img src={bridalImg} alt="Bridal Craft" />
        </div>
      </div>

      {/* Testimonials */}
      <div className="mobile-testimonials">
        <h2 className="mobile-section-title">Loved By Brides</h2>
        {testimonials.map((item) => (
          <div key={item.id} className="mobile-testimonial-card">
            <div className="mobile-testimonial-text">{item.text}</div>
            <div className="mobile-testimonial-name">- {item.name}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mobile-quick-actions">
        <div
          className="mobile-quick-action"
          onClick={() => navigate("/occasion/mehndi")}
        >
          <div className="mobile-quick-action-icon">
            <img src={mehndiImg} alt="Mehndi Collection" />
          </div>
          <div className="mobile-quick-action-text">Mehndi Collection</div>
        </div>
        <div
          className="mobile-quick-action"
          onClick={() => navigate("/occasion/haldi")}
        >
          <div className="mobile-quick-action-icon">
            <img src={haldiImg} alt="Haldi Collection" />
          </div>
          <div className="mobile-quick-action-text">Haldi Collection</div>
        </div>
        <div
          className="mobile-quick-action"
          onClick={() => navigate("/occasion/wedding")}
        >
          <div className="mobile-quick-action-icon">
            <img src={weddingImg} alt="Wedding Collection" />
          </div>
          <div className="mobile-quick-action-text">Wedding Collection</div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="mobile-bottom-cta" onClick={() => navigate("/explore")}>
        <div className="mobile-bottom-title">Discover More</div>
        <div className="mobile-bottom-text">
          Explore our complete collection of premium lehengas
        </div>
        <button className="mobile-bottom-btn">View All Products →</button>
      </div>

      {/* Footer */}
      <div className="mobile-footer">
        <p>© 2026 Soni Mahal. All Rights Reserved.</p>
        <div style={{ marginTop: "15px" }}>
          <span className="mobile-footer-link" onClick={() => navigate("/")}>
            Home
          </span>
          |
          <span
            className="mobile-footer-link"
            onClick={() => navigate("/explore")}
          >
            Shop
          </span>
          |
          <span
            className="mobile-footer-link"
            onClick={() => navigate("/tryon")}
          >
            Try On
          </span>
        </div>
      </div>

      {/* Floating Cart Button */}
      {cartCount > 0 && (
        <div className="mobile-float-cart" onClick={() => navigate("/cart")}>
          <FaShoppingBag size={24} />
          <div className="mobile-cart-badge">{cartCount}</div>
        </div>
      )}
    </div>
  );
};

export default MobileLanding;
