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
import { deleteToken, getToken, isTokenExpired } from "./src/utils/tokenUtils";
import WelcomeScreen from "./src/screens/WelcomeScreen";
import { width } from "./src/utils/dimensions";
import { useAuthStore } from "./src/services/useAuthStore";

const App = () => {
  const { isAuthenticated, setIsAuthenticated } = useAuthStore();

  useEffect(() => {
    const checkToken = async () => {
      const token = await getToken();
      if (!token || isTokenExpired(token)) {
        setIsAuthenticated(false);
        deleteToken();
      } else setIsAuthenticated(true);
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
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
