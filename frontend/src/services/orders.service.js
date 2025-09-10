// frontend/src/services/orders.service.js
const API =
    import.meta.env.VITE_API_URL || "http://localhost:4000/api";

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