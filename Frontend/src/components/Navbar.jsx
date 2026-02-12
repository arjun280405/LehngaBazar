import React, { useState, useContext, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaShoppingBag,
  FaHeart,
  FaSearch,
  FaUser,
  FaSignOutAlt,
  FaBox,
  FaUserCircle,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { CartContext } from "../context/CartContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { cart } = useContext(CartContext);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);
  const userMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Check authentication status and get user data
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        setUserData(parsedUser);
        setIsAuthenticated(true);
      } catch {
        localStorage.removeItem("user");
        setIsAuthenticated(false);
      }
    }
  }, []);

  // Get cart count
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUserData(null);
    setIsUserMenuOpen(false);
    navigate("/login");
  };

  const handleUserClick = () => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      setIsUserMenuOpen(!isUserMenuOpen);
    }
  };

  const normalizeQuery = (query) =>
    query.toLowerCase().replace(/\s+/g, " ").trim();

  const getSearchRoute = (query) => {
    if (/\bhaldi\b/.test(query)) return "/occasion/haldi";
    if (/\bmehndi\b/.test(query)) return "/occasion/mehndi";
    if (/\b(reception)\b/.test(query)) return "/occasion/reception";
    if (/\b(bridal|wedding)\b/.test(query)) return "/occasion/wedding";
    return null;
  };

  const handleSearchSubmit = () => {
    const q = normalizeQuery(searchQuery);
    if (!q) return;
    const route = getSearchRoute(q);
    if (route) {
      navigate(route);
    } else {
      navigate("/explore", { state: { searchQuery: q } });
    }
    setSearchQuery("");
    setIsSearchOpen(false);
  };

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      handleSearchSubmit();
    }
  };

  // Helper function to get user display name
  const getUserDisplayName = () => {
    if (!userData) return "";
    return userData.name || userData.email || "User";
  };

  // Helper function to get first character for avatar
  const getUserInitial = () => {
    const name = getUserDisplayName();
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="navbar-container">
      <style>{`
        :root {
          --deep-maroon: #4A0E0E;
          --rose-gold: #E5B4A2;
          --gold-bright: #C2A35D;
          --ivory: #FDFBF7;
        }

        .navbar-container {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: white;
          border-bottom: 1px solid rgba(74, 14, 14, 0.1);
          padding: 0;
          z-index: 1000;
          box-shadow: 0 2px 10px rgba(74, 14, 14, 0.08);
          font-family: 'Montserrat', sans-serif;
        }

        .navbar-wrapper {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 8%;
          max-width: 1600px;
          margin: 0 auto;
        }

        /* Logo/Brand */
        .navbar-logo {
          font-size: 1.8rem;
          font-weight: 700;
          color: var(--deep-maroon);
          cursor: pointer;
          letter-spacing: 1px;
          text-decoration: none;
          transition: color 0.3s;
          font-family: 'Cormorant Garamond', serif;
        }

        .navbar-logo:hover {
          color: var(--gold-bright);
        }

        /* Center section - Search */
        .navbar-center {
          flex: 1;
          margin: 0 60px;
        }

        .search-container {
          position: relative;
          display: flex;
          align-items: center;
          background: #f5f5f5;
          border-radius: 25px;
          padding: 8px 16px;
          transition: all 0.3s ease;
          border: 2px solid transparent;
        }

        .search-container.active {
          background: white;
          border-color: var(--gold-bright);
          box-shadow: 0 4px 15px rgba(194, 163, 93, 0.2);
        }

        .search-input {
          flex: 1;
          border: none;
          background: transparent;
          outline: none;
          font-size: 0.95rem;
          color: var(--deep-maroon);
          font-family: 'Montserrat', sans-serif;
        }

        .search-input::placeholder {
          color: #999;
        }

        .search-icon {
          color: var(--gold-bright);
          cursor: pointer;
          font-size: 1.1rem;
          margin-left: 10px;
        }

        /* Right section - Icons */
        .navbar-right {
          display: flex;
          align-items: center;
          gap: 30px;
        }

        .navbar-icon-group {
          display: flex;
          align-items: center;
          gap: 25px;
        }

        .navbar-icon {
          font-size: 1.3rem;
          color: var(--deep-maroon);
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
        }

        .navbar-icon:hover {
          color: var(--gold-bright);
          transform: scale(1.15);
        }

        .navbar-icon.wishlist {
          color: var(--rose-gold);
        }

        /* Cart badge */
        .cart-badge {
          position: absolute;
          top: -8px;
          right: -10px;
          background: var(--rose-gold);
          color: white;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          font-weight: 700;
        }

        .cart-text {
          font-size: 0.75rem;
          color: #666;
          margin-top: 2px;
        }

        /* User menu */
        .user-menu-wrapper {
          position: relative;
        }

        .user-menu {
          position: absolute;
          top: 100%;
          right: 0;
          background: white;
          border-radius: 10px;
          min-width: 200px;
          box-shadow: 0 10px 30px rgba(74, 14, 14, 0.15);
          border: 1px solid rgba(74, 14, 14, 0.1);
          margin-top: 10px;
          z-index: 1001;
          overflow: hidden;
          animation: slideDown 0.3s ease;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .user-menu-item {
          padding: 14px 20px;
          color: var(--deep-maroon);
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 12px;
          transition: all 0.2s;
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
          font-size: 0.95rem;
          font-weight: 500;
        }

        .user-menu-item:last-child {
          border-bottom: none;
        }

        .user-menu-item:hover {
          background: var(--ivory);
          padding-left: 24px;
          color: var(--gold-bright);
        }

        .user-menu-item.logout {
          color: #e74c3c;
        }

        .user-menu-item.logout:hover {
          background: #ffe5e5;
          color: #c0392b;
        }

        /* Mobile responsive */
        .mobile-menu-toggle {
          display: none;
          background: none;
          border: none;
          color: var(--deep-maroon);
          font-size: 1.5rem;
          cursor: pointer;
          padding: 8px;
        }

        .mobile-menu {
          position: fixed;
          top: 60px;
          left: 0;
          right: 0;
          background: white;
          border-bottom: 1px solid rgba(74, 14, 14, 0.1);
          box-shadow: 0 4px 12px rgba(74, 14, 14, 0.1);
          padding: 15px 0;
          z-index: 999;
          animation: slideDown 0.3s ease;
          max-height: 80vh;
          overflow-y: auto;
        }

        .mobile-menu-item {
          padding: 12px 6%;
          border-bottom: 1px solid rgba(74, 14, 14, 0.05);
          cursor: pointer;
          color: var(--deep-maroon);
          font-weight: 500;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .mobile-menu-item:hover {
          background: var(--ivory);
          padding-left: 8%;
        }

        @media (max-width: 768px) {
          .navbar-wrapper {
            padding: 12px 4%;
            gap: 10px;
          }

          .navbar-logo {
            font-size: 1.3rem;
            flex-shrink: 0;
          }

          .navbar-center {
            flex: 1;
            margin: 0 10px;
            min-width: 120px;
          }

          .search-container {
            padding: 6px 10px;
          }

          .search-input {
            font-size: 0.8rem;
          }

          .navbar-right {
            gap: 12px;
          }

          .navbar-icon-group {
            gap: 12px;
          }

          .navbar-icon {
            font-size: 1rem;
          }

          .mobile-menu-toggle {
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .navbar-icon-group {
            display: none;
          }
        }

        @media (max-width: 480px) {
          .navbar-wrapper {
            padding: 10px 3%;
            gap: 8px;
          }

          .navbar-logo {
            font-size: 1.1rem;
            font-weight: 600;
          }

          .navbar-center {
            margin: 0 8px;
            flex: 1;
          }

          .search-input {
            font-size: 0.75rem;
          }

          .search-container {
            padding: 5px 8px;
            border-radius: 20px;
          }

          .search-icon {
            font-size: 0.9rem;
          }

          .mobile-menu-toggle {
            font-size: 1.3rem;
          }

          .mobile-menu {
            top: 55px;
          }
        }

        @media (max-width: 768px) {

        }

        /* User Avatar Circle */
        .user-avatar-circle {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--gold-bright), var(--rose-gold));
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 1rem;
          box-shadow: 0 4px 12px rgba(194, 163, 93, 0.3);
        }

        .user-avatar-circle:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 16px rgba(194, 163, 93, 0.4);
        }

        .user-name-text {
          font-size: 0.9rem;
          color: var(--deep-maroon);
          font-weight: 600;
          margin-right: 8px;
          max-width: 100px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        @media (max-width: 768px) {
          .user-name-text {
            display: none;
          }

          .user-avatar-circle {
            width: 35px;
            height: 35px;
            font-size: 0.9rem;
          }
        }

        @media (max-width: 480px) {
          .user-avatar-circle {
            width: 32px;
            height: 32px;
            font-size: 0.85rem;
          }
        }

      `}</style>

      <div className="navbar-wrapper">
        {/* Logo */}
        <div className="navbar-logo" onClick={() => navigate("/")}>
          Lehenga Bazar
        </div>

        {/* Search Bar */}
        <div className="navbar-center">
          <div
            className={`search-container ${isSearchOpen ? "active" : ""}`}
            onFocus={() => setIsSearchOpen(true)}
          >
            <input
              type="text"
              className="search-input"
              placeholder="Search lehengas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
            />
            <FaSearch className="search-icon" onClick={handleSearchSubmit} />
          </div>
        </div>

        {/* Right Section - Icons */}
        <div className="navbar-right">
          <div className="navbar-icon-group">
            {/* Wishlist Icon */}
            <div
              className="navbar-icon wishlist"
              onClick={() => {
                navigate("/wishlist");
                setIsMobileMenuOpen(false);
              }}
              title="Wishlist"
            >
              <FaHeart />
            </div>

            {/* Cart Icon */}
            <div
              className="navbar-icon"
              onClick={() => {
                navigate("/cart");
                setIsMobileMenuOpen(false);
              }}
              title="Shopping Cart"
              style={{ position: "relative" }}
            >
              <FaShoppingBag />
              {cartCount > 0 && (
                <>
                  <div className="cart-badge">{cartCount}</div>
                  <div
                    className="cart-text"
                    style={{
                      position: "absolute",
                      top: "22px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      whiteSpace: "nowrap",
                      fontSize: "0.65rem",
                      fontWeight: "600",
                      color: "var(--rose-gold)",
                      minWidth: "60px",
                      textAlign: "center",
                    }}
                  >
                    Added in bag
                  </div>
                </>
              )}
            </div>

            {/* User Icon / Avatar */}
            <div className="user-menu-wrapper" ref={userMenuRef}>
              {isAuthenticated ? (
                <>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      cursor: "pointer",
                      padding: "4px 8px",
                      borderRadius: "20px",
                      transition: "all 0.3s ease",
                    }}
                    onClick={handleUserClick}
                    title="Account Menu"
                  >
                    <span className="user-name-text">
                      {getUserDisplayName()}
                    </span>
                    <div className="user-avatar-circle">{getUserInitial()}</div>
                  </div>

                  {/* User Dropdown Menu - Only when logged in */}
                  {isUserMenuOpen && (
                    <div className="user-menu">
                      <div
                        className="user-menu-item"
                        onClick={() => {
                          navigate("/profile");
                          setIsUserMenuOpen(false);
                        }}
                      >
                        <FaUserCircle size={16} />
                        My Profile
                      </div>
                      <div
                        className="user-menu-item"
                        onClick={() => {
                          navigate("/my-orders");
                          setIsUserMenuOpen(false);
                        }}
                      >
                        <FaBox size={16} />
                        My Orders
                      </div>
                      {userData?.role === "admin" ||
                      userData?.role === "owner" ? (
                        <div
                          className="user-menu-item"
                          onClick={() => {
                            navigate("/admin/dashboard");
                            setIsUserMenuOpen(false);
                          }}
                          style={{
                            background:
                              "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            color: "white",
                          }}
                        >
                          🛡️ Admin Panel
                        </div>
                      ) : null}
                      <div
                        className="user-menu-item logout"
                        onClick={handleLogout}
                      >
                        <FaSignOutAlt size={16} />
                        Logout
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div
                  className="navbar-icon"
                  onClick={handleUserClick}
                  title="Login"
                >
                  <FaUser />
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu" ref={mobileMenuRef}>
          <div
            className="mobile-menu-item"
            onClick={() => {
              navigate("/explore");
              setIsMobileMenuOpen(false);
            }}
          >
            <FaSearch /> Explore
          </div>
          <div
            className="mobile-menu-item"
            onClick={() => {
              navigate("/wishlist");
              setIsMobileMenuOpen(false);
            }}
          >
            <FaHeart /> Wishlist
          </div>
          <div
            className="mobile-menu-item"
            onClick={() => {
              navigate("/cart");
              setIsMobileMenuOpen(false);
            }}
          >
            <FaShoppingBag /> Cart {cartCount > 0 && `(${cartCount})`}
          </div>
          {isAuthenticated ? (
            <>
              <div
                className="mobile-menu-item"
                onClick={() => {
                  navigate("/profile");
                  setIsMobileMenuOpen(false);
                }}
              >
                <FaUserCircle /> My Profile
              </div>
              <div
                className="mobile-menu-item"
                onClick={() => {
                  navigate("/my-orders");
                  setIsMobileMenuOpen(false);
                }}
              >
                <FaBox /> My Orders
              </div>
              {userData?.role === "admin" || userData?.role === "owner" ? (
                <div
                  className="mobile-menu-item"
                  onClick={() => {
                    navigate("/admin/dashboard");
                    setIsMobileMenuOpen(false);
                  }}
                  style={{
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "white",
                  }}
                >
                  🛡️ Admin Panel
                </div>
              ) : null}
              <div
                className="mobile-menu-item"
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                style={{ color: "#e74c3c" }}
              >
                <FaSignOutAlt /> Logout
              </div>
            </>
          ) : (
            <div
              className="mobile-menu-item"
              onClick={() => {
                navigate("/login");
                setIsMobileMenuOpen(false);
              }}
            >
              <FaUser /> Login
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;
