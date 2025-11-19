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
      console.log("EMPLOYEE ROLE", role);

      res.status(200).json(role?.employee_role);
    } catch (error: any) {
      console.error(error.message || `Error in validating pin `);
    }
  }
}

export const employeeController = new EmployeeController();
