import User from "../model/userModel.js";
import bcrypt from "bcryptjs";
import validator from "validator";

export const createOwner = async (req, res) => {
    try {
        const { name, email, password, confirmPassword, adminId } = req.body;

        if (!name || !email || !password || !confirmPassword || !adminId) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        if (
            !validator.isStrongPassword(password, {
                minLength: 8,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            })
        ) {
            return res.status(400).json({
                message: "Password must contain uppercase, lowercase, number & symbol",
            });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const normalizedAdminId = adminId.toLowerCase().trim();

        const existingUser = await User.findOne({
            $or: [{ email: normalizedEmail }, { adminId: normalizedAdminId }],
        });

        if (existingUser) {
            return res.status(400).json({
                message: "Email or Admin ID already in use",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const owner = await User.create({
            name,
            email: normalizedEmail,
            password: hashedPassword,
            authProvider: "local",
            role: "owner",
            adminId: normalizedAdminId,
        });

        res.status(201).json({
            message: "Owner account created",
            owner: {
                _id: owner._id,
                name: owner.name,
                email: owner.email,
                adminId: owner.adminId,
                role: owner.role,
            },
        });
    } catch (error) {
        console.error("Create Owner Error:", error.message);
        res.status(500).json({ message: "Failed to create owner" });
    }
};