import { Schema, model } from 'mongoose';

const ProductSchema = new Schema({
    sku: { type: String, unique: true, index: true },
    name: { type: String, index: true },
    description: String,
    price: Number,
    images: [String],
    category: String,
    rating: Number,
    stock: Number,
    tags: [String],
}, { timestamps: true });

export default model('Product', ProductSchema);