// backend/src/app.js
import "./config/env.js";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import path from "node:path";
import { fileURLToPath } from "node:url";

import productsRoutes from "./routes/products.routes.js";
import ordersRoutes from "./routes/orders.routes.js";
import { connectDB } from "./config/db.js";

const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);

// 👉 Ajusta si tu carpeta es distinta (p.ej. "publicproductos")
const PUBLIC_DIR = path.resolve(__dirname, "../public");

const app = express();

/* ── Seguridad (Helmet) ──────────────────────────────────────
   Permite servir recursos a otro origen (vite:5173 → api:4000) */
app.use(
    helmet({
        crossOriginResourcePolicy: { policy: "cross-origin" }, // 💥 clave para que no bloquee
        crossOriginOpenerPolicy: false,
        crossOriginEmbedderPolicy: false,
    })
);

/* ── CORS ──────────────────────────────────────────────────── */
const allowlist = (process.env.CORS_ORIGIN || "http://localhost:5173,http://127.0.0.1:5173")
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);

app.use(
    cors({
        origin(origin, cb) {
            if (!origin) return cb(null, true); // Postman/curl
            if (allowlist.includes(origin)) return cb(null, true);
            return cb(new Error(`Origin ${origin} no permitido por CORS`));
        },
        credentials: true,
    })
);

app.use(express.json());

/* ── Archivos estáticos (imágenes) ─────────────────────────── */
app.use("/public", express.static(PUBLIC_DIR));

/* ── Rutas API ─────────────────────────────────────────────── */
app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api/products", productsRoutes);
app.use("/api/orders", ordersRoutes);

/* ── Errores (Zod + CORS) ──────────────────────────────────── */
app.use((err, _req, res, _next) => {
    if (err.name === "ZodError") {
        return res.status(400).json({ message: "Validación fallida", issues: err.issues });
    }
    if (String(err.message || "").includes("CORS")) {
        return res.status(403).json({ message: err.message });
    }
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
});

const PORT = process.env.PORT || 4000;
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`API on http://localhost:${PORT}`);
        console.log(`Static dir: ${PUBLIC_DIR}`);
        console.log(`CORS allowlist: ${allowlist.join(", ")}`);
        console.log(`Ejemplo imagen: http://localhost:${PORT}/public/productos/sku-015.jpg`);
    });
});
export default app;