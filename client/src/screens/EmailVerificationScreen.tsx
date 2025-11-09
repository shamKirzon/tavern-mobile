import React, { useState, useRef, useEffect } from "react";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamLists } from "../types/rootStackParamLists";
import { height, width } from "../utils/dimensions";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import MainBackground from "../assets/backgrounds/main-background.svg";
import { generateOtp, registerEmail, validateOtp } from "../services/auth";
import { useAuthStore } from "../stores/useAuthStore";

type EmailVerificationScreenRouteProps = RouteProp<
  RootStackParamLists,
  "EmailVerificationScreen"
>;
type EmailVerificationScreenNavigationProps = NativeStackNavigationProp<
  RootStackParamLists,
  "EmailVerificationScreen"
>;

interface Props {
  route: EmailVerificationScreenRouteProps;
  navigation: EmailVerificationScreenNavigationProps;
}

const EmailVerificationScreen: React.FC<Props> = ({ navigation, route }) => {
  const { email } = route.params;
  const { setShowEmailVerifiedToggle, showEmailVerifiedToggle } =
    useAuthStore();
  const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
  const [countdown, setCountdown] = useState<number>(55);
  const [canResend, setCanResend] = useState<boolean>(false);
  const [isOtpInvalid, setIsOtpInvalid] = useState<boolean>(false);
  const inputRefs = [
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
  ];

  // testing console part:
  useEffect(() => {
    console.log("value of showEmailVerifiedToggle: ", showEmailVerifiedToggle);
  }, [showEmailVerifiedToggle]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const showOtpError = () => {
    setIsOtpInvalid(true);

    setTimeout(() => {
      setIsOtpInvalid(false);
    }, 3000);
  };
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyPress = (index: number, key: string) => {
    if (key === "Backspace" && !otp[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleContinue = async () => {
    const otpCode = otp.join("");

    // otp validation part:
    // result = isValidOtp & message
    const result = await validateOtp(email, otpCode);
    if (!result?.isValidOtp) {
      showOtpError();
      console.log("message:", result?.message);
      setOtp(["", "", "", ""]);
      inputRefs[0].current?.focus();
      return;
    }

    // if correct otp:
    await registerEmail(email);

    setShowEmailVerifiedToggle(true);
    navigation.navigate("HomeScreen");
  };

  const handleResendCode = async () => {
    if (!canResend) return;
    await generateOtp(email);
    console.log("Resend OTP to:", email);
    setCountdown(55);
    setCanResend(false);
    setOtp(["", "", "", ""]);
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ width, height, flex: 1 }}>
        <MainBackground style={{ position: "absolute", height: "100%" }} />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: width * 0.08,
          }}
        >
          {/* Back Button */}
          <TouchableOpacity
            onPress={handleBack}
            style={{
              position: "absolute",
              top: height * 0.06,
              left: width * 0.06,
            }}
          >
            <Text style={{ color: "#FFFFFF", fontSize: 28 }}>←</Text>
          </TouchableOpacity>

          {/* Title Section */}
          <View style={{ marginBottom: height * 0.03 }}>
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: width * 0.08,
                fontWeight: "bold",
                fontFamily: "Poppins",
              }}
            >
              Email Verification
            </Text>
            <Text
              style={{
                color: "rgba(255, 255, 255, 0.85)",
                textAlign: "center",
                fontSize: width * 0.04,
                marginTop: height * 0.015,
                fontFamily: "Poppins",
              }}
            >
              We have sent a 4-digit verification code to your email address.
              Please enter it below to continue.
            </Text>
          </View>

          {/* OTP Input Fields */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              columnGap: width * 0.05,
              marginTop: height * 0.02,
              marginBottom: height * 0.05,
            }}
          >
            {[0, 1, 2, 3].map((index) => (
              <TextInput
                key={index}
                ref={inputRefs[index]}
                keyboardType="numeric"
                maxLength={1}
                value={otp[index]}
                onChangeText={(value) => handleOtpChange(index, value)}
                onKeyPress={({ nativeEvent }) =>
                  handleKeyPress(index, nativeEvent.key)
                }
                style={{
                  width: width * 0.17,
                  height: width * 0.17,
                  backgroundColor: "#FFFFFF",
                  borderRadius: 10,
                  textAlign: "center",
                  fontSize: width * 0.065,
                  fontWeight: "600",
                  fontFamily: "Poppins",
                  color: "#333333",
                }}
              />
            ))}
          </View>

          {isOtpInvalid && (
            <Text
              style={{
                color: "#EFD974",
                fontSize: width * 0.04,
                marginBottom: 6,
                fontFamily: "Poppins",
              }}
            >
              OTP is incorrect. Please try again.
            </Text>
          )}

          {/* Resend Code Section */}
          <View style={{ alignItems: "center", marginBottom: height * 0.045 }}>
            <Text
              style={{
                color: "rgba(255, 255, 255, 0.7)",
                fontSize: width * 0.035,
                marginBottom: 6,
                fontFamily: "Poppins",
              }}
            >
              Didn't receive an email?
            </Text>
            <TouchableOpacity onPress={handleResendCode} disabled={!canResend}>
              <Text
                style={{
                  color: canResend ? "#FFFFFF" : "rgba(255, 255, 255, 0.5)",
                  fontSize: width * 0.035,
                  textDecorationLine: canResend ? "underline" : "none",
                  fontFamily: "Poppins",
                }}
              >
                {canResend
                  ? "Resend code"
                  : `You can resend code in ${countdown}s`}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            onPress={handleContinue}
            disabled={otp.some((digit) => digit === "")}
            style={{
              backgroundColor: "#8B0000",
              paddingVertical: height * 0.022,
              borderRadius: 10,
              alignItems: "center",
              width: "85%",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 3,
              elevation: 4,
              opacity: otp.some((digit) => digit === "") ? 0.5 : 1,
            }}
          >
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: width * 0.05,
                fontWeight: "600",
                fontFamily: "Poppins",
              }}
            >
              Continue
            </Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default EmailVerificationScreen;
