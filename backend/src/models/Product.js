// backend/src/models/Product.js
import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    sku: { type: String, required: true, trim: true }, // índice único lo declaramos abajo
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    images: { type: [String], default: [] },
    category: { type: String, required: true, trim: true },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    stock: { type: Number, min: 0, default: 0 },
    tags: { type: [String], default: [] },
}, { timestamps: true });

/* Índices (solo aquí, sin index:true en campos) */
ProductSchema.index({ sku: 1 }, { unique: true, name: "idx_sku_unique" }); // lookups por SKU
ProductSchema.index({ category: 1, price: 1 }, { name: "idx_category_price" }); // filtros + orden por precio
ProductSchema.index({ createdAt: -1 }, { name: "idx_createdAt_desc" }); // listados recientes
ProductSchema.index({ name: "text", description: "text" }, {
    weights: { name: 5, description: 1 },
    name: "ProductTextIndex",
});

// Evitar "OverwriteModelError" en hot-reload
const Product =
    mongoose.models.Product || mongoose.model("Product", ProductSchema);

export default Product;