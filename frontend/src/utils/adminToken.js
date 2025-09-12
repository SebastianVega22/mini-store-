// frontend/src/utils/adminToken.js
export const ADMIN_TOKEN_KEY = "ms_admin_token";

export function getAdminToken() {
    try {
        return localStorage.getItem(ADMIN_TOKEN_KEY) || "";
    } catch {
        return "";
    }
}

export function setAdminToken(token) {
    try {
        localStorage.setItem(ADMIN_TOKEN_KEY, token);
    } catch {}
}

export function clearAdminToken() {
    try {
        localStorage.removeItem(ADMIN_TOKEN_KEY);
    } catch {}
}