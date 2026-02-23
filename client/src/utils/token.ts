import AsyncStorage, {
  AsyncStorageStatic,
} from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { TOKEN_SECRET_KEY } from "@env";
import { axiosInstance } from "../api/axiosInstance";
import { TokenPayLoad } from "../types/token";
import { reservationCancellationTermsAndConditions } from "../data/rulesAndCondition";

export const saveToken = async (token: any) => {
  try {
    await AsyncStorage.setItem(TOKEN_SECRET_KEY, token.token);
  } catch (error) {
    console.log("Error saving token", error);
  }
};

export const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem(TOKEN_SECRET_KEY);
    return token ?? null;
  } catch (error) {
    console.log("Error getting token ", error);
    return null;
  }
};

export const getTokenInformation = async () => {
  const token = await getToken();
  if (!token) return null;

  const decodedToken = jwtDecode<TokenPayLoad>(token);
  return {
    exp: decodedToken.exp,
    iat: decodedToken.iat,
    email: decodedToken.email,
    reservationId: decodedToken.reservationId,
    orderId: decodedToken.orderId,
    employeeId: decodedToken.employeeId,
    reservationCancellationId: decodedToken.reservationCancellationId,
    id: decodedToken.jti,
  };
};

export const deleteToken = async () => {
  try {
    await AsyncStorage.removeItem(TOKEN_SECRET_KEY);
  } catch (error) {
    console.log("Error deleting token ", error);
  }
};

export const isTokenExpired = async (): Promise<boolean> => {
  try {
    const token = await getToken();
    const decodedToken = jwtDecode<TokenPayLoad>(token!);
    return decodedToken.exp * 1000 < Date.now();
  } catch (error: any) {
    console.log("There is an error in decoding token.", error);
    return true;
  }
};

export const refreshToken = async () => {
  try {
    const token = await getToken();
    if (!token) return null;
    const decodedToken = jwtDecode<TokenPayLoad>(token);

    console.info("\n");
    console.info("Token Refreshed Succesfully");
    // console.info("Current Email:", decodedToken.email);
    // console.info("Current Reservation Id:", decodedToken.reservationId);
    // console.info("Current Order Id:", decodedToken.orderId);
    // console.info("Current Employee Id:", decodedToken.employeeId);

    const res = await axiosInstance.post("/auth/token/refresh", {
      decodedToken,
    });

    if (!res) return console.log("No created token");

    await deleteToken();
    await saveToken(res.data);
  } catch (error: any) {
    console.log("Error in utils/token/refreshToken()", error);
  }
};
