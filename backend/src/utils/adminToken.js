// frontend/src/utils/adminToken.js
export function getAdminToken() {
    try {
        const local = localStorage.getItem("adminToken");
        if (local && local.trim()) return local.trim();
    } catch (_) { /* safari private mode, etc. */ }

    // fallback a .env
    const env =
        import.meta.env.VITE_ADMIN_TOKEN;
    return (env && String(env).trim()) || "";
}

export function setAdminToken(token) {
    try { localStorage.setItem("adminToken", token || ""); } catch (_) {}
}

export function clearAdminToken() {
    try { localStorage.removeItem("adminToken"); } catch (_) {}
}