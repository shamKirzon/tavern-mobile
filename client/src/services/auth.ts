import { AxiosInstance } from "axios";
import { axiosInstance } from "../api/axiosInstance";
import { getToken, saveToken } from "../utils/token";

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

export const updateToken = async () => {
  try {
    const token = await getToken();
    const res = await axiosInstance.post("/auth/token/update", { token });

    if (!res) return console.log("auth/updateToken: can't update the token");

    return res.data;
  } catch (error) {}
};
