// frontend/src/services/http.js
import axios from "axios";

const baseURL =
    import.meta.env.VITE_API_URL || "/api"; // fallback a /api por si usas proxy de Vite
export const http = axios.create({
    baseURL,
    timeout: 12000,
});