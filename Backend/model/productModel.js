import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        product_title: {
            type: String,
            required: true,
        },
        brand: {
            type: String,
            required: true,
        },
        class_label: {
            type: String,
            enum: ["Lehenga", "Haldi", "Mehndi", "Bridal", "Traditional"],
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        originalPrice: {
            type: Number,
            default: null,
        },
        discount: {
            type: Number,
            default: 0,
        },
        description: {
            type: String,
            required: true,
        },
        review: {
            type: String,
            default: "4.5/5 — Great product",
        },
        image_url: {
            type: String,
            required: true,
        },
        thumb1: {
            type: String,
            default: null,
        },
        thumb2: {
            type: String,
            default: null,
        },
        inventory: {
            type: Number,
            default: 10,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
