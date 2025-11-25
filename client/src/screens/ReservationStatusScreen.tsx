import React, { useEffect, useState } from "react";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamLists } from "../types/rootStackParamLists";
import { height, paddingTop, width } from "../utils/dimensions";
import {
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  Alert,
  ScrollView,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import MainBackground from "../assets/backgrounds/main-background.svg";
import InfoIcon from "../assets/images/info.svg";
import CircleSpinner from "./ui/CircleSpinner";
import Rejected from "../assets/icons/rejected.svg";
import OrderPolicyScreen from "./OrderPolicyScreen";
import { useReservationStore } from "../stores/useReservationStore";
import { updateToken } from "../services/token";
import { useOrderStore } from "../stores/useOrderStore";
import { rulesAndConditions } from "../data/rulesAndCondition";
type ReservationStatusScreenRouteProp = RouteProp<
  RootStackParamLists,
  "ReservationStatusScreen"
>;
type ReservationStatusScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamLists,
  "ReservationStatusScreen"
>;

interface Props {
  route: ReservationStatusScreenRouteProp;
  navigation: ReservationStatusScreenNavigationProp;
}

const ReservationStatusScreen: React.FC<Props> = ({ navigation, route }) => {
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const { reservationStatus } = route.params;
  const { spendLimit } = useOrderStore();
  const [title, setTitle] = useState("");
  const [header, setHeader] = useState("");
  const [description, setDescription] = useState("");

  const statusText = {
    pending: {
      header: "Awaiting Confirmation",
      title: "What Happens Next?",
      description:
        "Please allow up to 24 hours for us to manually verify your payment. You will receive a confirmation email as soon as it is approved.",
    },
    rejected: {
      header: "Reservation not Approved",
      title: "Reservation Rejected",
      description:
        "Our admin has reviewed your reservation and determined that it does not comply with Tavern’s Reservation Terms & Conditions.\nYou may create a new reservation following the guidelines.\n\nIf you believe this is a mistake, please contact us:\n- Phone: 0977 855 0783\n- Email: tavernasia1@gmail.com\n\nThank you for your understanding.",
    },
    done: {
      title: "",
      description: "",
    },
  };

  // mounting texts
  useEffect(() => {
    switch (reservationStatus) {
      case "none":
        break;
      case "pending":
        setHeader(statusText.pending.header);
        setTitle(statusText.pending.title);
        setDescription(statusText.pending.description);
        break;
      case "accepted":
        // await getReservationData("sha")
        // setReservationAmount()
        break;
      case "rejected":
        setHeader(statusText.rejected.header);
        setTitle(statusText.rejected.title);
        setDescription(statusText.rejected.description);

        break;
      case "done":
        break;
      default:
        break;
    }
  }, [reservationStatus]);

  // functions
  const displayIcon = () => {
    switch (reservationStatus) {
      case "pending":
        return <CircleSpinner />;
      case "accepted":
        break;
      case "rejected":
        // https://icon-sets.iconify.design/material-symbols/page-13.html?icon-filter=x
        return (
          <View style={{ width: width * 0.25, height: width * 0.25 }}>
            <Rejected width={width * 0.25} height={width * 0.25} />
          </View>
        );
      case "done":
        break;
      default:
        break;
    }
  };

  const handleStatusAction = async () => {
    switch (reservationStatus) {
      case "pending":
        navigation.navigate("HomeScreen");
        break;
      case "rejected":
        await updateToken({ reservationId: null });
        navigation.navigate("HomeScreen");

        break;
      case "done":
        break;
      default:
        break;
    }
  };

  const displayOrderPolicy = (): React.JSX.Element => {
    const [agreed, setAgreed] = useState(false);

    const handleContinueOrdering = () => {
      navigation.navigate("OrderHomeScreen");
    };

    return (
      <View style={{ width, height, flex: 1 }}>
        {/* Background Layer */}
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

        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingTop: paddingTop,
            // marginBottom: height * 0.01,
            paddingHorizontal: width * 0.05,
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
            Order Policy
          </Text>
        </View>

        {/* Main Content Container */}
        <ScrollView
          style={{
            flex: 1,
            padding: width * 0.05,
          }}
        >
          <View>
            {/* ===== ORDER SPEND LIMIT CARD ===== */}
            <View
              style={{
                marginTop: height * 0.02,
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
                  Order Minimum Spend Limit :
                </Text>
                <Text
                  style={{
                    color: "#FFF",
                    fontSize: width * 0.075,
                    fontWeight: "700",
                    fontFamily: "Poppins",
                    alignSelf: "center",
                  }}
                >
                  ₱{spendLimit}
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
                {rulesAndConditions.map((item, index) => (
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
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: height * 0.015,
                paddingBottom: height * 0.07,
              }}
            >
              <TouchableOpacity
                onPress={() => setIsChecked(!isChecked)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginRight: 8,
                }}
              >
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderWidth: 2,
                    borderColor: "#ccc",
                    borderRadius: 4,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: isChecked ? "#D4AF37" : "transparent",
                  }}
                >
                  {isChecked && (
                    <Text style={{ color: "white", fontSize: 14 }}>✓</Text>
                  )}
                </View>
              </TouchableOpacity>

              <Text
                style={{
                  color: "white",
                  fontSize: width * 0.032,
                  flexShrink: 1,
                }}
              >
                I have read and agree to the ordering and payment policies.
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* ===== CONTINUE ORDERING BUTTON ===== */}
        <View
          style={{
            paddingHorizontal: width * 0.05,
            paddingBottom: 30,
            paddingTop: 15,
          }}
        >
          <TouchableOpacity
            onPress={handleContinueOrdering}
            disabled={!isChecked}
            style={[
              {
                backgroundColor: "#8B0000",
                paddingVertical: 20,
                borderRadius: 20,
                alignItems: "center",
              },
              !isChecked && { opacity: 0.5 },
            ]}
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
    );
  };

  return (
    <>
      {reservationStatus === "accepted" && displayOrderPolicy()}
      {reservationStatus !== "accepted" && (
        <View style={{ width, height, flex: 1 }}>
          {/* ===== BACKGROUND ===== */}
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

          {/* ===== MAIN CONTAINER ===== */}
          <View
            style={{
              flex: 1,
              padding: width * 0.05,
              paddingTop: paddingTop,
              justifyContent: "space-between",
            }}
          >
            {/* Header */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: height * 0.01,
              }}
            >
              <Text
                style={{
                  paddingLeft: width * 0.035,
                  color: "#FFFFFF",
                  fontSize: width * 0.07,
                  fontWeight: "bold",
                }}
              >
                Reservation Status
              </Text>
            </View>

            {/* ===== CENTERED CONTENT (Loading Icon to Info Card) ===== */}
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {displayIcon()}
              <Text
                style={{
                  color: "#FFF",
                  fontSize: width * 0.065,
                  fontWeight: "700",
                  fontFamily: "Poppins",
                  marginBottom: height * 0.04,
                  marginTop: height * 0.02,
                }}
              >
                {header}
              </Text>
              {/* ===== INFO CARD ===== */}
              <View
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.12)",
                  borderRadius: 20,
                  padding: width * 0.045,
                  borderWidth: 1,
                  borderColor: "rgba(255, 255, 255, 0.15)",
                  width: "100%",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: height * 0.01,
                  }}
                >
                  <InfoIcon
                    width={width * 0.05}
                    height={width * 0.05}
                    style={{ marginRight: width * 0.02 }}
                  />
                  <Text
                    style={{
                      color: "#FFF",
                      fontSize: width * 0.045,
                      fontWeight: "700",
                      fontFamily: "Poppins",
                    }}
                  >
                    {title}
                  </Text>
                </View>

                <Text
                  style={{
                    color: "rgba(255, 255, 255, 0.9)",
                    fontSize: width * 0.033,
                    fontWeight: "400",
                    lineHeight: width * 0.05,
                    fontFamily: "Poppins",
                  }}
                >
                  {description}
                </Text>
              </View>
            </View>

            {/* ===== BACK TO HOME BUTTON ===== */}
            <TouchableOpacity
              onPress={handleStatusAction}
              style={{
                backgroundColor: "#8B0000",
                paddingVertical: 16,
                borderRadius: 16,
                alignItems: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 6,
                elevation: 6,
                marginBottom: height * 0.03,
              }}
            >
              <Text
                style={{
                  color: "#FFF",
                  fontSize: 16,
                  fontWeight: "700",
                  fontFamily: "Poppins",
                }}
              >
                Back to home
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </>
  );
};

export default ReservationStatusScreen;
