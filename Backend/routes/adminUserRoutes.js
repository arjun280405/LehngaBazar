import express from "express";
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";
import { createOwner } from "../controller/adminUserController.js";

const adminUserRoutes = express.Router();

// Admin/Owner: create owner account
adminUserRoutes.post("/owners", verifyToken, isAdmin, createOwner);

export default adminUserRoutes;