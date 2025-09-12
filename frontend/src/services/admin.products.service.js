// frontend/src/services/admin.products.service.js
import { getAdminToken } from "../utils/adminToken";

// Normalizamos base URL y forzamos /api
const API_ROOT = (
    import.meta.env.VITE_API_URL || "http://localhost:4000"
).replace(/\/+$/, "");
const BASE = `${API_ROOT}/api`;

/* ------------ headers + parse helpers ------------ */
function buildHeaders(isJson = true) {
    const token = getAdminToken() || "";
    const h = { "x-admin-token": token };
    if (isJson) h["Content-Type"] = "application/json";
    return h;
}

async function parse(res) {
    if (!res.ok) {
        let msg = "Error en la solicitud";
        try {
            const j = await res.json();
            msg = j.message || msg;
        } catch {}
        throw new Error(msg);
    }
    if (res.status === 204) return null;
    return res.json();
}

/* ====================
   Público (catálogo)
   ==================== */
export async function listProducts(params = {}) {
    const qs = new URLSearchParams();
    if (params.page != null) qs.set("page", params.page);
    if (params.limit != null) qs.set("limit", params.limit);
    if (params.search) qs.set("search", params.search);
    if (params.category) qs.set("category", params.category);
    if (params.sort) qs.set("sort", params.sort);
    if (params.order) qs.set("order", params.order);

    const url = `${BASE}/products${qs.toString() ? `?${qs}` : ""}`;
  const res = await fetch(url);
  return parse(res);
}

export async function getProductBySku(sku) {
  const res = await fetch(`${BASE}/products/${encodeURIComponent(sku)}`);
  return parse(res);
}

/* ====================
   Admin (CRUD + Bulk)
   ==================== */
export async function adminList(params = {}) {
  const qs = new URLSearchParams(params).toString();
  const url = `${BASE}/admin/products${qs ? `?${qs}` : ""}`;
  const res = await fetch(url, { headers: buildHeaders(false) });
  return parse(res);
}

export async function adminGetOne(sku) {
  const res = await fetch(`${BASE}/admin/products/${encodeURIComponent(sku)}`, {
    headers: buildHeaders(false),
  });
  return parse(res);
}

export async function adminCreate(data) {
  // Soporta FormData (con archivo) y JSON
  if (data instanceof FormData) {
    const res = await fetch(`${BASE}/admin/products`, {
      method: "POST",
      headers: buildHeaders(false), // NO content-type con FormData
      body: data,
    });
    return parse(res);
  }
  const res = await fetch(`${BASE}/admin/products`, {
    method: "POST",
    headers: buildHeaders(true),
    body: JSON.stringify(data),
  });
  return parse(res);
}

export async function adminUpdate(sku, data) {
  // 👇 Soporta FormData (cuando editas con nueva imagen)
  if (data instanceof FormData) {
    const res = await fetch(`${BASE}/admin/products/${encodeURIComponent(sku)}`, {
      method: "PUT",
      headers: buildHeaders(false), // NO content-type con FormData
      body: data,
    });
    return parse(res);
  }
  const res = await fetch(`${BASE}/admin/products/${encodeURIComponent(sku)}`, {
    method: "PUT",
    headers: buildHeaders(true),
    body: JSON.stringify(data),
  });
  return parse(res);
}

export async function adminRemove(sku) {
  const res = await fetch(`${BASE}/admin/products/${encodeURIComponent(sku)}`, {
    method: "DELETE",
    headers: buildHeaders(false),
  });
  return parse(res);
}

/* ---------- Bulk ---------- */
export async function adminBulkTemplate() {
  const res = await fetch(`${BASE}/admin/products/bulk/template`, {
    method: "GET",
    headers: buildHeaders(false),
  });
  if (!res.ok) {
    let msg = "No se pudo descargar la plantilla";
    try {
      const j = await res.json();
      msg = j?.message || msg;
    } catch {}
    throw new Error(msg);
  }
  return res.blob();
}

export async function adminBulkUpload(file) {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch(`${BASE}/admin/products/bulk`, {
    method: "POST",
    headers: buildHeaders(false), // NO content-type con FormData
    body: fd,
  });
  return parse(res);
}