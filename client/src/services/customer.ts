import { axiosInstance } from "../api/axiosInstance";

export const setCustomerInactive = async (email: string) => {
  try {
    const res = await axiosInstance.post("/customer/set-inactive", { email });
    if (!res) return console.error("Can't perform setting status to inactive");
  } catch (error: any) {
    console.error("services/customers/setCustomerInactive() error:", error);
  }
};
export const setCustomerActive = async (email: string) => {
  try {
    const res = await axiosInstance.post("services/customer/set-active", {
      email,
    });
    if (!res) return console.error("Can't perform setting status to inactive");
  } catch (error: any) {
    console.error("services/customers/setCustomerActive() error:", error);
  }
};
