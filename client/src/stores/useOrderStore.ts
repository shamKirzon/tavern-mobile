import { create } from "zustand";
import { orderStore, ordersData } from "../types/orders";

export const useOrderStore = create<orderStore>((set) => ({
  orders: { orderItems: [], total: 0 },

  addOrders: (data) =>
    set((state) => ({
      orders: { ...state.orders, ...data },
    })),

  removeOrders: (name) =>
    set((state) => ({
      orders: {
        ...state.orders,
        orderItems: state.orders.orderItems.filter((o) => o.orderName !== name),
      },
    })),

  updateOrders: (name, updatedData) =>
    set((state) => ({
      orders: {
        ...state.orders,
        orderItems: state.orders.orderItems.map((item) =>
          item.orderName == name
            ? {
                ...item,
                ...updatedData,
              }
            : item
        ),
      },
    })),

  clearOrders: () => set({ orders: { orderItems: [], total: 0 } }),
}));
