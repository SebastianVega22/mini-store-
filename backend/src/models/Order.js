import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema({
    sku: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true, maxlength: 160 },
    price: { type: Number, required: true, min: 0 },
    qty: { type: Number, required: true, min: 1 },
    image: { type: String, default: null }, // opcional, para mostrar en confirmaciones
}, { _id: false });

const ShippingSchema = new mongoose.Schema({
    fullName: { type: String, required: true, trim: true, maxlength: 160 },
    email: { type: String, required: true, trim: true, maxlength: 160 },
    phone: { type: String, trim: true, maxlength: 40 },
    address: { type: String, required: true, trim: true, maxlength: 240 },
    city: { type: String, required: true, trim: true, maxlength: 120 },
}, { _id: false });

const OrderSchema = new mongoose.Schema({
    items: { type: [OrderItemSchema], required: true, validate: v => v.length > 0 },
    shipping: { type: ShippingSchema, required: true },
    subtotal: { type: Number, required: true, min: 0 },
    taxes: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
    status: { type: String, default: "created", enum: ["created", "paid", "canceled"] },
}, { timestamps: true });

/* Índices */
OrderSchema.index({ createdAt: -1 });
OrderSchema.index({ "shipping.email": 1 });

const Order = mongoose.model("Order", OrderSchema);
export default Order;