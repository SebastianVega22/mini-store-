// frontend/src/utils/resolveImage.js
export function resolveImage(src) {
    // Fallback bonito si no hay imagen
    const FALLBACK = "https://picsum.photos/seed/prod/800/600";

    if (!src) return FALLBACK;

    // Si ya es absoluta, úsala tal cual
    if (/^https?:\/\//i.test(src)) return src;

    // Prefija con el host del backend
    const base = (
        import.meta.env.VITE_API_URL || "http://localhost:4000").replace(/\/$/, "");
    const path = String(src).replace(/^\//, ""); // sin doble slash

    return `${base}/${path}`;
}