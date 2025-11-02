import { generateQR } from "../utils/generateQR";
import { orderRepository } from "./order.repository";

class OrderService {
  async createOrder(order: any): Promise<any> {
    try {
      const orderData = {
        orderItems: order.orderItems,
        total: order.total,
        reservationId: "3fa7284c-5317-4711-aec6-d49c79a08e36",
      };

      const orderId = await orderRepository.createOrder(orderData);
      const qrUrl = await generateQR(
        {
          reservationId: orderData.reservationId,
          orderId,
        },
        "shammysuyat@gmail.com"
      );

      const updatedOrder = await orderRepository.insertQrUrl(qrUrl!, orderId);
      return updatedOrder;
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
