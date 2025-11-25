import {
  View,
  Text,
  Keyboard,
  Modal,
  Pressable,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { width, height, paddingTop } from "../utils/dimensions";
import MainBackground from "../assets/backgrounds/main-background.svg";
import LogoutModal from "../assets/icons/logout-staff-scanner-modal.svg";
import LogoutScanner from "../assets/icons/logout-staff-scanner.svg";
import Loading from "./ui/Loading";

import { CameraView, useCameraPermissions } from "expo-camera";
import { updateToken } from "../services/token";
import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamLists } from "../types/rootStackParamLists";
import { useEmployeeStore } from "../stores/useEmployeeStore";
import { decryptQr } from "../services/employee";

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
  const [permission, requestPermission] = useCameraPermissions();
  const { employeeRole } = useEmployeeStore();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [scannedData, setScannedData] = useState<{
    reservationId: string;
    orderId: string;
  } | null>(null);

  const [hasScanned, setHasScanned] = useState(false);

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

  const getIdByRole = (data: any) => {
    const { reservationId, orderId } = data;
    return employeeRole === "cashier" ? { orderId } : { reservationId };
  };

  const handleScanned = async (barcode: { type: string; data: string }) => {
    if (hasScanned) return;
    setHasScanned(true);

    try {
      if (!scannedData) {
        const encrypted = barcode.data;

        const decrypted = await decryptQr(encrypted);
        const decryptedJson = JSON.parse(decrypted);

        const id = getIdByRole(decryptedJson);

        navigation.navigate("StaffQRResultScreen", {
          qrResult: id,
          isValid: true,
        });
      }
    } catch (error) {
      console.log("Error in handleScanned():", error);

      navigation.navigate("StaffQRResultScreen", {
        isValid: false,
      });

      setHasScanned(false);
    }
  };

  return (
    <>
      {isLoading && Loading("")}

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
        {/* <View
          style={{
            position: "absolute",
            top: height * 0.1,
            alignSelf: "center",
            paddingHorizontal: width * 0.04,
            paddingVertical: width * 0.02,
            borderRadius: width * 0.03,
            backgroundColor: "#8A1717",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 99,
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontWeight: "bold",
              fontSize: width * 0.07,
            }}
          >
            {employeeRole?.toString().charAt(0).toUpperCase()}
            {employeeRole?.toString().slice(1)}
          </Text>
        </View> */}

        {/* Logout Icon */}
        {/* <View
          style={{
            position: "absolute",
            top: height * 0.05,
            right: width * 0.05,
            width: width * 0.15,
            height: width * 0.15,
            borderRadius: width * 0.15,
            borderColor: "#fff",
            borderWidth: width * 0.005,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "transparent",
            zIndex: 99,
          }}
        >
          <Pressable
            onPress={() => setModalVisible(true)}
            style={({ pressed }) => ({
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              opacity: pressed ? 0.6 : 1,
              transform: [{ scale: pressed ? 0.95 : 1 }],
            })}
          >
            <LogoutScanner width={width * 0.08} />
          </Pressable>
        </View> */}

        {/* Center Content */}
        <View
          style={{
            flex: 1,
            // justifyContent: "center",
            // alignItems: "center",
            paddingHorizontal: width * 0.08,
            backgroundColor: "rgba(0,0,0,0.7)",
          }}
        >
          {/* Header */}
          <View
            style={{
              paddingTop: paddingTop + 5,
              flexDirection: "row",
              alignItems: "center",
              marginBottom: height * 0.01,
            }}
          >
            <Pressable
              onPress={() => setModalVisible(true)}
              style={({ pressed }) => ({
                justifyContent: "center",
                alignItems: "center",
                opacity: pressed ? 0.6 : 1,
                transform: [{ scale: pressed ? 0.95 : 1 }],
              })}
            >
              <LogoutScanner width={width * 0.08} />
            </Pressable>
          </View>

          <View
            style={{ flex: 1, alignItems: "center", marginTop: height * 0.06 }}
          >
            <View
              style={{
                paddingHorizontal: width * 0.1,
                paddingVertical: width * 0.02,
                borderRadius: width * 0.03,
                backgroundColor: "#8A1717",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  color: "#FFFF",
                  fontSize: width * 0.08,
                  fontWeight: "bold",
                }}
              >
                {employeeRole?.charAt(0).toUpperCase()}
                {employeeRole?.slice(1)}
              </Text>
            </View>

            <Text
              style={{
                marginTop: height * 0.08,
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
                marginBottom: height * 0.04,
                textAlign: "center",
                opacity: 0.8,
              }}
            >
              Place the QR code inside the area. Scanning will start
              automatically.
            </Text>

            {/* Scanner Box */}
            <View
              style={{
                width: width * 0.6,
                height: width * 0.6,
                overflow: "hidden",
                borderRadius: width * 0.02,
              }}
            >
              <CameraView
                style={{ flex: 1 }}
                facing="back"
                barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
                onBarcodeScanned={hasScanned ? undefined : handleScanned}
              />

              {/* Scanner Corners */}
              {[
                { top: 0, left: 0, borderTopWidth: 3, borderLeftWidth: 3 },
                { top: 0, right: 0, borderTopWidth: 3, borderRightWidth: 3 },
                {
                  bottom: 0,
                  left: 0,
                  borderBottomWidth: 3,
                  borderLeftWidth: 3,
                },
                {
                  bottom: 0,
                  right: 0,
                  borderBottomWidth: 3,
                  borderRightWidth: 3,
                },
              ].map((pos, i) => (
                <View
                  key={i}
                  style={{
                    position: "absolute",
                    width: width * 0.1,
                    height: width * 0.1,
                    borderColor: "#fff",
                    ...pos,
                  }}
                />
              ))}
            </View>
          </View>
        </View>

        {/* Logout Modal */}
        <Modal animationType="slide" transparent={true} visible={modalVisible}>
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
              }}
            >
              {/* Modal Icon */}
              <View
                style={{
                  width: width * 0.2,
                  height: width * 0.2,
                  borderRadius: width * 0.2,
                  backgroundColor: "#fff",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <LogoutModal width={width * 0.12} />
              </View>

              <Text
                style={{
                  marginTop: width * 0.04,
                  color: "#fff",
                  fontSize: width * 0.06,
                  fontWeight: "bold",
                  marginBottom: width * 0.02,
                }}
              >
                Confirm Logout
              </Text>

              <Text
                style={{
                  color: "#fff",
                  textAlign: "center",
                  fontSize: width * 0.04,
                  marginBottom: height * 0.03,
                  opacity: 0.8,
                }}
              >
                Are you sure you want to logout? You will need to login again.
              </Text>

              {/* Buttons */}
              <View style={{ flexDirection: "row", gap: width * 0.04 }}>
                {["Cancel", "Yes, Proceed"].map((label, index) => (
                  <Pressable
                    key={index}
                    onPress={() => {
                      if (index === 0) setModalVisible(false);
                      else handleLogout();
                    }}
                    style={({ pressed }) => ({
                      backgroundColor: index === 0 ? "#fff" : "#8A1717",
                      paddingVertical: height * 0.02,
                      borderRadius: width * 0.03,
                      alignItems: "center",
                      width: width * 0.34,
                      opacity: pressed ? 0.7 : 1,
                      transform: [{ scale: pressed ? 0.97 : 1 }],
                    })}
                  >
                    <Text
                      style={{
                        color: index === 0 ? "#8A1717" : "#fff",
                        fontSize: width * 0.04,
                        fontWeight: "600",
                      }}
                    >
                      {label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </Pressable>
          </Pressable>
        </Modal>
      </View>
    </>
  );
};

export default StaffQRScannerScreen;
