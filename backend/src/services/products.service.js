import Product from '../models/Product.js';

export async function list({
    page = 1,
    limit = 12,
    search,
    category,
    sort = 'price',
    order = 'asc',
}) {
    const q = {};
    if (search) q.name = { $regex: search, $options: 'i' };
    if (category && category !== 'Todos') q.category = category;

    const sortSpec = {
        [sort]: order === 'desc' ? -1 : 1 };

    const [items, total] = await Promise.all([
        Product.find(q)
        .sort(sortSpec)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
        Product.countDocuments(q),
    ]);

    return { items, total, page, pageSize: limit };
}

export async function getBySku(sku) {
    return Product.findOne({ sku }).lean();
}