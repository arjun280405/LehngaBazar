import express from "express";
import {
    processPayment,
    getOrder,
    getOrdersByEmail,
    getOrdersByUserId,
    getTestTokens,
    createRazorpayOrderController,
    verifyRazorpayPaymentController,
    getAllOrders,
} from "../controller/paymentController.js";

const router = express.Router();

// Stripe payment processing
router.post("/process", processPayment);

// Get available test tokens documentation
router.get("/test-tokens", getTestTokens);

// Get order by ID
router.get("/order/:orderId", getOrder);

// Get orders by email (legacy - prefer userId route)
router.get("/orders/:email", getOrdersByEmail);

// Get orders by userId (PREFERRED)
router.get("/user/:userId/orders", getOrdersByUserId);

// Razorpay endpoints
router.post("/razorpay/create-order", createRazorpayOrderController);
router.post("/razorpay/verify", verifyRazorpayPaymentController);

// Admin: list all orders (add auth/role middleware later)
router.get("/admin/orders", getAllOrders);

export default router;
