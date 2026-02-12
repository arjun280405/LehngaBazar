import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,  // userId is now required - orders are tied to authenticated users
            index: true,     // Add index for faster queries by userId
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            // Note: email is stored as contact info and can differ from user's auth email
        },
        customerName: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        city: {
            type: String,
        },
        state: {
            type: String,
        },
        zipcode: {
            type: String,
        },
        items: [
            {
                id: String,
                name: String,
                product_title: String,
                price: Number,
                quantity: Number,
                image_url: String,
                image: String,
            },
        ],
        totalAmount: {
            type: Number,
            required: true,
        },
        paymentStatus: {
            type: String,
            enum: ["pending", "completed", "failed"],
            default: "completed",
        },
        paymentMethod: {
            type: String,
            enum: ["card", "upi", "netbanking", "razorpay"],
            default: "razorpay",
        },
        lastFourDigits: {
            type: String, // Store only last 4 digits for security
        },
        orderDate: {
            type: Date,
            default: Date.now,
        },
        estimatedDeliveryDate: {
            type: Date,
        },
        status: {
            type: String,
            enum: ["confirmed", "processing", "shipped", "out-for-delivery", "delivered", "cancelled"],
            default: "confirmed",
        },
        trackingNumber: {
            type: String,
        },
        notes: {
            type: String,
        },
        razorpayOrderId: {
            type: String,
        },
        razorpayPaymentId: {
            type: String,
        },
    },
    { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
