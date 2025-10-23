import { AxiosInstance } from "axios";
import { axiosInstance } from "../api/axiosInstance";
import { saveToken } from "../utils/token";

export const registerEmail = async (email: string) => {
  try {
    const res = await axiosInstance.post("/customer/register-email", { email });

    if (!res) return console.log("no created token");
    console.log("Email Successfully Verified");
    await saveToken(res.data);
    return res.data;
  } catch (error: any) {
    console.error("registerEmail error: ", error);
  }
};
