import { View, Text, Dimensions } from "react-native";
import React, { useEffect, useState } from "react";
import HomeScreen from "./src/screens/HomeScreen";
import Reservation from "./src/screens/ReservationScreen";
import ReservationPaymentScreen from "./src/screens/ReservationPaymentScreen";
import ReservationReviewScreen from "./src/screens/ReservationReviewScreen";
import Otp from "./src/screens/OtpScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamLists } from "./src/types/rootStackParamLists";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { navigationRef } from "./navigationRef";
import {
  deleteToken,
  getToken,
  getTokenInformation,
  isTokenExpired,
  refreshToken,
  saveToken,
} from "./src/utils/token";
import WelcomeScreen from "./src/screens/WelcomeScreen";
import { width } from "./src/utils/dimensions";
import { useAuthStore } from "./src/stores/useAuthStore";
import { registerEmail } from "./src/services/auth";
import { checkToken } from "./src/services/token";
// import HomeScreenTesting from "./src/screens/shams-testing/HomeScreenTesting";

// ✅ Added imports
import EmailVerificationScreen from "./src/screens/EmailVerificationScreen";
import OrderPolicyScreen from "./src/screens/OrderPolicyScreen";

const App = () => {
  useEffect(() => {
    checkToken();
  }, []);

  const Stack = createNativeStackNavigator<RootStackParamLists>();

  return (
    <SafeAreaProvider>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator
          initialRouteName="EmailVerificationScreen"
          screenOptions={{ headerShown: false, animation: "none" }}
        >
          <Stack.Screen name="HomeScreen" component={HomeScreen} />
          <Stack.Screen name="Otp" component={Otp} />

          <Stack.Screen name="Reservation" component={Reservation} />
          <Stack.Screen
            name="ReservationPayment"
            component={ReservationPaymentScreen}
          />
          <Stack.Screen
            name="ReservationReview"
            component={ReservationReviewScreen}
          />
          <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />

          {/* ✅ Added new screens below */}
          <Stack.Screen
            name="EmailVerificationScreen"
            component={EmailVerificationScreen}
          />
          <Stack.Screen
            name="OrderPolicyScreen"
            component={OrderPolicyScreen}
          />

          {/* shams testing - ignore niyo lang ito  */}
          {/*<Stack.Screen
            name="HomeScreenTesting"
            component={HomeScreenTesting}
          />*/}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
