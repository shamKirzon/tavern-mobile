import { create } from "zustand";
import { orderStore } from "../types/orders";

export const useOrderStore = create<orderStore>((set) => ({
  spendLimit: "",
  setSpendLimit: (data: number) =>
    set({ spendLimit: (data / 2).toLocaleString() }),
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
          (data.orderItems?.reduce((sum, item) => sum + item.total, 0) || 0),
      },
    })),

  removeOrders: (name) =>
    set((state) => ({
      orders: {
        ...state.orders,
        orderItems: state.orders.orderItems.filter((o) => o.orderName !== name),
        total: state.orders.orderItems
          .filter((o) => o.orderName !== name)
          .reduce((sum, item) => sum + item.total, 0),
      },
    })),

  updateOrder: (name, updatedData) =>
    set((state) => {
      const updatedItems = state.orders.orderItems.map((item) =>
        item.orderName === name ? { ...item, ...updatedData } : item
      );

      console.log("\n");
      console.log("previous order data: ", updatedData);
      console.log("\n");
      console.log("current order data: ", updatedItems);
      console.log("\n");

      return {
        orders: {
          orderItems: updatedItems,
          total: updatedItems.reduce((sum, item) => sum + item.total, 0),
        },
      };
    }),

  clearOrders: () => set({ orders: { orderItems: [], total: 0 } }),
}));
