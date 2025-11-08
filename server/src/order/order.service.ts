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

      // inserting qr url
      await orderRepository.insertQrUrl(orderId, qrUrl!);

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
}

export const orderService = new OrderService();
