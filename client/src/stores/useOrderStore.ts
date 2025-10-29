import { create } from "zustand";
import { orderStore, ordersData } from "../types/orders";

export const useOrderStore = create<orderStore>((set) => ({
  ordersData: { orderItems: [], total: 0 },
  setOrdersData: (data) =>
    set((state) => ({
      ordersData: { ...state.ordersData, ...data },
    })),
  clearOrdersData: () => set({ ordersData: { orderItems: [], total: 0 } }),
}));
