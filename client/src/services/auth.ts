import { axiosInstance } from "../api/axiosInstance";
import { getToken, saveToken } from "../utils/token";

export const registerEmail = async (email: string) => {
  try {
    const res = await axiosInstance.post("/customer/register-email", { email });

    if (!res) return console.log("no created token");
    await saveToken(res.data);
    return res.data;
  } catch (error: any) {
    console.log("registerEmail error: ", error);
  }
};

export const generateOtp = async (email: string) => {
  try {
    const res = await axiosInstance.post("/auth/otp/send-otp", {
      email,
    });
    console.log("GENERATED OTP FROM BACKEND: ", res.data.otp);
  } catch (error) {
    console.error("services/auth.ts/generateOtp: ", error);
  }
};
export const validateOtp = async (email: string, otp: string) => {
  try {
    const res = await axiosInstance.post("/auth/otp/validate-otp", {
      email,
      otp,
    });

    return { isValidOtp: res.data.isValidOtp, message: res.data.message };
  } catch (error) {
    console.error("services/auth.ts/validateOtp: ", error);
  }
};
