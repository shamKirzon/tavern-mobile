export type ordersData = {
  orderItems: {
    orderName: string;
    serving?: {
      servingSize: "solo" | "regular" | "to share";
      servingPrice: number;
    };
    quantity: number;
    note: string;
    image: any;
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
  removeOrders: (id: string) => void; // remove by unique id
  updateOrder: (
    name: string,
    updatedData: Partial<ordersData["orderItems"][number]>
  ) => void;
  clearOrders: () => void;
}
