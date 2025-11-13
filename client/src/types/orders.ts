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
  }[];
  total?: number;
};

export interface orderStore {
  orders: ordersData;
  addOrders: (data: Partial<ordersData>) => void;
  removeOrders: (name: string) => void;
  updateOrders: (
    name: string,
    updatedData: Partial<ordersData["orderItems"][number]>
  ) => void;
  clearOrders: () => void;
}
