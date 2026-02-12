import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaShoppingBag,
  FaSearch,
  FaArrowLeft,
  FaArrowRight,
  FaChevronDown,
  FaInstagram,
  FaWhatsapp,
  FaMapMarkerAlt,
  FaStar,
  FaApple,
  FaGooglePlay,
} from "react-icons/fa";
import Navbar from "../components/Navbar";

// Import datasets
import lehngaDataset from "../data/lehngaDataset.json";
import lehngaMehndi from "../data/lehngaMehndi.json";
import lehngaHaldi from "../data/lehngaHaldi.json";

// Assets from your uploads
import heroImage from "../assets/banners/hero2.png";
import logoDefault from "../assets/logos/logo.png";
import logoAlt from "../assets/logos/logo2.png";
import weddingGif from "../assets/banners/STYLED_BY_MOHEY_Landing_D.jpg";
import trendBanner from "../assets/banners/STYLED_BY_MOHEY_Landing_D.jpg";
import coutureImg from "../assets/logos/logologin.png";
import bridalImg from "../assets/products/bridal-collection.avif";
import mehndiImg from "../assets/categories/Mehndi.webp";
import haldiImg from "../assets/categories/Haldi.jpeg";
import weddingImg from "../assets/categories/Wedding.jpg";
import weddingImg2 from "../assets/categories/Wedding2.jpg";
import prod1 from "../assets/products/lehenga-01.avif";
import prod2 from "../assets/products/lehenga-02.avif";
import prod3 from "../assets/products/lehenga-03.avif";
import prod4 from "../assets/products/lehenga-04.avif";
import prod5 from "../assets/products/lehenga-05.avif";
import prod6 from "../assets/products/lehenga-06.avif";
import prod19 from "../assets/products/lehenga-19.avif";
import prod13 from "../assets/products/lehenga-13.avif";
import tryon from "../assets/icons/tryon.png";

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

