import axios from "axios";
import IP_ADDRESS from "../constant/IpAddress";

const NGROK_URL = "https://nondehiscent-medfly-joslyn.ngrok-free.dev";

export const axiosInstance = axios.create({
  // baseURL: `${IP_ADDRESS}/api`,
  baseURL: `${NGROK_URL}/api`,
  withCredentials: true,
});
