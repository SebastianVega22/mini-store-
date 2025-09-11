// frontend/src/services/orders.service.js
// Normaliza la base para que siempre termine en /api (sin duplicarlo)
const RAW =
    import.meta.env.VITE_API_URL || "http://localhost:4000";
const BASE = RAW.replace(/\/+$/g, ""); // sin barra final
const API = /\/api$/i.test(BASE) ? BASE : `${BASE}/api`; // agrega /api si falta

export async function createOrder(payload) {
    const res = await fetch(`${API}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Error al crear la orden");
    }
    return res.json();
}