# Virtual Try-On Feature - Setup Guide

## 🎯 Feature Overview

AI-powered virtual try-on that lets users upload their photo and see themselves wearing any lehenga from your collection using Google Gemini AI.

## 📋 Prerequisites

1. Node.js and npm installed
2. MongoDB running
3. Google Gemini API key

## 🔑 Get Your Gemini API Key

### Step 1: Visit Google AI Studio

Go to: https://makersuite.google.com/app/apikey

### Step 2: Sign in with Google Account

- Use your Google account to sign in
- Accept the terms of service if prompted

### Step 3: Create API Key

1. Click "Create API Key" button
2. Select existing project or create new one
3. Copy the generated API key
4. Keep it secure and never commit it to Git

### Step 4: Add to .env File

Open `Backend/.env` and replace:

```
GEMINI_API_KEY="YOUR_GEMINI_API_KEY_HERE"
```

with your actual key:

```
GEMINI_API_KEY="AIzaSyB..."
```

## 🚀 Installation Steps

### Backend Setup

```bash
cd Backend
npm install multer axios @google/generative-ai
```

### Frontend Setup

```bash
cd Frontend
npm install
```

## ▶️ Running the Application

### Terminal 1 - Backend Server

```bash
cd Backend
npm run dev
```

Backend will run on: http://localhost:8000

### Terminal 2 - Frontend Server

```bash
cd Frontend
npm run dev
```

Frontend will run on: http://localhost:5174 (or 5173)

## 🎨 How to Use the Feature

### For Users:

1. **Navigate to Try-On Page**
   - Click on the try-on image on the home page
   - Or click the "Try It Now" button

2. **Upload Your Photo**
   - Click the upload area in Step 1
   - Select a clear photo of yourself (JPG, PNG, JPEG)
   - Image should be less than 5MB
   - Best results with full-body or upper-body photos

3. **Select a Lehenga**
   - Browse the product grid in Step 2
   - Click on any lehenga you want to try on
   - Selected product will have a golden border

4. **Generate Try-On**
   - Click "Try Virtual Try-On" button
   - Wait 10-20 seconds for AI generation
   - View your result below!

## 🛠️ Technical Architecture

### Data Flow:

```
User Upload Photo → Frontend
    ↓
Select Lehenga → Frontend
    ↓
Click "Try On" → POST /api/virtual-tryon
    ↓
Backend receives: userImage (file) + productImageUrl (string)
    ↓
Convert images to base64
    ↓
Send to Gemini AI with prompt
    ↓
Receive generated image
    ↓
Return to frontend
    ↓
Display result
```

### API Endpoint:

- **URL:** `POST http://localhost:8000/api/virtual-tryon`
- **Content-Type:** `multipart/form-data`
- **Body:**
  - `userImage`: Image file (form-data)
  - `productImageUrl`: String (product image path)

### Response Format:

```json
{
  "success": true,
  "generatedImage": "base64_encoded_image_data",
  "message": "Virtual try-on completed"
}
```

## 🎨 AI Prompt Used

The system sends this prompt to Gemini:

```
You are an AI fashion designer specializing in Indian bridal wear.

Rules:
- Keep person's face, body, pose, skin tone, hair UNCHANGED
- Replace ONLY the clothing with the lehenga
- Match exact color, embroidery, fabric texture from product
- Natural fit with realistic folds and draping
- Maintain original background and lighting
- Generate photorealistic Indian bridal fashion photo
- Face must remain recognizable
```

## 🔒 Security Considerations

1. **API Key Security**
   - Never commit `.env` file to Git
   - Keep `GEMINI_API_KEY` private
   - Use environment variables in production

2. **File Upload Limits**
   - Max file size: 5MB
   - Only image files allowed (JPG, PNG, JPEG)
   - Validated on both frontend and backend

3. **CORS Configuration**
   - Currently allows `http://localhost:5173` and `http://localhost:5174`
   - Update for production domains

## 🐛 Troubleshooting

### Issue: "Failed to generate try-on image"

**Solution:**

- Check if GEMINI_API_KEY is set in .env
- Verify backend server is running
- Check console for detailed error messages

### Issue: "User image is required"

**Solution:**

- Ensure file is selected before clicking try-on
- Check if file size is under 5MB
- Verify file is an image format

### Issue: CORS errors

**Solution:**

- Check backend CORS configuration
- Ensure frontend URL matches backend allowed origins
- Restart backend server after .env changes

### Issue: Image quality poor

**Solution:**

- Upload higher resolution user photos
- Use well-lit photos with clear subject
- Avoid blurry or pixelated images

## 📝 Notes for Production

1. **Image Storage:**
   - Currently product images are local imports
   - For production, use cloud storage (S3, Cloudinary)
   - Update controller to fetch from URLs

2. **Gemini API Limitations:**
   - Current implementation uses text-based Gemini
   - For better results, use Imagen model when available
   - Consider rate limiting API calls

3. **Caching:**
   - Implement caching for generated images
   - Store results in database for quick retrieval
   - Reduce redundant API calls

4. **Error Handling:**
   - Add retry logic for API failures
   - Implement fallback mechanisms
   - Better user feedback for errors

## 📞 Support

If you encounter any issues:

1. Check the console logs (browser DevTools)
2. Check backend terminal for errors
3. Verify all environment variables are set
4. Ensure all dependencies are installed

## 🎉 Feature Highlights

✅ User-friendly interface with drag-and-drop upload
✅ Real-time product selection with visual feedback
✅ Loading states and progress indicators
✅ Error handling with helpful messages
✅ Responsive design for all devices
✅ AI-powered realistic try-on generation
✅ Beautiful UI matching your bridal store theme

---

**Built with:** React, Node.js, Express, Google Gemini AI, Multer

**Status:** ✅ Ready to use (add your Gemini API key)
