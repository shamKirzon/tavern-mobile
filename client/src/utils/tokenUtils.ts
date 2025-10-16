import AsyncStorage, {
  AsyncStorageStatic,
} from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { TOKEN_SECRET_KEY } from "@env";

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
    console.log(decodedToken.exp * 1000 < Date.now());
    return decodedToken.exp * 1000 < Date.now();
  } catch (error: any) {
    console.error("isTokenExpired: decoding of token part ", error);
    return true;
  }
};
