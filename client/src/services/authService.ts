import { AxiosInstance } from "axios";
import { axiosInstance } from "../api/axiosInstance";
import { saveToken } from "../utils/tokenUtils";

export const registerEmail = async (email: string) => {
  try {
    const res = await axiosInstance.post("/customer/register-email", email);

    if (!res) return console.log("no created token");

    await saveToken(res.data);
  } catch (error) {}
};
