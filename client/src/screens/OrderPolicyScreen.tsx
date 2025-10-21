import React, { useState } from "react";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamLists } from "../types/rootStackParamLists";
import { height, width } from "../utils/dimensions";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
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
  const [reservationData] = useState({
    name: "Dannah Joyce Torres",
    date: "October 07, 2025",
    type: "Exclusive",
    guests: "50",
    reservationFee: "30,000.00",
  });

  const [orderSpendLimit] = useState("P15,000.00");
  const [agreed, setAgreed] = useState(false);

  const handleContinueOrdering = () => {
    if (!agreed) {
      Alert.alert("Error", "Please agree to the terms and conditions");
      return;
    }
    console.log("Continue ordering clicked", reservationData);
    // navigation.navigate("NextScreen");
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    // ✅ Updated wrapper starts here
    <View style={{ width, height, flex: 1 }}>
      <MainBackground style={{ position: "absolute", height: "100%" }} />
      {/* ✅ Keeps all content layered above background */}
      <View
        style={{
          flex: 1,
          justifyContent: "space-between",
          padding: width * 0.06,
          paddingBottom: width * 0.1,
        }}
      >
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: height * 0.04,
            width: "100%",
          }}
        >
          <TouchableOpacity
            onPress={handleBack}
            style={{ marginRight: width * 0.04 }}
          >
            <Text style={{ color: "#FFFFFF", fontSize: 28, fontWeight: "300" }}>
              ‹
            </Text>
          </TouchableOpacity>
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: width * 0.055,
              fontWeight: "bold",
              fontFamily: "Poppins",
            }}
          >
            Order Policy
          </Text>
        </View>

        {/* Reservation Details */}
        <View>
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: width * 0.055,
              fontWeight: "400",
              marginBottom: height * 0.025,
              fontFamily: "DMSerifText",
            }}
          >
            Reservation Details
          </Text>

          <View
            style={{
              borderRadius: 12,
              padding: width * 0.045,
              marginBottom: height * 0.025,
              borderWidth: 2,
              borderColor: "rgba(255, 255, 255, 0.3)",
            }}
          >
            {Object.entries(reservationData).map(([key, value]) => (
              <View
                key={key}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: height * 0.012,
                }}
              >
                <Text style={{ color: "#FFFFFF", fontSize: width * 0.037 }}>
                  {key.charAt(0).toUpperCase() +
                    key.slice(1).replace(/([A-Z])/g, " $1")}
                  :
                </Text>
                <Text style={{ color: "#FFFFFF", fontSize: width * 0.037 }}>
                  {value}
                </Text>
              </View>
            ))}
          </View>

          <View
            style={{
              borderRadius: 12,
              paddingVertical: height * 0.02,
              paddingHorizontal: width * 0.045,
              borderWidth: 2,
              borderColor: "rgba(255, 255, 255, 0.3)",
              backgroundColor: "transparent",
              marginBottom: height * 0.02,
            }}
          >
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={{ color: "#FFFFFF", fontSize: width * 0.04 }}>
                Order Spend Limit is :
              </Text>
              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: width * 0.045,
                  fontWeight: "600",
                }}
              >
                {orderSpendLimit}
              </Text>
            </View>
          </View>
        </View>

        {/* Terms and Conditions (scrollable only this part) */}
        <View style={{ flex: 1 }}>
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: width * 0.055,
              fontWeight: "400",
              marginBottom: height * 0.015,
              fontFamily: "DMSerifText",
            }}
          >
            Terms and Conditions
          </Text>

          <ScrollView
            showsVerticalScrollIndicator={true}
            style={{
              maxHeight: height * 0.35,
              paddingRight: width * 0.02,
            }}
          >
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
                  "Each order is subject to a ₱15,000 spend limit. Additional charges apply for excess consumption.",
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
              <View key={index} style={{ marginBottom: height * 0.02 }}>
                <Text
                  style={{
                    color: "#FFFFFF",
                    fontSize: width * 0.035,
                    fontWeight: "600",
                    marginBottom: 6,
                    fontFamily: "Poppins",
                  }}
                >
                  {item.title}
                </Text>
                <Text
                  style={{
                    color: "#FFFFFF",
                    fontSize: width * 0.032,
                    fontWeight: "300",
                    lineHeight: width * 0.048,
                    fontFamily: "Poppins",
                  }}
                >
                  {item.content}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Checkbox */}
        <TouchableOpacity
          onPress={() => setAgreed(!agreed)}
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: height * 0.015,
            marginBottom: height * 0.02,
          }}
        >
          <View
            style={{
              width: 18,
              height: 18,
              borderWidth: 2,
              borderColor: "#FFFFFF",
              borderRadius: 3,
              marginRight: width * 0.025,
              backgroundColor: agreed ? "#FFFFFF" : "transparent",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {agreed && (
              <Text
                style={{ color: "#000000", fontSize: 12, fontWeight: "bold" }}
              >
                ✓
              </Text>
            )}
          </View>
          <Text style={{ color: "#FFFFFF", fontSize: width * 0.032, flex: 1 }}>
            I have read and agree to the ordering and payment policies.
          </Text>
        </TouchableOpacity>

        {/* Continue Button */}
        <TouchableOpacity
          onPress={handleContinueOrdering}
          disabled={!agreed}
          style={{
            backgroundColor: agreed ? "#8B0000" : "#666666",
            paddingVertical: height * 0.022,
            borderRadius: 12,
            alignItems: "center",
            opacity: agreed ? 1 : 0.5,
          }}
        >
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: width * 0.042,
              fontWeight: "600",
              fontFamily: "Poppins",
            }}
          >
            Continue Ordering
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OrderPolicyScreen;
