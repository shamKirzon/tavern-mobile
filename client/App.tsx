import React, { useEffect, useState } from "react";
import HomeScreen from "./src/screens/HomeScreen";
import ReservationScreen from "./src/screens/ReservationScreen";
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
// import ReservationScreenTesting from "./src/screens/shams-testing/ReservationScreenTesting";
import EmailVerificationScreen from "./src/screens/EmailVerificationScreen";
import OrderPolicyScreen from "./src/screens/OrderPolicyScreen";
import MenuViewingScreen from "./src/screens/MenuViewingScreen";
import BookingSummaryScreen from "./src/screens/BookingSummaryScreen";
import PaymentScreen from "./src/screens/PaymentScreen";
import CustomizationScreen from "./src/screens/CustomizationScreen";
import OrderHomeScreen from "./src/screens/OrderHomeScreen";
import WaitingConfirmationScreen from "./src/screens/WaitingConfirmationScreen";
import ViewOrderStatusScreen from "./src/screens/ViewOrderStatusScreen";

const App = () => {
  useEffect(() => {
    checkToken();
  }, []);

  const Stack = createNativeStackNavigator<RootStackParamLists>();

  return (
    <SafeAreaProvider>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator
          initialRouteName="ReservationScreen"
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
            name="ReservationReview"
            component={ReservationReviewScreen}
          />

          <Stack.Screen
            name="ReservationScreen"
            component={ReservationScreen}
          />
          <Stack.Screen
            name="ReservationPayment"
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

          <Stack.Screen name="OrderHomeScreen" component={OrderHomeScreen} />

          <Stack.Screen
            name="WaitingConfirmationScreen"
            component={WaitingConfirmationScreen}
          />
          <Stack.Screen name="PaymentScreen" component={PaymentScreen} />

          <Stack.Screen
            name="BookingSummaryScreen"
            component={BookingSummaryScreen}
          />

          <Stack.Screen
            name="ViewOrderStatusScreen"
            component={ViewOrderStatusScreen}
/>

          {/* shams testing - ignore niyo lang ito  */}

          {/* <Stack.Screen
            name="ReservationScreenTesting"
            component={ReservationScreenTesting}
          /> */}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
