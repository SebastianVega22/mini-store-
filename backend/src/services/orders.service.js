import Order from "../models/Order.js";
import { parseOrder } from "../schemas/order.schema.js";
import { makeOrderCode } from "../utils/code.js";

export async function create(body) {
    // 1) Validación con Zod
    const data = parseOrder(body);

    // 2) Cálculos
    //    Usa TAX_RATE (ej 0.19) o 0 si no está definido / es inválido
    let taxRate = Number(process.env.TAX_RATE || 0);

    if (Number.isNaN(taxRate)) taxRate = 0;

    const subtotal = data.items.reduce((a, i) => a + i.price * i.qty, 0);
    const discount = 0; // aquí puedes aplicar cupones si quieres
    const taxes = Math.round(subtotal * taxRate * 100) / 100;
    const total = Math.round((subtotal + taxes - discount) * 100) / 100;

    // 3) code único
    let code, tries = 0;
    do {
        code = makeOrderCode();
        // eslint-disable-next-line no-await-in-loop
        const exists = await Order.exists({ code });
        if (!exists) break;
        tries += 1;
    } while (tries < 5);
    if (tries >= 5) throw new Error("No se pudo generar code único");

    // 4) Persistir
    const order = await Order.create({
        code,
        items: data.items,
        shipping: data.shipping,
        subtotal,
        discount,
        taxes,
        total,
    });

    // 5) Respuesta para el front
    return { orderId: order._id, code: order.code, total: order.total };
}