import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaUpload,
  FaImage,
  FaMagic,
  FaSpinner,
} from "react-icons/fa";
import Navbar from "../components/Navbar";

// Import all product images
import prod1 from "../assets/products/lehenga-01.avif";
import prod2 from "../assets/products/lehenga-02.avif";
import prod3 from "../assets/products/lehenga-03.avif";
import prod4 from "../assets/products/lehenga-04.avif";
import prod5 from "../assets/products/lehenga-05.avif";
import prod6 from "../assets/products/lehenga-06.avif";
import prod13 from "../assets/products/lehenga-13.avif";
import prod19 from "../assets/products/lehenga-19.avif";
import mehndiG1 from "../assets/Mehndi/g1.jpeg";
import mehndiG2 from "../assets/Mehndi/g2.jpg";
import mehndiG3 from "../assets/Mehndi/g3.jpg";
import mehndiG4 from "../assets/Mehndi/g4.jpg";
import mehndiG5 from "../assets/Mehndi/g5.jpg";
import haldiY2 from "../assets/Haldi/y2.avif";
import haldiY3 from "../assets/Haldi/y3.avif";
import haldiY4 from "../assets/Haldi/y4.avif";
import haldiY5 from "../assets/Haldi/y5.avif";
import haldiY6 from "../assets/Haldi/y6.avif";

