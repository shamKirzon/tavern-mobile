import AsyncStorage, {
  AsyncStorageStatic,
} from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { TOKEN_SECRET_KEY } from "@env";

type TokenPayLoad = {
  id: string;
  email: string;
  iat: number;
  exp: number;
};

export const saveToken = async (token: string) => {
  try {
    await AsyncStorage.setItem(TOKEN_SECRET_KEY, token);
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

export const deleteToken = async () => {
  try {
    await AsyncStorage.removeItem(TOKEN_SECRET_KEY);
  } catch (error) {
    console.error("Error deleting token ", error);
  }
};

export const isTokenExpired = (token: string): boolean => {
  try {
    const decodedToken = jwtDecode<TokenPayLoad>(token);
    return decodedToken.exp * 1000 < Date.now();
  } catch (error) {
    return true;
  }
};
