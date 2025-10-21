import { Router } from "express";
import { customerController } from "./customer.controller";

const customerRoutes = Router();

customerRoutes.post("/register-email", customerController.registerCustomer);
customerRoutes.post("/set-inactive", customerController.setInactive);
customerRoutes.post("/set-active", customerController.setActive);
export default customerRoutes;
