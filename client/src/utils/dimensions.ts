import { Dimensions, Platform } from "react-native";

const { width, height } = Dimensions.get("window");
const paddingTop = Platform.OS === "ios" ? height * 0.06 : height * 0.02;

export { width, height, paddingTop };
