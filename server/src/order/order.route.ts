import { Router } from "express";
import { orderController } from "./order.controller";

const orderRoutes = Router();

orderRoutes.post("/create-order", orderController.createOrder);
orderRoutes.get("/get-order-data/:orderId", orderController.getOrderData);
orderRoutes.post("/update-order-items", orderController.updateOrderItems);
orderRoutes.post("/assign-cashier-id", orderController.assignCashierId);
orderRoutes.post("/complete-order", orderController.completeOrder);

export default orderRoutes;
