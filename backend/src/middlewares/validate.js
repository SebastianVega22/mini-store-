import { AppError } from "./error.js";

/* Aplica un schema de Zod sobre req[source] */
export const validate =
    (schema, source = "query") =>
    (req, _res, next) => {
        const parsed = schema.safeParse(req[source]);
        if (!parsed.success) {
            const e = new AppError(400, "Validación fallida", { issues: parsed.error.issues });
            e.name = "ZodError";
            e.issues = parsed.error.issues;
            return next(e);
        }
        req[source] = parsed.data;
        next();
    };