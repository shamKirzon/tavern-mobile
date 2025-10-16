import { View, Text, Dimensions } from "react-native";
import React, { useEffect, useState } from "react";
import HomeScreen from "./src/screens/HomeScreen";
import Reservation from "./src/screens/ReservationScreen";
import ReservationPaymentScreen from "./src/screens/ReservationPaymentScreen";
import ReservationReviewScreen from "./src/screens/ReservationReviewScreen";
import Otp from "./src/screens/OtpScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamLists } from "./src/types/type";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { navigationRef } from "./navigationRef";
import {
  deleteToken,
  getToken,
  getTokenInformation,
  isTokenExpired,
} from "./src/utils/tokenUtils";
import WelcomeScreen from "./src/screens/WelcomeScreen";
import { width } from "./src/utils/dimensions";
import { useAuthStore } from "./src/services/useAuthStore";
import { registerEmail } from "./src/services/authService";
import HomeScreenTesting from "./src/screens/shams-testing/HomeScreenTesting";

const App = () => {
  const { isAuthenticated, setIsAuthenticated } = useAuthStore();

  useEffect(() => {
    // deleteToken();
    const checkToken = async () => {
      const token = await getToken();
      const tokenPayload = await getTokenInformation(token);

      if (!token || isTokenExpired(token)) {
        setIsAuthenticated(false);
        console.log("no token || the token is expired", token);
        await deleteToken();
      } else {
        console.log("token fetched successfully: ");
        console.log(tokenPayload);
        setIsAuthenticated(true);
      }
    };
    checkToken();
  }, []);

  const Stack = createNativeStackNavigator<RootStackParamLists>();

  return (
    <SafeAreaProvider>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator
          initialRouteName="WelcomeScreen"
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

          {/* shams testing - ignore niyo lang ito  */}
          <Stack.Screen
            name="HomeScreenTesting"
            component={HomeScreenTesting}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
