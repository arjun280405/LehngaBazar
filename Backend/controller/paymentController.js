import Order from "../model/orderModel.js";
import {
    processPaymentIntent,
    getPaymentStatus,
    handlePaymentError,
    createRazorpayOrder,
    verifyRazorpayPayment,
} from "../services/paymentService.js";
import {
    validatePaymentData,
    sanitizePaymentData,
} from "../utils/paymentValidation.js";
import { testCardTokens } from "../config/stripeConfig.js";

export const processPayment = async (req, res) => {
    try {
        const rawData = req.body;

        // Validate payment data
        const validation = validatePaymentData(rawData);
        if (!validation.isValid) {
            return res.status(400).json({
                message: "Invalid payment data",
                errors: validation.errors,
            });
        }

        // Sanitize data
        const paymentData = sanitizePaymentData(rawData);

        console.log(`\n📦 Processing Payment`);
        console.log(`   Customer: ${paymentData.name}`);
        console.log(`   Email: ${paymentData.email}`);
        console.log(`   Amount: ₹${paymentData.amount}`);
        console.log(`   Items: ${paymentData.cartItems.length}`);
        console.log(`   User ID: ${paymentData.userId || 'Not provided (guest order)'}`);

        // Require userId for all orders
        if (!paymentData.userId) {
            return res.status(400).json({
                message: "User must be logged in to place orders",
                code: "USER_AUTH_REQUIRED"
            });
        }

        // Process payment with Stripe
        const paymentResult = await processPaymentIntent(paymentData);

        if (!paymentResult.success) {
            return res.status(400).json({
                message: "Payment could not be processed",
                status: paymentResult.paymentIntent.status,
            });
        }

        // Create order in database
        const order = await Order.create({
            userId: paymentData.userId,  // userId is now required
            email: paymentData.email,
            customerName: paymentData.name,
            phone: paymentData.phone,
            address: paymentData.address,
            city: paymentData.city,
            state: paymentData.state,
            zipcode: paymentData.zipcode,
            items: paymentData.cartItems,
            totalAmount: paymentData.amount,
            paymentStatus:
                paymentResult.paymentIntent.status === "succeeded"
                    ? "completed"
                    : "processing",
            paymentMethod: "card",
            stripePaymentIntentId: paymentResult.paymentIntent.id,
            orderDate: new Date(),
            status:
                paymentResult.paymentIntent.status === "succeeded"
                    ? "confirmed"
                    : "processing",
            lastFourDigits: paymentResult.cardInfo.lastFourDigits,
            testMode: true,
        });

        // Add order to user's orders array
        try {
            const User = (await import('../model/userModel.js')).default;
            await User.findByIdAndUpdate(
                paymentData.userId,
                { $push: { orders: order._id } },
                { new: true }
            );
            console.log(`👤 Order linked to user: ${paymentData.userId}`);
        } catch (userUpdateError) {
            console.error(`⚠️ Failed to link order to user:`, userUpdateError.message);
            // Don't fail the order creation if user update fails
        }

        console.log(`✅ Order Created: ${order._id}`);
        console.log(`   Status: ${order.status}`);
        console.log(`   Amount: ₹${order.totalAmount}\n`);

        res.status(200).json({
            message: "Payment processed successfully",
            orderId: order._id,
            order: {
                _id: order._id,
                email: order.email,
                customerName: order.customerName,
                phone: order.phone,
                address: order.address,
                city: order.city,
                state: order.state,
                zipcode: order.zipcode,
                items: order.items,
                totalAmount: order.totalAmount,
                paymentStatus: order.paymentStatus,
                paymentMethod: order.paymentMethod,
                orderDate: order.orderDate,
                status: order.status,
                lastFourDigits: order.lastFourDigits,
            },
            stripePaymentIntentId: paymentResult.paymentIntent.id,
        });
    } catch (error) {
        console.error("❌ Payment Processing Error:", error.message);

        // Handle Stripe-specific errors
        if (error.type && error.type.includes("stripe")) {
            const errorInfo = handlePaymentError(error);
            return res.status(400).json(errorInfo);
        }

        res.status(500).json({
            message: error.message || "Payment processing failed",
            code: "INTERNAL_ERROR",
        });
    }
};

