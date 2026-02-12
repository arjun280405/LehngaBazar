import admin from 'firebase-admin';
import fs from 'fs';

// Initialize Firebase Admin SDK using a service account JSON provided via env
let serviceAccount = null;
if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
    try {
        const raw = fs.readFileSync(process.env.FIREBASE_SERVICE_ACCOUNT_PATH, 'utf8');
        serviceAccount = JSON.parse(raw);
    } catch (err) {
        console.error('Failed to read FIREBASE_SERVICE_ACCOUNT_PATH:', err.message);
        // Keep serviceAccount null and continue; do not crash the server
        serviceAccount = null;
    }
} else if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    } catch (err) {
        console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT JSON:', err.message);
        // Keep serviceAccount null and continue; do not crash the server
        serviceAccount = null;
    }
} else {
    console.warn('No Firebase service account provided. Set FIREBASE_SERVICE_ACCOUNT (JSON) or FIREBASE_SERVICE_ACCOUNT_PATH in environment. Google sign-in verification will fail until provided.');
}

let initialized = false;
if (serviceAccount) {
    try {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
        initialized = true;
        console.log('✅ Firebase Admin initialized');
    } catch (err) {
        // Initialization failed - keep server running without admin features
        console.error('Failed to initialize Firebase Admin:', err.message);
        initialized = false;
    }
}

export const isInitialized = () => initialized && admin.apps && admin.apps.length > 0;

export const verifyIdToken = async (idToken) => {
    if (!isInitialized()) throw new Error('Firebase Admin not initialized');
    return admin.auth().verifyIdToken(idToken);
};

export default admin;