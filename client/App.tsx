import React, { useEffect, useState } from "react";
import HomeScreen from "./src/screens/HomeScreen";
import ReservationScreen from "./src/screens/ReservationScreen";
import ReservationPaymentScreen from "./src/screens/ReservationPaymentScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamLists } from "./src/types/rootStackParamLists";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { navigationRef } from "./navigationRef";
import WelcomeScreen from "./src/screens/WelcomeScreen";
import EmailVerificationScreen from "./src/screens/EmailVerificationScreen";
import OrderPolicyScreen from "./src/screens/OrderPolicyScreen";
import MenuViewingScreen from "./src/screens/MenuViewingScreen";
import BookingSummaryScreen from "./src/screens/BookingSummaryScreen";
import CustomizationScreen from "./src/screens/CustomizationScreen";
import OrderHomeScreen from "./src/screens/OrderHomeScreen";
import OrderStatusScreen from "./src/screens/OrderStatusScreen";
import CartScreen from "./src/screens/CartScreen";
import { checkToken, updateToken } from "./src/services/token";
import { useFonts } from "expo-font";
import { deleteToken, getToken, getTokenInformation } from "./src/utils/token";
import ReservationStatusScreen from "./src/screens/ReservationStatusScreen";
import StaffHomeScreen from "./src/screens/StaffHomeScreen";
import StaffQRScannerScreen from "./src/screens/StaffQRScannerScreen";
import StaffQRResultScreen from "./src/screens/StaffQRResultScreen";

const App = () => {
  const [fontsLoaded] = useFonts({
    DMSerif: require("./src/assets/fonts/DMSerifText-Regular.ttf"),
    "DMSerif-Italic": require("./src/assets/fonts/DMSerifText-Italic.ttf"),
    Poppins: require("./src/assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Bold": require("./src/assets/fonts/Poppins-Bold.ttf"),
    "Poppins-ExtraBoldItalic": require("./src/assets/fonts/Poppins-ExtraBoldItalic.ttf"),

    "Poppins-Italic": require("./src/assets/fonts/Poppins-Italic.ttf"),
  });

  useEffect(() => {
    const verifyToken = async () => {
      // await deleteToken();
      // await updateToken({ orderId: null });
      await checkToken();
    };

    verifyToken();
  }, []);

  const Stack = createNativeStackNavigator<RootStackParamLists>();

  return (
    <SafeAreaProvider>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator
          initialRouteName="WelcomeScreen"
          screenOptions={{ headerShown: false, animation: "none" }}
        >
          <Stack.Screen
            name="CustomizationScreen"
            component={CustomizationScreen}
          />
          <Stack.Screen
            name="MenuViewingScreen"
            component={MenuViewingScreen}
          />

          <Stack.Screen name="HomeScreen" component={HomeScreen} />

          <Stack.Screen
            name="ReservationScreen"
            component={ReservationScreen}
          />
          <Stack.Screen
            name="ReservationPaymentScreen"
            component={ReservationPaymentScreen}
          />
          <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />

          <Stack.Screen
            name="EmailVerificationScreen"
            component={EmailVerificationScreen}
          />

          <Stack.Screen
            name="OrderPolicyScreen"
            component={OrderPolicyScreen}
          />

          <Stack.Screen name="CartScreen" component={CartScreen} />

          <Stack.Screen name="OrderHomeScreen" component={OrderHomeScreen} />

          <Stack.Screen
            name="ReservationStatusScreen"
            component={ReservationStatusScreen}
          />

          <Stack.Screen
            name="BookingSummaryScreen"
            component={BookingSummaryScreen}
          />

          <Stack.Screen
            name="OrderStatusScreen"
            component={OrderStatusScreen}
          />

          {/* Staff Screens */}

          <Stack.Screen name="StaffHomeScreen" component={StaffHomeScreen} />
          <Stack.Screen
            name="StaffQRScannerScreen"
            component={StaffQRScannerScreen}
          />
          <Stack.Screen
            name="StaffQRResultScreen"
            component={StaffQRResultScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
