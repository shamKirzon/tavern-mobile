import { generateQR } from "../utils/generateQR";
import { orderRepository } from "./order.repository";

class OrderService {
  async createOrder(order: any, email: string): Promise<any> {
    try {
      const orderData = {
        orderItems: order.orderItems,
        total: order.total,
        reservationId: "3fa7284c-5317-4711-aec6-d49c79a08e36",
      };

      const createdOrder = await orderRepository.createOrder(orderData);

      const qrUrl = await generateQR(
        {
          reservationId: orderData.reservationId,
          orderId: createdOrder.order_id,
        },
        "shammysuyat@gmail.com"
      );

      const updatedOrder = await orderRepository.insertQrUrl(
        createdOrder.order_id,
        qrUrl!
      );

      return { updatedOrder };
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
