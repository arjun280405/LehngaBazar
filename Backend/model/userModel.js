import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    // Password is optional to support social logins (Google)
    password: {
        type: String,
    },
    // Track authentication provider and provider-specific id
    authProvider: {
        type: String,
        enum: ['local', 'google', 'facebook', 'other'],
        default: 'local'
    },
    providerId: {
        type: String,
        default: null
    },
    avatar: {
        type: String,
        default: null
    },
    // Profile information
    phone: {
        type: String,
        default: null
    },
    address: {
        type: String,
        default: null
    },
    city: {
        type: String,
        default: null
    },
    country: {
        type: String,
        default: null
    },
    // Role-based access control
    role: {
        type: String,
        enum: ['customer', 'admin', 'owner'],
        default: 'customer'
    },
    // Admin/Owner login id (optional, unique)
    adminId: {
        type: String,
        unique: true,
        sparse: true,
        trim: true,
        lowercase: true
    },
    cartData: {
        type: Object,
        default: {}
    },
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    }]
}, { timestamps: true, minimize: false });
const User = mongoose.model("User", userSchema);
export default User;