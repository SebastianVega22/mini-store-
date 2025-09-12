// backend/src/routes/products.routes.js
import { Router } from "express";
import { z } from "zod";
import Product from "../models/Product.js";
import { validate } from "../middlewares/validate.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

const listQuerySchema = z.object({
    page: z
        .preprocess((v) => {
            const n = Number(v);
            return Number.isFinite(n) ? n : 1;
        }, z.number().int().min(1).max(1000))
        .default(1),
    limit: z
        .preprocess((v) => {
            const n = Number(v);
            return Number.isFinite(n) ? n : 12;
        }, z.number().int().min(1).max(60))
        .default(12),
    search: z.string().trim().max(100).optional().or(z.literal("")).default(""),
    category: z.string().trim().max(80).optional().or(z.literal("")).default(""),
    sort: z.enum(["price", "name", "rating", "createdAt"]).default("price"),
    order: z.enum(["asc", "desc"]).default("asc"),
});

/* GET /api/products */
router.get(
    "/",
    validate(listQuerySchema, "query"),
    asyncHandler(async(req, res) => {
        const { page, limit, search, category, sort, order } = req.query;

        const filter = {};
        if (category) filter.category = category;

        // Si tienes índice de texto, úsalo; si no, cae a regex por nombre.
        if (search) {
            filter.$text = { $search: search };
        }

        const skip = (page - 1) * limit;

        const sortObj =
            sort === "name" ?
            { name: order === "asc" ? 1 : -1 } :
            sort === "rating" ?
            { rating: order === "asc" ? 1 : -1 } :
            sort === "createdAt" ?
            { createdAt: order === "asc" ? 1 : -1 } :
            { price: order === "asc" ? 1 : -1 };

        const [items, total] = await Promise.all([
            Product.find(filter)
            .select("sku name price images category rating stock")
            .sort(sortObj)
            .collation({ locale: "es", strength: 2 }) // orden alfabético insensible a may/min
            .skip(skip)
            .limit(limit)
            .lean(),
            Product.countDocuments(filter),
        ]);

        res.json({ items, total, page, pageSize: limit });
    })
);

/* GET /api/products/:sku */
router.get(
    "/:sku",
    asyncHandler(async(req, res) => {
        const raw = String(req.params.sku || "").trim();

        // 1) intento exacto
        let p = await Product.findOne({ sku: raw }).lean();

        // 2) fallback case-insensitive (anclado)
        if (!p) {
            const safe = escapeRegex(raw);
            p = await Product.findOne({ sku: new RegExp(`^${safe}$`, "i") }).lean();
        }

        if (!p) return res.status(404).json({ message: "Producto no encontrado" });
        res.json(p);
    })
);

function escapeRegex(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export default router;