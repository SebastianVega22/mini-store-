import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    sku: { type: String, required: true, trim: true, unique: true },
    name: { type: String, required: true, trim: true, maxlength: 160 },
    description: { type: String, trim: true, maxlength: 4000 },
    price: { type: Number, required: true, min: 0 },
    images: {
        type: [String],
        default: [],
        validate: {
            validator: (arr) => Array.isArray(arr) && arr.every((s) => typeof s === "string"),
            message: "images must be an array of strings (URLs).",
        },
    },
    category: { type: String, trim: true, maxlength: 80 },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    stock: { type: Number, min: 0, default: 0 },
    tags: { type: [String], default: [] },
}, { timestamps: true });

/* Índices */
ProductSchema.index({ sku: 1 }, { unique: true }); // lookups por SKU
ProductSchema.index({ category: 1, price: 1 }); // filtros + orden por precio
ProductSchema.index({ createdAt: -1 }); // listados recientes
ProductSchema.index({ name: "text", description: "text" }, { // búsqueda por texto
    weights: { name: 5, description: 1 },
    name: "ProductTextIndex",
});

const Product = mongoose.model("Product", ProductSchema);
export default Product;