// Get order details
export const getOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json({ order });
    } catch (error) {
        console.error("Get Order Error:", error);
        res.status(500).json({ message: "Failed to fetch order" });
    }
};

// Get orders by email
export const getOrdersByEmail = async (req, res) => {
    try {
        const { email } = req.params;
        const orders = await Order.find({ email }).sort({ orderDate: -1 });

        res.status(200).json({ orders });
    } catch (error) {
        console.error("Get Orders Error:", error);
        res.status(500).json({ message: "Failed to fetch orders" });
    }
};

// Get orders by userId (PREFERRED METHOD)
export const getOrdersByUserId = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        console.log(`📦 Fetching orders for user: ${userId}`);
        const orders = await Order.find({ userId }).sort({ orderDate: -1 });

        console.log(`✅ Found ${orders.length} orders for user`);
        res.status(200).json({ orders });
    } catch (error) {
        console.error("Get Orders by UserId Error:", error);
        res.status(500).json({ message: "Failed to fetch orders" });
    }
};

// Create Razorpay order (returns order details and key id)
export const createRazorpayOrderController = async (req, res) => {
    try {
        const { amount, currency = "INR", name, email, phone, cartItems } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({ message: "Invalid amount" });
        }

        const order = await createRazorpayOrder({
            amount,
            currency,
            receipt: `rcpt_${Date.now()}`,
            notes: { name, email, phone, cartItemCount: (cartItems || []).length },
        });

        return res.status(200).json({ order, key: process.env.RAZORPAY_KEY_ID });
    } catch (error) {
        console.error("Create Razorpay Order Error:", error.message);
        res.status(500).json({ message: "Failed to create order" });
    }
};

