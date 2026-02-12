import User from "../model/userModel.js";
import bcrypt from "bcryptjs";
import validator from "validator";
import { genToken } from "../config/token.js";
import { verifyIdToken, isInitialized } from "../config/firebaseAdmin.js";

/* =========================
   REGISTER (EMAIL/PASSWORD)
========================= */
export const registration = async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;

        if (!name || !email || !password || !confirmPassword) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        if (!validator.isStrongPassword(password, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
        })) {
            return res.status(400).json({
                message: "Password must contain uppercase, lowercase, number & symbol"
            });
        }

        // Public registration always creates a customer
        const userRole = 'customer';

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            authProvider: "local",
            role: userRole
        });

        const token = await genToken(user._id);

        res.cookie("token", token, cookieOptions());

        res.status(201).json({
            message: "User registered successfully",
            token,
            user
        });

    } catch (error) {
        console.error("Register Error:", error.message);
        res.status(500).json({ message: "Registration failed" });
    }
};


/* =========================
        LOGIN
========================= */
export const login = async (req, res) => {
    try {
        const { email, password, adminId, identifier } = req.body;

        const loginId = (identifier || email || adminId || "").toString().trim();

        if (!loginId || !password) {
            return res.status(400).json({ message: "Login ID and password required" });
        }

        const isEmail = validator.isEmail(loginId);
        const user = await User.findOne(
            isEmail ? { email: loginId.toLowerCase() } : { adminId: loginId.toLowerCase() }
        );
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // 🚫 Google users cannot login via password
        if (user.authProvider === "google") {
            return res.status(400).json({
                message: "This account uses Google Sign-In"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = await genToken(user._id);
        res.cookie("token", token, cookieOptions());

        res.status(200).json({
            message: "Login successful",
            token,
            user
        });

    } catch (error) {
        console.error("Login Error:", error.message);
        res.status(500).json({ message: "Login failed" });
    }
};


/* =========================
     GOOGLE SIGN-IN
========================= */
export const googleSignIn = async (req, res) => {
    try {
        // Accept either an ID token (from the client) or a dev-bypass payload when enabled
        const { token: idToken, email: devEmail, name: devName, uid: devUid } = req.body;
        const devKeyHeader = req.headers['x-dev-google-key'];

        // If no ID token, allow a **safe** development bypass when explicitly enabled via env
        if (!idToken) {
            const bypassEnabled = process.env.ALLOW_GOOGLE_BYPASS === "true";
            const devKey = process.env.DEV_GOOGLE_KEY || null;

            if (bypassEnabled && devKey && devKeyHeader && devKeyHeader === devKey) {
                // Validate required dev fields
                if (!devEmail || !devUid) {
                    return res.status(400).json({ message: "Dev bypass requires email and uid" });
                }

                console.warn('⚠️ Using DEV Google bypass to create/sign-in user:', devEmail);

                // Treat provided payload as trusted for local testing
                let user = await User.findOne({ email: devEmail });

                if (!user) {
                    user = await User.create({
                        name: devName || "Dev Google User",
                        email: devEmail,
                        authProvider: "google",
                        providerId: devUid,
                        avatar: null
                    });
                }

                const jwtToken = await genToken(user._id);
                res.cookie("token", jwtToken, cookieOptions());

                return res.status(200).json({ message: "(Dev) Google sign-in successful", token: jwtToken, user });
            }

            // If no bypass allowed, return missing token
            return res.status(400).json({ message: "Google token missing" });
        }

        // If ID token provided, ensure Firebase Admin is initialized so we can verify it
        if (!isInitialized()) {
            return res.status(503).json({
                message:
                    "Firebase Admin not initialized on server. Google Sign-In unavailable."
            });
        }

        // 🔐 Verify token
        const decoded = await verifyIdToken(idToken);
        const { email, name, picture, uid } = decoded;

        if (!email) {
            return res.status(400).json({ message: "Email not found from Google" });
        }

        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                name: name || "Google User",
                email,
                authProvider: "google",
                providerId: uid,
                avatar: picture || null
            });
        }

        const jwtToken = await genToken(user._id);

        res.cookie("token", jwtToken, cookieOptions());

        return res.status(200).json({
            message: "Google sign-in successful",
            token: jwtToken,
            user
        });

    } catch (error) {
        console.error("🔥 Google Sign-In Error:", error);
        return res.status(400).json({
            message: "Invalid or expired Google token"
        });
    }
};


/* =========================
  FIREBASE ADMIN STATUS
========================= */
export const firebaseStatus = async (req, res) => {
    try {
        const initialized = isInitialized();
        res.status(200).json({ initialized });
    } catch (error) {
        console.error("Firebase status error:", error.message);
        res.status(500).json({ initialized: false, message: "Failed to determine Firebase Admin status" });
    }
};


/* =========================
        LOGOUT
========================= */
export const logout = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
        });

        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: "Logout failed" });
    }
};


/* =========================
     UPDATE PROFILE
========================= */
export const updateProfile = async (req, res) => {
    try {
        const userId = req.user?._id || req.body?.userId;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { name, email, phone, address, city, country } = req.body;

        // Validate required fields
        if (!name) {
            return res.status(400).json({ message: "Name is required" });
        }

        // Find and update user
        const user = await User.findByIdAndUpdate(
            userId,
            {
                name: name.trim(),
                email: email ? email.trim() : undefined,
                phone: phone || undefined,
                address: address || undefined,
                city: city || undefined,
                country: country || undefined
            },
            { new: true, runValidators: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "Profile updated successfully",
            user
        });
    } catch (error) {
        console.error("Profile Update Error:", error.message);
        res.status(500).json({ message: "Failed to update profile" });
    }
};


/* =========================
     COOKIE OPTIONS
========================= */
const cookieOptions = () => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000
});
