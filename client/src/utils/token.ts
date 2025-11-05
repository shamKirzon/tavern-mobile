import AsyncStorage, {
  AsyncStorageStatic,
} from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { TOKEN_SECRET_KEY } from "@env";
import { axiosInstance } from "../api/axiosInstance";
import { TokenPayLoad } from "../types/token";

export const saveToken = async (token: any) => {
  try {
    await AsyncStorage.setItem(TOKEN_SECRET_KEY, token.token);
  } catch (error) {
    console.error("Error saving token", error);
  }
};

export const getToken = async () => {
  try {
    return await AsyncStorage.getItem(TOKEN_SECRET_KEY);
  } catch (error) {
    console.error("Error getting token ", error);
    return null;
  }
};

export const getTokenInformation = async () => {
  const token = await getToken();
  const decodedToken = jwtDecode<TokenPayLoad>(token!);
  return {
    exp: decodedToken.exp,
    iat: decodedToken.iat,
    email: decodedToken.email,
    reservationId: decodedToken.reservationId,
    orderId: decodedToken,
    id: decodedToken.jti,
  };
};

export const deleteToken = async () => {
  try {
    await AsyncStorage.removeItem(TOKEN_SECRET_KEY);
  } catch (error) {
    console.error("Error deleting token ", error);
  }
};

export const isTokenExpired = async (): Promise<boolean> => {
  try {
    const token = await getToken();
    const decodedToken = jwtDecode<TokenPayLoad>(token!);
    return decodedToken.exp * 1000 < Date.now();
  } catch (error: any) {
    console.error("isTokenExpired: decoding of token part ", error);
    return true;
  }
};

export const refreshToken = async () => {
  try {
    const token = await getToken();
    const decodedToken = jwtDecode<TokenPayLoad>(token!);
    const { email, reservationId, orderId } = decodedToken;

    console.info("Current Email:", decodedToken.email);
    console.info("Current Reservation Id:", decodedToken.reservationId);
    console.info("Current Order Id:", decodedToken.orderId);

    const res = await axiosInstance.post("/auth/token/generate", {
      decodedToken,
    });

    if (!res) return console.log("no created token");

    const refreshedToken = jwtDecode<TokenPayLoad>(res.data.token);

    deleteToken();
    await saveToken(res.data);

    return refreshedToken.iat;
  } catch (error: any) {
    console.error("registerEmail error: ", error);
  }
};

export const updateToken = async (update: any) => {
  try {
    const token = await getToken();
    const res = await axiosInstance.post("/auth/token/update", {
      token,
      update,
    });

    if (!res) return console.log("auth/updateToken: can't update the token");

    console.log("updated token: ", res);
    await deleteToken();
    saveToken(res.data.updatedToken);
  } catch (error) {}
};
