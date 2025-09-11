/* Error homogéneo y handler central */
export class AppError extends Error {
    constructor(status, message, extras = {}) {
        super(message);
        this.status = status;
        this.extras = extras;
    }
}

export function errorHandler(err, _req, res, _next) {
    // Zod
    if (err.name === "ZodError") {
        return res.status(400).json({
            message: "Validación fallida",
            issues: err.issues.map(i => ({
                path: i.path.join("."),
                message: i.message,
            })),
        });
    }

    // Mongoose
    if (err.name === "ValidationError") {
        return res.status(400).json({ message: "Validación de datos", details: err.message });
    }
    if (err.name === "CastError") {
        return res.status(400).json({ message: "Formato de parámetro inválido", details: err.message });
    }
    if (err.code === 11000) {
        return res.status(409).json({ message: "Duplicado", key: err.keyValue });
    }

    // AppError
    if (err instanceof AppError) {
        return res.status(err.status).json({ message: err.message, ...err.extras });
    }

    // Rate limit
    if (err.name === "RateLimitError") {
        return res.status(429).json({ message: "Demasiadas solicitudes" });
    }

    console.error("[UNHANDLED ERROR]", err);
    return res.status(500).json({ message: "Internal server error" });
}