import React, { useEffect, useState } from "react";
import { RouteProp, StackActions } from "@react-navigation/native";
import { RootStackParamLists } from "../types/rootStackParamLists";
import { height, paddingTop, width } from "../utils/dimensions";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import MainBackground from "../assets/backgrounds/main-background.svg";
import InfoIcon from "../assets/images/info.svg";
import {
  getReservationCancellationIdByToken,
  updateToken,
} from "../services/token";
import { getCancellationData } from "../services/cancellation";

type ReservationCancellationStatusScreenRouteProp = RouteProp<
  RootStackParamLists,
  "ReservationCancellationStatusScreen"
>;
type ReservationCancellationStatusScreenNavigationProp =
  NativeStackNavigationProp<
    RootStackParamLists,
    "ReservationCancellationStatusScreen"
  >;

interface Props {
  route: ReservationCancellationStatusScreenRouteProp;
  navigation: ReservationCancellationStatusScreenNavigationProp;
}

const ReservationCancellationStatusScreen: React.FC<Props> = ({
  navigation,
  route,
}) => {
  const [cancellationStatus, setCancellationStatus] = useState<string>("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState<string[]>();

  const statusText = {
    pending: {
      title: "Request Under Review",
      description: [
        "We have received your cancellation request and it is currently under review.",
        "Please allow up to 24 hours for our team to manually verify the details of your request. You will receive a confirmation email once a decision has been made.",
        "We appreciate your patience and understanding during this process.",
      ],
    },
    accepted: {
      title: "Request Approved",
      description: [
        "We have carefully reviewed your cancellation request and are pleased to inform you that it has been approved.",
        "The refund has been successfully processed to your original payment method. Kindly allow 5–7 business days for the amount to reflect in your account, depending on your financial institution.",
        "Thank you for choosing Tavern. We look forward to welcoming you again, and you may submit a new reservation at your convenience.",
      ],
    },
    rejected: {
      title: "Request not Approved",
      description: [
        "We have carefully reviewed your cancellation request. After thorough evaluation, we regret to inform you that the request does not comply with Tavern’s Terms and Conditions for the process.",
        "As a result, your reservation will proceed as originally scheduled. Thank you for your understanding.",
      ],
    },
  };

  // Fetch Cancellation Status
  useEffect(() => {
    const fetchCancellationStatus = async () => {
      const reservationCancellationId =
        await getReservationCancellationIdByToken();

      if (!reservationCancellationId) return;

      const status = await getCancellationData(reservationCancellationId);

      setCancellationStatus(status);
    };

    fetchCancellationStatus();
  }, []);

  // Set text based on status
  useEffect(() => {
    switch (cancellationStatus) {
      case "pending":
        setTitle(statusText.pending.title);
        setDescription(statusText.pending.description);
        break;
      case "accepted":
        setTitle(statusText.accepted.title);
        setDescription(statusText.accepted.description);
        break;
      case "rejected":
        setTitle(statusText.rejected.title);
        setDescription(statusText.rejected.description);
        break;
    }
  }, [cancellationStatus]);

  const handleStatusAction = async () => {
    switch (cancellationStatus) {
      case "pending":
        navigation.navigate("HomeScreen");
        break;
      case "accepted":
        await updateToken({
          reservationCancellationId: null,
          orderId: null,
          reservationId: null,
        });
        navigation.navigate("HomeScreen");
        break;
      case "rejected":
        await updateToken({
          reservationCancellationId: null,
          orderId: null,
          reservationId: null,
        });
        navigation.navigate("HomeScreen");
        break;

      default:
        break;
    }
  };

  return (
    <>
      <View style={{ width, height, flex: 1 }}>
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

        <View
          style={{
            flex: 1,
            padding: width * 0.05,
            paddingTop: paddingTop,
          }}
        >
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
              Cancellation Status
            </Text>
          </View>

          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                // padding: width * 0.0,
                width: "100%",
              }}
            >
              <View
                style={{
                  justifyContent: "center",
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: height * 0.01,
                }}
              >
                <Text
                  style={{
                    color: "#FFF",
                    fontSize: width * 0.05,
                    fontWeight: "700",
                    fontFamily: "Poppins",
                  }}
                >
                  {title}
                </Text>
              </View>

              {description?.map((text, index) => (
                <Text
                  key={index}
                  style={[
                    {
                      textAlign: "center",
                      color: "rgba(255, 255, 255, 0.9)",
                      fontSize: width * 0.035,
                      fontWeight: "400",
                      lineHeight: width * 0.05,
                      fontFamily: "Poppins",
                    },
                    index !== description.length - 1 && {
                      marginBottom: width * 0.05,
                    },
                  ]}
                >
                  {text}
                </Text>
              ))}
            </View>

            {/* Contact Us: */}
            <View
              style={{
                marginTop: height * 0.04,
                backgroundColor: "rgba(255, 255, 255, 0.12)",
                borderRadius: 10,
                padding: width * 0.03,
                paddingVertical: width * 0.02,
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
                    fontSize: width * 0.04,
                    fontWeight: "700",
                    fontFamily: "Poppins",
                  }}
                >
                  Contact Us
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
                For any questions or further information, please reach out to
                the following:
              </Text>

              <Text
                style={{
                  marginTop: height * 0.005,
                  color: "rgba(255, 255, 255, 0.9)",
                  fontSize: width * 0.033,
                  fontWeight: "400",
                  lineHeight: width * 0.05,
                  fontFamily: "Poppins",
                }}
              >
                -Phone: 0977 855 0783
              </Text>

              <Text
                style={{
                  color: "rgba(255, 255, 255, 0.9)",
                  fontSize: width * 0.033,
                  fontWeight: "400",
                  lineHeight: width * 0.05,
                  fontFamily: "Poppins",
                }}
              >
                -Email: tavernasia1@gmail.com
              </Text>
            </View>
          </View>

          {/* Back to Home Button */}
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
              Back to Home
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default ReservationCancellationStatusScreen;
