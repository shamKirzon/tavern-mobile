import { AxiosInstance } from "axios";
import { axiosInstance } from "../api/axiosInstance";
import { saveToken } from "../utils/tokenUtils";

export const registerEmail = async (email: string) => {
  try {
    const res = await axiosInstance.post("/customer/register-email", { email });

    if (!res) return console.log("no created token");
    console.log("Email Successfully Verified");
    await saveToken(res.data);
    // return res.data;
  } catch (error: any) {
    console.error("registerEmail error: ", error);
  }
};

export const setInactiveCustomer = async (email: string) => {
  try {
    const res = await axiosInstance.post("/customer/set-inactive", { email });
    if (!res) return console.error("Can't perform setting status to inactive");

    console.log("setInactiveCustomer() - res: ", res.data);
  } catch (error: any) {
    console.error("setInactiveCustomer error:", error);
  }
};
