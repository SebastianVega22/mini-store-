// backend/src/schemas/product.schema.js
import { z } from "zod";

/* Helpers */
const stringArray = (max = 20) =>
    z.preprocess((v) => {
        if (Array.isArray(v)) return v;
        if (typeof v === "string") {
            return v
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean);
        }
        return [];
    }, z.array(z.string().trim().min(1)).max(max));

const numberCoerce = (schema) =>
    z.preprocess((v) => {
        if (typeof v === "number") return v;
        const n = Number(v);
        return Number.isFinite(n) ? n : v;
    }, schema);

/**
 * SKU:
 * - Se normaliza a MAYÚSCULAS (acepta que venga en minúsculas)
 * - Valida un patrón flexible: SKU- + 1 a 10 dígitos (ajústalo si quieres más/menos).
 *   Ej: sku-1, sku-099, SKU-1234567890
 */
const SkuSchema = z.preprocess((v) => {
    if (typeof v !== "string") return v;
    return v.trim().toUpperCase();
}, z.string().regex(/^SKU-\d{1,10}$/, "SKU debe tener el formato SKU-<dígitos>"));

export const ProductCreateSchema = z.object({
    sku: SkuSchema,
    name: z.string().trim().min(3).max(120),
    description: z.string().trim().max(2000).optional().or(z.literal("")),
    // acepta enteros o decimales
    price: numberCoerce(z.number().min(0).max(10000000)),
    images: stringArray(10).default([]),
    // 🔧 AHORA opcional o vacío (para que no falle cuando el front envía "")
    category: z.string().trim().max(60).optional().or(z.literal("")),
    rating: numberCoerce(z.number().min(0).max(5)).default(0),
    stock: numberCoerce(z.number().int().min(0).max(100000)).default(0),
    tags: stringArray(20).default([]),
});

export const ProductUpdateSchema = ProductCreateSchema.omit({ sku: true }).partial();