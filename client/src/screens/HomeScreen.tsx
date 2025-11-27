import React, { useState, useEffect, useRef, JSX } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Animated,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { width, height } from "../utils/dimensions";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamLists } from "../types/rootStackParamLists";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAuthStore } from "../stores/useAuthStore";
import MainBackground from "../assets/backgrounds/main-background.svg";
import { category } from "../data/category";
import { generateOtp } from "../services/auth";
import {
  getEmailByToken,
  getOrderIdByToken,
  getReservationIdByToken,
  updateToken,
} from "../services/token";
import {
  getReservationStatus,
  getReservationAmount,
} from "../services/reservation";
import Loading from "./ui/Loading";
import { useReservationStore } from "../stores/useReservationStore";
import { useOrderStore } from "../stores/useOrderStore";
import { ReservationStatus } from "../types/reservation";
import { getOrderData } from "../services/order";

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamLists,
  "HomeScreen"
>;

type HomeScreenRouteProp = RouteProp<RootStackParamLists, "HomeScreen">;

interface Props {
  navigation: HomeScreenNavigationProp;
  route: HomeScreenRouteProp;
}

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [hasEmail, setHasEmail] = useState<string | null>(null);
  const [hasReservation, setHasReservation] = useState<string | null>(null);
  const [hasOrder, setHasOrder] = useState<string | null>(null);

  const { showEmailVerifiedToggle, setShowEmailVerifiedToggle } =
    useAuthStore();
  const { setReservationAmount, reservationAmount } = useReservationStore();
  const { setSpendLimit } = useOrderStore();
  const [email, setEmail] = useState("");
  const [isEmailInvalid, setIsEmailInvalid] = useState<boolean>(false);
  const [showToaster, setShowToaster] = useState(false);
  const [isLoading, setIsLoadings] = useState<boolean>(false);

  const [reservationStatus, setReservationStatus] =
    useState<ReservationStatus>("none");

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const resetSystem = async () => {
      try {
        setIsLoadings(true);
        const reservationId = await getReservationIdByToken();
        const orderId = await getOrderIdByToken();

        if (!reservationId || !orderId) return;

        const reservationStatus = await getReservationStatus(reservationId);
        const { order_status: orderStatus } = await getOrderData(orderId);

        if (reservationStatus === "done" && orderStatus === "done") {
          await updateToken({ orderId: null });
          await updateToken({ reservationId: null });
        }
      } catch (error) {
        console.error("Can't perform reset system.");
      } finally {
        setIsLoadings(false);
      }
    };

    resetSystem();
  }, []);

  useEffect(() => {
    if (showToaster) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => setShowToaster(false));
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showToaster]);

  useEffect(() => {
    if (showEmailVerifiedToggle) {
      setShowToaster(true);
    }
    setShowEmailVerifiedToggle(false);
  }, [showEmailVerifiedToggle]);

  // check auth
  useEffect(() => {
    const fetchData = async () => {
      const email = await getEmailByToken();
      const reservation = await getReservationIdByToken();
      const order = await getOrderIdByToken();

      setHasEmail(email);
      setHasReservation(reservation);
      setHasOrder(order);
    };
    fetchData();
  }, []);

  // handle reservation status
  useEffect(() => {
    handleStatus();
  }, [hasEmail, hasReservation, hasOrder]);

  // get reservation amount
  useEffect(() => {
    const getTotal = async () => {
      if (!hasReservation) return;
      const amount = await getReservationAmount(hasReservation);
      setReservationAmount(amount);
      setSpendLimit(amount);
    };
    getTotal();
  }, [hasReservation]);

  const handleStatus = async () => {
    if (hasEmail && hasReservation && hasOrder) {
      setReservationStatus("done");
    } else if (hasEmail && hasReservation) {
      try {
        setIsLoadings(true);
        const res = await getReservationStatus(hasReservation);
        if (!res) return;
        setReservationStatus(res);
      } catch (error) {
        console.error("Error in handleStatus(): ", error);
      } finally {
        setIsLoadings(false);
      }
    } else if (hasEmail) {
      // show book now
    } else {
      setReservationStatus("none");
    }
  };

  const handleViewStatus = async () => {
    if (!hasReservation) return;

    if (hasOrder) {
      navigation.navigate("OrderStatusScreen");
    } else if (hasReservation) {
      navigation.navigate("ReservationStatusScreen", { reservationStatus });
    }
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email.trim());
  };

  const handleBookNow = () => {
    navigation.navigate("ReservationScreen");
  };

  const handleContinue = async () => {
    if (!validateEmail(email)) {
      setIsEmailInvalid(true);
      setEmail("");
      setShowToaster(true);
      return;
    }

    navigation.navigate("EmailVerificationScreen", { email });
    await generateOtp(email);
  };

  const renderToaster = (): JSX.Element | null => {
    if (!showToaster) return null;

    return (
      <Animated.View
        style={{
          opacity: fadeAnim,
          backgroundColor: isEmailInvalid
            ? "rgba(211, 47, 47, 0.8)"
            : "rgba(76, 175, 80, 0.8)",

          paddingVertical: height * 0.01,
          paddingHorizontal: width * 0.05,
          borderRadius: width * 0.03,
          marginBottom: height * 0.02,
          width: "100%",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: "white",
            fontWeight: "medium",
            fontSize: width * 0.04,
            textAlign: "center",
            fontFamily: "Poppins-Regular",
          }}
        >
          {isEmailInvalid ? "Invalid Email" : "Email Verified."}
        </Text>
      </Animated.View>
    );
  };

  const renderReservationLabel = (): JSX.Element | null => {
    let bgColor = "";
    let borderColor = "";
    let text = "";

    switch (reservationStatus) {
      case "pending":
        borderColor = "#A88A00";
        bgColor = "rgba(255, 217, 102, 0.25)";
        text = "Pending Reservation Approval";
        break;

      case "accepted":
        bgColor = "rgb(35, 135, 35)";
        borderColor = "rgb(35, 135, 35)";
        text = "Reservation Approved";
        break;

      case "rejected":
        borderColor = "#E05002";
        bgColor = "rgba(224, 80, 2, 0.25)";
        text = "Your Reservation has been Rejected.";
        break;

      case "done":
        borderColor = "#C6A300";
        bgColor = "rgba(198, 163, 0, 0.25)";
        text = "Review Order Summary.";
        break;

      case "cancelled":
        borderColor = "#FFA500";
        bgColor = "rgba(255, 165, 0, 0.25)";
        text = "Reservation has been Cancelled.";
        break;

      default:
        return <></>;
    }

    return (
      <Text
        style={{
          color: "white",
          fontSize: width * 0.04,
          fontWeight: "500",
          paddingVertical: height * 0.01,
          paddingHorizontal: width * 0.05,
          borderRadius: width * 0.03,
          textAlign: "center",
          width: "100%",
          marginBottom: height * 0.02,
          backgroundColor: bgColor,
          borderWidth: 1,
          borderColor: borderColor,
        }}
      >
        {text}
      </Text>
    );
  };

  const reservationSection = (): JSX.Element | null => {
    if (reservationStatus === "none") return null;

    return (
      <View
        style={{
          width: "100%",
          alignItems: "center",
          marginBottom: height * 0.025,
        }}
      >
        {renderReservationLabel()}
        <TouchableOpacity
          onPress={() => handleViewStatus()}
          style={{
            backgroundColor: "#8B0001",
            paddingVertical: height * 0.02,
            borderRadius: width * 0.03,
            width: "100%",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: "#FFFFFF",
              fontWeight: "bold",
              fontSize: width * 0.045,
            }}
          >
            View Status
          </Text>
        </TouchableOpacity>
        {/* labelTesting(pending) */}
      </View>
    );
  };

  const menu = (): JSX.Element => (
    <View
      style={{
        width: "100%",
        marginTop: height * 0.03,
      }}
    >
      <Text
        style={{
          color: "white",
          fontSize: width * 0.075,
          fontWeight: "bold",
          marginBottom: height * 0.02,
          textAlign: "left",
          paddingHorizontal: width * 0.025,
        }}
      >
        Our Menu
      </Text>

      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-between",
          paddingHorizontal: width * 0.025,
        }}
      >
        {Object.values(category).map((item, index) => (
          <TouchableOpacity
            key={index}
            style={{
              width: "48%",
              marginBottom: height * 0.02,
              borderRadius: width * 0.05,
              overflow: "hidden",
              height: height * 0.25,
            }}
            onPress={() =>
              navigation.navigate("MenuViewingScreen", {
                category: item.header,
              })
            }
          >
            <ImageBackground
              source={item.imagePath}
              style={{
                flex: 1,
                justifyContent: "flex-end",
                padding: width * 0.05,
              }}
              imageStyle={{
                borderRadius: width * 0.05,
                resizeMode: "cover",
              }}
            >
              <View
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  borderRadius: width * 0.05,
                }}
              />

              <Text
                style={{
                  color: "white",
                  fontSize: width * 0.055,
                  fontWeight: "bold",
                  marginBottom: height * 0.01,
                  zIndex: 1,
                }}
              >
                {item.header}
              </Text>
              <Text
                style={{
                  color: "white",
                  fontSize: width * 0.035,
                  lineHeight: height * 0.018,
                  zIndex: 1,
                }}
              >
                {item.description}
              </Text>
            </ImageBackground>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <>
      {isLoading && Loading()}

      <KeyboardAvoidingView
        style={{
          flex: 1,
          width,
        }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        <MainBackground
          width={width}
          height={height}
          preserveAspectRatio="none"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
          }}
        />

        <ScrollView
          contentContainerStyle={{
            paddingTop: Platform.OS === "ios" ? height * 0.06 : height * 0.02,
            flexGrow: 1,
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            paddingHorizontal: width * 0.05,
            paddingVertical: height * 0.02,
          }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ width: "100%", alignItems: "center" }}>
            <Text
              style={{
                color: "white",
                fontSize: width * 0.08,
                fontWeight: "bold",
                marginBottom: height * 0.015,
                textAlign: "left",
                width: "100%",
              }}
            >
              Book a Reservation.
            </Text>
            <Text
              style={{
                color: "white",
                fontSize: width * 0.04,
                marginBottom: height * 0.03,
                textAlign: "left",
                width: "100%",
                lineHeight: height * 0.022,
              }}
            >
              Great food, great drinks, top notch service and a warm inviting
              ambiance.
            </Text>

            {renderToaster()}

            {reservationStatus === "none" && (
              <>
                {!hasEmail && (
                  <TextInput
                    placeholder="email@example.com"
                    placeholderTextColor="#999"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    style={{
                      width: "100%",
                      backgroundColor: "white",
                      color: "#333",
                      padding: height * 0.02,
                      borderRadius: width * 0.03,
                      marginBottom: height * 0.025,
                      fontSize: width * 0.04,
                    }}
                  />
                )}

                {hasEmail ? (
                  <TouchableOpacity
                    onPress={handleBookNow}
                    style={{
                      backgroundColor: "#8B0001",
                      paddingVertical: height * 0.02,
                      borderRadius: width * 0.03,
                      width: "100%",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: "#FFFFFF",
                        fontWeight: "bold",
                        fontSize: width * 0.045,
                      }}
                    >
                      Book Now
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={handleContinue}
                    style={{
                      backgroundColor: "#8B0001",
                      paddingVertical: height * 0.02,
                      borderRadius: width * 0.03,
                      width: "100%",
                      alignItems: "center",
                      opacity: !email ? 0.5 : 1,
                    }}
                    disabled={!email}
                  >
                    <Text
                      style={{
                        color: "#FFFFFF",
                        fontWeight: "bold",
                        fontSize: width * 0.045,
                      }}
                    >
                      Verify Email
                    </Text>
                  </TouchableOpacity>
                )}
              </>
            )}

            {reservationSection()}
            {menu()}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default HomeScreen;
