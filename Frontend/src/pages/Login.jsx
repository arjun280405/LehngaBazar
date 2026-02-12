import React, { useState, useContext } from "react";
import { FaEye, FaEyeSlash, FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import lehengaImageUrl from "../assets/logos/logologin.png";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../utils/Firebase.js";
const LoginPage = () => {
  // --- React State & Logic ---
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { serverUrl } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await axios.post(`${serverUrl}/api/auth/login`, {
        email: credentials.email,
        password: credentials.password,
      });

      const userData = response.data?.user;
      const nameToShow = userData?.name || credentials.email;

      alert(`Welcome back, ${nameToShow}!`);
      console.log("Login successful:", response.data);

      // Store user and token in localStorage
      if (userData) {
        localStorage.setItem("user", JSON.stringify(userData));
      }
      if (response.data?.token) {
        localStorage.setItem("token", response.data.token);
      }

      // Reset form
      setCredentials({
        email: "",
        password: "",
        rememberMe: false,
      });

      // Redirect to home page
      window.location.href = "/";
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        "Login failed. Please check your credentials.";
      setError(errorMsg);
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const idToken = await user.getIdToken();

      // Send Firebase ID token to backend for verification and login/create
      const response = await axios.post(`${serverUrl}/api/auth/googlesignin`, {
        token: idToken,
      });

      const serverUser = response.data?.user;
      const serverToken = response.data?.token;
      const nameToShow = serverUser?.name || user.displayName || user.email;

      alert(`Welcome back, ${nameToShow}!`);
      console.log("Google sign-in (server) success:", response.data);

      // Persist user info and token for client-side use
      try {
        if (serverUser) {
          localStorage.setItem("user", JSON.stringify(serverUser));
        }
        if (serverToken) {
          localStorage.setItem("token", serverToken);
        }
      } catch (e) {
        console.warn("Could not save user/token to localStorage", e);
      }

      // Redirect to home
      window.location.href = "/";
    } catch (err) {
      console.error("Google sign-in error:", err?.response?.data || err);
      const msg =
        err.response?.data?.message ||
        "Google sign-in failed. Please try again.";
      setError(msg);
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  // Using the same high-quality thematic image for consistency

  // --- JSX Structure ---
  return (
    <div className="lb-container">
      {/* Embedded CSS Styles - Theme matches previous registration page perfectly */}
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
        .lb-container {
            min-height: 100vh;
            font-family: 'Poppins', sans-serif;
            background-color: var(--lb-primary-red);
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 12px;
            box-sizing: border-box;
            position: relative; 
            z-index: 1;
            overflow: visible;
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
            background-position: center top;
            background-repeat: no-repeat;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
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

        .lb-form-section {
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
            background-color: var(--lb-bg-cream);
            overflow: visible;
            box-sizing: border-box;
        }

        .lb-form-card {
            width: 100%;
            max-width: 420px;
            max-height: none;
            overflow: visible;
        }

        .lb-form-header {
            font-family: 'Playfair Display', serif;
            color: var(--lb-primary-red);
            text-align: center;
            font-size: 2.5rem;
            margin: 0 0 35px 0;
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
            border-radius: 50px; 
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

        /* Checkbox and Options styles */
        .lb-options-group {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 25px;
            font-size: 0.9rem;
        }

        .lb-checkbox-label {
            display: flex;
            align-items: center;
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
        
        .lb-forgot-link {
            color: var(--lb-text-muted);
            text-decoration: none;
            font-weight: 500;
            transition: color 0.3s;
        }
        .lb-forgot-link:hover {
             color: var(--lb-primary-red);
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

        .lb-switch-link {
            text-align: center;
            margin-top: 25px;
            font-size: 0.9rem;
            color: var(--lb-text-muted);
        }
        .lb-switch-link a {
            color: var(--lb-primary-red);
            text-decoration: none;
            font-weight: 600;
        }

        /* Responsive Design */
        @media (max-width: 900px) {
            .lb-split-layout {
                flex-direction: column;
                height: auto; 
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
                height: 22vh; 
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
                display: none; 
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
        {/* Left Side - Image and Branding (Same as registration for consistency) */}
        <div
          className="lb-image-section"
          style={{ backgroundImage: `url(${lehengaImageUrl})` }}
        >
          <div className="lb-image-overlay">
            <h1 className="lb-brand-title">Lahnga Bazar</h1>
            <p className="lb-brand-tagline">Where Tradition Meets Elegance</p>
            <div className="lb-feature-box">
              <span>✨ Welcome Back to Your Virtual Trousseau</span>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="lb-form-section">
          <div className="lb-form-card">
            <h2 className="lb-form-header">Login</h2>

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
              {/* Email */}
              <div className="lb-input-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={credentials.email}
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
                  value={credentials.password}
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

              {/* Options: Remember Me & Forgot Password */}
              <div className="lb-options-group">
                <label className="lb-checkbox-label">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={credentials.rememberMe}
                    onChange={handleChange}
                    className="lb-checkbox"
                  />
                  Remember me
                </label>
                <a href="/forgot-password" class="lb-forgot-link">
                  Forgot Password?
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="lb-submit-btn"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            {/* Social Login */}
            <div className="lb-social-section">
              <div className="lb-divider">
                <span>Or Login With</span>
              </div>
              <div className="lb-social-icons">
                <button
                  className="lb-social-btn google"
                  type="button"
                  onClick={googleLogin}
                >
                  <FcGoogle size={24} />
                </button>
                <button className="lb-social-btn facebook" type="button">
                  <FaFacebook size={24} color="#1877F2" />
                </button>
              </div>
            </div>
            <p className="lb-switch-link">
              Don't have an account? <a href="/signup">Register here</a>
            </p>
            <p
              className="lb-switch-link"
              style={{ marginTop: "15px", fontSize: "0.85rem" }}
            >
              Admin?{" "}
              <a
                href="/admin/login"
                style={{ color: "#667eea", fontWeight: "600" }}
              >
                Login as Admin
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
