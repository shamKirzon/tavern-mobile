import { Router } from "express";

const orderRoutes = Router();

orderRoutes.post("/create-order");
orderRoutes.post("/get-order-data");
