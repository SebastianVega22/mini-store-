import { http } from "./http";
export async function listProducts(params = {}) {
    const { data } = await http.get("/products", { params });
    return data; // { items, page, total, pageSize }
}