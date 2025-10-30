import { orderRepository } from "./order.repository";

class OrderService {
  async createOrder(order: any): Promise<any> {
    try {
      const orderData = {
        orderItems: order.orderItems,
        total: order.total,
        reservationId: "3fa7284c-5317-4711-aec6-d49c79a08e36",
        qrCodeUrl: "2de1178f-8dda-476c-b0e5-1f9650295116",
        cashierId: "2de1178f-8dda-476c-b0e5-1f9650295116",
      };

      return await orderRepository.createOrder(orderData);
    } catch (error) {
      console.error("Error in createOrder(): ", error);
    }
  }

  async getOrderData(orderId: string): Promise<any> {
    try {
      return await orderRepository.getOrderData(orderId);
    } catch (error: any) {
      console.error("error in getting the order information: ", error);
    }
  }
}

export const orderService = new OrderService();
