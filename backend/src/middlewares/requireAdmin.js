// backend/src/middlewares/requireAdmin.js
export function requireAdmin(req, res, next) {
    // Lee el token en tiempo de petición
    const token = process.env.ADMIN_TOKEN;

    if (!token) {
        return res.status(503).json({ message: "ADMIN_TOKEN no configurado en el servidor" });
    }

    const header = req.header("x-admin-token");
    if (header !== token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    return next();
}