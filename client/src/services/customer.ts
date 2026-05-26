import { axiosInstance } from "../api/axiosInstance";

export const setCustomerInactive = async (email: string) => {
  try {
    const res = await axiosInstance.post("/customer/set-inactive", { email });
    if (!res) return console.log("Can't set status to inactive.");
  } catch (error: any) {
    console.log("services/customers/setCustomerInactive() error:", error);
  }
};
export const setCustomerActive = async (email: string) => {
  try {
    const res = await axiosInstance.post("services/customer/set-active", {
      email,
    });
    if (!res) return console.log("Can't perform setting status to inactive");
  } catch (error: any) {
    console.log("services/customers/setCustomerActive() error:", error);
  }
};
