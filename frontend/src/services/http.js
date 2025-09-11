// frontend/src/services/http.js
import axios from "axios";

const API_ORIGIN = (
    import.meta.env.VITE_API_URL || "http://localhost:4000").replace(/\/$/, "");

export const http = axios.create({
    baseURL: `${API_ORIGIN}/api`, // 👈 prefijo /api aquí
    headers: { "Content-Type": "application/json" },
});