import React, { useState } from "react";
import Logo from "../assets/icons/neon-logo.svg";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamLists } from "../types/rootStackParamLists";
import { height, width } from "../utils/dimensions";
import MainBackground from "../assets/backgrounds/main-background.svg";
import ScheduleIcon from "../assets/icons/schedule-icon.svg";
import LocationIcon from "../assets/icons/location-icon.svg";

import { View, Text, TouchableOpacity, StatusBar } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import ResizableSidebar from "./ui/ResizableSidebar";

type WelcomeSceenRouteProps = RouteProp<RootStackParamLists, "WelcomeScreen">;
type WelcomeScreenNavigationProps = NativeStackNavigationProp<
  RootStackParamLists,
  "WelcomeScreen"
>;

interface Props {
  route: WelcomeSceenRouteProps;
  navigation: WelcomeScreenNavigationProps;
}

const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" />

      {/* Main background */}
      <MainBackground
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
        }}
      />

      {/* Main content */}
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: width * 0.08,
          paddingVertical: height * 0.08,
        }}
      >
        {/* Logo */}
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Logo />
        </View>

        {/* Info Lines */}
        <View
          style={{
            marginTop: height * 0.2,
          }}
        >
          {/* Open Hours */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: height * 0.02,
            }}
          >
            <ScheduleIcon width={width * 0.05} height={width * 0.05} />
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: width * 0.035,
                marginLeft: width * 0.02,
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
            <LocationIcon width={width * 0.05} height={width * 0.05} />
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: width * 0.035,
                marginLeft: width * 0.02,
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
            paddingHorizontal: width * 0.28,
            borderRadius: width * 0.04,
            marginTop: height * 0.15,
          }}
        >
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: width * 0.05,
              fontWeight: "bold",
            }}
          >
            Get Started
          </Text>
        </TouchableOpacity>
      </View>

      {/* Dim overlay when sidebar is open */}
      {isSidebarOpen && (
        <TouchableOpacity
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.3)",
            zIndex: 50,
          }}
          onPress={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar overlay */}
      <ResizableSidebar
        minWidth={0}
        maxWidth={width * 0.78}
        initialOpen={false}
        animationDuration={200}
        open={isSidebarOpen}
        onToggle={setIsSidebarOpen}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 100,
        }}
      >
        {/* resizable side bar content:  */}
        <TouchableOpacity onPress={() => setIsSidebarOpen(false)}>
          <Text
            style={{
              padding: width * 0.04,
              fontSize: width * 0.05,
              fontWeight: "bold",
              color: "#FFF",
            }}
          >
            Customer
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("StaffHomeScreen")}
        >
          <Text
            style={{
              padding: width * 0.04,
              fontSize: width * 0.05,
              fontWeight: "bold",
              color: "#FFF",
            }}
          >
            Staff
          </Text>
        </TouchableOpacity>
      </ResizableSidebar>
    </View>
  );
};

export default WelcomeScreen;
