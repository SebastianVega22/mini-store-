// backend/src/app.js
import "./config/env.js";
import express from "express";
import cors from "cors";
import helmet from "helmet";

import productsRoutes from "./routes/products.routes.js";
import ordersRoutes from "./routes/orders.routes.js";
import { connectDB } from "./config/db.js";

const app = express();

// Middlewares
app.use(helmet());
app.use(
    cors({
        origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    })
);
app.use(express.json());

// Healthcheck
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// Rutas
app.use("/api/products", productsRoutes);
app.use("/api/orders", ordersRoutes);

// Manejador de errores (incluye Zod)
app.use((err, _req, res, _next) => {
    if (err && err.name === "ZodError") {
        return res.status(400).json({
            message: "Validación fallida",
            issues: err.issues,
        });
    }
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
});


const PORT = process.env.PORT || 4000;

async function start() {
    await connectDB(); // Asegura conexión antes de escuchar
    app.listen(PORT, () => {
        console.log(`API on http://localhost:${PORT}`);
    });
}

start();

export default app;