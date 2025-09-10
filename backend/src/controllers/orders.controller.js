const svc = require('../services/orders.service');

async function create(req, res, next) {
  try {
    const result = await svc.create(req.body || {});
    res.status(201).json(result);
  } catch (e) {
    next(e);
  }
}

module.exports = { create };
