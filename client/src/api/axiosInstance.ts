import axios from "axios";
import IP_ADDRESS from "../constant/IpAddress";

export const axiosInstance = axios.create({
  baseURL: `${IP_ADDRESS}/api`,
  withCredentials: true,
});
