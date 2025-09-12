// backend/src/config/env.js
import dotenv from "dotenv";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);

// backend/ (raíz del backend)
const backendRoot = path.resolve(__dirname, "../../");
const rootEnv = path.join(backendRoot, ".env");

// backend/src/.env (fallback)
const srcEnv = path.resolve(__dirname, "../.env");

// Elegimos el que exista
const envPath = fs.existsSync(rootEnv) ? rootEnv : srcEnv;

dotenv.config({ path: envPath });

if (!process.env.ADMIN_TOKEN) {
    console.warn(`[env] ADMIN_TOKEN no cargado (path usado: ${envPath})`);
} else {
    console.log(`[env] ADMIN_TOKEN cargado desde: ${envPath}`);
}