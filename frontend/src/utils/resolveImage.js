export function resolveImage(p, size = "800x600") {
    const first = p ? .images ? .[0];
    if (!first) return `https://picsum.photos/seed/${encodeURIComponent(p?.sku || "product")}/${size}`;
    if (first.startsWith("http")) return first;
    // Si es relativo (ej. "/img/x200-1.jpg"), lo dejamos como está:
    return first;
}

export function fallbackImage(p, size = "800x600") {
    return `https://picsum.photos/seed/${encodeURIComponent(p?.sku || "product")}/${size}`;
}