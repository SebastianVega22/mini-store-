// frontend/src/store/cart.store.js
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// --- Selectores (igual que antes) ---
export const selectList = (s) => Object.values(s.items);
export const selectCount = (s) => selectList(s).reduce((a, i) => a + i.qty, 0);
export const selectTotal = (s) =>
    selectList(s).reduce((a, i) => a + i.qty * i.price, 0);

// --- Store (igual que antes) ---
export const useCartStore = create(
    persist(
        (set, get) => ({
            items: {},

            add: (p, qty = 1) =>
                set((state) => {
                    const prev =
                        state.items[p.sku] || {
                            sku: p.sku,
                            name: p.name,
                            price: p.price,
                            image: (p.images && p.images[0]) || p.image || null,
                            qty: 0,
                        };
                    const newQty = Math.max(1, prev.qty + qty);
                    return {
                        items: {
                            ...state.items,
                            [p.sku]: {...prev, qty: newQty },
                        },
                    };
                }),

            setQty: (sku, qty) =>
                set((state) => {
                    if (!state.items[sku]) return {};
                    if (qty <= 0) {
                        const copy = {...state.items };
                        delete copy[sku];
                        return { items: copy };
                    }
                    return {
                        items: {
                            ...state.items,
                            [sku]: {...state.items[sku], qty },
                        },
                    };
                }),

            remove: (sku) =>
                set((state) => {
                    const copy = {...state.items };
                    delete copy[sku];
                    return { items: copy };
                }),

            clear: () => set({ items: {} }),
        }), {
            name: "ministore-cart-v1", // mismo nombre de storage
            storage: createJSONStorage(() => localStorage),
            version: 1,
        }
    )
);