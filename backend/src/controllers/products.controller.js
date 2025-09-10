const svc = require('../services/products.service');

async function list(req, res, next) {
  try {
    const { search, category, sort, order, page, limit } = req.query;
    const data = await svc.list({ search, category, sort, order, page, limit });
    res.json(data);
  } catch (e) {
    next(e);
  }
}
async function getBySku(req, res, next) {
  try {
    const product = await svc.getBySku(req.params.sku);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (e) {
    next(e);
  }
}

module.exports = { list, getBySku };
