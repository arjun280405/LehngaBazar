// Load environment variables as early as possible
import 'dotenv/config';
import express from "express";
import connectDb from "./config/db.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import tryonRoutes from "./routes/tryonRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import adminOrderRoutes from "./routes/adminOrderRoutes.js";
import adminUserRoutes from "./routes/adminUserRoutes.js";
import cors from "cors";
import http from "http";
import { Server as SocketServer } from "socket.io";
import { bootstrapAdmin } from "./utils/bootstrapAdmin.js";

let port = process.env.PORT || 8000
const app = express();

// Create HTTP server and Socket.io instance
const server = http.createServer(app);
const io = new SocketServer(server, {
    cors: {
        origin: ['http://localhost:5173', 'http://localhost:5174'],
        credentials: true,
    }
});

// Make io globally accessible
global.io = io;

// Socket.io connection handling
io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Join user-specific room
    socket.on("userJoined", (userId) => {
        socket.join(`user_${userId}`);
        console.log(`User ${userId} joined room`);
    });

    socket.on("disconnect", () => {
        console.log(`Client disconnected: ${socket.id}`);
    });
});

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//origin se backend k liye request aayegi
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
}))

app.use("/api/auth", authRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api", tryonRoutes);
app.use("/api/products", productRoutes);
app.use("/api/admin/orders", adminOrderRoutes);
app.use("/api/admin/users", adminUserRoutes);

// Handle malformed JSON payloads gracefully
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
        return res.status(400).json({ message: "Invalid JSON payload" });
    }
    return next(err);
});

server.listen(port, () => {
    console.log(`✅ Server running on http://localhost:${port}`);
    console.log("Hello From Server")

    connectDb().then(bootstrapAdmin);
});
