import { generateQR } from "../utils/generateQR";
import { orderRepository } from "./order.repository";

class OrderService {
  async createOrder(
    order: any,
    email: string,
    reservationId: string
  ): Promise<any> {
    try {
      const orderData = {
        orderItems: order.orderItems,
        total: order.total,
      };

      const orderId = await orderRepository.createOrder(
        orderData,
        reservationId
      );

      const qrUrl = await generateQR(
        {
          reservationId,
          orderId,
        },
        email
      );

      console.log("QR URL: ", qrUrl);
      // inserting qr url
      await orderRepository.insertQrUrl(qrUrl!, orderId);

      return orderId;
    } catch (error) {
      console.error("order.service - error in  createOrder(): ", error);
    }
  }

  async getOrderData(orderId: string): Promise<any> {
    try {
      return await orderRepository.getOrderData(orderId);
    } catch (error: any) {
      console.error("error in getting the order information: ", error);
    }
  }

  async updateOrderItems(orderId: string, updatedOrders: any): Promise<any> {
    try {
      return await orderRepository.updateOrderItems(orderId, updatedOrders);
    } catch (error: any) {
      console.error("error in updating order items  ", error);
    }
  }

  async assignCashierId(employeeId: string, orderId: string): Promise<any> {
    try {
      return await orderRepository.assignCashierId(employeeId, orderId);
    } catch (error) {}
  }

  async completeOrder(orderId: string): Promise<any> {
    try {
      return await orderRepository.completeOrder(orderId);
    } catch (error) {}
  }
}

export const orderService = new OrderService();
