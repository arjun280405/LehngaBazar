import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "strong-skyline-445216-b0.firebaseapp.com",
    projectId: "strong-skyline-445216-b0",
    storageBucket: "strong-skyline-445216-b0.firebasestorage.app",
    messagingSenderId: "1049907843244",
    appId: "1:1049907843244:web:6c04eea252775f12720f09",
    measurementId: "G-WP5VBJKWGT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Helpful check to surface missing env values earlier
if (!firebaseConfig.apiKey) {
    console.error(
        'Missing VITE_FIREBASE_API_KEY — make sure you have a .env file at the project root with `VITE_FIREBASE_API_KEY` and restart the dev server.'
    );
}
const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { auth, provider };