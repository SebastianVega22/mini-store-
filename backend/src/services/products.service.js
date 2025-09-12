// backend/src/services/product.service.js
import Product from "../models/Product.js";

/**
 * Listado público (catálogo). Mantengo tu comportamiento original.
 */
export async function list({
    page = 1,
    limit = 12,
    search,
    category,
    sort = "price",
    order = "asc",
}) {
    const q = {};
    if (search) q.name = { $regex: search, $options: "i" };
    if (category && category !== "Todos") q.category = category;

    const sortSpec = {
        [sort]: order === "desc" ? -1 : 1
    };

    const [items, total] = await Promise.all([
        Product.find(q)
        .sort(sortSpec)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
        Product.countDocuments(q),
    ]);

    return { items, total, page, pageSize: limit };
}

/**
 * Obtener producto por SKU (público y admin)
 */
export async function getProductBySku(sku) {
    return Product.findOne({ sku }).lean();
}

/* ─────────────────────────────────────────────────────────────
   NUEVO: Servicios para Admin CRUD
   (sin tocar lo que ya usaba el catálogo)
   ───────────────────────────────────────────────────────────── */

/**
 * Lista para Admin. Reusa la lógica de list con otros defaults opcionales.
 */
export async function listProductsAdmin(params = {}) {
    const page = Number(params.page || 1);
    const limit = Number(params.limit || 20);
    const search = params.search || "";
    const category = params.category || "";
    const sort = params.sort || "createdAt";
    const order = params.order || "desc";

    return list({ page, limit, search, category, sort, order });
}

/**
 * Crear producto (lanza error de duplicado SKU si aplica)
 */
export async function createProduct(data) {
    const doc = new Product(data);
    return doc.save();
}

/**
 * Actualizar producto por SKU (admin)
 */
export async function updateProductBySku(sku, data) {
    const updated = await Product.findOneAndUpdate({ sku }, data, {
        new: true,
        runValidators: true,
    }).lean();
    return updated;
}

/**
 * Eliminar producto por SKU (admin)
 */
export async function deleteProductBySku(sku) {
    const res = await Product.deleteOne({ sku });
    return res.deletedCount > 0;
}