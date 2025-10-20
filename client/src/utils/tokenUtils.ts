import AsyncStorage, {
  AsyncStorageStatic,
} from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { TOKEN_SECRET_KEY } from "@env";
import { axiosInstance } from "../api/axiosInstance";

type TokenPayLoad = {
  email: string;
  iat: number;
  exp: number;
  jti: string;
};

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

export const getTokenInformation = async (token: any) => {
  const decodedToken = jwtDecode<TokenPayLoad>(token);
  return {
    exp: decodedToken.exp,
    iat: decodedToken.iat,
    email: decodedToken.email,
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

export const isTokenExpired = (token: any): boolean => {
  try {
    const decodedToken = jwtDecode<TokenPayLoad>(token);
    return decodedToken.exp * 1000 < Date.now();
  } catch (error: any) {
    console.error("isTokenExpired: decoding of token part ", error);
    return true;
  }
};

// use this function inside the statement if there is an authenticated account fetched.
export const refreshToken = async (token: any) => {
  try {
    const decodedToken = jwtDecode<TokenPayLoad>(token);
    const email = decodedToken.email;

    console.info("Current Email:", email);

    const res = await axiosInstance.post("/customer/register-email", { email });

    if (!res) return console.log("no created token");

    const refreshedToken = jwtDecode<TokenPayLoad>(res.data.token);

    deleteToken();
    await saveToken(res.data);

    return refreshedToken.iat;
  } catch (error: any) {
    console.error("registerEmail error: ", error);
  }
};
