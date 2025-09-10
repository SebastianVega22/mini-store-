const Product = require('../models/Product.model');

async function list({ search, category, sort = 'name', order = 'asc', page = 1, limit = 12 }) {
  const query = {};
  if (search) query.name = { $regex: search, $options: 'i' };
  if (category) query.category = category;

  const sortObj = {};
  sortObj[sort] = order === 'desc' ? -1 : 1;
  const skip = (Number(page) - 1) * Number(limit);

  const [items, total] = await Promise.all([
    Product.find(query).sort(sortObj).skip(skip).limit(Number(limit)),
    Product.countDocuments(query)
  ]);

  return { items, page: Number(page), total, pageSize: Number(limit) };
}

async function getBySku(sku) {
  return Product.findOne({ sku });
}

module.exports = { list, getBySku };
