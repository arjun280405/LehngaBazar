import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import MobileLanding from "./pages/MobileLanding.jsx";
import Login from "./pages/Login.jsx";
import Registration from "./pages/Registration.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import ExploreEdit from "./pages/ExploreEdit.jsx";
import Cart from "./pages/Cart.jsx";
import Wishlist from "./pages/Wishlist.jsx";
import OrderConfirmation from "./pages/OrderConfirmation.jsx";
import MyOrders from "./pages/MyOrders.jsx";
import MyProfile from "./pages/MyProfile.jsx";
import OccasionPage from "./pages/OccasionPage.jsx";
import VirtualTryOn from "./pages/VirtualTryOn.jsx";
import SoniAssistant from "./components/SoniAssistant.jsx";
import AdminLoginPage from "./pages/AdminLogin.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminProducts from "./pages/AdminProducts.jsx";
import AdminAddProduct from "./pages/AdminAddProduct.jsx";
import AdminOrders from "./pages/AdminOrders.jsx";
import AdminCreateOwner from "./pages/AdminCreateOwner.jsx";
import { CartProvider } from "./context/CartContext.jsx";

function App() {
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      const isAndroid = /android/i.test(userAgent);
      const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
      const isMobileView = window.innerWidth <= 768;

      setIsMobile(isAndroid || isIOS || isMobileView);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <CartProvider>
      <Routes>
        <Route path="/" element={isMobile ? <MobileLanding /> : <Home />} />
        <Route path="/occasion/:occasion" element={<OccasionPage />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/explore" element={<ExploreEdit />} />
        <Route path="/tryon" element={<VirtualTryOn />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Registration />} />
        <Route
          path="/order-confirmation/:orderId"
          element={<OrderConfirmation />}
        />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/profile" element={<MyProfile />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/products/add" element={<AdminAddProduct />} />
        <Route
          path="/admin/products/edit/:productId"
          element={<AdminAddProduct />}
        />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/owners/create" element={<AdminCreateOwner />} />
      </Routes>
      <SoniAssistant />
    </CartProvider>
  );
}

export default App;
