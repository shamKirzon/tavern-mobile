import {
  View,
  Text,
  Keyboard,
  Modal,
  Pressable,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { width, height } from "../utils/dimensions";
import MainBackground from "../assets/backgrounds/main-background.svg";
import LogoutModal from "../assets/icons/logout-staff-scanner-modal.svg";
import LogoutScanner from "../assets/icons/logout-staff-scanner.svg";

import { CameraView, useCameraPermissions } from "expo-camera";
import { updateToken } from "../services/token";
import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamLists } from "../types/rootStackParamLists";
import { useEmployeeStore } from "../stores/useEmployeeStore";

type StaffQRResultScreenRouteProps = RouteProp<
  RootStackParamLists,
  "StaffQRResultScreen"
>;
type StaffQRResultScreenNavigationProps = NativeStackNavigationProp<
  RootStackParamLists,
  "StaffQRResultScreen"
>;

interface Props {
  route: StaffQRResultScreenRouteProps;
  navigation: StaffQRResultScreenNavigationProps;
}

const StaffQRResultScreen: React.FC<Props> = ({ navigation, route }) => {
  const { qrResult } = route.params;

  // Functions

  return (
    <View style={{ flex: 1 }}>
      {/* Background */}
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
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: width * 0.08,
        }}
      >
        {/* Text above scanner */}
        <Text
          style={{
            fontSize: width * 0.08,
            fontWeight: "bold",
            color: "#fff",
            fontFamily: "Poppins-Bold",
            textAlign: "center",
          }}
        >
          SCANNED QR RESULTS
        </Text>

        {Object.entries(qrResult).map(([key, value], index) => (
          <>
            <Text
              key={index}
              style={{
                fontSize: width * 0.04,
                color: "#fff",
                fontFamily: "Poppins",
                marginBottom: height * 0.02,
                textAlign: "center",
              }}
            >
              {key}: {value}
            </Text>
          </>
        ))}
      </View>
    </View>
  );
};

export default StaffQRResultScreen;
