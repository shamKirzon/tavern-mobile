import { View, Text, Dimensions } from "react-native";
import React from "react";
import EmailAuth from "./screens/EmailAuth";
import Reservation from "./screens/Reservation";
import ReservationPayment from "./screens/ReservationPayment";
import ReservationReview from "./screens/ReservationReview";
import Otp from "./screens/Otp";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamLists } from "./types/type";
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
          <Stack.Screen name="EmailAuth" component={EmailAuth} />
          <Stack.Screen name="Otp" component={Otp} />
          <Stack.Screen name="Reservation" component={Reservation} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