// Verify Razorpay payment signature and create order record
export const verifyRazorpayPaymentController = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            userId,
            name,
            email,
            phone,
            address,
            city,
            state,
            zipcode,
            cartItems,
            amount,
        } = req.body;

        console.log("\n🔐 [RAZORPAY VERIFY REQUEST]");
        console.log(`   Order ID: ${razorpay_order_id}`);
        console.log(`   Payment ID: ${razorpay_payment_id}`);
        console.log(`   Customer: ${name}`);
        console.log(`   Email: ${email}`);
        console.log(`   User ID: ${userId || 'Not provided (guest order)'}`);

        // Verify signature (in dev mode, this auto-passes)
        const valid = verifyRazorpayPayment({ razorpay_order_id, razorpay_payment_id, razorpay_signature });

        if (!valid && process.env.NODE_ENV === "production") {
            console.error("❌ Signature verification failed in production mode");
            return res.status(400).json({ message: "Payment verification failed" });
        }

        // Validate required payment data - userId is now required
        if (!razorpay_order_id || !razorpay_payment_id || !name || !email || !amount || !userId) {
            console.error("❌ Missing required payment data");
            console.error({ razorpay_order_id, razorpay_payment_id, name, email, amount, userId });
            return res.status(400).json({
                message: "Missing required payment data. User must be logged in to place orders.",
                missingFields: {
                    razorpay_order_id: !razorpay_order_id,
                    razorpay_payment_id: !razorpay_payment_id,
                    name: !name,
                    email: !email,
                    amount: !amount,
                    userId: !userId
                }
            });
        }

        // Calculate estimated delivery date (5-7 days from now)
        const orderDate = new Date();
        const estimatedDeliveryDate = new Date(orderDate);
        estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 5);

        console.log("📝 Creating order with data:");
        console.log({
            userId,
            email,
            customerName: name,
            phone: phone || "Not provided",
            address: address || "Not provided",
            city: city || "Not provided",
            state: state || "Not provided",
            zipcode: zipcode || "Not provided",
            items: cartItems ? cartItems.length + " items" : "No items",
            totalAmount: amount,
            paymentMethod: "razorpay",
        });

        // Normalize item prices coming from the frontend (they may include currency symbols/commas)
        const sanitizedItems = (cartItems || []).map((item) => {
            const priceNumber = typeof item.price === "number"
                ? item.price
                : parseFloat(String(item.price).replace(/[^0-9.]/g, "")) || 0;

            return {
                id: item.id,
                name: item.name || item.product_title,
                product_title: item.product_title || item.name,
                price: priceNumber,
                quantity: item.quantity || 1,
                image_url: item.image_url,
                image: item.image,
            };
        });

        // Ensure amount is numeric as well
        const numericAmount = typeof amount === "number"
            ? amount
            : parseFloat(String(amount).replace(/[^0-9.]/g, "")) || 0;

        const order = await Order.create({
            userId: userId,  // userId is now required - primary identifier
            email,  // email is stored as contact info (can be different from auth email)
            customerName: name,
            phone: phone || "",
            address: address || "",
            city: city || "",
            state: state || "",
            zipcode: zipcode || "",
            items: sanitizedItems,
            totalAmount: numericAmount,
            paymentStatus: "completed",
            paymentMethod: "razorpay",
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id,
            orderDate,
            estimatedDeliveryDate,
            status: "confirmed",
        });

        // Add order to user's orders array
        try {
            const User = (await import('../model/userModel.js')).default;
            await User.findByIdAndUpdate(
                userId,
                { $push: { orders: order._id } },
                { new: true }
            );
            console.log(`👤 Order linked to user: ${userId}`);
        } catch (userUpdateError) {
            console.error(`⚠️ Failed to link order to user:`, userUpdateError.message);
            // Don't fail the order creation if user update fails
        }

        console.log(`✅ Order Created Successfully!`);
        console.log(`   Order ID: ${order._id}`);
        console.log(`   Customer: ${order.customerName}`);
        console.log(`   Amount: ₹${order.totalAmount}`);
        console.log(`   Est. Delivery: ${estimatedDeliveryDate.toLocaleDateString("en-IN")}\n`);

        return res.status(200).json({
            message: "Order created successfully",
            orderId: order._id,
            order
        });
    } catch (error) {
        console.error("❌ Verify Razorpay Payment Error:");
        console.error("   Message:", error.message);
        console.error("   Stack:", error.stack);
        res.status(500).json({
            message: "Order creation failed",
            error: error.message,
            details: error.errors ? Object.keys(error.errors) : null
        });
    }
};

// Admin: list all orders with pagination and optional filters
export const getAllOrders = async (req, res) => {
    try {
        const page = Math.max(parseInt(req.query.page || "1", 10), 1);
        const limit = Math.min(Math.max(parseInt(req.query.limit || "20", 10), 1), 100);
        const skip = (page - 1) * limit;

        const filter = {};
        if (req.query.email) {
            filter.email = req.query.email.toLowerCase();
        }
        if (req.query.status) {
            filter.status = req.query.status;
        }

        const [orders, total] = await Promise.all([
            Order.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Order.countDocuments(filter),
        ]);

        res.status(200).json({
            page,
            limit,
            total,
            orders,
        });
    } catch (error) {
        console.error("Get All Orders Error:", error);
        res.status(500).json({ message: "Failed to fetch orders" });
    }
};

// Get test tokens documentation
export const getTestTokens = (req, res) => {
    const formattedTokens = Object.entries(testCardTokens).map(
        ([cardNumber, cardInfo]) => ({
            number: cardNumber,
            token: cardInfo.token,
            description: cardInfo.description,
            network: cardInfo.network,
            status: cardInfo.status,
        })
    );

    res.status(200).json({
        message: "Stripe Test Tokens for Testing",
        tokens: formattedTokens,
        documentation: "https://stripe.com/docs/testing",
        usage: "Copy any test card number above and use in the checkout form",
    });
};
