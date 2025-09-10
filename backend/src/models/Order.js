import mongoose from "mongoose";
const { Schema, model } = mongoose;

const OrderSchema = new Schema({
    code: { type: String, index: true, unique: true },
    items: [{
        sku: String,
        name: String,
        price: Number,
        qty: Number,
        image: String,
    }, ],
    subtotal: Number,
    discount: Number,
    taxes: Number,
    total: Number,
    shipping: {
        fullName: String,
        email: String,
        phone: String,
        address: String,
        city: String,
    },
}, { timestamps: true });

export default model("Order", OrderSchema);