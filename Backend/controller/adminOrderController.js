import Order from "../model/orderModel.js";

// Get all orders (admin/owner)
export const getAllOrders = async (req, res) => {
    try {
        const { status, userId } = req.query;
        let query = {};

        if (status) {
            query.status = status;
        }

        if (userId) {
            query.userId = userId;
        }

        const orders = await Order.find(query)
            .populate("userId", "name email")
            .sort({ orderDate: -1 });

        res.status(200).json({
            message: "Orders retrieved successfully",
            count: orders.length,
            orders
        });
    } catch (error) {
        console.error("Get orders error:", error.message);
        res.status(500).json({ message: "Failed to retrieve orders" });
    }
};

// Get order by ID
export const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findById(id).populate("userId", "name email");

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json({
            message: "Order retrieved successfully",
            order
        });
    } catch (error) {
        console.error("Get order error:", error.message);
        res.status(500).json({ message: "Failed to retrieve order" });
    }
};

// Update order status (admin/owner)
export const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, trackingNumber } = req.body;

        // Validate status
        const validStatuses = ["confirmed", "processing", "shipped", "out-for-delivery", "delivered", "cancelled"];
        if (status && !validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        if (!status) {
            return res.status(400).json({ message: "Status is required" });
        }

        const order = await Order.findByIdAndUpdate(
            id,
            {
                status,
                ...(trackingNumber && { trackingNumber })
            },
            { new: true }
        ).populate("userId", "name email");

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Emit real-time update to customer
        if (global.io) {
            global.io.to(`user_${order.userId._id}`).emit("orderStatusUpdated", {
                orderId: order._id,
                status: order.status,
                trackingNumber: order.trackingNumber
            });
        }

        res.status(200).json({
            message: "Order status updated successfully",
            order
        });
    } catch (error) {
        console.error("Update order status error:", error.message);
        res.status(500).json({ message: "Failed to update order status" });
    }
};

// Get order statistics
export const getOrderStats = async (req, res) => {
    try {
        const stats = {
            total: await Order.countDocuments(),
            confirmed: await Order.countDocuments({ status: "confirmed" }),
            processing: await Order.countDocuments({ status: "processing" }),
            shipped: await Order.countDocuments({ status: "shipped" }),
            outForDelivery: await Order.countDocuments({ status: "out-for-delivery" }),
            delivered: await Order.countDocuments({ status: "delivered" }),
            cancelled: await Order.countDocuments({ status: "cancelled" }),
            totalRevenue: await getTotalRevenue()
        };

        res.status(200).json({
            message: "Order statistics retrieved successfully",
            stats
        });
    } catch (error) {
        console.error("Get order stats error:", error.message);
        res.status(500).json({ message: "Failed to retrieve order statistics" });
    }
};

// Helper function to calculate total revenue
const getTotalRevenue = async () => {
    try {
        const result = await Order.aggregate([
            { $match: { paymentStatus: "completed" } },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } }
        ]);
        return result.length > 0 ? result[0].total : 0;
    } catch (error) {
        console.error("Get total revenue error:", error.message);
        return 0;
    }
};

// Export revenue helper for use in other files
export { getTotalRevenue };
