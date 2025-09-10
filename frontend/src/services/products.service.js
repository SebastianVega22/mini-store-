import { http } from "./http";

export async function listProducts(params) {
    const { data } = await http.get("/products", { params });
    return data; // { items, total, page, pageSize }
}

export async function getProductBySku(sku) {
    const { data } = await http.get(`/products/${sku}`);
    return data;
}