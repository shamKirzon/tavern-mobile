import { create } from "zustand";
import { orderStore } from "../types/orders";

export const useOrderStore = create<orderStore>((set) => ({
  orders: { orderItems: [], total: 0 },

  addOrders: (data) =>
    set((state) => ({
      orders: {
        ...state.orders,

        orderItems: [
          ...(state.orders.orderItems || []),
          ...(data.orderItems || []),
        ],
        total:
          (state.orders.total || 0) +
          (data.orderItems?.reduce((sum, item) => sum + item.price, 0) || 0),
      },
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
