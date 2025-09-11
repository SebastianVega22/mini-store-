import { Router } from "express";
import { z } from "zod";
import Product from "../models/Product.js";
import { validate } from "../middlewares/validate.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

const listQuerySchema = z.object({
    page: z.coerce.number().int().min(1).max(1000).default(1),
    limit: z.coerce.number().int().min(1).max(60).default(12),
    search: z.string().trim().max(100).optional().or(z.literal("")),
    category: z.string().trim().max(80).optional().or(z.literal("")),
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
        if (search) filter.$text = { $search: search };

        const skip = (page - 1) * limit;
        const sortObj =
            sort === "name" ? { name: order === "asc" ? 1 : -1 } :
            sort === "rating" ? { rating: order === "asc" ? 1 : -1 } :
            sort === "createdAt" ? { createdAt: order === "asc" ? 1 : -1 } : { price: order === "asc" ? 1 : -1 };

        const [items, total] = await Promise.all([
            Product.find(filter)
            .select("sku name price images category rating")
            .sort(sortObj)
            .collation({ locale: "es", strength: 2 })
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
        const p = await Product.findOne({ sku: req.params.sku }).lean();
        if (!p) return res.status(404).json({ message: "Producto no encontrado" });
        res.json(p);
    })
);

export default router;