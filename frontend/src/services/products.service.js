// Normaliza para que haya exactamente un /api en la base
function normalizeApiBase(raw) {
    const base = (raw || "http://localhost:4000").replace(/\/+$/, ""); // sin slash final
    return base.endsWith("/api") ? base : `${base}/api`;
}

const API = normalizeApiBase(
    import.meta.env.VITE_API_URL);

/** Lista pública de productos */
export async function listProducts(params = {}) {
    const qs = new URLSearchParams();
    if (params.page != null) qs.set("page", params.page);
    if (params.limit != null) qs.set("limit", params.limit);
    if (params.search) qs.set("search", params.search);
    if (params.category) qs.set("category", params.category);
    if (params.sort) qs.set("sort", params.sort);
    if (params.order) qs.set("order", params.order);

    const url = `${API}/products?${qs.toString()}`;
    const res = await fetch(url);
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Error al listar productos");
    }
    return res.json();
}

/** Detalle por SKU */
export async function getProductBySku(sku) {
    const res = await fetch(`${API}/products/${encodeURIComponent(sku)}`);
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Producto no encontrado");
    }
    return res.json();
}