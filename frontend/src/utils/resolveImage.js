// frontend/src/utils/resolveImage.js

function apiOriginFromEnv() {
    const raw =
        import.meta.env.VITE_API_URL || "http://localhost:4000";
    // sin slash final
    let base = raw.replace(/\/+$/, "");
    // si termina en /api, se lo quitamos para construir URLs de /public/...
    if (base.endsWith("/api")) base = base.slice(0, -4);
    return base;
}

const API_ORIGIN = apiOriginFromEnv();

/**
 * Devuelve una URL completa y válida para una imagen.
 * Acepta:
 *  - URLs absolutas (http/https)
 *  - rutas que empiecen por /public/...
 *  - 'public/...', 'productos/...', 'uploads/...', 'images/...'
 *  - cualquier otra cosa la devuelve tal cual (el fallback cubrirá si 404)
 */
export function resolveImage(src) {
    if (!src || typeof src !== "string") return null;

    // Ya es absoluta
    if (/^https?:\/\//i.test(src)) return src;

    let path = src.trim();

    // 'public/...' -> '/public/...'
    if (/^public\//i.test(path)) path = `/${path}`;

    // 'productos/...', 'uploads/...', 'images/...' -> '/public/...'
    if (/^(productos|uploads|images)\//i.test(path)) path = `/public/${path}`;

    // Si empieza por /public/... la servimos desde el backend
    if (/^\/public\//.test(path)) {
        return `${API_ORIGIN}${path}`;
    }

    // Cualquier otra ruta se deja igual (relativa al front)
    return path;
}

export function fallbackImage(sku, w = 800, h = 600) {
    const seed = encodeURIComponent(sku || "product");
    return `https://picsum.photos/seed/${seed}/${w}/${h}`;
}