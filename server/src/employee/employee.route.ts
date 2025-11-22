import { Router } from "express";
import { employeeController } from "./employee.controller";

const employeeRoutes = Router();

employeeRoutes.post("/validate-pin", employeeController.validatePin);
employeeRoutes.get(
  "/get-employee-role/:employeeId",
  employeeController.getEmployeeRole
);
employeeRoutes.post("/decrypt-qr", employeeController.decryptQr);

export default employeeRoutes;
