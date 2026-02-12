import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaEdit,
  FaSave,
  FaTimes,
  FaArrowLeft,
} from "react-icons/fa";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const MyProfile = () => {
  const navigate = useNavigate();
  const { user, setUser, serverUrl } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
  });

  // Load user data from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setFormData({
          name: parsedUser.name || "",
          email: parsedUser.email || "",
          phone: parsedUser.phone || "",
          address: parsedUser.address || "",
          city: parsedUser.city || "",
          country: parsedUser.country || "",
        });
      } catch (err) {
        console.error("Error loading user data:", err);
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${serverUrl}/api/auth/profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const updatedUser = response.data?.user || { ...user, ...formData };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setSuccess("Profile updated successfully!");
      setIsEditing(false);

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Failed to update profile";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        background: "linear-gradient(180deg, #fff, #fbf8f6)",
        minHeight: "100vh",
      }}
    >
      <Navbar />

      <div
        style={{
          padding: "100px 6% 60px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: "40px" }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#4A0E0E",
              fontSize: "1.1rem",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontWeight: "600",
            }}
          >
            <FaArrowLeft /> Back
          </button>
          <h1
            style={{
              fontSize: "3rem",
              fontWeight: "300",
              color: "#4A0E0E",
              margin: "0 0 10px 0",
              fontFamily: "Cormorant Garamond, serif",
            }}
          >
            My Profile
          </h1>
          <div
            style={{
              width: "60px",
              height: "2px",
              background: "#E5B4A2",
              margin: "0",
            }}
          ></div>
        </div>

        {/* Profile Card */}
        <div
          style={{
            background: "#fff",
            borderRadius: "12px",
            padding: "40px",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
            border: "1px solid rgba(0, 0, 0, 0.04)",
          }}
        >
          {/* Success/Error Messages */}
          {success && (
            <div
              style={{
                background: "#d4edda",
                color: "#155724",
                padding: "12px 16px",
                borderRadius: "8px",
                marginBottom: "20px",
                border: "1px solid #c3e6cb",
              }}
            >
              ✓ {success}
            </div>
          )}
          {error && (
            <div
              style={{
                background: "#f8d7da",
                color: "#721c24",
                padding: "12px 16px",
                borderRadius: "8px",
                marginBottom: "20px",
                border: "1px solid #f5c6cb",
              }}
            >
              ✗ {error}
            </div>
          )}

          {/* Profile Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "40px",
              paddingBottom: "30px",
              borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <div
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #E5B4A2, #cba966)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "3rem",
                  fontWeight: "bold",
                }}
              >
                {formData.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2
                  style={{
                    margin: "0 0 5px 0",
                    fontSize: "1.8rem",
                    color: "#4A0E0E",
                  }}
                >
                  {formData.name}
                </h2>
                <p style={{ margin: "0", color: "#666", fontSize: "0.95rem" }}>
                  {user?.role === "admin" || user?.role === "owner"
                    ? "👑 "
                    : ""}
                  {user?.authProvider === "google"
                    ? "Google Sign-In User"
                    : "Email & Password User"}
                </p>
              </div>
            </div>

            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                style={{
                  background: "#4A0E0E",
                  color: "white",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontWeight: "600",
                  transition: "all 0.3s ease",
                }}
                onMouseOver={(e) => {
                  e.target.style.background = "#6B1515";
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 8px 20px rgba(0, 0, 0, 0.15)";
                }}
                onMouseOut={(e) => {
                  e.target.style.background = "#4A0E0E";
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "none";
                }}
              >
                <FaEdit size={16} /> Edit Profile
              </button>
            )}
          </div>

          {!isEditing ? (
            // View Mode
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "30px",
              }}
            >
              <ProfileField
                icon={<FaUser />}
                label="Full Name"
                value={formData.name}
              />
              <ProfileField
                icon={<FaEnvelope />}
                label="Email Address"
                value={formData.email}
              />
              <ProfileField
                icon={<FaPhone />}
                label="Phone Number"
                value={formData.phone || "Not provided"}
              />
              <ProfileField
                icon={<FaMapMarkerAlt />}
                label="Address"
                value={formData.address || "Not provided"}
              />
              <ProfileField
                icon={<FaMapMarkerAlt />}
                label="City"
                value={formData.city || "Not provided"}
              />
              <ProfileField
                icon={<FaMapMarkerAlt />}
                label="Country"
                value={formData.country || "Not provided"}
              />
            </div>
          ) : (
            // Edit Mode
            <div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: "20px",
                  marginBottom: "30px",
                }}
              >
                <FormField
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
                <FormField
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={user?.authProvider === "google"}
                  helperText={
                    user?.authProvider === "google"
                      ? "Email is managed by Google"
                      : ""
                  }
                />
                <FormField
                  label="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 000-0000"
                />
                <FormField
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Street address"
                />
                <FormField
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="City"
                />
                <FormField
                  label="Country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  placeholder="Country"
                />
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  onClick={() => setIsEditing(false)}
                  style={{
                    background: "#e0e0e0",
                    color: "#333",
                    border: "none",
                    padding: "12px 24px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontWeight: "600",
                  }}
                >
                  <FaTimes size={16} /> Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  disabled={loading}
                  style={{
                    background: "#4A0E0E",
                    color: "white",
                    border: "none",
                    padding: "12px 24px",
                    borderRadius: "8px",
                    cursor: loading ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontWeight: "600",
                    opacity: loading ? 0.6 : 1,
                  }}
                >
                  <FaSave size={16} /> {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
            marginTop: "40px",
          }}
        >
          <QuickLink
            title="My Orders"
            description="Track your orders and view order history"
            onClick={() => navigate("/my-orders")}
          />
          <QuickLink
            title="Wishlist"
            description="View and manage your favorite items"
            onClick={() => navigate("/wishlist")}
          />
          <QuickLink
            title="Virtual Try-On"
            description="Try on lehengas virtually before buying"
            onClick={() => navigate("/tryon")}
          />
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;600&family=Montserrat:wght@400;600&display=swap');

        * {
          font-family: 'Montserrat', sans-serif;
        }

        h1, h2 {
          font-family: 'Cormorant Garamond', serif;
        }

        @media (max-width: 768px) {
          .profile-container {
            padding: 80px 4% 40px;
          }

          .profile-card {
            padding: 25px !important;
          }

          .profile-field {
            flex-direction: column;
            gap: 8px !important;
          }

          h1 {
            font-size: 2rem !important;
          }
        }
      `}</style>
    </div>
  );
};

// Profile Field Component (View Mode)
const ProfileField = ({ icon, label, value }) => (
  <div
    style={{
      background: "rgba(229, 180, 162, 0.08)",
      padding: "20px",
      borderRadius: "10px",
      border: "1px solid rgba(229, 180, 162, 0.2)",
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        color: "#4A0E0E",
        marginBottom: "8px",
        fontSize: "0.9rem",
        fontWeight: "600",
      }}
    >
      {icon}
      {label}
    </div>
    <p
      style={{
        margin: "0",
        color: "#333",
        fontSize: "1.05rem",
        fontWeight: "500",
      }}
    >
      {value}
    </p>
  </div>
);

// Form Field Component (Edit Mode)
const FormField = ({
  label,
  name,
  value,
  onChange,
  disabled,
  type = "text",
  placeholder,
  helperText,
  required,
}) => (
  <div>
    <label
      style={{
        display: "block",
        marginBottom: "8px",
        color: "#4A0E0E",
        fontWeight: "600",
        fontSize: "0.95rem",
      }}
    >
      {label}
      {required && <span style={{ color: "#E50B0B" }}>*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      placeholder={placeholder}
      style={{
        width: "100%",
        padding: "12px 16px",
        border: "1px solid rgba(0, 0, 0, 0.1)",
        borderRadius: "8px",
        fontSize: "0.95rem",
        fontFamily: "Montserrat, sans-serif",
        background: disabled ? "#f5f5f5" : "#fff",
        color: disabled ? "#999" : "#333",
        cursor: disabled ? "not-allowed" : "text",
        transition: "all 0.2s ease",
      }}
      onFocus={(e) => {
        if (!disabled) {
          e.target.style.borderColor = "#E5B4A2";
          e.target.style.boxShadow = "0 0 0 3px rgba(229, 180, 162, 0.1)";
        }
      }}
      onBlur={(e) => {
        e.target.style.borderColor = "rgba(0, 0, 0, 0.1)";
        e.target.style.boxShadow = "none";
      }}
    />
    {helperText && (
      <p style={{ margin: "6px 0 0 0", color: "#999", fontSize: "0.85rem" }}>
        {helperText}
      </p>
    )}
  </div>
);

// Quick Link Component
const QuickLink = ({ title, description, onClick }) => (
  <div
    onClick={onClick}
    style={{
      background: "#fff",
      border: "1px solid rgba(0, 0, 0, 0.08)",
      borderRadius: "10px",
      padding: "24px",
      cursor: "pointer",
      transition: "all 0.3s ease",
      textAlign: "center",
    }}
    onMouseOver={(e) => {
      e.currentTarget.style.transform = "translateY(-4px)";
      e.currentTarget.style.boxShadow = "0 12px 32px rgba(0, 0, 0, 0.12)";
    }}
    onMouseOut={(e) => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "none";
    }}
  >
    <h3 style={{ margin: "0 0 8px 0", color: "#4A0E0E", fontSize: "1.2rem" }}>
      {title}
    </h3>
    <p
      style={{
        margin: "0",
        color: "#666",
        fontSize: "0.9rem",
        lineHeight: "1.4",
      }}
    >
      {description}
    </p>
  </div>
);

export default MyProfile;
