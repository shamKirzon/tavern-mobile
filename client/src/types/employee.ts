export interface EmployeeStore {
  employeeRole: EmployeeRole | undefined;
  setEmployeeRole: (role: EmployeeRole) => void;
}

export type EmployeeRole = "cashier" | "security";
