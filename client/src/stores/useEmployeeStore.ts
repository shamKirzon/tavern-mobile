import { create } from "zustand";
import { EmployeeStore } from "../types/employee";

export const useEmployeeStore = create<EmployeeStore>((set) => ({
  employeeRole: undefined,

  setEmployeeRole: (role) => set({ employeeRole: role }),
}));
