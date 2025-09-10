export function makeOrderCode() {
    const y = new Date().getFullYear();
    const n = Math.floor(Math.random() * 90000) + 10000; // 5 dígitos
    return `ORD-${y}-${n}`;
}