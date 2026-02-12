import express from "express";
import {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    deactivateProduct,
    getAdminProducts
} from "../controller/productController.js";
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllProducts);

// Admin routes (requires authentication and admin role)
// Place admin-prefixed routes before dynamic :id to avoid conflicts
router.get("/admin/my-products", verifyToken, isAdmin, getAdminProducts);
router.post("/", verifyToken, isAdmin, createProduct);
router.put("/:id", verifyToken, isAdmin, updateProduct);
router.delete("/:id", verifyToken, isAdmin, deleteProduct);
router.patch("/:id/deactivate", verifyToken, isAdmin, deactivateProduct);

// Public route (after admin-prefixed routes)
router.get("/:id", getProductById);

export default router;
