import User from "../model/userModel.js";
import jwt from "jsonwebtoken";

// Middleware to verify token and extract user
export const verifyToken = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Token required" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_secret_key");
        const userId = decoded.userId || decoded.id;

        if (!userId) {
            return res.status(401).json({ message: "Invalid token payload" });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};

// Middleware to check if user is admin or owner
export const isAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "User not authenticated" });
    }

    if (req.user.role !== "admin" && req.user.role !== "owner") {
        return res.status(403).json({ message: "Admin access required" });
    }

    next();
};

// Middleware to check if user is owner only
export const isOwner = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "User not authenticated" });
    }

    if (req.user.role !== "owner") {
        return res.status(403).json({ message: "Owner access required" });
    }

    next();
};

// Middleware to check if user is customer
export const isCustomer = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "User not authenticated" });
    }

    if (req.user.role !== "customer") {
        return res.status(403).json({ message: "Customer access required" });
    }
    next();
};
