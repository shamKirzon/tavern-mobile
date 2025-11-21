import {
  View,
  Text,
  Keyboard,
  Modal,
  Pressable,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { use, useEffect, useState } from "react";
import { width, height } from "../utils/dimensions";
import MainBackground from "../assets/backgrounds/main-background.svg";
import ReservationVerified from "../assets/icons/reservation-verified.svg";
import ReservationInvalid from "../assets/icons/reservation-invalid.svg";

import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamLists } from "../types/rootStackParamLists";
import { useEmployeeStore } from "../stores/useEmployeeStore";
import {
  getEmployeeIdByToken,
  getOrderIdByToken,
  getReservationIdByToken,
} from "../services/token";
import { getOrderData } from "../services/order";
import { assignSecurityId, getReservationData } from "../services/reservation";
import { formatReadableDate } from "../utils/formatReadableDate";
import Loading from "./ui/Loading";
import { useReservationStore } from "../stores/useReservationStore";

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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [employeeId, setEmployeeId] = useState<string>("");
  const [reservationId, setReservationId] = useState<string>("");
  const { qrResult, isValid } = route.params;
  const [qrIdKey, setQrIdKey] = useState<string | null>("");
  const [qrIdValue, setQrIdValue] = useState<string | null>("");

  // reservation
  const [reservationData, setReservationData] = useState<any>();
  const [isReservationStatusInvalid, setIsReservationInvalid] =
    useState<boolean>(false);

  // order
  const [orderData, setOrderData] = useState<any>();

  useEffect(() => {
    if (!qrIdValue) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);

        const reservationInformation = await getReservationInformation(
          qrIdValue
        );
        setReservationData(reservationInformation);

        // check if the reservation status is valid or not:
        if (reservationInformation.reservationStatus === "done") {
          setIsReservationInvalid(true);
        }
      } catch (error) {
        console.log("error in fetching data: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [qrIdValue]);

  useEffect(() => {
    if (!qrResult) {
      setQrIdKey(null);
      setQrIdValue(null);
      return;
    }

    if ("reservationId" in qrResult) {
      setQrIdKey("reservationId");
      setQrIdValue(qrResult.reservationId);
    } else if ("orderId" in qrResult) {
      setQrIdKey("orderId");
      setQrIdValue(qrResult.orderId);
    }
  }, [qrResult]);

  // functions:

  const handleDone = async () => {
    try {
      // add conditional statement depends on the role of the staff:
      // if(employeeRole === "security") // this logic: else if (employeeRole ==="cashier")// some logic else return (to avoid the null)
      const employeeId = await getEmployeeIdByToken();

      if (!qrIdValue) return;

      const result = await assignSecurityId(employeeId, qrIdValue);

      if (!result)
        throw new Error("Error in assigning employee id in reservation");

      navigation.navigate("StaffQRScannerScreen");
    } catch (error) {
      console.error("error in handleDone: ", error);
    }
  };

  const getCurrentDateAndTime = (): string => {
    const now = new Date();

    const dateOptions: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "2-digit",
    };

    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true, // 12-hour format with AM/PM
    };

    const date = now.toLocaleDateString("en-US", dateOptions);
    const time = now.toLocaleTimeString("en-US", timeOptions);

    return `${date} • ${time}`;
  };

  const getReservationInformation = async (id: string) => {
    const [
      {
        first_name: firstName,
        last_name: lastName,
        reservation_amount: reservationAmount,
        reservation_type: reservationType,
        reservation_status: reservationStatus,
        pax,
        date,
      },
    ] = await getReservationData(id);

    return {
      name: `${firstName} ${lastName}`,
      date,
      reservationType,
      pax,
      reservationAmount,
      reservationStatus,
    };
  };

  const getOrderInformation = async () => {
    // to be continued... same format lang nung nasa order history natin
    const orderId = await getOrderIdByToken();

    const {
      created_at: createdAt,
      order_items: orderItems,
      qr_code_url: QRCodeUrl,
      total,
    } = await getOrderData(orderId);
  };

  // function jsx:
  const reservationValid = (): React.JSX.Element => {
    return (
      <View style={{ flex: 1 }}>
        {/* Scrollable main content */}
        <ScrollView
          contentContainerStyle={{
            marginTop: height * 0.2,
            alignItems: "center",
            paddingHorizontal: width * 0.08,
            paddingBottom: 120,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Icon */}
          <View
            style={{
              width: width * 0.22,
              height: width * 0.22,
              borderRadius: 100,
              backgroundColor: "#fff",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 20,
            }}
          >
            <ReservationVerified width={52} />
          </View>

          <Text
            style={{
              color: "#fff",
              fontWeight: "bold",
              fontSize: width * 0.07,
              fontFamily: "Inter",
              marginTop: 10,
            }}
          >
            Reservation Verified
          </Text>

          <Text
            style={{
              marginTop: width * 0.02,
              color: "#fff",
              fontWeight: "300",
              fontSize: width * 0.043,
              fontFamily: "Inter",
            }}
          >
            {getCurrentDateAndTime()}
          </Text>

          {isLoading ? (
            <Text style={{ color: "#fff", marginTop: 20 }}>Loading...</Text>
          ) : reservationData ? (
            <View
              style={{
                width: "100%",
                marginTop: height * 0.035,
                backgroundColor: "rgba(255,255,255,0.1)",
                borderRadius: 12,
                padding: 15,
                marginBottom: 15,
              }}
            >
              {/* Name */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 6,
                }}
              >
                <Text style={{ color: "#FFFFFF", fontSize: width * 0.045 }}>
                  Name:
                </Text>
                <Text
                  style={{
                    color: "#FFFFFF",
                    fontSize: width * 0.045,
                    fontWeight: "700",
                  }}
                >
                  {reservationData.name}
                </Text>
              </View>

              {/* Date */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 6,
                }}
              >
                <Text style={{ color: "#FFFFFF", fontSize: width * 0.045 }}>
                  Date:
                </Text>
                <Text
                  style={{
                    color: "#FFFFFF",
                    fontSize: width * 0.045,
                    fontWeight: "700",
                  }}
                >
                  {formatReadableDate(reservationData.date)}
                </Text>
              </View>

              {/* Type */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 6,
                }}
              >
                <Text style={{ color: "#FFFFFF", fontSize: width * 0.045 }}>
                  Reservation Type:
                </Text>
                <Text
                  style={{
                    color: "#FFFFFF",
                    fontSize: width * 0.045,
                    fontWeight: "700",
                  }}
                >
                  {reservationData.reservationType.charAt(0).toUpperCase() +
                    reservationData.reservationType.slice(1)}
                </Text>
              </View>

              {/* Guests */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 6,
                }}
              >
                <Text style={{ color: "#FFFFFF", fontSize: width * 0.045 }}>
                  Guests:
                </Text>
                <Text
                  style={{
                    color: "#FFFFFF",
                    fontSize: width * 0.045,
                    fontWeight: "700",
                  }}
                >
                  {reservationData.pax}
                </Text>
              </View>

              {/* Fee */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 6,
                }}
              >
                <Text style={{ color: "#FFFFFF", fontSize: width * 0.045 }}>
                  Reservation Fee:
                </Text>
                <Text
                  style={{
                    color: "#FFFFFF",
                    fontSize: width * 0.045,
                    fontWeight: "700",
                  }}
                >
                  ₱ {reservationData.reservationAmount.toLocaleString()}
                </Text>
              </View>
            </View>
          ) : (
            <Text style={{ color: "#fff", marginTop: 20 }}>
              No reservation data found
            </Text>
          )}
        </ScrollView>

        {/* Done button fixed at bottom */}
        <View
          style={{
            paddingHorizontal: height * 0.02,
            position: "absolute",
            bottom: height * 0.04,
            left: width * 0.04,
            right: width * 0.04,
          }}
        >
          <TouchableOpacity
            onPress={handleDone}
            style={{
              backgroundColor: "#8A1717",
              paddingVertical: height * 0.026,
              borderRadius: width * 0.05,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: "#ffffff",
                fontSize: width * 0.055,
                fontWeight: "600",
              }}
            >
              Done
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const reservationInvalid = (): React.JSX.Element => {
    return (
      <View style={{ flex: 1 }}>
        {/* Scrollable main content */}
        <ScrollView
          contentContainerStyle={{
            marginTop: height * 0.28,
            alignItems: "center",
            paddingHorizontal: width * 0.08,
            paddingBottom: 120,
          }}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={{
              width: width * 0.35,
              height: width * 0.35,
              justifyContent: "center",
              alignItems: "center",
              marginTop: 20,
            }}
          >
            <ReservationInvalid width={width * 0.3} height={width * 0.3} />
          </View>

          <Text
            style={{
              color: "#fff",
              fontWeight: "bold",
              fontSize: width * 0.07,
              fontFamily: "Inter",
              marginTop: 10,
              textAlign: "center",
            }}
          >
            QR Code Error
          </Text>

          <View style={{ paddingHorizontal: width * 0.05 }}>
            <Text
              style={{
                marginTop: width * 0.02,
                color: "#fff",
                fontWeight: "300",
                fontSize: width * 0.043,
                fontFamily: "Poppins",
                textAlign: "center",
              }}
            >
              This QR code is no longer valid. It may have expired or has
              already been used.
            </Text>
          </View>
        </ScrollView>

        {/* Done button fixed at bottom */}
        <View
          style={{
            paddingHorizontal: height * 0.02,
            position: "absolute",
            bottom: height * 0.04,
            left: width * 0.04,
            right: width * 0.04,
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.navigate("StaffQRScannerScreen")}
            style={{
              backgroundColor: "#8A1717",
              paddingVertical: height * 0.026,
              borderRadius: width * 0.05,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: "#ffffff",
                fontSize: width * 0.055,
                fontWeight: "600",
              }}
            >
              Try Again
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
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

        {isReservationStatusInvalid
          ? reservationInvalid()
          : isValid && qrIdKey === "reservationId"
          ? reservationValid()
          : // : isValid && qrIdKey === "orderId"
            // ? orderValid()
            null}
      </View>
    </>
  );
};

export default StaffQRResultScreen;
