import { axiosInstance } from "../api/axiosInstance";

export const setCustomerInactive = async (email: string) => {
  try {
    const res = await axiosInstance.post("/customer/set-inactive", { email });
    if (!res) return console.error("Can't perform setting status to inactive");

    console.log("setCustomerInactive() - res: ", res.data);
  } catch (error: any) {
    console.error("setCustomerInactive() error:", error);
  }
};
export const setCustomerActive = async (email: string) => {
  try {
    const res = await axiosInstance.post("/customer/set-active", { email });
    if (!res) return console.error("Can't perform setting status to inactive");

    console.log("setCustomerActive() - res: ", res.data);
  } catch (error: any) {
    console.error("setCustomerActive() error:", error);
  }
};
