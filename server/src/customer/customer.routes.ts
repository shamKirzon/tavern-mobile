import { Router } from "express";
import { customerController } from "./customer.controller";

const customerRoutes = Router();

customerRoutes.post("/register-email", customerController.registerCustomer);

export default customerRoutes;
