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

type StaffQRScannerScreenRouteProps = RouteProp<
  RootStackParamLists,
  "StaffQRScannerScreen"
>;
type StaffQRScannerScreenNavigationProps = NativeStackNavigationProp<
  RootStackParamLists,
  "StaffQRScannerScreen"
>;

interface Props {
  route: StaffQRScannerScreenRouteProps;
  navigation: StaffQRScannerScreenNavigationProps;
}

const StaffQRScannerScreen: React.FC<Props> = ({ navigation }) => {
  const { employeeRole } = useEmployeeStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedData, setScannedData] = useState<{
    reservationId: string;
    orderId: string;
  } | null>(null);

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "#fff" }}>We need your camera permission</Text>
        <Pressable
          onPress={requestPermission}
          style={{
            marginTop: 20,
            padding: 12,
            backgroundColor: "#000",
            borderRadius: 8,
          }}
        >
          <Text style={{ color: "#fff" }}>Grant Permission</Text>
        </Pressable>
      </View>
    );
  }

  // Functions
  const handleLogout = async () => {
    await updateToken({ employeeId: null });
    setModalVisible(false);
    navigation.navigate("StaffHomeScreen");
  };
  const handleScanned = async (barcode: { type: string; data: string }) => {
    if (!scannedData) {
      console.log("Scanned QR Information:", barcode.data);
      const { reservationId, orderId } = JSON.parse(barcode.data);
      setScannedData({ reservationId, orderId });

      navigation.navigate("StaffQRResultScreen", {
        qrResult: { reservationId, orderId },
      });
    }

    return;
  };

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

      {/* Role Label */}
      <View
        style={{
          position: "absolute",
          top: width * 0.4,
          alignSelf: "center",
          paddingHorizontal: width * 0.04, // Horizontal padding for the label
          paddingVertical: width * 0.02, // Vertical padding for the label
          borderRadius: width * 0.02, // Slightly rounded corners
          backgroundColor: "#8A1717", // Red background
          justifyContent: "center",
          alignItems: "center",
          zIndex: 99,
        }}
      >
        <Text
          style={{
            color: "#fff", // White text
            fontWeight: "bold",
            fontSize: width * 0.07, // Adjust font size
          }}
        >
          {employeeRole?.toString().charAt(0).toUpperCase()}
          {employeeRole?.toString().slice(1)}
        </Text>
      </View>

      {/* Logout Icon */}
      <View
        style={{
          position: "absolute",
          top: width * 0.16,
          right: width * 0.05,
          width: width * 0.15,
          height: width * 0.15,
          borderRadius: 100,
          borderColor: "#fff",
          borderWidth: 1.4,
          backgroundColor: "transparent",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 99,
        }}
      >
        <Pressable
          onPress={() => setModalVisible(true)}
          style={({ pressed }) => ({
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
            opacity: pressed ? 0.6 : 1, // Fade on press
            transform: [{ scale: pressed ? 0.95 : 1 }], // Slight shrink on press
          })}
        >
          <LogoutScanner width={30} />
        </Pressable>
      </View>

      {/* Centered content */}
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: width * 0.08,
          backgroundColor: "rgba(0,0,0,0.7)",
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
          Scan QR Code
        </Text>

        <Text
          style={{
            fontSize: width * 0.04,
            color: "#fff",
            fontFamily: "Poppins",
            marginBottom: height * 0.04, // spacing between text and scanner
            textAlign: "center",
          }}
        >
          Place the QR code properly inside the area. Scanning will start
          automatically.
        </Text>

        {/* Scanner */}
        <View
          style={{
            width: 260,
            height: 260,
            overflow: "hidden",
          }}
        >
          <CameraView
            style={{ flex: 1 }}
            facing="back"
            barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
            onBarcodeScanned={handleScanned}
          />

          {/* Corner brackets */}
          {/* Top Left */}
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: 40,
              height: 40,
              borderTopWidth: 3,
              borderLeftWidth: 3,
              borderColor: "#fff",
            }}
          />
          {/* Top Right */}
          <View
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: 40,
              height: 40,
              borderTopWidth: 3,
              borderRightWidth: 3,
              borderColor: "#fff",
            }}
          />
          {/* Bottom Left */}
          <View
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: 40,
              height: 40,
              borderBottomWidth: 3,
              borderLeftWidth: 3,
              borderColor: "#fff",
            }}
          />
          {/* Bottom Right */}
          <View
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              width: 40,
              height: 40,
              borderBottomWidth: 3,
              borderRightWidth: 3,
              borderColor: "#fff",
            }}
          />
        </View>
      </View>

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          onPress={() => Keyboard.dismiss()}
          style={{
            flex: 1,
            width: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: width * 0.08,
          }}
        >
          <Pressable
            onPress={() => {}}
            style={{
              backgroundColor: "#171717",
              padding: width * 0.06,
              borderRadius: width * 0.04,
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Logout Modal Icon */}
            <View
              style={{
                width: width * 0.2,
                height: width * 0.2,
                borderRadius: 100,
                backgroundColor: "#fff",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <LogoutModal width={50} />
            </View>

            <Text
              style={{
                marginTop: width * 0.04,
                color: "#fff",
                fontSize: width * 0.06,
                fontWeight: "bold",
                marginBottom: width * 0.01,
              }}
            >
              Confirm Logout
            </Text>

            <View
              style={{
                marginTop: width * 0.01,
                paddingHorizontal: width * 0.05,
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  textAlign: "center",
                  fontSize: width * 0.04,
                  fontWeight: "200",
                  marginBottom: height * 0.03,
                }}
              >
                Are you sure you want to logout? You will need to login again to
                access the system.
              </Text>
            </View>

            {/* Buttons */}
            <View style={{ flexDirection: "row", gap: width * 0.04 }}>
              {["Cancel", "Yes, Proceed"].map((item, index) => (
                <Pressable
                  key={index}
                  style={({ pressed }) => ({
                    backgroundColor: index === 0 ? "#FFFF" : "#8A1717",
                    paddingVertical: height * 0.02,
                    borderRadius: width * 0.03,
                    alignItems: "center",
                    width: width * 0.34,
                    opacity: pressed ? 0.7 : 1,
                    transform: [{ scale: pressed ? 0.97 : 1 }],
                  })}
                  onPress={() => {
                    if (index === 0) setModalVisible(false);
                    else handleLogout();
                  }}
                >
                  <Text
                    style={{
                      color: index === 0 ? "#8A1717" : "#FFFF",
                      fontSize: width * 0.04,
                      fontWeight: "600",
                    }}
                  >
                    {item}
                  </Text>
                </Pressable>
              ))}
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

export default StaffQRScannerScreen;
