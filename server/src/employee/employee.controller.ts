import { Response, Request } from "express";
import { employeeService } from "./employee.service";

class EmployeeController {
  async validatePin(req: Request, res: Response) {
    try {
      const { pin, role } = req.body;
      if (!pin || !role)
        return res.status(400).json({ message: "it must have a pin or role" });

      const employeeInfo = await employeeService.validatePin(pin, role);

      res.status(200).json(employeeInfo);
    } catch (error: any) {
      console.error(error.message || `Error in validating pin `);
    }
  }

  async getEmployeeRole(req: Request, res: Response) {
    try {
      const { employeeId } = req.params;
      if (!employeeId)
        return res.status(400).json({ message: "it must have an employee id" });

      const role = await employeeService.getEmployeeRole(employeeId);

      res.status(200).json(role?.employee_role);
    } catch (error: any) {
      console.error(error.message || `Error in validating pin `);
    }
  }

  async decryptQr(req: Request, res: Response) {
    try {
      const { encryptedQr } = req.body;

      if (!encryptedQr)
        return res
          .status(400)
          .json({ message: "it must have an encrypted Qr" });

      const decryptedQr = await employeeService.decryptQr(encryptedQr);

      res.status(200).json(decryptedQr);
    } catch (error: any) {
      console.error(error.message || `Error in decrypting qr  `);
    }
  }
}

export const employeeController = new EmployeeController();