const ProfessionalBridalAtelier = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll reveal observer: adds .visible with a staggered delay when elements enter viewport
  useEffect(() => {
    const reveals = document.querySelectorAll(".reveal");
    if (!reveals.length) return;

    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const idx = el.dataset.index ? parseInt(el.dataset.index, 10) : 0;
            // stagger via inline transitionDelay so each shows in sequence
            el.style.transitionDelay = `${idx * 120}ms`;
            requestAnimationFrame(() => el.classList.add("visible"));
            obs.unobserve(el);
          }
        });
      },
      { threshold: 0.15 },
    );

    reveals.forEach((el, i) => {
      el.dataset.index = i;
      io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  // Occasion carousel control
  const occasionRef = useRef(null);
  const scrollOccasion = (dir = "right") => {
    const el = occasionRef.current;
    if (!el) return;
    const card = el.querySelector(".occasion-card");
    const cardWidth = card
      ? card.getBoundingClientRect().width
      : el.clientWidth / 4;
    const gap = 30; // should match CSS gap
    const offset = (cardWidth + gap) * (dir === "right" ? 1 : -1);
    el.scrollBy({ left: offset, behavior: "smooth" });
  };

  // Whether the navbar is in scrolled state
  const isScrolled = scrollY > 50;
  // Chat toggle
  const [chatOpen, setChatOpen] = useState(false);
  // Signature flip state (for touch/click)
  const [sigFlipped, setSigFlipped] = useState({});
  // router navigate for hero CTA
  const navigate = useNavigate();

  return (
    <div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;1,400&family=Montserrat:wght@200;400;600&family=Alex+Brush&display=swap');

        :root {
          --royal-ivory: #FDFBF7;
          --champagne: #F7E7CE;
          --rose-gold: #E5B4A2;
          --deep-maroon: #4A0E0E;
          --glass-white: rgba(255, 255, 255, 0.85);
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          background: var(--royal-ivory); 
          color: var(--deep-maroon);
          font-family: 'Cormorant Garamond', serif;
          overflow-x: hidden;
        }

        /* --- TRANSPARENT TO RICH NAVBAR --- */
        .navbar {
          position: fixed; top: 0; width: 100%; z-index: 1000;
          display: flex; justify-content: space-between; align-items: center;
          padding: 18px 60px; transition: all 0.4s ease;
          background: ${scrollY > 50 ? "rgba(74,14,14,0.95)" : "transparent"};
          backdrop-filter: ${scrollY > 50 ? "blur(12px)" : "none"};
          border-bottom: ${
            scrollY > 50 ? "1px solid rgba(0,0,0,0.08)" : "none"
          };
        }
        .nav-left { display:flex; align-items:center; gap:22px; }
        .nav-logo img { height: 45px; transition: 0.3s; filter: ${
          scrollY > 50 ? "brightness(1) invert(0)" : "none"
        }; }
        .nav-links { display: flex; gap: 22px; align-items: center; }
        .nav-links a { 
          text-decoration: none; color: ${
            scrollY > 50 ? "white" : "var(--deep-maroon)"
          }; 
          font-family: 'Montserrat'; font-size: 0.75rem; letter-spacing: 2px;
          text-transform: uppercase; font-weight: 500;
        }
        .nav-right { display:flex; gap:18px; align-items:center; color: ${
          scrollY > 50 ? "white" : "var(--deep-maroon)"
        }; }
        .nav-right svg { color: ${
          scrollY > 50 ? "white" : "var(--deep-maroon)"
        }; }

        /* --- FANCY HERO DESIGN --- */
        .hero {
          height: 100vh; width: 100%; display: grid;
          grid-template-columns: 1fr 1fr; align-items: center;
          padding: 0 8%; position: relative; background: #fff;
        }

        .hero-text-side { padding-right: 50px; z-index: 10; animation: fadeUp 900ms ease both; }
        @keyframes fadeUp { from { transform: translateY(20px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
        
        .hero-title { 
          font-size: clamp(4rem, 7vw, 8rem); font-weight: 300; line-height: 0.9;
          margin: 20px 0; color: var(--deep-maroon);
        }
        .hero-title i { font-family: 'Alex Brush'; color: var(--rose-gold); font-size: 1.1em; }

        .hero-image-side {
          position: relative; height: 85vh;
          border-radius: 400px 400px 20px 20px;
          margin-top: 24px;
          overflow: hidden; box-shadow: 0 40px 100px rgba(0,0,0,0.15);
          clip-path: path("M 0 12% Q 50% 0% 100% 12% L 100% 100% L 0 100% Z");
          display: block;
        }
        .hero-image-side img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.2s linear; }

        @media (max-width: 1024px) {
          .hero { grid-template-columns: 1fr; padding: 0 5%; }
          .hero-text-side { padding-right: 0; margin-bottom: 30px; }
          .hero-image-side { height: 50vh; margin-top: 18px; border-radius: 20px; clip-path: path("M 0 12% Q 50% 0% 100% 12% L 100% 100% L 0 100% Z"); }
          .hero-title { font-size: clamp(2.5rem, 5vw, 4.5rem); }
        }
        @media (max-width: 768px) {
          .hero { padding: 60px 4% 40px; margin-top: 20px; }
          .hero-image-side { height: 45vh; margin-top: 20px; clip-path: path("M 0 14% Q 50% 0% 100% 14% L 100% 100% L 0 100% Z"); border-radius: 15px; }
          .hero-title { font-size: clamp(1.8rem, 4vw, 2.8rem); }
          .hero-text-side { padding: 0; }
        }
        @media (max-width: 480px) {
          .hero { padding: 70px 4% 40px; gap: 20px; }
          .hero-image-side { height: 50vh; margin-top: 15px; border-radius: 12px; clip-path: path("M 0 16% Q 50% 0% 100% 16% L 100% 100% L 0 100% Z"); }
          .hero-title { font-size: clamp(1.4rem, 5vw, 2rem); margin: 12px 0; }
          .hero-text-side { padding: 0; text-align: center; }
        }

        /* --- THE GIF PLACEMENT (The Procession) --- */
        .gif-divider {
          background: #fff; padding: 0; margin-top: -20px;
          display: flex; flex-direction: column; align-items: center;
          border-top: 1px solid var(--champagne);
        }
        .gif-divider img { width: 100%; height: 70vh; object-fit: cover; mix-blend-mode: normal; opacity: 1; animation: slowZoom 25s ease-in-out infinite alternate; box-shadow: 0 40px 80px rgba(0,0,0,0.15); }
        @keyframes slowZoom { from { transform: scale(1); } to { transform: scale(1.06); } }
        
        @media (max-width: 1024px) {
          .gif-divider img { height: 50vh; }
        }
        @media (max-width: 768px) {
          .gif-divider img { height: 40vh; }
        }
        @media (max-width: 480px) {
          .gif-divider { margin-top: 0px; padding: 20px 0; }
          .gif-divider img { height: 35vh; }
        }
        .gif-overlay { position: absolute; top: 40%; transform: translateY(-50%); color: white; pointer-events: none; }
        .gif-label { 
            font-family: 'Montserrat'; font-size: 0.9rem; letter-spacing: 6px; 
            text-transform: uppercase; color: var(--rose-gold); background: rgba(0,0,0,0.25); padding: 8px 14px; border-radius: 20px;
        }

        /* --- SHOP THE OCCASION --- */
        .occasion-section { padding: 80px 8%; text-align: center; }
        .occasion-header { font-size: 2.2rem; font-weight: 300; margin-bottom: 24px; }
        .occasion-sub { color: #666; margin-bottom: 20px; }
        .occasion-wrap { position: relative; }
        .occasion-track { display: grid; grid-auto-flow: column; grid-auto-columns: calc((100% - 90px) / 4); gap: 30px; overflow-x: auto; scroll-snap-type: x mandatory; scroll-behavior: smooth; padding: 0 56px 12px; }
        .occasion-card { position: relative; scroll-snap-align: center; border-radius: 12px; overflow: hidden; }
        .occasion-card img { width: 100%; height: 500px; object-fit: cover; display: block; }
        .occasion-label { position: absolute; bottom: 18px; left: 18px; color: white; font-weight: 600; letter-spacing: 2px; background: rgba(0,0,0,0.32); padding: 10px 14px; border-radius: 8px; }
        .occasion-nav { position: absolute; top: 50%; transform: translateY(-50%); width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.98); box-shadow: 0 12px 26px rgba(0,0,0,0.12); cursor: pointer; z-index: 4; pointer-events: auto; }
        .occasion-nav.left { left: 12px; }
        .occasion-nav.right { right: 12px; }
        .occasion-track::-webkit-scrollbar { height: 8px; }
        .occasion-track::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.08); border-radius: 8px; }

        @media (max-width: 1024px) {
          .occasion-section { padding: 60px 5%; }
          .occasion-header { font-size: 1.8rem; }
          .occasion-track { grid-auto-columns: calc((100% - 60px) / 3); gap: 20px; }
          .occasion-card img { height: 380px; }
        }
        @media (max-width: 768px) {
          .occasion-section { padding: 50px 4%; }
          .occasion-header { font-size: 1.5rem; }
          .occasion-track { grid-auto-columns: calc((100% - 30px) / 2); gap: 15px; padding: 0 30px 12px; }
          .occasion-card img { height: 320px; }
          .occasion-label { padding: 8px 10px; font-size: 0.9rem; }
        }
        @media (max-width: 480px) {
          .occasion-section { padding: 40px 3%; }
          .occasion-header { font-size: 1.2rem; }
          .occasion-track { grid-auto-columns: 100%; gap: 12px; padding: 0 0 12px; }
          .occasion-card img { height: 280px; }
          .occasion-nav { width: 35px; height: 35px; font-size: 0.9rem; }
        }

        /* --- ARCHED COLLECTION CARDS --- */
        .card-arch {
          border-radius: 200px 200px 0 0; overflow: hidden;
          background: white; padding: 10px; border: 1px solid var(--champagne);
          transition: 0.5s ease;
          perspective: 1200px;
        }
        .card-arch:hover { transform: translateY(-15px) scale(1.02); box-shadow: 0 30px 60px rgba(0,0,0,0.08); }

        /* 3D flip container */
        /* give the flip a fixed responsive height so absolute children have space */
        .card-flip {
          width:100%;
          height: clamp(520px, 62vh, 900px);
          cursor: pointer;
          position: relative;
          overflow: hidden;
          clip-path: path("M 0 12% Q 50% 0% 100% 12% L 100% 100% L 0 100% Z");
        }
        .flip-inner { position: relative; width:100%; height:100%; transition: transform .9s cubic-bezier(.2,.9,.2,1); transform-style: preserve-3d; }
        .card-arch:hover .flip-inner { transform: rotateY(180deg); }
        .flip-inner.flipped { transform: rotateY(180deg); }
        .flip-front, .flip-back { position:absolute; inset:0; backface-visibility: hidden; border-radius: inherit; overflow:hidden; display:flex; align-items:center; justify-content:center; }
        /* images fill the flip area and use the portrait-friendly focal point */
        .flip-front img, .flip-back img { width:100%; height:100%; object-fit: cover; object-position: 50% 12%; display:block; }
        .flip-back { transform: rotateY(180deg); background: linear-gradient(180deg, rgba(74,14,14,0.95), rgba(229,180,162,0.06)); color: white; padding: 20px; text-align:center; }
        .back-content { color: white; font-weight:700; }

        @media (max-width: 1024px) {
          .card-arch { padding: 8px; }
          .card-flip { height: clamp(400px, 55vh, 700px); clip-path: path("M 0 12% Q 50% 0% 100% 12% L 100% 100% L 0 100% Z"); }
        }
        @media (max-width: 768px) {
          .card-arch:hover { transform: translateY(-8px) scale(1.01); }
          .card-flip { height: clamp(300px, 45vh, 550px); clip-path: path("M 0 14% Q 50% 0% 100% 14% L 100% 100% L 0 100% Z"); }
          .flip-back { padding: 15px; }
        }
        @media (max-width: 480px) {
          .card-arch { padding: 6px; border-radius: 150px 150px 0 0; }
          .card-flip { height: clamp(280px, 48vh, 400px); clip-path: path("M 0 16% Q 50% 0% 100% 16% L 100% 100% L 0 100% Z"); }
          .flip-back { padding: 12px; font-size: 0.9rem; }
        }

        /* ensure any leftover direct .card-arch > img is handled (legacy) */
        .card-arch > img { width:100%; height:auto; display:block; }
        /* small safety: if a flip isn't used, images still have a large size */
        .card-arch img { max-height: clamp(520px, 62vh, 900px); object-fit: cover; object-position: 50% 12%; transition: transform .5s ease, opacity .5s; }

        /* --- SCROLL REVEAL --- */
        .reveal { opacity: 0; --x: 0px; --y: 40px; transform: translate(var(--x), var(--y)); transition: opacity 700ms cubic-bezier(.2,.9,.2,1), transform 700ms cubic-bezier(.2,.9,.2,1); will-change: transform, opacity; }
        .reveal.visible { opacity: 1; --x: 0px; --y: 0px; }
        .reveal-left { --x: -60px; --y: 0px; }
        .reveal-right { --x: 60px; --y: 0px; }
        .reveal-up { --y: 60px; }

        /* Promo banner section (after Craftsmanship) */
        .promo-banner { margin: 60px 8%; border-radius: 12px; overflow: hidden; position: relative; display:flex; align-items:center; justify-content:center; min-height: 220px; background-size: cover; background-position: center; }
        .promo-overlay { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(8,20,30,0.45), rgba(8,20,30,0.45)); }
        .promo-inner { position: relative; z-index: 2; width: 100%; max-width: 1200px; display:flex; gap: 24px; align-items:center; justify-content: space-between; padding: 28px; color: white; }
        .promo-left { display:flex; flex-direction:column; gap: 10px; max-width: 60%; }
        .promo-title { font-family: 'cursive'; font-weight:800; font-size: clamp(1.6rem, 2.6vw, 3rem); letter-spacing: 2px; color: #FFD966; }
        .promo-sub { font-size: 1.05rem; opacity: 0.95; color: #fff; }
        .promo-cta { display:flex; gap: 12px; margin-top: 10px; }
        .store-badge { display:inline-flex; align-items:center; gap:10px; background: rgba(255,255,255,0.95); color:#000; padding: 10px 14px; border-radius: 8px; font-weight:700; box-shadow: 0 10px 30px rgba(0,0,0,0.12); }
        .store-badge svg { color: #000; }
        .promo-right { width: 260px; display:flex; align-items:center; justify-content:center; }
        .promo-right img { width: 100%; height: auto; object-fit: contain; }

        @media (max-width: 900px) { .promo-inner { flex-direction: column; align-items:flex-start; padding: 18px; } .promo-left { max-width: 100%; } .promo-right { width:100%; } }
        @media (max-width: 520px) { .promo-title { font-size: 1.35rem } .store-badge { padding:8px 10px; font-size:0.9rem } }

        /* --- BUTTONS --- */
        .btn-fancy {
          padding: 20px 50px; background: var(--deep-maroon); color: white;
          border: none; font-family: 'Montserrat'; font-size: 0.75rem;
          letter-spacing: 3px; text-transform: uppercase; cursor: pointer;
          transition: 0.4s; display: inline-flex; align-items: center; gap: 15px;
          box-shadow: 0 8px 24px rgba(72,12,12,0.12);
        }
        .btn-fancy:hover { letter-spacing: 5px; background: #000; transform: translateY(-3px); }

        .testimonial { background: linear-gradient(180deg,#fff,#fcfbf9); padding: 34px; border-radius: 14px; border-left: 6px solid var(--rose-gold); transition: transform .4s, box-shadow .4s, opacity .4s; position: relative; overflow: visible; }
        .testimonial::before { content: "“"; position: absolute; top: -18px; left: 18px; font-size: 48px; color: rgba(229,180,162,0.14); font-family: serif; }
        .testimonial:hover { transform: translateY(-12px); box-shadow: 0 28px 60px rgba(0,0,0,0.12); }
        .testimonial p { color: #333; font-style: italic; }
        /* decorative gif near testimonials */
        .testimonial-deco { position: absolute; right: -30px; top: -20px; width: 160px; opacity: 0.95; border-radius: 12px; box-shadow: 0 18px 40px rgba(0,0,0,0.12); }

        @media (max-width: 768px) {
          .testimonial { padding: 24px; border-left: 4px solid var(--rose-gold); }
          .testimonial::before { font-size: 36px; top: -12px; left: 12px; }
          .testimonial-deco { width: 120px; right: -15px; top: -10px; }
        }
        @media (max-width: 480px) {
          .testimonial { padding: 16px; border-left: 3px solid var(--rose-gold); }
          .testimonial::before { font-size: 28px; top: -8px; }
          .testimonial p { font-size: 0.95rem; }
          .testimonial-deco { width: 90px; right: -10px; }
        }

        /* --- FLOATING CHAT AVATAR --- */
        .chat-avatar { position: fixed; right: 26px; bottom: 90px; z-index: 2000; width: 78px; height: 78px; border-radius: 50%; overflow: visible; cursor:pointer; box-shadow:0 14px 34px rgba(0,0,0,0.22); background: white; display:flex; align-items:center; justify-content:center; animation: float 3.8s ease-in-out infinite; }
        .chat-avatar img { width: 100%; height: 100%; object-fit: cover; border-radius:50%; display:block; }
        @keyframes float { 0%{transform:translateY(0)} 50%{transform:translateY(-8px)} 100%{transform:translateY(0)} }
        .status-dot { position: absolute; right: 8px; bottom: 8px; width: 12px; height: 12px; background: #34D399; border-radius: 50%; border: 2px solid white; }

        .assistant-avatar { width:44px; height:44px; border-radius:50%; overflow:hidden; border:2px solid rgba(255,255,255,0.14); }

        .chat-panel { position: fixed; right: 26px; bottom: 178px; width: 340px; max-width: calc(100% - 48px); background: white; color: var(--deep-maroon); border-radius: 12px; box-shadow: 0 22px 60px rgba(0,0,0,0.18); z-index: 2000; overflow: hidden; transform-origin: bottom right; transform: translateY(10px) scale(.98); opacity: 0; transition: transform .28s cubic-bezier(.2,.9,.2,1), opacity .28s; }
        .chat-panel.open { transform: translateY(0) scale(1); opacity:1; }
        .chat-panel-header { padding: 12px 14px; display:flex; align-items:center; gap:10px; justify-content:space-between; background: linear-gradient(90deg, rgba(74,14,14,0.95), rgba(74,14,14,0.85)); color:white; }
        .chat-panel .chat-message { padding: 14px; color: #444; background: #fff; min-height: 80px; }
        .chat-panel-footer { padding: 12px; display:flex; gap:8px; align-items:center; border-top:1px solid rgba(0,0,0,0.05); }
        .chat-input { flex:1; padding: 10px 12px; border-radius: 8px; border:1px solid rgba(0,0,0,0.06); font-size: 0.95rem; }

        @media (max-width: 768px) {
          .chat-avatar { width: 65px; height: 65px; right: 20px; bottom: 80px; }
          .chat-panel { width: 300px; right: 20px; bottom: 155px; }
        }
        @media (max-width: 480px) {
          .chat-avatar { width: 55px; height: 55px; right: 15px; bottom: 70px; }
          .chat-panel { width: calc(100% - 30px); right: 15px; bottom: 140px; max-width: 320px; }
          .chat-panel-header { padding: 10px 12px; font-size: 0.9rem; }
          .chat-input { font-size: 0.9rem; }
        }

        /* --- FOOTER --- */
        .site-footer { background: var(--deep-maroon); color: white; }
        .site-footer .footer-inner { padding: 80px 8%; max-width: 1400px; margin: 0 auto; }
        .footer-grid { display: grid; grid-template-columns: 1.5fr 1fr 1fr 1fr; gap: 30px; align-items: start; }
        .footer-logo { height: 80px; width: auto; margin-bottom: 16px; filter: brightness(1.1); }
        .footer-heading { font-size: 0.95rem; letter-spacing: 2px; color: var(--rose-gold); margin-bottom: 12px; font-weight: 700; }
        .footer-desc { margin: 0 0 12px; font-size: 0.85rem; opacity: 0.78; line-height: 1.6; }
        .footer-list { list-style: none; padding: 0; margin: 0; }
        .footer-list li { margin: 8px 0; opacity: 0.9; }
        .footer-link { color: inherit; text-decoration: none; opacity: 0.9; transition: opacity .2s ease, transform .2s ease; display: inline-block; }
        .footer-link:hover { opacity: 1; transform: translateX(2px); }
        .footer-link:focus-visible { outline: 2px solid var(--rose-gold); outline-offset: 3px; border-radius: 3px; }
        .footer-visit-link { color: inherit; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; opacity: 0.9; }
        .footer-bottom { padding-top: 28px; border-top: 1px solid rgba(255,255,255,0.06); display:flex; justify-content:space-between; align-items:center; gap:20px; flex-wrap:wrap; font-size: 0.9rem; opacity: 0.85; }
        .footer-social { display:flex; gap:12px; align-items:center; }
        .footer-social a { color: inherit; text-decoration: none; opacity: 0.9; transition: opacity .2s ease, transform .2s ease; }
        .footer-social a:hover { opacity: 1; transform: translateY(-2px); }

        @media (max-width: 900px) {
          .footer-grid { grid-template-columns: 1fr 1fr; }
          .nav-links { display: none; }
        }
        @media (max-width: 600px) {
          .footer-grid { grid-template-columns: 1fr; }
          .footer-bottom { text-align:center; justify-content:center; }
        }

        /* --- MOST LOVED PRODUCT GRID --- */
        .product-wrap { position: relative; margin-top: 28px; }
        .product-track { display: grid; grid-auto-flow: column; grid-auto-columns: min(320px, 28%); gap: 28px; overflow-x: auto; padding: 0 56px 12px; scroll-snap-type: x mandatory; scroll-behavior: smooth; }
        .product-card { background: #fff; border-radius: 10px; overflow: hidden; border: 1px solid rgba(0,0,0,0.06); cursor: pointer; transition: transform .25s, box-shadow .25s; scroll-snap-align: center; }
        .product-card:hover { transform: translateY(-6px); box-shadow: 0 16px 36px rgba(0,0,0,0.12); }
        .product-image-wrap { position: relative; }
        .product-image { width: 100%; height: 420px; object-fit: cover; display: block; }
        .rating-pill { position: absolute; top: 10px; left: 10px; display:flex; gap:6px; align-items:center; background: #fff; padding:6px 10px; border-radius:8px; font-weight:800; font-size:0.85rem; color:#111; box-shadow: 0 8px 18px rgba(0,0,0,0.12); }
        .rating-pill .rating-star { color: #00a36c; }
        .rating-pill .rating-count { color: #555; font-weight: 700; }

        .product-meta { padding: 14px 16px 16px; display: flex; flex-direction: column; gap: 8px; }
        .product-title { font-weight: 800; color: #1e1e1e; font-size: 1rem; letter-spacing: 0.6px; text-transform: uppercase; }
        .product-sub { color: #666; font-size: 0.9rem; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
        .price-row { display:flex; flex-wrap: wrap; align-items: baseline; gap: 8px; }
        .price-current { font-weight: 800; color: #111; }
        .price-old { color:#999; text-decoration: line-through; font-size:0.85rem; }
        .price-discount { color:#ff3b30; font-weight:800; font-size:0.85rem; }
        .stock-note { color:#ff5a1f; font-weight:800; font-size:0.85rem; }

        .product-nav { position: absolute; top: 50%; transform: translateY(-50%); width: 46px; height: 46px; border-radius: 50%; background: rgba(255,255,255,0.98); box-shadow: 0 12px 26px rgba(0,0,0,0.12); display:flex; align-items:center; justify-content:center; cursor:pointer; z-index: 4; pointer-events: auto; }
        .product-nav.left { left: 6px; }
        .product-nav.right { right: 6px; }

        @media (max-width: 1100px) { .product-track { grid-auto-columns: min(300px, 45%); padding: 0 48px 12px; } .product-image { height: 360px; } }
        @media (max-width: 600px) { .product-track { grid-auto-columns: 90%; padding: 0 42px 12px; } .product-image { height: 320px; } }
      `}</style>

      {/* --- NAVIGATION --- */}
      <Navbar />

      {/* --- REFINED HERO SECTION --- */}
      <section className="hero">
        <div className="hero-text-side">
          <span
            style={{
              fontFamily: "Montserrat",
              letterSpacing: "5px",
              color: "var(--rose-gold)",
              fontSize: "0.8rem",
            }}
          >
            ESTABLISHED 2026
          </span>
          <h1 className="hero-title">
            Woven <br /> <i>Royalty</i>
          </h1>
          <p
            style={{
              lineHeight: "1.8",
              color: "#666",
              marginBottom: "40px",
              maxWidth: "400px",
            }}
          >
            Enter a sanctuary of bridal excellence. We combine centuries-old
            craftsmanship with modern silhouettes to create heirlooms for your
            soul
          </p>
          <button className="btn-fancy" onClick={() => navigate("/explore")}>
            Explore the Edit <FaArrowRight />
          </button>
        </div>

        <div
          className="hero-image-side"
          style={{
            transform: `translateY(${scrollY * -0.06}px)`,
            transition: "transform 0.2s linear",
          }}
        >
          <img
            src={heroImage}
            alt="Main Bridal Piece"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: `scale(${1 + Math.min(scrollY / 2000, 0.06)})`,
              transition: "transform 0.2s linear",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "40px",
              left: "40px",
              color: "white",
              background:
                "linear-gradient(90deg, rgba(0,0,0,0.25), rgba(0,0,0,0.15))",
              padding: "20px",
              backdropFilter: "blur(5px)",
            }}
          >
            <p style={{ fontSize: "0.7rem", letterSpacing: "2px" }}>
              FEATURING
            </p>
            <h3>The Crimson Heritage</h3>
          </div>
        </div>
      </section>

      {/* --- STRATEGIC GIF PLACEMENT --- */}
      <div className="gif-divider">
        <img
          src={weddingGif}
          alt="Bridal Procession"
          className="reveal reveal-up"
          style={{ transitionDelay: "100ms" }}
        />
      </div>

      {/* --- COLLECTION GRID --- */}
      <section style={{ padding: "100px 8%" }} id="collections">
        <div style={{ textAlign: "center", marginBottom: "80px" }}>
          <h2 style={{ fontSize: "3.5rem", fontWeight: "300" }}>
            Signature Series
          </h2>
          <div
            style={{
              width: "60px",
              height: "1px",
              background: "var(--rose-gold)",
              margin: "20px auto",
            }}
          ></div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "40px",
          }}
        >
          {[
            {
              img: prod19,
              backImg: trendBanner,
              title: "Peacock Velvet",
              price: "Premium Couture",
              onclick: () => navigate(""),
            },
            {
              img: bridalImg,
              backImg: prod13,
              title: "Humayun Silk",
              price: "Signature Bridal",
            },
            {
              img: trendBanner,
              backImg: prod19,
              title: "Modern Muse",
              price: "Trendy Festive",
            },
          ].map((item, idx) => (
            <div
              className={`card-arch reveal ${
                idx % 2 === 0 ? "reveal-left" : "reveal-right"
              }`}
              key={idx}
              style={{ transitionDelay: `${idx * 120}ms` }}
            >
              <div
                className="card-flip"
                onClick={() =>
                  setSigFlipped((prev) => ({ ...prev, [idx]: !prev[idx] }))
                }
                role="button"
                aria-pressed={!!sigFlipped[idx]}
              >
                <div
                  className={`flip-inner ${sigFlipped[idx] ? "flipped" : ""}`}
                >
                  <div className="flip-front">
                    <img src={item.img} alt={item.title} />
                  </div>
                  <div className="flip-back">
                    {item.backImg ? (
                      <img src={item.backImg} alt={`${item.title} back`} />
                    ) : (
                      <div className="back-content">
                        <h4>{item.title} — Back</h4>
                        <p style={{ opacity: 0.95, marginTop: 8 }}>
                          Back view coming soon
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div style={{ padding: "25px", textAlign: "center" }}>
                <h4 style={{ fontSize: "1.5rem", marginBottom: "5px" }}>
                  {item.title}
                </h4>
                <p
                  style={{
                    fontFamily: "Montserrat",
                    fontSize: "0.7rem",
                    color: "var(--rose-gold)",
                    letterSpacing: "2px",
                  }}
                >
                  {item.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- SHOP THE OCCASION --- */}
      <section className="occasion-section">
        <h2 className="occasion-header">SHOP THE OCCASION</h2>
        <div className="occasion-sub">
          Find looks for different moments — choose an occasion to explore
          suitable outfits
        </div>
        <div className="occasion-wrap">
          <div
            className="occasion-nav left"
            onClick={() => scrollOccasion("left")}
            role="button"
            aria-label="previous"
          >
            <FaArrowLeft />
          </div>

          <div className="occasion-track reveal" ref={occasionRef}>
            {[
              { img: weddingImg, label: "WEDDING", occasion: "wedding" },
              { img: weddingImg2, label: "RECEPTION", occasion: "reception" },
              { img: mehndiImg, label: "MEHENDI", occasion: "mehndi" },
              { img: haldiImg, label: "HALDI", occasion: "haldi" },
            ].map((it, i) => (
              <div
                className="occasion-card"
                key={i}
                onClick={() => navigate(`/occasion/${it.occasion}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) =>
                  e.key === "Enter" && navigate(`/occasion/${it.occasion}`)
                }
                style={{ cursor: "pointer" }}
              >
                <img src={it.img} alt={it.label} />
                <div className="occasion-label">{it.label}</div>
              </div>
            ))}
          </div>

          <div
            className="occasion-nav right"
            onClick={() => scrollOccasion("right")}
            role="button"
            aria-label="next"
          >
            <FaArrowRight />
          </div>
        </div>
      </section>
      {/* --- MOST LOVED (click to view) --- */}
      <section className="occasion-section">
        <h2 className="occasion-header">MOST LOVED</h2>
        <div className="occasion-sub">
          Our most loved lehengas — click any to view details
        </div>

        {/* Local product data for this demo. Replace with real data later. */}
        {/* Each product includes id, name, model, review, price, img */}
        <MostLovedProducts />
      </section>

      {/* --- MEHNDI COLLECTION --- */}
      <section
        className="occasion-section"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,235,59,0.05), rgba(255,193,7,0.05))",
        }}
      >
        <h2 className="occasion-header">MEHNDI COLLECTION</h2>
        <div className="occasion-sub">
          Vibrant and elegant mehndi lehengas to celebrate your special moment
        </div>
        <OccasionProducts occasion="mehndi" data={lehngaMehndi} />
      </section>

      {/* --- HALDI COLLECTION --- */}
      <section
        className="occasion-section"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,215,0,0.05), rgba(255,235,59,0.05))",
        }}
      >
        <h2 className="occasion-header">HALDI COLLECTION</h2>
        <div className="occasion-sub">
          Golden and luminous haldi lehengas for your radiant celebration
        </div>
        <OccasionProducts occasion="haldi" data={lehngaHaldi} />
      </section>

      {/* --- CRAFT & STORY SECTION --- */}
      <section
        id="atelier"
        style={{
          padding: "80px 8%",
          background: "linear-gradient(180deg, #fff 0%, #fbf8f6 100%)",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "40px",
            alignItems: "center",
          }}
        >
          <div>
            <img
              src={tryon}
              alt="Virtual Try-On"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/tryon")}
            />
            <button
              className="btn-fancy"
              style={{ marginTop: 20 }}
              onClick={() => navigate("/tryon")}
            >
              Try It Now
            </button>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
              position: "relative",
            }}
          >
            <img
              src={weddingGif}
              alt="atelier"
              className="atelier-gif reveal"
              style={{
                gridColumn: "1 / -1",
                borderRadius: 12,
                height: 200,
                objectFit: "cover",
              }}
            />

            <div
              className="card-arch reveal reveal-left"
              style={{ transitionDelay: "80ms" }}
            >
              <img src={prod13} alt="Hand Embroidery" />
              <div style={{ padding: "25px", textAlign: "center" }}>
                <p
                  style={{
                    fontFamily: "Montserrat",
                    fontSize: "1.2rem",
                    color: "var(--rose-gold)",
                  }}
                >
                  Hand Embroidery
                </p>
              </div>
            </div>
            <div
              className="card-arch reveal reveal-right"
              style={{ transitionDelay: "160ms" }}
            >
              <img src={bridalImg} alt="Bespoke Tailoring" />
              <div style={{ padding: "25px", textAlign: "center" }}>
                <p
                  style={{
                    fontFamily: "Montserrat",
                    fontSize: "0.9rem",
                    color: "var(--rose-gold)",
                  }}
                >
                  Bespoke Tailoring
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- PROMOTIONAL APP BANNER --- */}
      <section
        className="promo-banner reveal"
        style={{ backgroundImage: `url(${trendBanner})` }}
        aria-label="Download our app banner"
      >
        <div className="promo-overlay" aria-hidden="true"></div>
        <div className="promo-inner">
          <div className="promo-left">
            <div className="promo-title">Think Lehnga. Think Lahnga Bazar</div>
            <div className="promo-sub">
              Download the app for exclusive collections, early access and
              personalised styling.
            </div>
            <div className="promo-cta">
              <a
                className="store-badge"
                href="#"
                aria-label="Download on the App Store"
              >
                <FaApple /> <span style={{ marginLeft: 4 }}>App Store</span>
              </a>
              <a
                className="store-badge"
                href="#"
                aria-label="Get it on Google Play"
              >
                <FaGooglePlay />{" "}
                <span style={{ marginLeft: 4 }}>Google Play</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* --- TESTIMONIALS --- */}
      <section style={{ padding: "80px 8%", textAlign: "center" }}>
        <h2 style={{ fontSize: "2.5rem", fontWeight: 300 }}>What Brides Say</h2>
        <div style={{ position: "relative", marginTop: 20 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 20,
              marginTop: 40,
            }}
          >
            {[
              "An unforgettable experience — their attention to detail made me feel like royalty.",
              "Exquisite workmanship, the embroidery is simply breathtaking.",
              "Timeless designs and a personalized service that truly cares for the bride.",
            ].map((t, i) => (
              <div
                key={i}
                className="testimonial reveal"
                style={{
                  transform: isLoaded ? "translateY(0)" : "translateY(10px)",
                  opacity: isLoaded ? 1 : 0,
                  transitionDelay: `${i * 150}ms`,
                }}
              >
                <p
                  style={{
                    fontStyle: "italic",
                    color: "black",
                    fontWeight: "500",
                  }}
                >
                  {t}
                </p>
                <p
                  style={{
                    marginTop: 15,
                    fontWeight: 600,
                    color: "orange",
                  }}
                >
                  - A Happy Bride
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FANCY STORE FOOTER --- */}
      <footer
        style={{
          background: "var(--deep-maroon)",
          color: "white",
          padding: "100px 8% 40px",
        }}
      >
        <div className="footer-inner">
          <div className="footer-grid">
            <div className="footer-col">
              <img
                src={logoDefault}
                alt="Lahnga Bazar"
                className="footer-logo"
              />
              <p style={{ maxWidth: 360, opacity: 0.95, lineHeight: 1.8 }}>
                Lahnga Bazar is more than a showroom; it's a testament to Indian
                heritage. Experience luxury, bespoke craftsmanship and a curated
                collection for your most important moments.
              </p>
            </div>
            <div className="footer-col">
              <div className="footer-heading">THE HOUSE</div>
              <p className="footer-desc">
                The story and craft behind every piece.
              </p>
              <ul className="footer-list">
                <li>
                  <a className="footer-link" href="/explore">
                    Our Story
                  </a>
                </li>
                <li>
                  <a className="footer-link" href="/explore">
                    Craftsmanship
                  </a>
                </li>
                <li>
                  <a className="footer-link" href="/explore">
                    Sustainability
                  </a>
                </li>
              </ul>
            </div>
            <div className="footer-col">
              <div className="footer-heading">QUICK LINKS</div>
              <p className="footer-desc">Navigate to essentials in one tap.</p>
              <ul className="footer-list">
                <li>
                  <a className="footer-link" href="/explore">
                    About Us
                  </a>
                </li>
                <li>
                  <a className="footer-link" href="/explore">
                    Brand Story
                  </a>
                </li>
                <li>
                  <a className="footer-link" href="/explore">
                    Careers
                  </a>
                </li>
                <li>
                  <a className="footer-link" href="#visit">
                    Store Locator
                  </a>
                </li>
              </ul>
            </div>
            <div className="footer-col">
              <div className="footer-heading">SERVICES</div>
              <p className="footer-desc">
                Personalized experiences for every bride.
              </p>
              <ul className="footer-list">
                <li>
                  <a className="footer-link" href="/tryon">
                    Virtual Fitting
                  </a>
                </li>
                <li>
                  <a className="footer-link" href="/explore">
                    Custom Tailoring
                  </a>
                </li>
                <li>
                  <a className="footer-link" href="/explore">
                    Styling Appointments
                  </a>
                </li>
              </ul>
            </div>
            <div className="footer-col">
              <div className="footer-heading">SUPPORT</div>
              <p className="footer-desc">
                Help, orders, and account assistance.
              </p>
              <ul className="footer-list">
                <li>
                  <a className="footer-link" href="/my-orders">
                    Track Order
                  </a>
                </li>
                <li>
                  <a className="footer-link" href="#visit">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a className="footer-link" href="/login">
                    My Account
                  </a>
                </li>
              </ul>
            </div>

            <div className="footer-col" id="visit">
              <div className="footer-heading">VISIT</div>
              <p className="footer-desc">
                Find us in the heart of Colonelganj.
              </p>
              <a
                className="footer-visit-link"
                href="https://maps.google.com/?q=Lahnga%20Bazar%20Colonelganj%20Gonda%20271502"
                target="_blank"
                rel="noreferrer"
                style={{ marginBottom: 10 }}
              >
                <FaMapMarkerAlt /> Lahnga Bazar Powered By Soni Saree Center And
                Sarraf <br />
                Near Kasgaran Chauraha <br />
                Colonelganj Gonda 271502
              </a>
              <div className="footer-social" style={{ marginTop: 8 }}>
                <a
                  href="https://www.instagram.com/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                >
                  <FaInstagram size={18} />
                </a>
                <a
                  href="https://wa.me/919999999999"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="WhatsApp"
                >
                  <FaWhatsapp size={18} />
                </a>
              </div>
            </div>
          </div>
          <div
            style={{
              marginTop: "40px",
              paddingTop: "20px",
              borderTop: "1px solid rgba(255,255,255,0.06)",
            }}
            className="footer-bottom"
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 20,
                flexWrap: "wrap",
              }}
            >
              <div>© 2026 LAHNGA BAZAR LUXURY RETAIL. ALL RIGHTS RESERVED.</div>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{ opacity: 0.9 }}>100% Secure Payments</div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ProfessionalBridalAtelier;

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

const parseRatingValue = (review) => {
  if (!review) return null;
  const match = review.match(/([\d.]+)\//);
  return match ? Number(match[1]) : null;
};

const getRatingValue = (product) => {
  if (product?.rating) return Number(product.rating);
  const parsed = parseRatingValue(product?.review);
  return parsed || 4.3;
};

const getRatingCount = (product) => {
  return product?.ratingCount || product?.likes || "1.6k";
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

const shouldShowFewLeft = (product) => {
  if (!product) return false;
  return product.stock === undefined ? true : product.stock <= 10;
};

/* --- Occasion Products component --- */
function OccasionProducts({ occasion, data }) {
  const navigate = useNavigate();
  const trackRef = React.useRef(null);

  const scrollTrack = (dir = "right") => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector(".product-card");
    const cardWidth = card
      ? card.getBoundingClientRect().width
      : el.clientWidth / 3;
    const gap = 28;
    const offset = (cardWidth + gap) * (dir === "right" ? 1 : -1);
    el.scrollBy({ left: offset, behavior: "smooth" });
  };

  if (!data || data.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        No products available
      </div>
    );
  }

  return (
    <div className="product-wrap reveal">
      <div
        className="product-nav left"
        onClick={() => scrollTrack("left")}
        aria-hidden="true"
      >
        <FaArrowLeft />
      </div>
      <div
        className="product-nav right"
        onClick={() => scrollTrack("right")}
        aria-hidden="true"
      >
        <FaArrowRight />
      </div>

      <div className="product-track" ref={trackRef}>
        {data.map((p) => {
          const priceValue = parsePriceValue(p.price);
          const oldPriceValue = getOldPriceValue(p, priceValue);
          const discountPercent = getDiscountPercent(priceValue, oldPriceValue);
          const ratingValue = getRatingValue(p);
          const ratingCount = getRatingCount(p);

          return (
            <div
              role="button"
              tabIndex={0}
              className="product-card"
              key={p.id}
              onClick={() =>
                navigate(`/occasion/${occasion}`, {
                  state: { product: p, occasion },
                })
              }
              onKeyDown={(e) =>
                e.key === "Enter"
                  ? navigate(`/occasion/${occasion}`, {
                      state: { product: p, occasion },
                    })
                  : null
              }
            >
              <div className="product-image-wrap">
                <img
                  src={imageMap[p.imageUrl] || p.imageUrl}
                  alt={p.name}
                  className="product-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://via.placeholder.com/400x380?text=No+image";
                  }}
                />
                <div className="rating-pill">
                  <span>{ratingValue.toFixed(1)}</span>
                  <FaStar className="rating-star" />
                  <span className="rating-count">{ratingCount}</span>
                </div>
              </div>

              <div className="product-meta">
                <div className="product-title">{p.name}</div>
                <div className="product-sub">{p.description}</div>
                <div className="price-row">
                  <span className="price-current">
                    {formatRupees(priceValue || p.price)}
                  </span>
                  {oldPriceValue ? (
                    <span className="price-old">
                      {formatRupees(oldPriceValue)}
                    </span>
                  ) : null}
                  {discountPercent ? (
                    <span className="price-discount">
                      ({discountPercent}% OFF)
                    </span>
                  ) : null}
                </div>
                {shouldShowFewLeft(p) ? (
                  <div className="stock-note">Only Few Left!</div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* --- Most Loved products component (inline for now) --- */
function MostLovedProducts() {
  const navigate = useNavigate();
  const trackRef = React.useRef(null);

  const products = [
    {
      id: "p1",
      name: "Lavish Purple Lehnga Ensemble",
      model: "Palazzo Suit",
      price: "₹ 9,999",
      oldPrice: "Rs. 4999",
      savings: "Rs. 3,600 OFF",
      review: "4.8/5 — Exquisite finish",
      likes: "1.7k",
      img: prod1,
      backImg: prod2,
    },
    {
      id: "p2",
      name: "Wine Velvet Bridal Lehenga Set",
      model: "Bridal Lehenga",
      price: "₹ 26,999",
      oldPrice: "Rs. 34,999",
      savings: "(Rs. 8,000 OFF)",
      review: "4.9/5 — Bridal favourite",
      likes: "4k",
      img: prod2,
      backImg: prod4,
    },
    {
      id: "p3",
      name: "Sea Green Mustard Sharara Suit",
      model: "Sharara Suit",
      price: "₹ 14,999",
      oldPrice: "Rs. 18,999",
      savings: "(Rs. 4,000 OFF)",
      review: "4.7/5 — Comfortable & elegant",
      likes: "2.2k",
      img: prod3,
      backImg: prod5,
    },
    {
      id: "p4",
      name: "Cream Zari Weave Art Silk Saree",
      model: "Saree",
      price: "₹ 11,999",
      oldPrice: "Rs. 14,999",
      savings: "(Rs. 3,000 OFF)",
      review: "4.6/5 — Beautiful weave",
      likes: "1.1k",
      img: prod4,
      backImg: prod6,
    },
    // Example extra items to allow sliding
    {
      id: "p5",
      name: "Sunset Pink Anarkali",
      model: "Anarkali",
      price: "₹ 8,999",
      oldPrice: "Rs. 12,999",
      savings: "(Rs. 4,000 OFF)",
      review: "4.5/5 — Lightweight",
      likes: "900",
      img: prod5,
      backImg: prod13,
    },
    {
      id: "p6",
      name: "Royal Blue Lehenga",
      model: "Lehenga",
      price: "₹ 19,999",
      oldPrice: "Rs. 24,999",
      savings: "(Rs. 5,000 OFF)",
      review: "4.8/5 — Rich embroidery",
      likes: "3k",
      img: prod6,
      backImg: prod19,
    },
  ];

  const scrollTrack = (dir = "right") => {
    const el = trackRef.current;
    if (!el) return;
    // scroll by the width of one card plus gap
    const card = el.querySelector(".product-card");
    const cardWidth = card
      ? card.getBoundingClientRect().width
      : el.clientWidth / 3;
    const gap = 28;
    const offset = (cardWidth + gap) * (dir === "right" ? 1 : -1);
    el.scrollBy({ left: offset, behavior: "smooth" });
  };

  return (
    <div className="product-wrap reveal">
      <div
        className="product-nav left"
        onClick={() => scrollTrack("left")}
        aria-hidden="true"
      >
        <FaArrowLeft />
      </div>
      <div
        className="product-nav right"
        onClick={() => scrollTrack("right")}
        aria-hidden="true"
      >
        <FaArrowRight />
      </div>

      <div className="product-track" ref={trackRef}>
        {products.map((p) => {
          const priceValue = parsePriceValue(p.price);
          const oldPriceValue = getOldPriceValue(p, priceValue);
          const discountPercent = getDiscountPercent(priceValue, oldPriceValue);
          const ratingValue = getRatingValue(p);
          const ratingCount = getRatingCount(p);

          return (
            <div
              role="button"
              tabIndex={0}
              className="product-card"
              key={p.id}
              onKeyDown={(e) =>
                e.key === "Enter"
                  ? navigate(`/product/${p.id}`, { state: p })
                  : null
              }
            >
              <div className="product-image-wrap">
                <img
                  src={p.img}
                  alt={p.name}
                  className="product-image"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/product/${p.id}`, {
                      state: { ...p, selectedImg: p.img },
                    });
                  }}
                />
                <div className="rating-pill">
                  <span>{ratingValue.toFixed(1)}</span>
                  <FaStar className="rating-star" />
                  <span className="rating-count">{ratingCount}</span>
                </div>
              </div>

              <div
                className="product-meta"
                onClick={() => navigate(`/product/${p.id}`, { state: p })}
                role="link"
                tabIndex={0}
              >
                <div className="product-title">{p.name}</div>
                <div className="product-sub">{p.model}</div>
                <div className="price-row">
                  <span className="price-current">
                    {formatRupees(priceValue || p.price)}
                  </span>
                  {oldPriceValue ? (
                    <span className="price-old">
                      {formatRupees(oldPriceValue)}
                    </span>
                  ) : null}
                  {discountPercent ? (
                    <span className="price-discount">
                      ({discountPercent}% OFF)
                    </span>
                  ) : null}
                </div>
                {shouldShowFewLeft(p) ? (
                  <div className="stock-note">Only Few Left!</div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
