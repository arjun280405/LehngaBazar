import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import lehengaImageUrl from "../assets/products/bridal-collection.avif";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../utils/Firebase.js";

const RegistrationPage = () => {
  // --- React State & Logic ---
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    subscribe: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { serverUrl } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Client-side validation to give faster feedback
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!formData.email || !formData.fullName) {
      setError("Name and email are required");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${serverUrl}/api/auth/registration`,
        {
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        },
        { withCredentials: true },
      );

      alert(
        `Welcome to Lahnga Bazar, ${formData.fullName}! Account created successfully.`,
      );
      console.log("Registration successful:", response.data);

      // Store user and token in localStorage
      const userData = response.data?.user;
      if (userData) {
        localStorage.setItem("user", JSON.stringify(userData));
      }
      if (response.data?.token) {
        localStorage.setItem("token", response.data.token);
      }

      // Reset form
      setFormData({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        subscribe: false,
      });

      // Redirect to home (or change to /login if you prefer)
      navigate("/");
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Registration failed. Please try again.";
      setError(errorMsg);
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const googleSignup = async () => {
    setError("");
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const token = await user.getIdToken();

      // Send the ID token to your backend for verification/creation/login
      try {
        const response = await axios.post(
          `${serverUrl}/api/auth/googlesignin`,
          { token },
          { withCredentials: true },
        );
        console.log("Backend response:", response.data);
        alert(`Signed in with Google as ${user.displayName || user.email}`);
      } catch (backendErr) {
        console.error("Backend error (googlesignin):", backendErr);
        const backendMsg =
          backendErr.response?.data?.message ||
          backendErr.message ||
          "Backend sign-in failed";
        setError(backendMsg);
        alert(backendMsg);

        // Development fallback: if server can't verify token and dev bypass is enabled, send user info with dev key
        try {
          const allowBypass =
            import.meta.env.VITE_ALLOW_GOOGLE_BYPASS === "true";
          const devKey = import.meta.env.VITE_DEV_GOOGLE_KEY || null;
          const shouldAttemptBypass =
            allowBypass &&
            devKey &&
            (backendMsg.includes("Firebase Admin") ||
              backendMsg.includes("Unable to verify"));
          if (shouldAttemptBypass) {
            const devResponse = await axios.post(
              `${serverUrl}/api/auth/googlesignin`,
              { name: user.displayName, email: user.email, uid: user.uid },
              {
                headers: { "x-dev-google-key": devKey },
                withCredentials: true,
              },
            );
            console.log("Dev bypass response:", devResponse.data);
            alert(`(Dev) Signed in as ${user.displayName || user.email}`);
          }
        } catch (fallbackErr) {
          console.error("Dev bypass failed:", fallbackErr);
          const fallbackMsg =
            fallbackErr.response?.data?.message ||
            fallbackErr.message ||
            "Dev bypass failed";
          setError(fallbackMsg);
          alert(fallbackMsg);
        }
      }
    } catch (err) {
      console.error("Google sign-in error:", err);
      const code = err?.code || "";
      const message = err?.message || JSON.stringify(err);
      // Friendly mapping for common Firebase errors
      let friendly = message;
      if (code === "auth/popup-closed-by-user")
        friendly = "Popup closed before completing sign-in.";
      else if (code === "auth/popup-blocked")
        friendly = "Popup blocked by the browser. Allow popups and try again.";
      else if (code === "auth/cancelled-popup-request")
        friendly = "A popup request was cancelled. Try again.";
      else if (code === "auth/network-request-failed")
        friendly = "Network error. Check your connection and try again.";
      else if (code === "auth/account-exists-with-different-credential")
        friendly =
          "An account already exists with a different sign-in method for this email.";

      const fullMsg = `${code ? code + ": " : ""}${friendly}`;
      setError(fullMsg);
      alert(fullMsg);
    }
  };
  // High-quality image URL matching the theme (imported above via Vite)

  // --- JSX Structure ---
  return (
    <div className="lb-container">
      {/* Embedded CSS Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Poppins:wght@300;400;500&display=swap');

        /* Variables for theme colors */
        :root {
            --lb-primary-red: #5a121b; /* Deep burgundy */
            --lb-accent-gold: #cba966;
            --lb-accent-gold-dark: #a6864d;
            --lb-bg-cream: #fdfbf7;
            --lb-text-dark: #333;
            --lb-text-muted: #777;
        }

        /* Main Container resetting defaults */
        html, body, #root { height: 100%; margin: 0; }
        .lb-container {
            min-height: 100vh;
            font-family: 'Poppins', sans-serif;
            background-color: var(--lb-primary-red);
            display: flex;
            justify-content: center;
            align-items: center;
            padding:12px;
            box-sizing: border-box;
            /* Ensure styles don't leak out if used in a larger app */
            position: relative; 
            z-index: 1;
            overflow: visible; /* allow natural scrolling on small screens */
        }

        .lb-split-layout {
            display: flex;
            width: 100%;
            max-width: 1000px;
            height: auto;
            max-height: calc(100vh - 24px);
            background-color: var(--lb-bg-cream);
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 12px 30px rgba(0,0,0,0.12);
        }

        /* --- Left Side: Image Section --- */
        .lb-image-section {
            flex: 0.7;
            background-size: cover;
            background-position: center center;
            background-repeat: no-repeat;
            position: relative;
            min-height: 0; /* let flexbox constrain height */
            display: flex;
            align-items: center;
            justify-content: center;
            min-width: 260px;
        }

        /* Dark overlay to make text pop */
        .lb-image-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(to bottom, rgba(90, 18, 27, 0.3), rgba(90, 18, 27, 0.8));
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;
            padding: 30px 20px;
            color: var(--lb-accent-gold);
        }

        .lb-brand-title {
            font-family: 'Playfair Display', serif;
            font-size: 3rem;
            margin: 0 0 8px 0;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.4);
        }

        .lb-brand-tagline {
            font-size: 1rem;
            font-weight: 300;
            color: var(--lb-bg-cream);
            margin: 0 0 24px 0;
        }

        .lb-feature-box {
            background: rgba(90, 18, 27, 0.7);
            padding: 12px 18px;
            border-radius: 12px;
            border-left: 4px solid var(--lb-accent-gold);
            color: var(--lb-bg-cream);
            max-width: 260px;
            font-weight: 500;
            backdrop-filter: blur(5px);
        }


        /* --- Right Side: Form Section --- */
        .lb-form-section {
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 16px;
            background-color: var(--lb-bg-cream);
            overflow: visible; /* no internal scrolling */
            box-sizing: border-box;
        }

        .lb-form-card {
            width: 100%;
            max-width: 420px;
            max-height: none; /* allow natural height, no inner scroll */
            display: flex;
            flex-direction: column;
            justify-content: center;
            gap: 10px;
            overflow: visible;
            padding-bottom: 8px;
        }

        .lb-form-header {
            font-family: 'Playfair Display', serif;
            color: var(--lb-primary-red);
            text-align: center;
            font-size: 1.8rem;
            margin: 0 0 16px 0;
        }

        /* Input styles */
        .lb-input-group {
            margin-bottom: 20px;
            position: relative;
        }

        .lb-input {
            width: 100%;
            padding: 12px 16px;
            border: 1.5px solid #e0e0e0;
            border-radius: 50px; /* Highly rounded corners */
            font-size: 0.95rem;
            font-family: 'Poppins', sans-serif;
            transition: all 0.3s ease;
            background-color: #fff;
            box-sizing: border-box;
            color: var(--lb-text-dark);
        }

        .lb-input:focus {
            outline: none;
            border-color: var(--lb-accent-gold);
            box-shadow: 0 0 0 3px rgba(203, 169, 102, 0.2);
        }

        /* Password specific styles */
        .lb-password-group {
            display: flex;
            align-items: center;
        }

        .lb-toggle-password {
            position: absolute;
            right: 15px;
            background: none;
            border: none;
            cursor: pointer;
            color: var(--lb-text-muted);
            font-size: 1.2rem;
            display: flex;
            align-items: center;
            padding: 5px;
        }
        .lb-toggle-password:hover {
            color: var(--lb-primary-red);
        }

        /* Checkbox styles */
        .lb-checkbox-group {
            margin-bottom: 25px;
        }

        .lb-checkbox-label {
            display: flex;
            align-items: center;
            font-size: 0.9rem;
            color: var(--lb-text-dark);
            cursor: pointer;
        }

        .lb-checkbox {
            accent-color: var(--lb-primary-red);
            margin-right: 10px;
            width: 18px;
            height: 18px;
            cursor: pointer;
        }

        /* Submit Button */
        .lb-submit-btn {
            width: 100%;
            padding: 15px;
            background: linear-gradient(to right, var(--lb-accent-gold), var(--lb-accent-gold-dark));
            color: var(--lb-primary-red);
            border: none;
            border-radius: 50px;
            font-size: 1.2rem;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
            font-family: 'Playfair Display', serif;
            box-shadow: 0 5px 15px rgba(203, 169, 102, 0.4);
        }

        .lb-submit-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(203, 169, 102, 0.6);
            background: linear-gradient(to right, var(--lb-accent-gold-dark), var(--lb-accent-gold));
        }

        /* Social Login Section */
        .lb-social-section {
            margin-top: 30px;
            text-align: center;
        }

        .lb-divider {
            position: relative;
            margin-bottom: 20px;
        }

        .lb-divider span {
            background-color: var(--lb-bg-cream);
            padding: 0 15px;
            color: var(--lb-text-muted);
            font-size: 0.9rem;
            position: relative;
            z-index: 1;
        }

        .lb-divider::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 0;
            width: 100%;
            height: 1px;
            background-color: #e0e0e0;
            z-index: 0;
        }

        .lb-social-icons {
            display: flex;
            justify-content: center;
            gap: 20px;
        }

        .lb-social-btn {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            border: 1px solid #e0e0e0;
            background-color: #fff;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 2px 5px rgba(0,0,0,0.05);
            padding: 0;
        }

        .lb-social-btn:hover {
            background-color: #f5f5f5;
            transform: translateY(-2px);
            border-color: var(--lb-accent-gold);
        }

        .lb-login-link {
            text-align: center;
            margin-top: 25px;
            font-size: 0.9rem;
            color: var(--lb-text-muted);
        }
        .lb-login-link a {
            color: var(--lb-primary-red);
            text-decoration: none;
            font-weight: 600;
        }

        /* Responsive Design */
        @media (max-width: 900px) {
            .lb-split-layout {
                flex-direction: column;
                height: auto; /* grow with content */
                max-height: 100vh;
                border-radius: 16px;
                max-width: 100%;
                box-shadow: none;
            }
            
            .lb-container {
                padding: 8px;
                align-items: flex-start;
                background-color: var(--lb-bg-cream);
                overflow: visible;
            }

            .lb-image-section {
                height: 22vh; /* compact header */
                flex: none;
            }
            
            .lb-image-overlay {
                padding: 12px 10px;
                justify-content: center;
                align-items: center;
                text-align: center;
            }

            .lb-brand-title {
                font-size: 1.4rem;
            }

            .lb-feature-box {
                display: none; /* Hide feature box on very small screens to save space */
            }

            .lb-form-section {
                padding: 12px;
                background-color: var(--lb-bg-cream);
                border-top-left-radius: 12px;
                border-top-right-radius: 12px;
                margin-top: 0; /* ensure no overlap */
                position: relative;
                z-index: 1;
                box-shadow: none; /* no floating/shadow */
                overflow: visible;
            }
            
            .lb-form-card {
                max-height: none;
                overflow: visible;
            }
        }
      `}</style>

      <div className="lb-split-layout">
        {/* Left Side - Image and Branding */}
        <div
          className="lb-image-section"
          style={{ backgroundImage: `url(${lehengaImageUrl})` }}
        >
          <div className="lb-image-overlay">
            <h1 className="lb-brand-title">Lahnga Bazar</h1>
            <p className="lb-brand-tagline">Where Tradition Meets Elegance</p>
            <div className="lb-feature-box">
              <span>✨ Unlock Virtual Trial Room & Custom Design Studio</span>
            </div>
          </div>
        </div>

        {/* Right Side - Registration Form */}
        <div className="lb-form-section">
          <div className="lb-form-card">
            <h2 className="lb-form-header">Registration</h2>

            {error && (
              <div
                style={{
                  color: "red",
                  marginBottom: "12px",
                  fontSize: "0.85rem",
                  textAlign: "center",
                }}
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Full Name */}
              <div className="lb-input-group">
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="lb-input"
                />
              </div>

              {/* Email */}
              <div className="lb-input-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="lb-input"
                />
              </div>

              {/* Password */}
              <div className="lb-input-group lb-password-group">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="lb-input"
                />
                <button
                  type="button"
                  className="lb-toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {/* Confirm Password */}
              <div className="lb-input-group lb-password-group">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="lb-input"
                />
                <button
                  type="button"
                  className="lb-toggle-password"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label="Toggle confirm password visibility"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {/* Newsletter Subscribe */}
              <div className="lb-checkbox-group">
                <label className="lb-checkbox-label">
                  <input
                    type="checkbox"
                    name="subscribe"
                    checked={formData.subscribe}
                    onChange={handleChange}
                    className="lb-checkbox"
                  />
                  Subscribe to newsletter and get 10% off
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="lb-submit-btn"
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            {/* Social Login */}
            <div className="lb-social-section">
              <div className="lb-divider">
                <span>Social Login</span>
              </div>
              <div className="lb-social-icons">
                <button
                  className="lb-social-btn google"
                  type="button"
                  onClick={googleSignup}
                >
                  <FcGoogle size={24} />
                </button>
                <button className="lb-social-btn facebook" type="button">
                  <FaFacebook size={24} color="#1877F2" />
                </button>
              </div>
            </div>
            <p className="lb-login-link">
              Already have an account? <a href="/login">Login here</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
