import React, { useState } from "react";
import Logo from "../assets/icons/neon-logo.svg";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamLists } from "../types/rootStackParamLists";
import { height, width } from "../utils/dimensions";
import MainBackground from "../assets/backgrounds/main-background.svg";
import ScheduleIcon from "../assets/icons/schedule-icon.svg";
import LocationIcon from "../assets/icons/location-icon.svg";

import { View, Text, TouchableOpacity } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

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
        style={{ position: "absolute", height: "100%" }} // ⬅️ Makes it a background layer
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

        {/* Info Lines */}
        <View style={{ marginTop: height * 0.2 }}>
          {/* Open Hours */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <ScheduleIcon width={20} height={20} />
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: width * 0.035,
                marginLeft: 8,
              }}
            >
              Open Hours: 05:00 PM - 02:00 AM
            </Text>
          </View>

          {/* Address */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              width: width * 0.8,
            }}
          >
            <LocationIcon width={20} height={20} />
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: width * 0.035,
                marginLeft: 8,
              }}
            >
              #197 Aguirre Avenue, B.F. Homes, Parañaque, Philippines
            </Text>
          </View>
        </View>

        {/* Button */}
        <TouchableOpacity
          onPress={() => navigation.navigate("HomeScreen")}
          style={{
            backgroundColor: "#8A1717",
            paddingVertical: width * 0.055,
            paddingHorizontal: 105,
            borderRadius: 16,
            marginTop: height * 0.15,
          }}
        >
          <Text
            style={{
              color: "#FFFF",
              fontSize: width * 0.05,
              fontWeight: "bold",
            }}
          >
            Get Started
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default WelcomeScreen;
