import React, { useState } from "react";
import MainBackground from "../assets/backgrounds/main-background.svg";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamLists } from "../types/rootStackParamLists";
import { height, paddingTop, width } from "../utils/dimensions";
import { formatReadableDate } from "../utils/formatReadableDate";

type BookingSummaryScreenNavigationProps = NativeStackNavigationProp<
  RootStackParamLists,
  "BookingSummaryScreen"
>;

type BookingSummaryScreenRouteProps = RouteProp<
  RootStackParamLists,
  "BookingSummaryScreen"
>;

type Props = {
  navigation: BookingSummaryScreenNavigationProps;
  route: BookingSummaryScreenRouteProps;
};

const BookingSummaryScreen: React.FC<Props> = ({ navigation, route }) => {
  const [isChecked, setIsChecked] = useState(false);
  const { name, date, guests, reservationType, reservationFee } = route.params;

  return (
    <View style={{ flex: 1 }}>
      <MainBackground
        width={width}
        height={height}
        preserveAspectRatio="none"
        style={{ position: "absolute", top: 0, left: 0 }}
      />

      {/* Main Content */}
      <View style={{ flex: 1, paddingHorizontal: width * 0.05 }}>
        {/* Scrollable Content */}
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingTop: paddingTop,
            marginBottom: height * 0.01,
          }}
        >
          <TouchableOpacity
            style={{
              width: width * 0.09,
              height: width * 0.09,
              justifyContent: "center",
              alignItems: "center",
              marginRight: width * 0.025,
            }}
            onPress={() => navigation?.goBack?.()}
          >
            <View
              style={{
                width: width * 0.035,
                height: width * 0.035,
                borderLeftWidth: width * 0.008,
                borderBottomWidth: width * 0.008,
                borderColor: "#fff",
                transform: [{ rotate: "45deg" }],
              }}
            />
          </TouchableOpacity>

          <Text
            style={{
              color: "#FFFFFF",
              fontSize: width * 0.07,
              fontWeight: "bold",
            }}
          >
            Reservation Summary
          </Text>
        </View>

        <ScrollView contentContainerStyle={{ paddingBottom: height * 0.15 }}>
          {/* Reservation Details */}
          <View
            style={{
              marginTop: height * 0.012,
              backgroundColor: "rgba(255,255,255,0.1)",
              borderRadius: width * 0.03,
              padding: width * 0.04,
              marginBottom: height * 0.02,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: height * 0.01,
              }}
            >
              <Text style={{ color: "#FFFFFF", fontSize: width * 0.034 }}>
                Name:
              </Text>
              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: width * 0.034,
                  fontWeight: "700",
                }}
              >
                {name}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: height * 0.01,
              }}
            >
              <Text style={{ color: "#FFFFFF", fontSize: width * 0.034 }}>
                Date:
              </Text>
              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: width * 0.034,
                  fontWeight: "700",
                }}
              >
                {formatReadableDate(date)}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: height * 0.01,
              }}
            >
              <Text style={{ color: "#FFFFFF", fontSize: width * 0.034 }}>
                Type:
              </Text>
              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: width * 0.034,
                  fontWeight: "700",
                }}
              >
                {reservationType}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: height * 0.01,
              }}
            >
              <Text style={{ color: "#FFFFFF", fontSize: width * 0.034 }}>
                Guests:
              </Text>
              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: width * 0.034,
                  fontWeight: "700",
                }}
              >
                {guests}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: height * 0.01,
              }}
            >
              <Text style={{ color: "#FFFFFF", fontSize: width * 0.034 }}>
                Reservation Fee:
              </Text>
              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: width * 0.034,
                  fontWeight: "700",
                }}
              >
                {parseInt(reservationFee).toLocaleString()} PHP
              </Text>
            </View>
          </View>

          {/* Terms & Conditions */}
          <View
            style={{
              backgroundColor: "rgba(255,255,255,0.1)",
              borderRadius: width * 0.03,
              padding: width * 0.04,
            }}
          >
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: width * 0.045,
                fontWeight: "bold",
                marginBottom: height * 0.015,
              }}
            >
              Terms and Conditions
            </Text>

            <View style={{ marginBottom: height * 0.03 }}>
              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: width * 0.04,
                  fontWeight: "600",
                  marginBottom: height * 0.008,
                }}
              >
                Reservation Policy
              </Text>
              <Text
                style={{
                  color: "#dddddd",
                  fontSize: width * 0.032,
                  marginBottom: height * 0.01,
                }}
              >
                Orders must be placed at least 2 days in advance to ensure
                availability and preparation time.
              </Text>

              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: width * 0.04,
                  fontWeight: "600",
                  marginBottom: height * 0.008,
                }}
              >
                Cancellation Policy
              </Text>
              <Text
                style={{
                  color: "#dddddd",
                  fontSize: width * 0.032,
                  marginBottom: height * 0.01,
                }}
              >
                Cancellations made within 24 hours of pickup/delivery will not
                be refunded.
              </Text>

              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: width * 0.04,
                  fontWeight: "600",
                  marginBottom: height * 0.008,
                }}
              >
                Payment Policy
              </Text>
              <Text
                style={{
                  color: "#dddddd",
                  fontSize: width * 0.032,
                  marginBottom: height * 0.01,
                }}
              >
                Full payment is required to confirm your order. Payments are
                non-refundable once confirmed.
              </Text>

              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: width * 0.04,
                  fontWeight: "600",
                  marginBottom: height * 0.008,
                }}
              >
                Special Requests
              </Text>
              <Text
                style={{
                  color: "#dddddd",
                  fontSize: width * 0.032,
                  marginBottom: height * 0.01,
                }}
              >
                Customizations or specific requests must be communicated upon
                ordering.
              </Text>

              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: width * 0.04,
                  fontWeight: "600",
                  marginBottom: height * 0.008,
                }}
              >
                Privacy Policy
              </Text>
              <Text
                style={{
                  color: "#dddddd",
                  fontSize: width * 0.032,
                  marginBottom: height * 0.01,
                }}
              >
                Customer information is kept confidential and used solely for
                processing your order.
              </Text>
            </View>
          </View>

          {/* Checkbox Agreement */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: height * 0.015,
            }}
          >
            <TouchableOpacity
              onPress={() => setIsChecked(!isChecked)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginRight: width * 0.02,
              }}
            >
              {/* Checkbox Box */}
              <View
                style={{
                  width: width * 0.05,
                  height: width * 0.05,
                  borderWidth: width * 0.005,
                  borderColor: "#ccc",
                  borderRadius: width * 0.01,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: isChecked ? "#D4AF37" : "transparent",
                }}
              >
                {isChecked && (
                  <Text style={{ color: "white", fontSize: width * 0.035 }}>
                    ✓
                  </Text>
                )}
              </View>
            </TouchableOpacity>

            {/* Label */}
            <Text
              style={{
                color: "white",
                fontSize: width * 0.034,
                flexShrink: 1,
              }}
            >
              I have read and agree to the ordering and payment policies.
            </Text>
          </View>
        </ScrollView>

        {/* Continue Button */}
        <TouchableOpacity
          style={{
            position: "absolute",
            bottom: height * 0.035,
            left: width * 0.05,
            right: width * 0.05,
            backgroundColor: "#8B0000",
            paddingVertical: height * 0.02,
            borderRadius: width * 0.03,
            alignItems: "center",
            opacity: isChecked ? 1 : 0.5,
          }}
          disabled={!isChecked}
          onPress={() =>
            navigation.navigate("ReservationPaymentScreen", { reservationFee })
          }
        >
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: width * 0.04,
              fontWeight: "600",
            }}
          >
            Continue to Payment
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BookingSummaryScreen;
