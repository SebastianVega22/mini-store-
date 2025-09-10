import { z } from "zod";

export const OrderItemZ = z.object({
    sku: z.string().min(1),
    name: z.string().min(1),
    price: z.number().positive(),
    qty: z.number().int().min(1),
    image: z.string().optional().nullable(),
});

export const ShippingZ = z.object({
    fullName: z.string().min(3, "Nombre muy corto"),
    email: z.string().email("Email inválido"),
    phone: z.string().min(7).max(20),
    address: z.string().min(5),
    city: z.string().min(2),
});

export const OrderZ = z.object({
    items: z.array(OrderItemZ).min(1, "Carrito vacío"),
    shipping: ShippingZ,
});

export function parseOrder(body) {
    return OrderZ.parse(body);
}