const VirtualTryOn = () => {
  const navigate = useNavigate();
  const [userImage, setUserImage] = useState(null);
  const [userImageFile, setUserImageFile] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [error, setError] = useState("");

  const products = [
    { id: 1, name: "Purple Elegance", image: prod1 },
    { id: 2, name: "Wine Velvet", image: prod2 },
    { id: 3, name: "Sea Green Charm", image: prod3 },
    { id: 4, name: "Cream Silk", image: prod4 },
    { id: 5, name: "Pink Anarkali", image: prod5 },
    { id: 6, name: "Royal Blue", image: prod6 },
    { id: 7, name: "Peacock Velvet", image: prod13 },
    { id: 8, name: "Heritage Red", image: prod19 },
    { id: 9, name: "Mehndi Green", image: mehndiG2 },
    { id: 10, name: "Mehndi Gold", image: mehndiG3 },
    { id: 11, name: "Haldi Yellow", image: haldiY2 },
    { id: 12, name: "Haldi Sunshine", image: haldiY3 },
  ];

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }
      setUserImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserImage(reader.result);
        setError("");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setError("");
  };

  const handleTryOn = async () => {
    if (!userImageFile) {
      setError("Please upload your photo first");
      return;
    }
    if (!selectedProduct) {
      setError("Please select a lehenga to try on");
      return;
    }

    setLoading(true);
    setError("");
    setGeneratedImage(null);

    try {
      const formData = new FormData();
      formData.append("userImage", userImageFile);
      formData.append("productImageUrl", selectedProduct.image);

      console.log("Sending request to backend...");
      console.log("Product image:", selectedProduct.image);

      const response = await fetch("http://localhost:8000/api/virtual-tryon", {
        method: "POST",
        body: formData,
      });

      console.log("Response status:", response.status);

      const data = await response.json();
      console.log("Response data:", data);

      if (!response.ok) {
        throw new Error(
          data.details || data.error || "Failed to generate try-on image",
        );
      }

      setGeneratedImage(data.generatedImage);
    } catch (err) {
      console.error("Try-on error:", err);
      console.error("Error details:", err.message);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tryon-page">
      <Navbar />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=Montserrat:wght@300;400;600;700&display=swap');

        :root {
          --deep-maroon: #4A0E0E;
          --rose-gold: #E5B4A2;
          --gold-bright: #C2A35D;
          --ivory: #FDFBF7;
        }

        .tryon-page {
          background: linear-gradient(180deg, var(--ivory) 0%, #fff 100%);
          min-height: 100vh;
          padding-top: 80px;
          font-family: 'Montserrat', sans-serif;
        }

        .tryon-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 60px 6%;
        }

        .tryon-header {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 50px;
        }

        .back-btn {
          background: none;
          border: none;
          color: var(--deep-maroon);
          font-size: 1.5rem;
          cursor: pointer;
          transition: transform 0.3s;
          padding: 8px;
        }

        .back-btn:hover {
          transform: translateX(-5px);
        }

        .tryon-title {
          font-size: 3rem;
          color: var(--deep-maroon);
          font-weight: 300;
          margin: 0;
          font-family: 'Cormorant Garamond', serif;
        }

        .tryon-subtitle {
          color: #666;
          font-size: 1.1rem;
          margin-top: 10px;
        }

        .tryon-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 50px;
          margin-bottom: 50px;
        }

        .upload-section {
          background: white;
          border-radius: 20px;
          padding: 40px;
          box-shadow: 0 10px 40px rgba(74, 14, 14, 0.08);
        }

        .section-title {
          font-size: 1.5rem;
          color: var(--deep-maroon);
          margin-bottom: 25px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .upload-area {
          border: 3px dashed var(--rose-gold);
          border-radius: 15px;
          padding: 60px 40px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s;
          background: linear-gradient(180deg, rgba(229, 180, 162, 0.03), rgba(229, 180, 162, 0.08));
        }

        .upload-area:hover {
          border-color: var(--deep-maroon);
          background: linear-gradient(180deg, rgba(229, 180, 162, 0.08), rgba(229, 180, 162, 0.12));
          transform: translateY(-2px);
        }

        .upload-icon {
          font-size: 3rem;
          color: var(--rose-gold);
          margin-bottom: 20px;
        }

        .upload-text {
          color: var(--deep-maroon);
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .upload-hint {
          color: #666;
          font-size: 0.9rem;
        }

        .preview-image {
          width: 100%;
          max-height: 400px;
          object-fit: contain;
          border-radius: 15px;
          margin-top: 20px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        .product-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-top: 25px;
        }

        .product-item {
          position: relative;
          border-radius: 15px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.3s;
          border: 3px solid transparent;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
        }

        .product-item:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
        }

        .product-item.selected {
          border-color: var(--gold-bright);
          box-shadow: 0 0 0 3px rgba(194, 163, 93, 0.3);
        }

        .product-item img {
          width: 100%;
          height: 200px;
          object-fit: cover;
          display: block;
        }

        .product-name {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
          color: white;
          padding: 15px 10px 10px;
          font-size: 0.9rem;
          font-weight: 600;
          text-align: center;
        }

        .tryon-action {
          text-align: center;
          margin: 40px 0;
        }

        .tryon-btn {
          background: linear-gradient(135deg, var(--deep-maroon), #6b1616);
          color: white;
          border: none;
          padding: 20px 60px;
          font-size: 1.1rem;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          border-radius: 50px;
          cursor: pointer;
          transition: all 0.4s;
          display: inline-flex;
          align-items: center;
          gap: 15px;
          box-shadow: 0 10px 30px rgba(74, 14, 14, 0.3);
        }

        .tryon-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 40px rgba(74, 14, 14, 0.4);
          letter-spacing: 3px;
        }

        .tryon-btn:disabled {
          background: #ccc;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .error-message {
          background: linear-gradient(135deg, #ff6b6b, #ee5a6f);
          color: white;
          padding: 15px 25px;
          border-radius: 10px;
          text-align: center;
          margin: 20px 0;
          font-weight: 600;
          box-shadow: 0 5px 20px rgba(255, 107, 107, 0.3);
        }

        .result-section {
          background: white;
          border-radius: 20px;
          padding: 40px;
          box-shadow: 0 10px 40px rgba(74, 14, 14, 0.08);
          text-align: center;
        }

        .result-image {
          width: 100%;
          max-height: 600px;
          object-fit: contain;
          border-radius: 15px;
          margin-top: 25px;
          box-shadow: 0 10px 35px rgba(0, 0, 0, 0.15);
        }

        .loading-spinner {
          display: inline-block;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .loading-text {
          margin-top: 20px;
          font-size: 1.2rem;
          color: var(--deep-maroon);
          font-weight: 600;
        }

        @media (max-width: 1024px) {
          .tryon-content {
            grid-template-columns: 1fr;
            gap: 30px;
          }
          .product-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 768px) {
          .tryon-container {
            padding: 40px 4%;
          }
          .tryon-title {
            font-size: 2rem;
          }
          .upload-section {
            padding: 25px;
          }
          .product-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
          }
          .tryon-btn {
            padding: 15px 40px;
            font-size: 0.95rem;
          }
        }

        @media (max-width: 480px) {
          .tryon-title {
            font-size: 1.6rem;
          }
          .product-grid {
            grid-template-columns: 1fr 1fr;
            gap: 10px;
          }
          .product-item img {
            height: 150px;
          }
          .upload-area {
            padding: 40px 20px;
          }
        }
      `}</style>

      <div className="tryon-container">
        <div className="tryon-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <FaArrowLeft />
          </button>
          <div>
            <h1 className="tryon-title">Virtual Try-On</h1>
            <p className="tryon-subtitle">
              Experience your dream lehenga with AI-powered virtual fitting
            </p>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="tryon-content">
          {/* Upload Your Photo */}
          <div className="upload-section">
            <h2 className="section-title">
              <FaUpload /> Step 1: Upload Your Photo
            </h2>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: "none" }}
              id="photo-upload"
            />
            <label htmlFor="photo-upload">
              <div className="upload-area">
                {userImage ? (
                  <img
                    src={userImage}
                    alt="Your photo"
                    className="preview-image"
                  />
                ) : (
                  <>
                    <div className="upload-icon">
                      <FaImage />
                    </div>
                    <div className="upload-text">
                      Click to upload your photo
                    </div>
                    <div className="upload-hint">
                      JPG, PNG or JPEG (Max 5MB)
                    </div>
                  </>
                )}
              </div>
            </label>
            {userImage && (
              <div
                style={{ marginTop: 15, textAlign: "center", color: "#666" }}
              >
                ✓ Photo uploaded successfully
              </div>
            )}
          </div>

          {/* Select Lehenga */}
          <div className="upload-section">
            <h2 className="section-title">
              <FaImage /> Step 2: Select a Lehenga
            </h2>
            <div className="product-grid">
              {products.map((product) => (
                <div
                  key={product.id}
                  className={`product-item ${
                    selectedProduct?.id === product.id ? "selected" : ""
                  }`}
                  onClick={() => handleProductSelect(product)}
                >
                  <img src={product.image} alt={product.name} />
                  <div className="product-name">{product.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Try On Button */}
        <div className="tryon-action">
          <button
            className="tryon-btn"
            onClick={handleTryOn}
            disabled={loading || !userImage || !selectedProduct}
          >
            {loading ? (
              <>
                <FaSpinner className="loading-spinner" />
                Generating...
              </>
            ) : (
              <>
                <FaMagic />
                Try Virtual Try-On
              </>
            )}
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="result-section">
            <FaSpinner
              className="loading-spinner"
              style={{ fontSize: "4rem", color: "var(--rose-gold)" }}
            />
            <div className="loading-text">
              Creating your perfect look... This may take 10-20 seconds
            </div>
          </div>
        )}

        {/* Result */}
        {generatedImage && !loading && (
          <div className="result-section">
            <h2 className="section-title" style={{ justifyContent: "center" }}>
              <FaMagic /> Your Virtual Try-On Result
            </h2>
            <img
              src={`data:image/png;base64,${generatedImage}`}
              alt="Virtual try-on result"
              className="result-image"
            />
            <div style={{ marginTop: 30, color: "#666", fontSize: "0.95rem" }}>
              Love this look? Add it to your cart and make it yours!
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VirtualTryOn;
