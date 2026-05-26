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
      console.log("Error in createOrder(): ", error);
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
      console.log("Error in getOrderData(): ", error);
      return res.status(400).json({ message: "can't create order" });
    }
  }

  async updateOrderItems(req: Request, res: Response) {
    try {
      const { orderId, updatedOrders } = req.body;

      if (!orderId || !updatedOrders)
        return res
          .status(400)
          .json({ message: "must have an order id and updated orders " });

      const result = await orderService.updateOrderItems(
        orderId,
        updatedOrders
      );

      if (!result)
        return res
          .status(400)
          .json({ message: "there is no returned results. " });

      return res.status(200).json({ message: "updated successfully", result });
    } catch (error: any) {
      console.log("Error in updateOrderItems(): ", error);
      return res.status(400).json({ message: "can't create order" });
    }
  }

  async assignCashierId(req: Request, res: Response) {
    try {
      const { employeeId, orderId } = req.body;

      if (!orderId)
        return res.status(400).json({ message: "must have reservation id" });

      const result = await orderService.assignCashierId(employeeId, orderId);

      if (!result)
        return res
          .status(400)
          .json({ message: "can't perform assigning cashier id " });

      return res
        .status(200)
        .json({ message: "assigned cashier id successfully!" });
    } catch (error: any) {
      console.log("Error in reservationController/assignCashierId(): ", error);
      return res
        .status(400)
        .json({ message: "can't perform assigning cashier id " });
    }
  }

  async completeOrder(req: Request, res: Response) {
    try {
      const { orderId } = req.body;

      if (!orderId)
        return res.status(400).json({ message: "must have order id" });

      const result = await orderService.completeOrder(orderId);

      if (!result)
        return res
          .status(400)
          .json({ message: "Can't make the oder and reservation complete" });

      return res
        .status(200)
        .json({ message: "completing order successfully!", result });
    } catch (error: any) {
      console.log("Error in reservationController/completeOrder(): ", error);
      return res
        .status(400)
        .json({ message: "cant perform completing an order and reservation" });
    }
  }
}

export const orderController = new OrderController();
