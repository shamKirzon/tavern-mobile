export type ordersData = {
  orderItems: {
    orderName: string;
    serving?: {
      servingSize: "solo" | "regular" | "to share";
      servingPrice: number;
    };
    quantity: number;
    note: string;
    price: number;
    description: string[];
    total: number;
  }[];
  total?: number;
};

export interface orderStore {
  orders: ordersData;
  spendLimit: string;
  setSpendLimit: (data: number) => void;
  addOrders: (data: Partial<ordersData>) => void;
  removeOrders: (id: string) => void;
  updateOrder: (
    name: string,
    updatedData: Partial<ordersData["orderItems"][number]>
  ) => void;
  clearOrders: () => void;
}

export type OrderStatus = "pending" | "cancelled" | "done";
export type Servings = "Solo" | "Regular" | "To Share";
