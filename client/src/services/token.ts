import {
  getToken,
  getTokenInformation,
  isTokenExpired,
  deleteToken,
  refreshToken,
  saveToken,
} from "../utils/token";
import { useAuthStore } from "../stores/useAuthStore";
import { axiosInstance } from "../api/axiosInstance";
import { jwtDecode } from "jwt-decode";
import { TokenPayLoad } from "../types/token";

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

export const getReservationIdByToken = async (): Promise<any> => {
  const tokenInfo = await getTokenInformation();
  if (!tokenInfo) return null;

  return tokenInfo.reservationId;
};

export const updateToken = async (update: any) => {
  try {
    const oldToken = await getToken();
    const res = await axiosInstance.post("/auth/token/update", {
      oldToken,
      update,
    });

    if (!res)
      return console.log(
        "services/token/updateToken(): can't update the token"
      );

    await deleteToken();
    await saveToken(res.data);

    const decodedToken = await jwtDecode<TokenPayLoad>(res.data.token);
    const tokenInfo = {
      exp: decodedToken.exp,
      iat: decodedToken.iat,
      email: decodedToken.email,
      reservationId: decodedToken.reservationId,
      orderId: decodedToken.orderId,
      id: decodedToken.jti,
    };

    console.log("updated token: ", tokenInfo);
  } catch (error) {
    console.error("services/token/updatedToken(); ", error);
  }
};
