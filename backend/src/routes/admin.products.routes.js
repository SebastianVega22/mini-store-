// backend/src/routes/admin.products.routes.js
import { Router } from "express";
import { z } from "zod";
import multer from "multer"; // solo para CSV en memoria
import { parse } from "csv-parse/sync";
import fs from "node:fs";

import { requireAdmin } from "../middlewares/requireAdmin.js";
import { uploadImage, toAbsFromPublic } from "../middlewares/uploadImage.js";
import { asyncHandler } from "../utils/asyncHandler.js";

import {
    ProductCreateSchema,
    ProductUpdateSchema,
} from "../schemas/product.schema.js";

import {
    listProductsAdmin,
    createProduct,
    updateProductBySku,
    deleteProductBySku,
    getProductBySku,
} from "../services/products.service.js";

import Product from "../models/Product.js";

const router = Router();

/* ─────────────────────────────────────────────────────
 * Carga de CSV en memoria (solo CSV)
 * ──────────────────────────────────────────────────── */
const uploadCsv = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
});

/* ─────────────────────────────────────────────────────
 * Listado admin con filtros
 * ──────────────────────────────────────────────────── */
const listQuerySchema = z.object({
    page: z
        .preprocess((v) => Number(v) || 1, z.number().int().min(1).max(1000))
        .default(1),
    limit: z
        .preprocess((v) => Number(v) || 20, z.number().int().min(1).max(100))
        .default(20),
    search: z.string().trim().max(100).optional().or(z.literal("")).default(""),
    category: z
        .string()
        .trim()
        .max(80)
        .optional()
        .or(z.literal(""))
        .default(""),
});

/** GET /api/admin/products */
router.get(
    "/",
    requireAdmin,
    asyncHandler(async(req, res) => {
        const parseQuery = listQuerySchema.parse(req.query);
        const data = await listProductsAdmin(parseQuery);
        res.json(data);
    })
);

/** GET /api/admin/products/:sku */
router.get(
    "/:sku",
    requireAdmin,
    asyncHandler(async(req, res) => {
        const p = await getProductBySku(req.params.sku);
        if (!p) return res.status(404).json({ message: "Producto no encontrado" });
        res.json(p);
    })
);

/** POST /api/admin/products
 *  Crea producto con imagen nombrada como <sku>.<ext>
 */
router.post(
    "/",
    requireAdmin,
    uploadImage.single("image"),
    asyncHandler(async(req, res) => {
        try {
            const body = {...req.body };

            // Normaliza números (vienen como string en multipart)
            if (body.price != null) body.price = Number(body.price);
            if (body.rating != null) body.rating = Number(body.rating);
            if (body.stock != null) body.stock = Number(body.stock);

            // Si subieron imagen, guardar la URL pública
            if (req.file && req.savedImageFilename) {
                body.images = ["/public/productos/" + req.savedImageFilename];
            }

            const parsed = await ProductCreateSchema.parseAsync(body);
            const created = await createProduct(parsed);
            res.status(201).json(created);
        } catch (err) {
            if (err && err.name === "ZodError") {
                return res
                    .status(400)
                    .json({ message: "Validación fallida", issues: err.issues });
            }
            if (err && err.code === 11000 && err.keyPattern && err.keyPattern.sku) {
                return res.status(409).json({ message: "SKU ya existe" });
            }
            throw err;
        }
    })
);

/** PUT /api/admin/products/:sku
 *  Si subes nueva imagen, la guarda como <sku>.<ext> y elimina la anterior si cambió.
 */
