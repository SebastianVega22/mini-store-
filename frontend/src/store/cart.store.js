// frontend/src/store/cart.store.js
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Selectores
export const selectList = (s) => Object.values(s.items);
export const selectCount = (s) => selectList(s).reduce((a, i) => a + i.qty, 0);
export const selectTotal = (s) => selectList(s).reduce((a, i) => a + i.qty * i.price, 0);

// Store
export const useCartStore = create(
    persist(
        (set, get) => ({
            items: {},

            // Agregar (sin optional chaining; defensivo)
            add: (p, qty = 1) =>
                set((state) => {
                    if (!p || !p.sku) return {};

                    const curr = state.items[p.sku] ? state.items[p.sku] : {};
                    const prevQty = Number(curr.qty) || 0;
                    const inc = Math.max(1, Math.floor(Number(qty) || 1));
                    const nextQty = prevQty + inc;

                    let image = null;
                    if (p && p.images && Array.isArray(p.images) && p.images.length > 0) {
                        image = p.images[0];
                    } else if (p && typeof p.image === "string") {
                        image = p.image;
                    }

                    return {
                        items: {
                            ...state.items,
                            [p.sku]: {
                                sku: p.sku,
                                name: p.name,
                                price: p.price,
                                image: image,
                                qty: nextQty,
                            },
                        },
                    };
                }),

            // Cambiar cantidad
            setQty: (sku, qty) =>
                set((state) => {
                    const item = state.items[sku];
                    if (!item) return {};
                    const q = Math.max(1, Math.floor(Number(qty) || 1));
                    return { items: {...state.items, [sku]: {...item, qty: q } } };
                }),

            // Quitar
            remove: (sku) =>
                set((state) => {
                    if (!state.items[sku]) return {};
                    const copy = {...state.items };
                    delete copy[sku];
                    return { items: copy };
                }),

            // Vaciar
            clear: () => set({ items: {} }),
        }), {
            name: "ministore-cart-v2", // cambia el nombre si quieres forzar reset
            storage: createJSONStorage(() => localStorage),
            version: 2,
        }
    )
);