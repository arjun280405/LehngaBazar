Here’s a clean, professional, interview-ready README.md you can directly paste into GitHub 👇

🌸 Lehenga Bazar

An AI-powered full-stack e-commerce platform for Indian bridal ethnic wear.
Users can browse products, securely complete payments, and use an AI-based virtual try-on feature to visualize outfits.

🚀 Features

🛍️ Product browsing & filtering

🔐 Email/Password + Google OAuth authentication

💳 Secure payments via Razorpay & Stripe

🤖 AI-powered Virtual Try-On (Gemini API)

🛒 Cart persistence with Context API + LocalStorage

📦 Order tracking & history

💬 AI Chatbot assistant

🏗️ Tech Stack
Frontend

React 19

Vite

React Router

Tailwind CSS

Axios

Firebase Authentication

Backend

Node.js

Express.js

MongoDB (Atlas)

Mongoose

JWT Authentication

bcrypt (password hashing)

Multer (image upload handling)

AI Integration

Google Gemini (1.5 Flash) for outfit analysis

Prompt-based virtual try-on logic

Payments

Razorpay (Primary – India)

Stripe (International fallback)

Backend HMAC-SHA256 signature verification

🧠 System Architecture

Frontend (React) → REST APIs (Axios) → Express Backend → MongoDB Atlas

Payments verified server-side

JWT stored in HTTPOnly cookies

AI requests processed securely on backend

💳 Secure Payment Flow

Backend creates payment order

Frontend opens Razorpay/Stripe checkout

Payment completes

Backend verifies signature using HMAC-SHA256

Order stored in MongoDB only after verification

✔ No raw card data stored
✔ Environment variables for all secrets
✔ PCI-safe implementation

🔐 Security Practices

Password hashing using bcrypt

JWT with expiry (7 days)

HTTPOnly cookies to prevent XSS

Input validation (email, card format, expiry, etc.)

CORS protection

Environment variables (.env) for API keys

🗄️ Database Structure
Users

email (unique)

name

password (hashed)

authProvider (local/google)

Orders

email (indexed)

items[]

totalAmount

paymentStatus

paymentMethod

razorpayOrderId / stripePaymentId

orderStatus

🤖 AI Virtual Try-On

Users upload their image →
Image processed via Multer →
Converted to base64 →
Sent to Gemini API →
Returns personalized description of outfit fit and appearance.

(Currently demo version – returns descriptive output. Can be upgraded with image generation APIs like Stable Diffusion.)

📈 Future Improvements

Redis caching for performance

Real image-based virtual try-on

Collaborative filtering recommendation engine

Inventory management system

⚙️ Installation
# Clone the repository
git clone <your-repo-url>


# Install frontend dependencies
cd client
npm install


# Install backend dependencies
cd ../server
npm install


# Add environment variables in .env
JWT_SECRET=
RAZORPAY_SECRET=
STRIPE_SECRET_KEY=
MONGO_URI=


# Start backend
npm run dev


# Start frontend
npm run dev
🌍 Deployment

Backend: AWS / Render / Heroku

Database: MongoDB Atlas

Frontend: Vercel / Netlify

👨‍💻 Author

Built as a full-stack AI-integrated e-commerce project to demonstrate real-world production concepts including payment security, authentication, and scalable architecture.
