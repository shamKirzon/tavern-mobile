import React, { useState } from "react";
import Logo from "../assets/icons/neon-logo.svg";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamLists } from "../types/type";
import { height, width } from "../utils/dimensions";
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

interface Props {
  route: RouteProp<RootStackParamLists, "WelcomeScreen">;
  navigation: NativeStackNavigationProp<RootStackParamLists, "WelcomeScreen">;
}

const WelcomeScreen: React.FC<Props> = ({ navigation, route }) => {
  return (
    <ImageBackground
      source={require("../assets/backgrounds/main-background.png")}
      style={{
        width,
        height,
        flex: 1,
        justifyContent: "space-between",
        alignItems: "center",
        padding: width * 0.08,
      }}
      resizeMode="cover"
    >
      {/* Logo in the center */}
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
        }}
      >
        <Logo />
      </View>

      {/* Button at the bottom */}
      <TouchableOpacity
        onPress={() => navigation.navigate("HomeScreen")}
        style={{
          backgroundColor: "#FFFFFF",
          paddingVertical: width * 0.05,
          paddingHorizontal: 40,
          borderRadius: 30,
          marginBottom: 40,
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
    </ImageBackground>
  );
};

export default WelcomeScreen;
