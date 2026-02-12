# ⚡ QUICK START - Virtual Try-On

## 🎯 What You Need to Do (Just 1 Step!)

### Get Your FREE Gemini API Key:

1. **Go to:** https://makersuite.google.com/app/apikey
2. **Sign in** with any Google account
3. **Click** "Create API Key"
4. **Copy** the generated key

### Add It to Your Project:

Open this file: `Backend/.env`

Find this line:

```env
GEMINI_API_KEY="YOUR_GEMINI_API_KEY_HERE"
```

Replace with your key:

```env
GEMINI_API_KEY="AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxx"
```

**That's it! You're done!** 🎉

---

## 🚀 Start the App

### Terminal 1 - Backend:

```bash
cd Backend
node index.js
```

✅ You'll see: "Server running on http://localhost:8000"

### Terminal 2 - Frontend:

```bash
cd Frontend
npm run dev
```

✅ You'll see: "Local: http://localhost:5174/"

---

## 🎮 Try It Out

1. Open http://localhost:5174/
2. Scroll down to "Craft & Story" section
3. Click **"Try It Now"** button
4. Upload your photo (any selfie or photo of yourself)
5. Click any lehenga from the grid
6. Click **"Try Virtual Try-On"**
7. Wait 10-20 seconds ⏳
8. **See yourself wearing the lehenga!** 🎊

---

## ✨ Features You Get

- ✅ Upload your photo
- ✅ Choose from 12 different lehengas
- ✅ AI generates realistic try-on image
- ✅ Beautiful UI matching your store theme
- ✅ Works on mobile, tablet, desktop
- ✅ Fast and secure

---

## 🎨 What Was Built

### Frontend:

- New page: `/tryon`
- Upload section with preview
- Product selection grid
- Loading animations
- Result display

### Backend:

- New endpoint: `POST /api/virtual-tryon`
- File upload handling (multer)
- Gemini AI integration
- Image processing

### Files Created/Updated:

- ✅ VirtualTryOn.jsx (new page)
- ✅ tryonController.js (AI logic)
- ✅ tryonRoutes.js (API endpoint)
- ✅ Home.jsx (button updated)
- ✅ App.jsx (route added)
- ✅ index.js (backend updated)

---

## 🔧 Tech Stack

- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **AI:** Google Gemini AI
- **Upload:** Multer
- **Styling:** CSS-in-JS

---

## 💡 Pro Tips

### For Best AI Results:

1. Use clear, well-lit photos
2. Full-body or upper-body shots
3. Simple backgrounds work best
4. File size under 5MB

### Troubleshooting:

- **No result?** → Check if API key is correct
- **Error message?** → Check browser console (F12)
- **Slow?** → AI generation takes 10-20 seconds

---

## 📞 Need Help?

1. Check [VIRTUAL_TRYON_COMPLETE.md](VIRTUAL_TRYON_COMPLETE.md) - Full guide
2. Check [VIRTUAL_TRYON_SETUP.md](VIRTUAL_TRYON_SETUP.md) - Setup instructions
3. Check [VISUAL_GUIDE.md](VISUAL_GUIDE.md) - UI documentation

---

## 🎉 Status

- ✅ Frontend: Complete
- ✅ Backend: Complete
- ✅ Integration: Complete
- ✅ UI/UX: Complete
- ✅ Documentation: Complete
- ⏳ **API Key: Add yours!**

Once you add your Gemini API key, you're 100% ready to go! 🚀

---

**Time to Complete:** 5 minutes
**Difficulty:** Easy
**Cost:** FREE (Gemini has free tier)

## Let's Go! 🎊

1. Get API key from Google AI Studio
2. Add to Backend/.env
3. Start both servers
4. Visit /tryon
5. Upload photo + Select lehenga
6. Click "Try Virtual Try-On"
7. **Experience the magic!** ✨
