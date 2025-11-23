import { axiosInstance } from "../api/axiosInstance";
import { EmployeeRole } from "../types/employee";

export const validatePin = async (
  pin: string,
  role: EmployeeRole | undefined
) => {
  try {
    const res = await axiosInstance.post("/employee/validate-pin", {
      pin,
      role,
    });
    if (!res) return console.error("Can't perform setting status to inactive");

    return res.data;
  } catch (error: any) {
    console.error("services/employee/validatePin() error:", error);
  }
};

export const getEmployeeRole = async (employeeId: string) => {
  try {
    const res = await axiosInstance.get(
      `/employee/get-employee-role/${employeeId}`
    );
    if (!res) return console.error("Error in getting the employee role");

    return res.data;
  } catch (error: any) {
    console.error("services/employee/getEmployeeRole() error:", error);
  }
};
export const decryptQr = async (encryptedQr: string) => {
  try {
    const res = await axiosInstance.post(`/employee/decrypt-qr`, {
      encryptedQr,
    });
    if (!res) return console.error("can't perform decryption of qr");

    return res.data;
  } catch (error: any) {
    console.error("services/employee/decrypQr() error:", error);
  }
};
