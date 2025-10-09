import { View, Text, Dimensions } from "react-native";
import React from "react";
import EmailAuthScreen from "./src/screens/HomeScreen";
import Reservation from "./src/screens/ReservationScreen";
import ReservationPaymentScreen from "./src/screens/ReservationPaymentScreen";
import ReservationReviewScreen from "./src/screens/ReservationReviewScreen";
import Otp from "./src/screens/OtpScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamLists } from "./src/types/type";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { navigationRef } from "./navigationRef";

const App = () => {
  const Stack = createNativeStackNavigator<RootStackParamLists>();

  // fonts:
  // const [fontsLoaded] = useFonts

  return (
    <SafeAreaProvider>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator
          initialRouteName="EmailAuth"
          screenOptions={{
            headerShown: false,
            animation: "none",
          }}
        >
          <Stack.Screen name="EmailAuth" component={EmailAuthScreen} />
          <Stack.Screen name="Otp" component={Otp} />
          <Stack.Screen name="Reservation" component={Reservation} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
