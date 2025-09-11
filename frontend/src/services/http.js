// frontend/src/services/http.js
import axios from "axios";

// VITE_API_URL = http://localhost:4000  (sin /api)
const base = (
        import.meta.env.VITE_API_URL || "http://localhost:4000")
    .replace(/\/+$/g, ""); // sin barra al final

export const http = axios.create({
    baseURL: `${base}/api`, // <-- forzamos /api aquí
    withCredentials: false,
    headers: {
        "Content-Type": "application/json",
    },
});