import * as svc from '../services/products.service.js';

export async function list(req, res, next) {
    try {
        const page = Number(req.query.page || 1);
        const limit = Number(req.query.limit || 12);
        const search = req.query.search || undefined;
        const category = req.query.category || undefined;
        const sort = req.query.sort || 'price';
        const order = req.query.order || 'asc';

        const data = await svc.list({ page, limit, search, category, sort, order });
        res.json(data);
    } catch (e) {
        next(e);
    }
}

export async function getBySku(req, res, next) {
    try {
        const sku = req.params.sku;
        const product = await svc.getBySku(sku);
        if (!product) return res.status(404).json({ message: 'Not found' });
        res.json(product);
    } catch (e) {
        next(e);
    }
}