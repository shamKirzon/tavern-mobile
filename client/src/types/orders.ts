export type ordersData = {
  orderItems: {
    orderName: string;
    serving: {
      servingSize: "solo" | "regular" | "to share";
      servingPrice: number;
    };
    quantity: number;
    note: string;
    price: number;
  }[];
  total: number;
};

export interface orderStore {
  ordersData: ordersData;
  setOrdersData: (data: Partial<ordersData>) => void;
  clearOrdersData: () => void;
}
