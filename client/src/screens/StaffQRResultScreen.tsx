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

import AdditionalOrders from "../assets/icons/additional-order.svg";
import MainBackground from "../assets/backgrounds/main-background.svg";
import ReservationVerified from "../assets/icons/reservation-verified.svg";
import OrderSummaryReceipt from "../assets/icons/order-summary-receipt.svg";
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
import { OrderStatus } from "../types/orders";
import DottedDivider from "./ui/DottedDivider";
import { formatCurrency } from "../utils/formatCurrency";
import { useOrderStore } from "../stores/useOrderStore";

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
  const { qrResult, isValid, additionalOrder } = route.params;
  const { orders } = useOrderStore();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [employeeId, setEmployeeId] = useState<string>("");
  const [reservationId, setReservationId] = useState<string>("");
  const [qrIdKey, setQrIdKey] = useState<string | null>("");
  const [qrIdValue, setQrIdValue] = useState<string | null>("");

  // reservation
  const [reservationData, setReservationData] = useState<any>();
  const [isReservationStatusInvalid, setIsReservationInvalid] =
    useState<boolean>(false);

  // order
  const [orderData, setOrderData] = useState<{
    items: { orderName: string; price: number; total: number }[];
    total: number;
    orderStatus: OrderStatus;
    reservationId: string;
  }>({
    items: [],
    total: 0,
    orderStatus: "pending",
    reservationId: "",
  });

  // testing
  // useEffect(() => {
  //   console.log("reservation Id", orderData.reservationId);
  //   console.log("reservation data: ", reservationData);
  // }, [orderData, reservationData]);

  // fetching order and reservation data
  useEffect(() => {
    if (!qrIdValue) return;
    if (!qrIdKey) return;

    const fetchData = async () => {
      try {
        // example:
        setIsLoading(true);

        if (qrIdKey === "reservationId") {
          const reservationInformation = await getReservationInformation(
            qrIdValue
          );
          setReservationData(reservationInformation);

          // validation of registered qr:
          if (reservationInformation.reservationStatus === "done") {
            setIsReservationInvalid(true);
          }
        }

        // Cashier
        else if (qrIdKey === "orderId") {
          const orderInformation = await getOrderInformation(qrIdValue);
          if (!orderInformation)
            throw new Error("No returned order information");

          // validation of order qr:
          if (orderInformation.orderStatus === "done") {
            setIsReservationInvalid(true);
          }

          // for order data:
          setOrderData({
            items: orderInformation.orderItems.map((item: any) => ({
              orderName: item.orderName,
              price: item.price,
              total: item.total,
            })),
            total: orderInformation.total,
            orderStatus: orderInformation.orderStatus,
            reservationId: orderInformation.reservationId,
          });

          // getting the reservation data:
          const reservationInformation = await getReservationInformation(
            orderInformation.reservationId
          );
          setReservationData(reservationInformation);
        } else {
          throw new Error("Can't insert corresponding data in states");
        }
      } catch (error) {
        console.log("error in fetching data: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [qrIdValue]);

  // set qr key and value to state
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

  // if it has an additional order:

  // functions:
  const handleDone = async () => {
    try {
      // if same button lang naman
      // add conditional statement depends on the role of the staff:
      // if(employeeRole === "security") // this logic: else if (employeeRole ==="cashier")// some logic else return (to avoid the null)
      const employeeId = await getEmployeeIdByToken();

      if (!qrIdValue) return;

      // reservation: assigning securityid
      const result = await assignSecurityId(employeeId, qrIdValue);

      // order: assigning cashierid
      // reservation and order status = "done"

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

  const getOrderInformation = async (id: string) => {
    const {
      order_items: orderItems,
      total,
      order_status: orderStatus,
      reservation_id: reservationId,
    } = await getOrderData(id);

    return { orderItems, total, orderStatus, reservationId };
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

          {reservationData && (
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
                <Text style={{ color: "#FFFFFF", fontSize: width * 0.04 }}>
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
                <Text style={{ color: "#FFFFFF", fontSize: width * 0.04 }}>
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
                <Text style={{ color: "#FFFFFF", fontSize: width * 0.04 }}>
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
                <Text style={{ color: "#FFFFFF", fontSize: width * 0.04 }}>
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
                <Text style={{ color: "#FFFFFF", fontSize: width * 0.04 }}>
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
            {isValid == false ? "QR Code Invalid" : "QR Code Expired"}
          </Text>

          <View style={{ paddingHorizontal: width * 0.01 }}>
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
              {isValid === false
                ? "This QR code can't be recognized. It may be incorrect, not found, or not issued by the Tavern."
                : "This QR code is no longer valid. It may have expired or has already been used."}
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

  const orderValid = (): React.JSX.Element => {
    // orderData.total = base orders total
    // additionalOrder.total = additional order total

    const calculatedTotal = () => {
      const calculatedTotalResult = additionalOrder?.total
        ? orderData.total + additionalOrder.total
        : orderData.total;

      return formatCurrency(calculatedTotalResult);
    };
    const calculatedPayable = () => {
      const calculatedAmount = additionalOrder?.total
        ? additionalOrder.total +
          (orderData.total - reservationData.reservationAmount / 2)
        : orderData.total - reservationData.reservationAmount / 2;

      return formatCurrency(calculatedAmount);
    };
    const handleAdditionalOrder = () => {
      if (!qrResult) return;
      navigation.navigate("AdditionalOrderHomeScreen", { isValid, qrResult });
    };

    return (
      <View style={{ flex: 1 }}>
        {/* Scrollable main content */}
        <ScrollView
          contentContainerStyle={{
            marginTop: height * 0.1,
            alignItems: "center",
            paddingHorizontal: width * 0.07,
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
            <OrderSummaryReceipt width={52} />
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
            Order Summary Receipt
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

          {reservationData && orderData && (
            <>
              <View
                style={{
                  width: "100%",
                  marginTop: height * 0.035,
                  borderRadius: 12,
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
                  <Text style={{ color: "#FFFFFF", fontSize: width * 0.04 }}>
                    Name:
                  </Text>
                  <Text
                    style={{
                      color: "#FFFFFF",
                      fontSize: width * 0.045,
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
                  <Text style={{ color: "#FFFFFF", fontSize: width * 0.04 }}>
                    Date:
                  </Text>
                  <Text
                    style={{
                      color: "#FFFFFF",
                      fontSize: width * 0.045,
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
                  <Text style={{ color: "#FFFFFF", fontSize: width * 0.04 }}>
                    Reservation Type:
                  </Text>
                  <Text
                    style={{
                      color: "#FFFFFF",
                      fontSize: width * 0.045,
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
                  <Text style={{ color: "#FFFFFF", fontSize: width * 0.04 }}>
                    Guests:
                  </Text>
                  <Text
                    style={{
                      color: "#FFFFFF",
                      fontSize: width * 0.045,
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
                  <Text style={{ color: "#FFFFFF", fontSize: width * 0.04 }}>
                    Reservation Fee:
                  </Text>
                  <Text
                    style={{
                      color: "#FFFFFF",
                      fontSize: width * 0.045,
                    }}
                  >
                    ₱ {reservationData.reservationAmount.toLocaleString()}
                  </Text>
                </View>
              </View>

              {<DottedDivider />}

              {/* order item - base orders */}
              <View
                style={{
                  width: "100%",
                  borderRadius: 12,
                }}
              >
                <Text
                  style={{
                    color: "#FFFFFF",
                    fontWeight: "700",
                    fontSize: width * 0.05,
                    alignSelf: "center",
                    paddingBottom: height * 0.02,
                  }}
                >
                  Base Orders
                </Text>
                {orderData.items.map((order, index) => (
                  <View
                    key={index}
                    style={{
                      flexDirection: "row",
                      marginBottom: 6,
                    }}
                  >
                    <Text
                      style={{
                        color: "#FFFFFF",
                        fontSize: width * 0.04,
                        flex: 1,
                        flexWrap: "wrap",
                      }}
                    >
                      {order.orderName}
                    </Text>

                    <Text
                      style={{
                        color: "#FFFFFF",
                        fontSize: width * 0.045,
                        marginLeft: 10,
                      }}
                    >
                      {order.total.toFixed(2).toLocaleString()}
                    </Text>
                  </View>
                ))}

                {/* base order total*/}
                <View
                  style={{
                    paddingTop: height * 0.02,
                    flexDirection: "row",
                    marginBottom: 6,
                  }}
                >
                  <Text
                    style={{
                      color: "#FFFFFF",
                      fontWeight: "700",
                      fontSize: width * 0.047,
                      flex: 1,
                      flexWrap: "wrap",
                    }}
                  >
                    Total
                  </Text>

                  <Text
                    style={{
                      color: "#FFFFFF",
                      fontWeight: "700",
                      fontSize: width * 0.047,
                      marginLeft: 10,
                    }}
                  >
                    {formatCurrency(orderData.total)}
                  </Text>
                </View>

                <DottedDivider />

                {additionalOrder?.total && (
                  <>
                    <Text
                      style={{
                        color: "#FFFFFF",
                        fontWeight: "700",
                        fontSize: width * 0.05,
                        alignSelf: "center",
                        paddingBottom: height * 0.02,
                      }}
                    >
                      Additional Orders
                    </Text>
                    {additionalOrder?.orderItems.map((order, index) => (
                      <View
                        key={index}
                        style={{
                          flexDirection: "row",
                          marginBottom: 6,
                        }}
                      >
                        <Text
                          style={{
                            color: "#FFFFFF",
                            fontSize: width * 0.04,
                            flex: 1,
                            flexWrap: "wrap",
                          }}
                        >
                          {order.orderName}
                        </Text>

                        <Text
                          style={{
                            color: "#FFFFFF",
                            fontSize: width * 0.045,
                            marginLeft: 10,
                          }}
                        >
                          {formatCurrency(order.total)}
                        </Text>
                      </View>
                    ))}

                    {/* additional orders total*/}
                    <View
                      style={{
                        paddingTop: height * 0.02,
                        flexDirection: "row",
                        marginBottom: 6,
                      }}
                    >
                      <Text
                        style={{
                          color: "#FFFFFF",
                          fontWeight: "700",
                          fontSize: width * 0.047,
                          flex: 1,
                          flexWrap: "wrap",
                        }}
                      >
                        Total
                      </Text>

                      <Text
                        style={{
                          color: "#FFFFFF",
                          fontWeight: "700",
                          fontSize: width * 0.047,
                          marginLeft: 10,
                        }}
                      >
                        {additionalOrder?.total
                          ? formatCurrency(additionalOrder?.total)
                          : null}
                      </Text>
                    </View>

                    <DottedDivider />
                  </>
                )}

                <Text
                  style={{
                    color: "#FFFFFF",
                    fontWeight: "700",
                    fontSize: width * 0.05,
                    alignSelf: "center",
                    paddingBottom: height * 0.02,
                  }}
                >
                  Summmary
                </Text>
                {/* total: */}
                <View
                  style={{
                    flexDirection: "row",
                    marginBottom: 6,
                  }}
                >
                  <Text
                    style={{
                      color: "#FFFFFF",
                      fontWeight: "700",
                      fontSize: width * 0.047,
                      flex: 1,
                      flexWrap: "wrap",
                    }}
                  >
                    Total
                  </Text>

                  <Text
                    style={{
                      color: "#FFFFFF",
                      fontWeight: "700",
                      fontSize: width * 0.047,
                      marginLeft: 10,
                    }}
                  >
                    {calculatedTotal()}
                  </Text>
                </View>

                {/* total: */}
                <View
                  style={{
                    marginTop: height * 0.012,
                    flexDirection: "row",
                    marginBottom: 6,
                  }}
                >
                  <Text
                    style={{
                      color: "#FFFFFF",
                      fontWeight: "700",
                      fontSize: width * 0.047,
                      flex: 1,
                      flexWrap: "wrap",
                    }}
                  >
                    Already Covered
                  </Text>

                  {/* Already Covered*/}
                  <Text
                    style={{
                      color: "#FFFFFF",
                      fontWeight: "700",
                      fontSize: width * 0.047,
                      marginLeft: 10,
                    }}
                  >
                    {/* {(reservationData.reservationAmount / 2).toLocaleString(
                      undefined,
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }
                    )} */}
                    - {formatCurrency(reservationData.reservationAmount / 2)}
                  </Text>
                </View>

                {/* divider solid line */}
                <View
                  style={{
                    height: width * 0.001, // thickness of the line
                    alignSelf: "center",
                    backgroundColor: "rgba(150,150,150,0.6)", // grey with some transparency
                    width: "100%", // full width
                    marginVertical: 10, // optional spacing above and below
                  }}
                />

                {/* payable*/}
                <View
                  style={{
                    marginTop: height * 0.012,
                    flexDirection: "row",
                    marginBottom: 6,
                  }}
                >
                  <Text
                    style={{
                      color: "#FFFFFF",
                      fontWeight: "700",
                      fontSize: width * 0.047,
                      flex: 1,
                      flexWrap: "wrap",
                    }}
                  >
                    Payable
                  </Text>

                  <Text
                    style={{
                      color: "#FFFFFF",
                      fontWeight: "700",
                      fontSize: width * 0.047,
                      marginLeft: 10,
                    }}
                  >
                    {calculatedPayable()}
                  </Text>
                </View>
              </View>
            </>
          )}
        </ScrollView>

        {/* additional order, done  */}
        <View
          style={{
            flexDirection: "row",
            paddingHorizontal: height * 0.02,
            position: "absolute",
            bottom: height * 0.035,
            left: width * 0.04,
            right: width * 0.04,
            gap: 12,
          }}
        >
          {/* additional */}
          <TouchableOpacity
            onPress={handleAdditionalOrder}
            style={{
              paddingHorizontal: width * 0.02,
              backgroundColor: "#EFD974",
              justifyContent: "center",
              borderRadius: width * 0.05,
              alignItems: "center",
            }}
          >
            <AdditionalOrders width={width * 0.2} height={width * 0.1} />
          </TouchableOpacity>

          {/* done */}
          <TouchableOpacity
            // onPress = {handleDone}
            onPress={() => navigation.navigate("StaffHomeScreen")}
            style={{
              flex: 1,
              backgroundColor: "#8A1717",
              paddingVertical: height * 0.02,
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

        {isReservationStatusInvalid || isValid == false // para makuha niya yung invalid galinlg sa scanner
          ? reservationInvalid()
          : isValid && qrIdKey === "reservationId"
          ? reservationValid()
          : isValid && qrIdKey === "orderId"
          ? orderValid()
          : null}
      </View>
    </>
  );
};

export default StaffQRResultScreen;
