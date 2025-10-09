// // for your async storage management
// // saveToken, getToken, removeToken, isTokenExpired
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import jwtDecode from "jwt-decode";

// type TokenPayload = {
//   exp: number;
// };

// const TOKEN_KEY = "token";

// // Save token
// export const saveToken = async (token: string) => {
//   try {
//     await AsyncStorage.setItem(TOKEN_KEY, token);
//   } catch (error) {
//     console.error("Error saving token:", error);
//   }
// };

// // Get token
// export const getToken = async () => {
//   try {
//     return await AsyncStorage.getItem(TOKEN_KEY);
//   } catch (error) {
//     console.error("Error reading token:", error);
//     return null;
//   }
// };

// // Remove token
// export const removeToken = async () => {
//   try {
//     await AsyncStorage.removeItem(TOKEN_KEY);
//   } catch (error) {
//     console.error("Error removing token:", error);
//   }
// };

// // Check if token is expired (for JWT)
// export const isTokenExpired = (token: string): boolean => {
//   try {
//     const decoded = jwtDecode<TokenPayload>(token);
//     return decoded.exp * 1000 < Date.now();
//   } catch {
//     return true; // treat invalid token as expired
//   }
// };
