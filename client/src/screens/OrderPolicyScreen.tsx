import React, { useState } from "react";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamLists } from "../types/rootStackParamLists";
import { height, width } from "../utils/dimensions";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import MainBackground from "../assets/backgrounds/main-background.svg";

type OrderPolicyScreenRouteProps = RouteProp<
  RootStackParamLists,
  "OrderPolicyScreen"
>;
type OrderPolicyScreenNavigationProps = NativeStackNavigationProp<
  RootStackParamLists,
  "OrderPolicyScreen"
>;

interface Props {
  route: OrderPolicyScreenRouteProps;
  navigation: OrderPolicyScreenNavigationProps;
}

const OrderPolicyScreen: React.FC<Props> = ({ navigation }) => {
  const [orderSpendLimit] = useState("15,000.00");
  const [agreed, setAgreed] = useState(false);

  const handleContinueOrdering = () => {
    if (!agreed) {
      Alert.alert("Error", "Please agree to the terms and conditions");
      return;
    }
    // navigation.navigate("NextScreen");
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={{ width, height, flex: 1 }}>
      {/* Background Layer */}
      <MainBackground style={{ position: "absolute", height: "100%" }} />

      {/* Main Content Container */}
      <View
        style={{
          flex: 1,
          padding: width * 0.05,
          paddingTop: height * 0.06,
        }}
      >
        <View>
          {/* ===== HEADER WITH BACK BUTTON ===== */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: height * 0.02,
            }}
          >
            <TouchableOpacity
              onPress={handleBack}
              style={{ marginRight: width * 0.03, padding: 5 }}
            >
              <Text
                style={{
                  color: "#FFF",
                  fontSize: 30,
                  fontWeight: "300",
                  lineHeight: 30,
                }}
              >
                ‹
              </Text>
            </TouchableOpacity>
            <Text
              style={{
                color: "#FFF",
                fontSize: width * 0.06,
                fontWeight: "700",
                fontFamily: "Poppins",
              }}
            >
              Order Policy
            </Text>
          </View>

          {/* ===== PROGRESS INDICATOR DOTS ===== */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: height * 0.02,
              paddingHorizontal: width * 0.03,
            }}
          >
            {[0, 1, 2, 3, 4].map((step, index) => (
              <React.Fragment key={step}>
                <View
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 6,
                    backgroundColor:
                      index <= 1 ? "#D4AF37" : "rgba(255, 255, 255, 0.3)",
                  }}
                />
                {index < 4 && (
                  <View
                    style={{
                      flex: 1,
                      height: 2,
                      backgroundColor:
                        index < 1 ? "#D4AF37" : "rgba(255, 255, 255, 0.3)",
                      marginHorizontal: 3,
                    }}
                  />
                )}
              </React.Fragment>
            ))}
          </View>

          {/* ===== ORDER SPEND LIMIT CARD ===== */}
          <View
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.12)",
              borderRadius: 20,
              padding: width * 0.045,
              marginBottom: height * 0.02,
              borderWidth: 1,
              borderColor: "rgba(255, 255, 255, 0.15)",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Bell Icon */}
            <View
              style={{
                width: 44,
                height: 44,
                justifyContent: "center",
                alignItems: "center",
                marginRight: width * 0.04,
              }}
            >
              <View
                style={{
                  width: 28,
                  height: 26,
                  borderWidth: 2.5,
                  borderColor: "#FFF",
                  borderTopLeftRadius: 14,
                  borderTopRightRadius: 14,
                  borderBottomLeftRadius: 4,
                  borderBottomRightRadius: 4,
                  position: "relative",
                }}
              >
                <View
                  style={{
                    width: 6,
                    height: 6,
                    backgroundColor: "#FFF",
                    position: "absolute",
                    top: -10,
                    left: 8,
                    borderRadius: 3,
                  }}
                />
                <View
                  style={{
                    width: 8,
                    height: 3,
                    backgroundColor: "#FFF",
                    position: "absolute",
                    bottom: -6,
                    left: 8,
                    borderRadius: 2,
                  }}
                />
              </View>
            </View>
            <View style={{ alignItems: "flex-start" }}>
              <Text
                style={{
                  color: "#FFF",
                  fontSize: width * 0.038,
                  fontWeight: "400",
                  marginBottom: 4,
                  fontFamily: "Poppins",
                }}
              >
                Order Spend Limit is :
              </Text>
              <Text
                style={{
                  color: "#FFF",
                  fontSize: width * 0.075,
                  fontWeight: "700",
                  fontFamily: "Poppins",
                }}
              >
                ₱{orderSpendLimit}
              </Text>
            </View>
          </View>

          {/* ===== TERMS AND CONDITIONS CARD ===== */}
          <View
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.12)",
              borderRadius: 20,
              padding: width * 0.045,
              paddingVertical: height * 0.02,
              borderWidth: 1,
              borderColor: "rgba(255, 255, 255, 0.15)",
              marginBottom: height * 0.015,
            }}
          >
            <Text
              style={{
                color: "#FFF",
                fontSize: width * 0.048,
                fontWeight: "700",
                marginBottom: height * 0.012,
                fontFamily: "Poppins",
              }}
            >
              Terms and Conditions
            </Text>
            <View>
              {[
                {
                  title: "1. Order Process",
                  content:
                    "All orders must be placed through this mobile app. Confirmation is issued once payment is received.",
                },
                {
                  title: "2. Deposit Payment",
                  content:
                    "A non-refundable deposit is required to secure your order. Payments accepted via GCash, Maya, Bank Transfer, or PayPal.",
                },
                {
                  title: "3. Non-Refundable Policy",
                  content:
                    "Deposits are strictly non-refundable, including cancellations or no-shows. Please confirm availability before ordering.",
                },
                {
                  title: "4. Order Spend Limit",
                  content:
                    "Each order is subject to a ₱15,000 spending limit. Additional charges may apply for rush consumption.",
                },
                {
                  title: "5. Modifications",
                  content:
                    "Changes may be requested 48 hours in advance, subject to approval and availability.",
                },
                {
                  title: "6. Confirmation",
                  content:
                    "A QR Code and order details will be emailed after successful payment. Present this upon arrival.",
                },
              ].map((item, index) => (
                <View key={index} style={{ marginBottom: height * 0.008 }}>
                  <Text
                    style={{
                      color: "#FFF",
                      fontSize: width * 0.032,
                      fontWeight: "700",
                      marginBottom: 2,
                      fontFamily: "Poppins",
                    }}
                  >
                    {item.title}
                  </Text>
                  <Text
                    style={{
                      color: "rgba(255, 255, 255, 0.9)",
                      fontSize: width * 0.028,
                      fontWeight: "400",
                      lineHeight: width * 0.04,
                      fontFamily: "Poppins",
                    }}
                  >
                    {item.content}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Bottom Section */}
        <View>
          {/* ===== AGREEMENT CHECKBOX ===== */}
          <TouchableOpacity
            onPress={() => setAgreed(!agreed)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: height * 0.012,
              paddingHorizontal: width * 0.01,
            }}
          >
            <View
              style={{
                width: 22,
                height: 22,
                borderWidth: 2,
                borderColor: "#FFF",
                borderRadius: 4,
                marginRight: width * 0.03,
                backgroundColor: agreed ? "#D4AF37" : "transparent",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {agreed && (
                <Text
                  style={{
                    color: "#FFF",
                    fontSize: 16,
                    fontWeight: "bold",
                    lineHeight: 16,
                  }}
                >
                  ✓
                </Text>
              )}
            </View>
            <Text
              style={{
                color: "#FFF",
                fontSize: width * 0.033,
                flex: 1,
                fontFamily: "Poppins",
              }}
            >
              I have read and agree to the ordering and payment policies.
            </Text>
          </TouchableOpacity>

          {/* ===== CONTINUE ORDERING BUTTON ===== */}
          <TouchableOpacity
            onPress={handleContinueOrdering}
            style={{
              backgroundColor: "#8B0000",
              paddingVertical: height * 0.018,
              borderRadius: 30,
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 6,
              elevation: 6,
              marginBottom: height * 0.015,
            }}
          >
            <Text
              style={{
                color: "#FFF",
                fontSize: width * 0.042,
                fontWeight: "700",
                fontFamily: "Poppins",
              }}
            >
              Continue Ordering
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default OrderPolicyScreen;
