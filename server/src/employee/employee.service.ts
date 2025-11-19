import { authService } from "../auth/auth.service";
import { employeeRepository } from "./employee.repository";
import { formatDateFromSeconds } from "../utils/formatDateFromSeconds";
import { EmployeeRole } from "../types/employee";

class EmployeeService {
  async validatePin(pin: string, role: EmployeeRole) {
    try {
      return await employeeRepository.validatePin(pin, role);
    } catch (error: any) {
      console.log(error.message || "Unable to register the customer ", error);
    }
  }

  async getEmployeeRole(employeeId: string) {
    try {
      return await employeeRepository.getEmployeeRole(employeeId);
    } catch (error: any) {
      console.log(error.message || "Unable to register the customer ", error);
    }
  }
}

export const employeeService = new EmployeeService();
