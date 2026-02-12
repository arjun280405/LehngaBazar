import express from "express";
import {
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    getOrderStats
} from "../controller/adminOrderController.js";
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require admin authentication
router.use(verifyToken, isAdmin);

// Get order statistics (place before :id to avoid conflicts)
router.get("/stats/overview", getOrderStats);

// Get all orders
router.get("/", getAllOrders);

// Get order by ID
router.get("/:id", getOrderById);

// Update order status
router.patch("/:id/status", updateOrderStatus);

export default router;
