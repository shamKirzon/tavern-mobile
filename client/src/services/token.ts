import {
  getToken,
  getTokenInformation,
  isTokenExpired,
  deleteToken,
  refreshToken,
} from "../utils/token";
import { useAuthStore } from "../stores/useAuthStore";

export const checkToken = async () => {
  const { isAuthenticated, setIsAuthenticated } = useAuthStore();
  const token = await getToken();

  if (!token || (await isTokenExpired())) {
    setIsAuthenticated(false);
    console.error("no token || the token is expired", token);
    await deleteToken();
  } else {
    console.log("Token Refreshed Successfully!");
    const afterRefresh = await refreshToken();
    console.info("new issued at:", afterRefresh);
    setIsAuthenticated(true);
  }
};

export const getEmailByToken = async (): Promise<string> => {
  const { email } = await getTokenInformation();
  return email;
};
