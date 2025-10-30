import { orderRepository } from "./order.repository";

class OrderService {
  async createOrder(data: any): Promise<any> {
    try {
      return await orderRepository.createOrder(data);
    } catch (error) {
      console.error("Error in createOrder(): ", error);
    }
  }

  async getOrderData(email: string): Promise<any> {
    try {
      return await orderRepository.getReservationData(email);
    } catch (error: any) {
      console.error("error in getting the order information: ", error);
    }
  }
}

export const orderService = new OrderService();
