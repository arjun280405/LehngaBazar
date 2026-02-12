import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const virtualTryOn = async (req, res) => {
    try {
        // Check if user uploaded their image
        if (!req.file) {
            return res.status(400).json({ error: "User image is required" });
        }

        // Get product image URL from request
        const { productImageUrl } = req.body;
        if (!productImageUrl) {
            return res.status(400).json({ error: "Product image URL is required" });
        }

        console.log("Starting virtual try-on process...");
        console.log("Product image URL:", productImageUrl);
        console.log("User image size:", req.file.size, "bytes");
        console.log("User image type:", req.file.mimetype);

        // Check if Gemini API key is configured
        if (!process.env.GEMINI_API_KEY) {
            console.error("GEMINI_API_KEY is not set in environment variables");
            return res.status(500).json({
                error: "Server configuration error",
                details: "GEMINI_API_KEY is not configured"
            });
        }

        // Convert user image buffer to base64
        const userImageBase64 = req.file.buffer.toString("base64");
        console.log("User image converted to base64, length:", userImageBase64.length);

        console.log("Initializing Gemini AI...");

        // Initialize Gemini AI
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const modelName = process.env.GEMINI_MODEL || "gemini-1.5-flash-001";
        const model = genAI.getGenerativeModel({ model: modelName });

        // Create a detailed description prompt for the AI
        const prompt = `Analyze this photo and describe how the person would look wearing an Indian bridal lehenga. 

Focus on:
1. The person's body type, pose, and positioning
2. Current clothing style and colors
3. How a traditional Indian bridal lehenga would drape on this person
4. The person's skin tone and how bridal colors would complement it
5. Describe the transformation in vivid detail

Be specific and descriptive about the virtual try-on visualization.`;

        console.log("Sending request to Gemini API...");

        // Create the request with the user image
        const imagePart = {
            inlineData: {
                data: userImageBase64,
                mimeType: req.file.mimetype,
            },
        };

        const result = await model.generateContent([
            prompt,
            imagePart,
        ]);

        const response = await result.response;
        const text = response.text();

        console.log("Gemini API response received successfully");
        console.log("Response text length:", text.length);

        // Note: Gemini's text models don't generate images directly
        // For a real virtual try-on, you would need:
        // 1. Image-to-image models like Stable Diffusion, DALL-E, or Midjourney
        // 2. Specialized virtual try-on models
        // 3. Or cloud services like Cloudinary AI or similar

        // For now, return the user's image with AI description
        return res.json({
            success: true,
            generatedImage: userImageBase64,
            aiDescription: text,
            message: "Virtual try-on analysis completed",
            note: "Demo version: Showing original image. For production, integrate image generation API like Stable Diffusion or specialized virtual try-on service.",
            productSelected: productImageUrl,
        });

    } catch (error) {
        console.error("Virtual try-on error:", error);
        console.error("Error stack:", error.stack);
        return res.status(500).json({
            error: "Failed to generate virtual try-on",
            details: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        });
    }
};
