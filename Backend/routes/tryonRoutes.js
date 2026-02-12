import express from "express";
import multer from "multer";
import { virtualTryOn } from "../controller/tryonController.js";

const router = express.Router();

// Configure multer for memory storage
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Only image files are allowed"), false);
        }
    },
});

// Virtual try-on endpoint
router.post("/virtual-tryon", upload.single("userImage"), virtualTryOn);

export default router;
