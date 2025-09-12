import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ carpeta final correcta: backend/public/productos
const DEST = path.resolve(__dirname, "../../public/productos");
fs.mkdirSync(DEST, { recursive: true });

// helper: convierte /public/... en ruta absoluta dentro de backend/public
export const toAbsFromPublic = (publicPath) => {
    if (!publicPath || !publicPath.startsWith("/public/")) return null;
    // desde src/middlewares → subimos 2 niveles hasta backend/ y pegamos "public/..."
    return path.resolve(__dirname, "../../", publicPath.replace(/^\/+/, ""));
};

const storage = multer.diskStorage({
    destination(_req, _file, cb) {
        cb(null, DEST);
    },
    filename(req, file, cb) {
        // mimetype → extensión
        const extMap = {
            "image/jpeg": ".jpg",
            "image/jpg": ".jpg",
            "image/png": ".png",
            "image/webp": ".webp",
            "image/gif": ".gif",
        };
        const ext = extMap[file.mimetype] || path.extname(file.originalname) || ".jpg";

        // usar SKU si viene en body o params
        const rawSku = (
            (req.body && req.body.sku) ||
            (req.params && req.params.sku) ||
            ""
        ).toString().trim();

        const safeSku = rawSku ?
            rawSku.toLowerCase().replace(/[^a-z0-9_-]/g, "-") :
            Date.now().toString(36);

        const filename = `${safeSku}${ext}`;
        // guardamos el nombre para construir la URL pública en la ruta
        req.savedImageFilename = filename;
        cb(null, filename);
    },
});

const fileFilter = (_req, file, cb) => {
    // acepta jpg, png, webp, gif
    if (/^image\/(jpe?g|png|webp|gif)$/i.test(file.mimetype)) return cb(null, true);
    return cb(new Error("Formato de imagen no permitido"), false);
};

export const uploadImage = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});