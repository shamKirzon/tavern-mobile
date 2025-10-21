import React, { useState } from "react";
import Logo from "../assets/icons/neon-logo.svg";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamLists } from "../types/type";
import { height, width } from "../utils/dimensions";
import MainBackground from "../assets/backgrounds/main-background.svg";
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

// start kayo dito ng pagkopya ng format

type WelcomeSceenRouteProps = RouteProp<RootStackParamLists, "WelcomeScreen">;
type WelcomeScreenNavigationProps = NativeStackNavigationProp<
  RootStackParamLists,
  "WelcomeScreen"
>;

interface Props {
  route: WelcomeSceenRouteProps;
  navigation: WelcomeScreenNavigationProps;
}

const WelcomeScreen: React.FC<Props> = ({ navigation, route }) => {
  return (
    <View style={{ width, height, flex: 1 }}>
      <MainBackground
        preserveAspectRatio="none" // allows the SVG to stretch and fill the entire screen
        style={{
          position: "absolute",
          width: "100%",
          height: "100%", // ensures full coverage
        }}
      />

      {/* Foreground content */}
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: width * 0.08,
        }}
      >
        {/* Logo */}
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Logo />
        </View>

        {/* Button */}
        <TouchableOpacity
          onPress={() => navigation.navigate("HomeScreen")}
          style={{
            backgroundColor: "#FFFFFF",
            paddingVertical: width * 0.05,
            paddingHorizontal: 40,
            borderRadius: 30,
            marginTop: height * 0.3,
          }}
        >
          <Text
            style={{
              color: "#1C0404",
              fontSize: width * 0.06,
              fontWeight: "bold",
            }}
          >
            Get Started na Gar
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default WelcomeScreen;