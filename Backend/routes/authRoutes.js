import express from "express";
import { registration, login, logout, googleSignIn, firebaseStatus, updateProfile } from "../controller/authController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const authRoutes = express.Router();

authRoutes.post("/registration", registration);
authRoutes.post("/login", login);
authRoutes.post("/logout", logout);
authRoutes.post("/googlesignin", googleSignIn);
authRoutes.put("/profile", verifyToken, updateProfile);
// Status route to check Firebase Admin initialization
authRoutes.get("/firebase-status", firebaseStatus);
export default authRoutes;   
