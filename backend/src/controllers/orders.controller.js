import * as svc from "../services/orders.service.js";

export async function create(req, res, next) {
    try {
        const result = await svc.create(req.body || {});
        res.status(201).json(result);
    } catch (e) {
        next(e);
    }
}