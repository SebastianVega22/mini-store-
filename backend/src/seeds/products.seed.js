// backend/src/seeds/products.seed.js
import "../config/env.js";
import { connectDB, disconnectDB } from "../config/db.js";
import Product from "../models/Product.js";

const products = [{
        sku: "SKU-001",
        name: "Parlantes Stereo S20",
        description: "Parlantes estéreo compactos, conexión 3.5mm.",
        price: 89900,
        images: [
            "https://images.unsplash.com/photo-1518444028785-8fce0a366e2a?w=1200&q=80&auto=format",
        ],
        category: "Audio",
        rating: 4.2,
        stock: 15,
        tags: ["stereo", "compacto"],
    },
    {
        sku: "SKU-002",
        name: "Mouse Pro M50",
        description: "Mouse ergonómico, 8K DPI, cable mallado.",
        price: 99900,
        images: [
            "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&q=80&auto=format",
        ],
        category: "Periféricos",
        rating: 4.6,
        stock: 20,
        tags: ["ergonómico"],
    },
    {
        sku: "SKU-003",
        name: "Auriculares BT X200",
        description: "Over-ear, 30h batería, USB-C.",
        price: 149900,
        images: [
            "https://images.unsplash.com/photo-1517059224940-d4af9eec41e5?w=1200&q=80&auto=format",
        ],
        category: "Audio",
        rating: 4.6,
        stock: 12,
        tags: ["bluetooth", "noise-cancel"],
    },
    {
        sku: "SKU-004",
        name: "Hub USB-C 6 en 1",
        description: "HDMI 4K, 3x USB-A, PD 100W, lector SD.",
        price: 159900,
        images: [
            "https://images.unsplash.com/photo-1596495578065-8a3be0b90a39?w=1200&q=80&auto=format",
        ],
        category: "Accesorios",
        rating: 4.4,
        stock: 18,
        tags: ["usb-c", "hub"],
    },
    {
        sku: "SKU-005",
        name: 'Monitor 24" FHD 75Hz',
        description: "Panel IPS, ultra-delgado, VESA.",
        price: 599900,
        images: [
            "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&q=80&auto=format",
        ],
        category: "Monitores",
        rating: 4.5,
        stock: 9,
        tags: ["ips", "75hz"],
    },
    {
        sku: "SKU-006",
        name: "Teclado Mecánico K87",
        description: "87 teclas, hot-swap, RGB.",
        price: 199900,
        images: [
            "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&q=80&auto=format",
        ],
        category: "Periféricos",
        rating: 4.7,
        stock: 14,
        tags: ["mecánico", "rgb"],
    },
];

async function run() {
    await connectDB();
    console.log("MongoDB conectado (seed)");

    await Product.deleteMany({});
    await Product.insertMany(products);

    const count = await Product.countDocuments();
    console.log("Insertados", count, "productos");

    await disconnectDB();
    console.log("Seed finalizado");
}

run().catch((e) => {
    console.error(e);
    process.exit(1);
});