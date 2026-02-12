import Product from "../model/productModel.js";

// Get all products (public route)
export const getAllProducts = async (req, res) => {
    try {
        const { category, search } = req.query;
        let query = { isActive: true };

        if (category) {
            query.class_label = category;
        }

        if (search) {
            query.$or = [
                { product_title: { $regex: search, $options: "i" } },
                { brand: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } }
            ];
        }

        const products = await Product.find(query).sort({ createdAt: -1 });
        res.status(200).json({
            message: "Products retrieved successfully",
            count: products.length,
            products
        });
    } catch (error) {
        console.error("Get products error:", error.message);
        res.status(500).json({ message: "Failed to retrieve products" });
    }
};

// Get single product by ID
export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({
            message: "Product retrieved successfully",
            product
        });
    } catch (error) {
        console.error("Get product error:", error.message);
        res.status(500).json({ message: "Failed to retrieve product" });
    }
};

// Create product (admin/owner only)
export const createProduct = async (req, res) => {
    try {
        const { product_title, brand, class_label, price, originalPrice, discount, description, review, image_url, thumb1, thumb2, inventory } = req.body;

        if (!product_title || !brand || !class_label || !price || !image_url) {
            return res.status(400).json({ message: "Required fields missing" });
        }

        const product = await Product.create({
            product_title,
            brand,
            class_label,
            price,
            originalPrice: originalPrice || price,
            discount: discount || 0,
            description,
            review: review || "4.5/5 — Great product",
            image_url,
            thumb1,
            thumb2,
            inventory: inventory || 10,
            createdBy: req.user._id
        });

        res.status(201).json({
            message: "Product created successfully",
            product
        });
    } catch (error) {
        console.error("Create product error:", error.message);
        res.status(500).json({ message: "Failed to create product" });
    }
};

// Update product (admin/owner only, or creator)
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Check authorization: admin/owner can modify any, others only their own
        const isPrivileged = req.user.role === "owner" || req.user.role === "admin";
        if (!isPrivileged && product.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to update this product" });
        }

        const updatedProduct = await Product.findByIdAndUpdate(id, updates, { new: true });

        // Notify connected clients about product update
        if (global.io) {
            global.io.emit("productUpdated", updatedProduct);
        }

        res.status(200).json({
            message: "Product updated successfully",
            product: updatedProduct
        });
    } catch (error) {
        console.error("Update product error:", error.message);
        res.status(500).json({ message: "Failed to update product" });
    }
};

// Delete product (admin/owner only, or creator)
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Check authorization
        const isPrivileged = req.user.role === "owner" || req.user.role === "admin";
        if (!isPrivileged && product.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to delete this product" });
        }

        await Product.findByIdAndDelete(id);

        // Notify connected clients about product deletion
        if (global.io) {
            global.io.emit("productDeleted", { id });
        }

        res.status(200).json({
            message: "Product deleted successfully",
            productId: id
        });
    } catch (error) {
        console.error("Delete product error:", error.message);
        res.status(500).json({ message: "Failed to delete product" });
    }
};

// Soft delete (deactivate) product
export const deactivateProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Check authorization
        const isPrivileged = req.user.role === "owner" || req.user.role === "admin";
        if (!isPrivileged && product.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to modify this product" });
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { isActive: false },
            { new: true }
        );

        // Notify clients
        if (global.io) {
            global.io.emit("productUpdated", updatedProduct);
        }

        res.status(200).json({
            message: "Product deactivated successfully",
            product: updatedProduct
        });
    } catch (error) {
        console.error("Deactivate product error:", error.message);
        res.status(500).json({ message: "Failed to deactivate product" });
    }
};

// Get admin products (products created by this admin)
export const getAdminProducts = async (req, res) => {
    try {
        const products = await Product.find({}).sort({ createdAt: -1 });

        res.status(200).json({
            message: "Admin products retrieved successfully",
            count: products.length,
            products
        });
    } catch (error) {
        console.error("Get admin products error:", error.message);
        res.status(500).json({ message: "Failed to retrieve admin products" });
    }
};
