// backend/src/seed/products.seed.js
require('dotenv').config();
const { connectMongo } = require('../config/db');
const Product = require('../models/Product.model');

const data = [
  {
    sku: 'SKU-001',
    name: 'Auriculares BT X200',
    description: 'Over-ear, 30h batería, USB-C',
    price: 149900,
    images: ['/img/x200-1.jpg'],
    category: 'Audio',
    rating: 4.6,
    stock: 12,
    tags: ['bluetooth', 'noise-cancel']
  },
  {
    sku: 'SKU-002',
    name: 'Teclado Mecánico K87',
    description: 'TKL, switches rojos',
    price: 199900,
    images: ['/img/k87.jpg'],
    category: 'Periféricos',
    rating: 4.4,
    stock: 8,
    tags: ['gaming']
  },
  {
    sku: 'SKU-003',
    name: 'Mouse Pro M50',
    description: '8K DPI, ergonómico',
    price: 99900,
    images: ['/img/m50.jpg'],
    category: 'Periféricos',
    rating: 4.3,
    stock: 20,
    tags: ['gaming']
  },
  {
    sku: 'SKU-004',
    name: 'Parlantes Stereo S20',
    description: '10W RMS, 2.0',
    price: 89900,
    images: ['/img/s20.jpg'],
    category: 'Audio',
    rating: 4.1,
    stock: 15,
    tags: []
  },
  {
    sku: 'SKU-005',
    name: "Monitor 24'' FHD 75Hz",
    description: 'IPS, bisel delgado',
    price: 599900,
    images: ['/img/mon24.jpg'],
    category: 'Monitores',
    rating: 4.5,
    stock: 7,
    tags: ['fhd']
  },
  {
    sku: 'SKU-006',
    name: 'Silla Ergonómica E1',
    description: 'Apoyo lumbar, malla',
    price: 699900,
    images: ['/img/e1.jpg'],
    category: 'Oficina',
    rating: 4.2,
    stock: 9,
    tags: []
  },
  {
    sku: 'SKU-007',
    name: 'Hub USB-C 6 en 1',
    description: 'HDMI, USB3, SD',
    price: 159900,
    images: ['/img/hub.jpg'],
    category: 'Accesorios',
    rating: 4.3,
    stock: 25,
    tags: []
  },
  {
    sku: 'SKU-008',
    name: 'SSD NVMe 1TB',
    description: '3500 MB/s',
    price: 329900,
    images: ['/img/nvme.jpg'],
    category: 'Almacenamiento',
    rating: 4.7,
    stock: 10,
    tags: ['nvme']
  }
];

(async () => {
  await connectMongo();
  for (const p of data) {
    await Product.updateOne({ sku: p.sku }, { $setOnInsert: p }, { upsert: true });
  }
  const total = await Product.countDocuments();
  console.log(`Seed OK. Total productos: ${total}`);
  process.exit(0);
})();
