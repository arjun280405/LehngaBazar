import bcrypt from "bcryptjs";
import validator from "validator";
import User from "../model/userModel.js";

const DEFAULT_EMAIL_DOMAIN = "sonimahal.local";

const buildEmail = (adminId) => `${adminId}@${DEFAULT_EMAIL_DOMAIN}`;

export const bootstrapAdmin = async () => {
    try {
        const adminId = (process.env.ADMIN_BOOTSTRAP_ID || "").toLowerCase().trim();
        const adminPassword = process.env.ADMIN_BOOTSTRAP_PASSWORD || "";
        const adminEmail = (process.env.ADMIN_BOOTSTRAP_EMAIL || "").trim();

        if (!adminId || !adminPassword) {
            return;
        }

        const emailToUse = adminEmail || buildEmail(adminId);

        if (!validator.isEmail(emailToUse)) {
            console.warn("⚠️ Invalid ADMIN_BOOTSTRAP_EMAIL. Admin seed skipped.");
            return;
        }

        const existing = await User.findOne({
            $or: [{ adminId }, { email: emailToUse.toLowerCase() }],
        });

        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        if (existing) {
            existing.name = existing.name || "Primary Admin";
            existing.email = emailToUse.toLowerCase();
            existing.password = hashedPassword;
            existing.authProvider = "local";
            existing.role = "admin";
            existing.adminId = adminId;
            await existing.save();
            console.log("✅ Admin bootstrap account updated");
            return;
        }

        await User.create({
            name: "Primary Admin",
            email: emailToUse.toLowerCase(),
            password: hashedPassword,
            authProvider: "local",
            role: "admin",
            adminId,
        });

        console.log("✅ Admin bootstrap account created");
    } catch (error) {
        console.error("Admin bootstrap error:", error.message);
    }
};