router.put(
    "/:sku",
    requireAdmin,
    uploadImage.single("image"),
    asyncHandler(async(req, res) => {
        try {
            const sku = req.params.sku;
            const body = {...req.body };

            if (body.price != null) body.price = Number(body.price);
            if (body.rating != null) body.rating = Number(body.rating);
            if (body.stock != null) body.stock = Number(body.stock);

            let newPublicPath = null;
            if (req.file && req.savedImageFilename) {
                newPublicPath = "/public/productos/" + req.savedImageFilename;
                body.images = [newPublicPath];
            }

            // Si hay imagen nueva, borra la anterior si es distinta
            if (newPublicPath) {
                const current = await getProductBySku(sku);

                let oldPublic = null;
                if (current && current.images && current.images.length > 0) {
                    oldPublic = current.images[0];
                }

                if (oldPublic && oldPublic !== newPublicPath) {
                    const abs = toAbsFromPublic(oldPublic);
                    if (abs) {
                        fs.promises.unlink(abs).catch(() => {});
                    }
                }
            }

            const parsed = await ProductUpdateSchema.parseAsync(body);
            const updated = await updateProductBySku(sku, parsed);
            if (!updated) {
                return res.status(404).json({ message: "Producto no encontrado" });
            }
            res.json(updated);
        } catch (err) {
            if (err && err.name === "ZodError") {
                return res
                    .status(400)
                    .json({ message: "Validación fallida", issues: err.issues });
            }
            throw err;
        }
    })
);

/** DELETE /api/admin/products/:sku */
router.delete(
    "/:sku",
    requireAdmin,
    asyncHandler(async(req, res) => {
        const ok = await deleteProductBySku(req.params.sku);
        if (!ok) return res.status(404).json({ message: "Producto no encontrado" });
        res.status(204).end();
    })
);

/* ─────────────────────────────────────────────────────
 * CARGA MASIVA (CSV)
 * ──────────────────────────────────────────────────── */
router.get(
    "/bulk/template",
    requireAdmin,
    asyncHandler(async(_req, res) => {
        const csv =
            "sku,name,description,price,image,category,rating,stock,tags\n" +
            'SKU-001,Producto demo,Descripción de ejemplo,89.9,/public/productos/sku-001.jpg,Periféricos,4.5,10,"gamer, rgb"\n';
        res.setHeader(
            "Content-Disposition",
            'attachment; filename="products-template.csv"'
        );
        res.type("text/csv").send(csv);
    })
);

const rowSchema = z.object({
    sku: z.string().min(1),
    name: z.string().min(1),
    description: z.string().optional().or(z.literal("")),
    price: z.preprocess((v) => Number(v), z.number().nonnegative()),
    image: z.string().optional().or(z.literal("")),
    category: z.string().optional().or(z.literal("")),
    rating: z
        .preprocess((v) => (v === "" || v == null ? 0 : Number(v)), z.number().min(0).max(5))
        .optional(),
    stock: z
        .preprocess((v) => (v === "" || v == null ? 0 : Number(v)), z.number().int().nonnegative())
        .optional(),
    tags: z.string().optional().or(z.literal("")),
});

router.post(
    "/bulk",
    requireAdmin,
    uploadCsv.single("file"),
    asyncHandler(async(req, res) => {
        if (!req.file || !req.file.buffer) {
            return res
                .status(400)
                .json({ message: "Archivo CSV requerido (campo 'file')." });
        }

        const text = req.file.buffer.toString("utf8");
        const records = parse(text, {
            columns: true,
            skip_empty_lines: true,
            trim: true,
        });

        let inserted = 0;
        let updated = 0;
        const errors = [];

        for (let i = 0; i < records.length; i++) {
            try {
                const r = rowSchema.parse(records[i]);
                const doc = {
                    sku: r.sku,
                    name: r.name,
                    description: r.description || "",
                    price: Number(r.price) || 0,
                    images: r.image ? [String(r.image)] : [],
                    category: r.category || "",
                    rating: Number(r.rating || 0),
                    stock: Number(r.stock || 0),
                    tags: r.tags ?
                        String(r.tags)
                        .split(",")
                        .map((t) => t.trim())
                        .filter(Boolean) : [],
                };

                const out = await Product.updateOne({ sku: doc.sku }, { $set: doc }, { upsert: true });
                if (out.upsertedCount) inserted++;
                else if (out.modifiedCount) updated++;
            } catch (e) {
                errors.push({
                    row: i + 2,
                    message:
                        (e && e.issues && e.issues[0] && e.issues[0].message) ||
                        e.message ||
                        "Validación fallida",
                });
            }
        }

        res.json({ inserted, updated, errorsCount: errors.length, errors });
    })
);

export default router;