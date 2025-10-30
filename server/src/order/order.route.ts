import { Router } from "express";
import { orderController } from "./order.controller";

const orderRoutes = Router();

orderRoutes.post("/create-order", orderController.createOrder);
orderRoutes.get("/get-order-data/:orderId", orderController.getOrderData);

export default orderRoutes;
