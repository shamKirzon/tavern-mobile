import React, { useEffect, useState } from "react";
import HomeScreen from "./src/screens/HomeScreen";
import Reservation from "./src/screens/ReservationScreen";
import ReservationPaymentScreen from "./src/screens/ReservationPaymentScreen";
import ReservationReviewScreen from "./src/screens/ReservationReviewScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamLists } from "./src/types/rootStackParamLists";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { navigationRef } from "./navigationRef";
import WelcomeScreen from "./src/screens/WelcomeScreen";
import { checkToken } from "./src/services/token";
// import HomeScreenTesting from "./src/screens/shams-testing/HomeScreenTesting";
import ReservationScreenTesting from "./src/screens/shams-testing/ReservationScreenTesting";
import EmailVerificationScreen from "./src/screens/EmailVerificationScreen";
import OrderPolicyScreen from "./src/screens/OrderPolicyScreen";
import MenuViewingScreen from "./src/screens/MenuViewingScreen";

const App = () => {
  useEffect(() => {
    checkToken();
  }, []);

  const Stack = createNativeStackNavigator<RootStackParamLists>();

  return (
    <SafeAreaProvider>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator
          initialRouteName="ReservationScreenTesting"
          screenOptions={{ headerShown: false, animation: "none" }}
        >
          <Stack.Screen name="HomeScreen" component={HomeScreen} />
          <Stack.Screen
            name="MenuViewingScreen"
            component={MenuViewingScreen}
          />

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

          <Stack.Screen
            name="EmailVerificationScreen"
            component={EmailVerificationScreen}
          />
          <Stack.Screen
            name="OrderPolicyScreen"
            component={OrderPolicyScreen}
          />

          {/* shams testing - ignore niyo lang ito  */}
          <Stack.Screen
            name="ReservationScreenTesting"
            component={ReservationScreenTesting}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
