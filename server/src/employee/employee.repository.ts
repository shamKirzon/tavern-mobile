import { supabase } from "../lib/supabase-client";
import { EmployeeRole } from "../types/employee";

class EmployeeRepository {
  async validatePin(pin: string, role: EmployeeRole) {
    try {
      const { data, error } = await supabase
        .from("employees")
        .select("*")
        .eq("employee_role", role)
        .eq("pin", pin)
        .single();

      if (error) throw error;

      return data;
    } catch (err) {
      console.error("Error in: employeeRepository/validatePin() - ", err);
      return null;
    }
  }
  async getEmployeeRole(employeeId: string) {
    try {
      const { data, error } = await supabase
        .from("employees")
        .select("employee_role")
        .eq("employee_id", employeeId)
        .single();

      if (error) throw error;

      return data;
    } catch (err) {
      console.error("Error in: employeeRepository/validatePin() - ", err);
      return null;
    }
  }
}

export const employeeRepository = new EmployeeRepository();
