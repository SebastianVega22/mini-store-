const Order = require('../models/Order.model');

function genCode() {
  const now = new Date();
  return `ORD-${now.getFullYear()}-${now.getTime().toString().slice(-5)}`;
}

async function create({ items, shipping }) {
  const subtotal = (items || []).reduce((acc, it) => acc + Number(it.price) * Number(it.qty), 0);
  const discount = 0,
    taxes = 0,
    total = subtotal - discount + taxes;
  const order = await Order.create({
    code: genCode(),
    items,
    subtotal,
    discount,
    taxes,
    total,
    shipping
  });
  return { orderId: String(order._id), code: order.code, total };
}

module.exports = { create };
