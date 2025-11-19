import React, { use, useState } from "react";
import Logo from "../assets/icons/neon-logo.svg";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamLists } from "../types/rootStackParamLists";
import { height, width } from "../utils/dimensions";
import Authentication from "../assets/icons/authentication.svg";
import MainBackground from "../assets/backgrounds/main-background.svg";

import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Modal,
  TextInput,
  Pressable,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { validatePin } from "../services/employee";
import { EmployeeRole } from "../types/employee";
import Loading from "./ui/Loading";
import { updateToken } from "../services/token";

type StaffHomeScreenRouteProps = RouteProp<
  RootStackParamLists,
  "StaffHomeScreen"
>;
type StaffHomeScreenNavigationProps = NativeStackNavigationProp<
  RootStackParamLists,
  "StaffHomeScreen"
>;

interface Props {
  route: StaffHomeScreenRouteProps;
  navigation: StaffHomeScreenNavigationProps;
}

const StaffHomeScreen: React.FC<Props> = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [enteredCode, setEnteredCode] = useState("");
  const [selectedRole, setSelectedRole] = useState<EmployeeRole | undefined>(
    undefined
  );
  const [isPinError, setIsPinError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const inputRefs = React.useRef<any[]>([]);

  const [digitValues, setDigitValues] = useState(["", "", "", "", ""]);

  // functions:

  const showPINError = () => {
    setIsPinError(true);

    setTimeout(() => {
      setIsPinError(false);
    }, 3000);
  };

  const handleDigitChange = (text: string, index: number) => {
    const digits = [...digitValues];
    digits[index] = text;
    setDigitValues(digits);

    if (text && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && digitValues[index] === "") {
      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleSubmitDigits = async () => {
    try {
      const code = digitValues.join("");

      if (code.length < 5) {
        showPINError();
        return;
      }

      setIsLoading(true);

      const res = await validatePin(code, selectedRole);

      // results example:
      const myResData = {
        employee_id: "25273ea9-4cce-40a1-a02a-adecd1a8c6d9",
        employee_role: "cashier",
        full_name: "Dummy Cashier",
        image_url: null,
        pin: "12345",
        shift_day: "Tuesday, Wednesday, Friday",
        shift_end: "4:00",
        shift_start: "8:00",
      };

      if (res) {
        Alert.alert(`${selectedRole} Verified!`, `Code entered: ${code}`);
        updateToken({ employeeId: res.employee_id });
        setModalVisible(false);
        setDigitValues(["", "", "", "", ""]);
        setIsPinError(false);
      } else {
        showPINError();
        setDigitValues(["", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      console.error("error in validating pin ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleButtonAction = (role: EmployeeRole) => {
    setSelectedRole(role);
    setEnteredCode("");
    setModalVisible(true);
  };

  return (
    <>
      <View style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" />

        {/* Main background */}
        <MainBackground
          style={{ position: "absolute", width: "100%", height: "100%" }}
        />

        {/* Main content */}
        <View
          style={{
            flex: 1,
            alignItems: "center",
            paddingHorizontal: width * 0.08,
          }}
        >
          {/* Logo */}
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginTop: height * 0.16,
            }}
          >
            <Logo />
          </View>

          {/* Bottom fixed section */}
          <View
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              paddingHorizontal: width * 0.14,
              paddingBottom: width * 0.15,
              paddingTop: height * 0.035,
              borderTopLeftRadius: width * 0.1,
              borderTopRightRadius: width * 0.1,
            }}
          >
            {/* Welcome text */}
            <Text
              style={{
                fontSize: width * 0.08,
                fontWeight: "bold",
                color: "#fff",
                fontFamily: "Poppins-ExtraBoldItalic",
              }}
            >
              Welcome!
            </Text>

            <Text
              style={{
                fontSize: width * 0.04,
                color: "#fff",
                marginBottom: height * 0.05,
              }}
            >
              Select your role to proceed
            </Text>

            {/* Roles buttons */}
            {["Security", "Cashier"].map((role, index) => (
              <TouchableOpacity
                key={role}
                onPress={() =>
                  handleButtonAction(role.toLowerCase() as EmployeeRole)
                }
                style={{
                  backgroundColor: "#8A1717",
                  paddingVertical: height * 0.03,
                  borderRadius: width * 0.03,
                  alignItems: "center",
                  marginBottom: index === 0 ? height * 0.025 : height * 0.015,
                  width: "100%",
                }}
              >
                <Text
                  style={{
                    fontSize: width * 0.05,
                    fontWeight: "600",
                    color: "#fff",
                    fontFamily: "Poppins",
                  }}
                >
                  {role}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Modal for 5-digit code */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            {isLoading && Loading("")}
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : undefined}
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
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
                  }}
                >
                  <Authentication />

                  <Text
                    style={{
                      color: "#fff",
                      fontSize: width * 0.06,
                      fontWeight: "bold",
                      marginBottom: width * 0.01,
                    }}
                  >
                    Authentication
                  </Text>

                  {/* subtext:  */}
                  <Text
                    style={{
                      color: "#fff",
                      fontSize: width * 0.04,
                      fontWeight: "200",
                      marginBottom: height * 0.03,
                    }}
                  >
                    Please enter your {selectedRole} PIN
                  </Text>

                  {/* 5-digit input boxes */}
                  <View style={{ flexDirection: "row", gap: width * 0.03 }}>
                    {Array.from({ length: 5 }).map((_, index) => (
                      <TextInput
                        key={index}
                        ref={(ref: any) => (inputRefs.current[index] = ref)}
                        value={digitValues[index]}
                        onChangeText={(text) => handleDigitChange(text, index)}
                        onKeyPress={(e) => handleBackspace(e, index)}
                        keyboardType="numeric"
                        maxLength={1}
                        style={{
                          width: width * 0.13,
                          height: width * 0.15,
                          backgroundColor: "#FFFFFF",
                          color: "#0a0a0a",
                          fontSize: width * 0.06,
                          textAlign: "center",
                          fontWeight: "700",
                          borderRadius: width * 0.02,
                          borderWidth: isPinError ? 2 : 0, // highlight border on error
                          borderColor: isPinError ? "#FF4C4C" : "transparent",
                        }}
                      />
                    ))}
                  </View>

                  {/* Error Message */}
                  {isPinError && (
                    <Text
                      style={{
                        color: "#FF4C4C",
                        fontSize: width * 0.035,
                        marginTop: height * 0.015,
                        fontWeight: "600",
                      }}
                    >
                      Invalid PIN entered. Please try again.
                    </Text>
                  )}

                  <Pressable
                    onPress={handleSubmitDigits}
                    style={{
                      backgroundColor: "#8A1717",
                      paddingVertical: height * 0.025,
                      borderRadius: width * 0.03,
                      width: "100%",
                      alignItems: "center",
                      marginTop: height * 0.05,
                    }}
                  >
                    <Text
                      style={{
                        color: "#fff",
                        fontSize: width * 0.05,
                        fontWeight: "600",
                      }}
                    >
                      Submit
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() => setModalVisible(false)}
                    style={{ marginTop: height * 0.02 }}
                  >
                    <Text style={{ color: "#fff", fontSize: width * 0.04 }}>
                      Cancel
                    </Text>
                  </Pressable>
                </Pressable>
              </Pressable>
            </KeyboardAvoidingView>
          </Modal>
        </View>
      </View>
    </>
  );
};

export default StaffHomeScreen;
