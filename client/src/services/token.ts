import {
  getToken,
  getTokenInformation,
  isTokenExpired,
  deleteToken,
  refreshToken,
} from "../utils/token";
import { useAuthStore } from "../stores/useAuthStore";

export const checkToken = async () => {
  const authStore = useAuthStore.getState();
  const token = await getToken();

  if (!token || (await isTokenExpired())) {
    authStore.setIsAuthenticated(false);
    console.log("no token or  the token is expired", token);
    await deleteToken();
  } else {
    authStore.setIsAuthenticated(true);
    await refreshToken();
  }
};

export const getEmailByToken = async (): Promise<any> => {
  const tokenInfo = await getTokenInformation();
  if (!tokenInfo) return null;

  return tokenInfo.email;
};
