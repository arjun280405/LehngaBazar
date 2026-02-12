import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const AdminAddProduct = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const { user, serverUrl, isAdmin } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(productId ? true : false);
  const [formData, setFormData] = useState({
    product_title: "",
    brand: "",
    class_label: "Lehenga",
    price: "",
    originalPrice: "",
    discount: "0",
    description: "",
    review: "4.5/5 — Great product",
    image_url: "",
    thumb1: "",
    thumb2: "",
    inventory: "10",
  });

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate("/admin/login");
    }

    if (productId) {
      fetchProduct();
    }
  }, [user, isAdmin, navigate, productId]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(
        `${serverUrl}/api/products/${productId}`,
      );
      setFormData(response.data.product);
      setFetchLoading(false);
    } catch (error) {
      console.error("Failed to fetch product:", error);
      setFetchLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (productId) {
        // Update product
        await axios.put(`${serverUrl}/api/products/${productId}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Product updated successfully!");
      } else {
        // Create product
        await axios.post(`${serverUrl}/api/products`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Product created successfully!");
      }

      navigate("/admin/products");
    } catch (error) {
      console.error("Failed to save product:", error);
      alert(error.response?.data?.message || "Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) return null;

  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading product...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">
            {productId ? "Edit Product" : "Add New Product"}
          </h1>
          <p className="text-purple-100">
            {productId
              ? "Update product details"
              : "Create a new product for your store"}
          </p>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow p-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="product_title"
                value={formData.product_title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                placeholder="e.g., Lavish Purple Lehenga Ensemble"
              />
            </div>

            {/* Brand */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brand <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                placeholder="e.g., Lehenga Bazar"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="class_label"
                value={formData.class_label}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
              >
                <option value="Lehenga">Lehenga</option>
                <option value="Haldi">Haldi</option>
                <option value="Mehndi">Mehndi</option>
                <option value="Bridal">Bridal</option>
                <option value="Traditional">Traditional</option>
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                placeholder="9999"
              />
            </div>

            {/* Original Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Original Price (₹)
              </label>
              <input
                type="number"
                name="originalPrice"
                value={formData.originalPrice}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                placeholder="12999"
              />
            </div>

            {/* Discount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount (%)
              </label>
              <input
                type="number"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                placeholder="10"
              />
            </div>

            {/* Inventory */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Inventory (Units)
              </label>
              <input
                type="number"
                name="inventory"
                value={formData.inventory}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                placeholder="10"
              />
            </div>

            {/* Review */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Review
              </label>
              <input
                type="text"
                name="review"
                value={formData.review}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                placeholder="4.5/5 — Great product"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                placeholder="Detailed product description..."
              ></textarea>
            </div>

            {/* Main Image URL */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Main Image URL <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                placeholder="../assets/products/lehenga-01.avif"
              />
              {formData.image_url && (
                <img
                  src={formData.image_url}
                  alt="Preview"
                  className="mt-2 h-40 object-cover rounded"
                />
              )}
            </div>

            {/* Thumbnail 1 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thumbnail 1 URL
              </label>
              <input
                type="text"
                name="thumb1"
                value={formData.thumb1}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                placeholder="../assets/products/lehenga-01-thumb1.avif"
              />
            </div>

            {/* Thumbnail 2 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thumbnail 2 URL
              </label>
              <input
                type="text"
                name="thumb2"
                value={formData.thumb2}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                placeholder="../assets/products/lehenga-01-thumb2.avif"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-8">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50"
            >
              {loading
                ? productId
                  ? "Updating..."
                  : "Creating..."
                : productId
                  ? "Update Product"
                  : "Create Product"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/products")}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-3 rounded-lg font-semibold transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default AdminAddProduct;
