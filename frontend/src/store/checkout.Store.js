import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useCheckoutStore = create(
    persist(
        (set) => ({
            step: "shipping", // "shipping" | "review" | "success"
            shipping: {
                fullName: "",
                email: "",
                phone: "",
                address: "",
                city: "",
            },

            setShipping: (patch) =>
                set((state) => ({ shipping: {...state.shipping, ...patch } })),

            setStep: (step) => set({ step }),

            reset: () =>
                set({
                    step: "shipping",
                    shipping: {
                        fullName: "",
                        email: "",
                        phone: "",
                        address: "",
                        city: "",
                    },
                }),
        }), {
            name: "ms-checkout",
            storage: createJSONStorage(() => localStorage),
            version: 1,
        }
    )
);