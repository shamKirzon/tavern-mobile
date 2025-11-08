import { Request, Response } from "express";
import { orderService } from "./order.service";
import { reservationRepository } from "../reservation/reservation.repository";

class OrderController {
  async createOrder(req: Request, res: Response) {
    try {
      const { order, email, reservationId } = req.body;

      if (!order) return res.status(400).json({ message: "no data fetched" });

      const orderId = await orderService.createOrder(
        order,
        email,
        reservationId
      );
      if (!orderId)
        throw new Error(
          "Order creation failed: No data returned from Supabase"
        );

      return res
        .status(200)
        .json({ message: "Order Created Successfully! ", orderId });
    } catch (error: any) {
      console.error("error from createOrder(): ", error);
      return res.status(400).json({ message: "can't create order" });
    }
  }
  async getOrderData(req: Request, res: Response) {
    try {
      const { orderId } = req.params;

      if (!orderId)
        return res.status(400).json({ message: "must have an order id " });

      const result = await orderService.getOrderData(orderId);

      if (!result)
        return res
          .status(400)
          .json({ message: "there is no returned results. " });

      return res.status(200).json({ message: "order data ", result });
    } catch (error: any) {
      console.error("error from getOrderData(): ", error);
      return res.status(400).json({ message: "can't create order" });
    }
  }
}

export const orderController = new OrderController();
