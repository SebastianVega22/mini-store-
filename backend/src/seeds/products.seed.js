// backend/src/seeds/products.seed.js (ESM)
import "../config/env.js";
import { connectDB, disconnectDB } from "../config/db.js";
import Product from "../models/Product.js";

// Helper para construir la ruta pública servida por Express:
// => http://localhost:4000/public/productos/<archivo>
const img = (file) => `/public/productos/${file}`;

const products = [{
        sku: "SKU-001",
        name: "Parlantes Stereo S20",
        description: "Parlantes estéreo compactos, conexión 3.5mm.",
        price: 89900,
        images: [img("sku-001.jpeg")], // usa la extensión real que tengas (.jpg/.jpeg)
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
        images: [img("sku-002.jpeg")],
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
        images: [img("sku-003.jpg")],
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
        images: [img("sku-004.jpg")],
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
        images: [img("sku-005.jpg")],
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
        images: [img("sku-006.jpg")],
        category: "Periféricos",
        rating: 4.7,
        stock: 14,
        tags: ["mecánico", "rgb"],
    },
    // 007–018
    {
        sku: "SKU-007",
        name: "Parlantes Stereo S30",
        description: "Más potencia y graves reforzados.",
        price: 119900,
        images: [img("sku-007.jpg")],
        category: "Audio",
        rating: 4.3,
        stock: 16,
        tags: ["stereo", "grave"],
    },
    {
        sku: "SKU-008",
        name: "Soundbar S900",
        description: "Barra de sonido 2.1 con subwoofer inalámbrico.",
        price: 329900,
        images: [img("sku-008.jpg")],
        category: "Audio",
        rating: 4.6,
        stock: 7,
        tags: ["soundbar", "subwoofer"],
    },
    {
        sku: "SKU-009",
        name: "Auriculares In-Ear S12",
        description: "Livianos, con micrófono y estuche.",
        price: 69900,
        images: [img("sku-009.jpeg")],
        category: "Audio",
        rating: 4.1,
        stock: 25,
        tags: ["in-ear", "microfono"],
    },
    {
        sku: "SKU-010",
        name: "Auriculares Studio Pro 500",
        description: "Estudio, alta fidelidad, cable desmontable.",
        price: 289900,
        images: [img("sku-010.jpg")],
        category: "Audio",
        rating: 4.8,
        stock: 6,
        tags: ["studio", "hifi"],
    },
    {
        sku: "SKU-011",
        name: "Mouse Gamer Viper X7",
        description: "Sensor 26K DPI, 8 botones programables.",
        price: 189900,
        images: [img("sku-011.jpg")],
        category: "Periféricos",
        rating: 4.7,
        stock: 11,
        tags: ["gamer", "dpi26k"],
    },
    {
        sku: "SKU-012",
        name: "Mouse Inalámbrico Lite W10",
        description: "Ligero, batería 500 mAh, 2.4 GHz + BT.",
        price: 89900,
        images: [img("sku-012.jpg")],
        category: "Periféricos",
        rating: 4.4,
        stock: 22,
        tags: ["wireless", "bt"],
    },
    {
        sku: "SKU-013",
        name: "Teclado 60% MK61",
        description: "Formato 60%, switches rojos, cable USB-C.",
        price: 169900,
        images: [img("sku-013.jpg")],
        category: "Periféricos",
        rating: 4.5,
        stock: 13,
        tags: ["60%", "hot-swap"],
    },
    {
        sku: "SKU-014",
        name: "Teclado Office Slim K130",
        description: "Bajo perfil, silencioso, layout completo.",
        price: 119900,
        images: [img("sku-014.jpg")],
        category: "Periféricos",
        rating: 4.2,
        stock: 19,
        tags: ["office", "silencioso"],
    },
    {
        sku: "SKU-015",
        name: 'Monitor 27" QHD 144Hz',
        description: "IPS, 1ms MPRT, HDR10, FreeSync.",
        price: 1499900,
        images: [img("sku-015.jpg")],
        category: "Monitores",
        rating: 4.7,
        stock: 5,
        tags: ["qhd", "144hz"],
    },
    {
        sku: "SKU-016",
        name: 'Monitor 32" 4K HDR',
        description: "UHD, 10-bit, cobertura sRGB 99%.",
        price: 2199900,
        images: [img("sku-016.jpg")],
        category: "Monitores",
        rating: 4.6,
        stock: 4,
        tags: ["4k", "hdr"],
    },
    {
        sku: "SKU-017",
        name: "Webcam 1080p W1",
        description: "Full HD, auto enfoque, clip universal.",
        price: 129900,
        images: [img("sku-017.jpg")],
        category: "Accesorios",
        rating: 4.3,
        stock: 17,
        tags: ["webcam", "1080p"],
    },
    {
        sku: "SKU-018",
        name: "Micrófono USB M1",
        description: "Cardioide, ganancia y mute integrados.",
        price: 179900,
        images: [img("sku-018.jpg")],
        category: "Accesorios",
        rating: 4.5,
        stock: 10,
        tags: ["microfono", "usb"],
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