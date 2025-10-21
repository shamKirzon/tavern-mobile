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
  const tokenPayload = await getTokenInformation(token);

  if (!token || isTokenExpired(token)) {
    setIsAuthenticated(false);
    console.error("no token || the token is expired", token);
    await deleteToken();
  } else {
    console.log("Token Refreshed Successfully!");
    const afterRefresh = await refreshToken(token);
    console.info("new issued at:", afterRefresh);
    setIsAuthenticated(true);
  }
};
