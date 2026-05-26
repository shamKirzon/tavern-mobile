import axios from "axios";
import IP_ADDRESS from "../constant/IpAddress";

export const axiosInstance = axios.create({
  baseURL: `${IP_ADDRESS}/api`,
  // baseURL: `${NGROK_URL}/api`,
  withCredentials: true,
});

// /client - ngrok http 3000
// to run:
//npx expo start --tunnel
