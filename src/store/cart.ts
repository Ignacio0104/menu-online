import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  key: string;
  name: string;
  variant?: string;
  options?: string;
  price: number;
  qty: number;
};

type CartState = {
  items: CartItem[];
  open: boolean;
  add: (item: Omit<CartItem, "qty">) => void;
  setQty: (key: string, qty: number) => void;
  clear: () => void;
  setOpen: (open: boolean) => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      open: false,
      add: (item) =>
        set((s) => {
          const found = s.items.find((i) => i.key === item.key);
          return {
            items: found
              ? s.items.map((i) =>
                  i.key === item.key ? { ...i, qty: i.qty + 1 } : i,
                )
              : [...s.items, { ...item, qty: 1 }],
          };
        }),
      setQty: (key, qty) =>
        set((s) => ({
          items:
            qty <= 0
              ? s.items.filter((i) => i.key !== key)
              : s.items.map((i) => (i.key === key ? { ...i, qty } : i)),
        })),
      clear: () => set({ items: [] }),
      setOpen: (open) => set({ open }),
    }),
    { name: "playmila-cart", partialize: (s) => ({ items: s.items }) },
  ),
);

export const selectTotal = (s: CartState) =>
  s.items.reduce((t, i) => t + i.price * i.qty, 0);
export const selectCount = (s: CartState) =>
  s.items.reduce((t, i) => t + i.qty, 0);
