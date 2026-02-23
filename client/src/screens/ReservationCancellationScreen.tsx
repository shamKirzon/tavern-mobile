import React, { useEffect, useState } from "react";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamLists } from "../types/rootStackParamLists";
import { height, paddingTop, width } from "../utils/dimensions";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import MainBackground from "../assets/backgrounds/main-background.svg";
import InfoIcon from "../assets/images/info.svg";
import { reservationCancellationTermsAndConditions } from "../data/rulesAndCondition";
import CollapsibleDropdown from "./ui/CollapsibleDropdown";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { createCancellation } from "../services/cancellation";
import { getReservationIdByToken, updateToken } from "../services/token";
import { getToken, getTokenInformation } from "../utils/token";
import { getReservationData } from "../services/reservation";
import { formatReadableDate } from "../utils/date";

type ReservationCancellationScreenRouteProp = RouteProp<
  RootStackParamLists,
  "ReservationCancellationScreen"
>;

type ReservationCancellationScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamLists,
  "ReservationCancellationScreen"
>;

interface Props {
  route: ReservationCancellationScreenRouteProp;
  navigation: ReservationCancellationScreenNavigationProp;
}

type ReservationInfo = {
  name: string;
  reservationAmount: string;
  reservationType: string;
  reservationStatus: string;
  pax: number;
  date: string;
};

const ReservationCancellationScreen: React.FC<Props> = ({
  navigation,
  route,
}) => {
  const cancellationReasons = [
    "Change of plans",
    "Found a better option",
    "Personal reasons",
    "Booking mistake",
    "Other",
  ];

  const [isRead, setIsRead] = useState<boolean>();
  const [isConfirmed, setIsConfirmed] = useState<boolean>();
  const [otherReasonNote, setOtherReasonNote] = useState<string>("");
  const [notes, setNotes] = useState<string>();
  const [selectedReason, setSelectedReason] = useState<string>();
  const [reservationInfo, setReservationInfo] = useState<ReservationInfo>({
    name: "",
    reservationAmount: "",
    reservationType: "",
    reservationStatus: "",
    pax: 0,
    date: "",
  });

  const checkCompleted = isRead && isConfirmed;

  // Reset "Other" Note when shifting from "other" to other reason.
  useEffect(() => {
    setOtherReasonNote("");
  }, [selectedReason]);

  // fetch reservation information.
  useEffect(() => {
    const fetchData = async () => {
      const reservationId = await getReservationIdByToken();

      if (!reservationId) return;

      const reservationData = await getReservationData(reservationId);

      if (!reservationData || reservationData.length === 0) return;

      const {
        first_name: firstName,
        last_name: lastName,
        reservation_amount: reservationAmount,
        reservation_type: reservationType,
        reservation_status: reservationStatus,
        pax,
        date,
      } = reservationData[0];

      setReservationInfo({
        name: `${firstName} ${lastName}`,
        reservationAmount: `${reservationAmount.toLocaleString()} PHP`,
        reservationType:
          reservationType.charAt(0).toUpperCase() + reservationType.slice(1),
        reservationStatus: reservationStatus,
        pax,
        date: formatReadableDate(date),
      });
    };

    fetchData();
  }, []);

  // Functions:
  const handleCancellation = async () => {
    const finalReason =
      selectedReason === "Other"
        ? otherReasonNote.trim() || "Other"
        : selectedReason;

    const cancellationData = {
      reservationId: await getReservationIdByToken(),
      reason: finalReason,
      notes: notes?.trim(),
    };

    const reservationCancellationId =
      await createCancellation(cancellationData);
    if (!reservationCancellationId) return;

    await updateToken({ reservationCancellationId });
    // navigation.navigate("HomeScreen");
  };
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
            Cancellation Request
          </Text>
        </View>

        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          enableOnAndroid
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: height * 0.05 }}
          >
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
                  {reservationInfo.name}
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
                  {reservationInfo.date}
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
                  {reservationInfo.reservationType}
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
                  {reservationInfo.pax}
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
                  {reservationInfo.reservationAmount}
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

              <View>
                {reservationCancellationTermsAndConditions.map(
                  (policy, index) => (
                    <View key={index} style={{ marginBottom: height * 0.013 }}>
                      <Text
                        style={{
                          color: "#FFFFFF",
                          fontSize: width * 0.032,
                          fontWeight: "600",
                          marginBottom: height * 0.004,
                        }}
                      >
                        {policy.title}
                      </Text>
                      {policy.items.map((item, itemIndex) => (
                        <View
                          key={itemIndex}
                          style={{
                            flexDirection: "row",
                            marginLeft: width * 0.05,
                            paddingBottom: width * 0.005,
                          }}
                        >
                          <Text
                            style={{
                              color: "#dddddd",
                              fontSize: width * 0.032,
                              paddingRight: width * 0.01,
                            }}
                          >
                            •
                          </Text>
                          <Text
                            style={{
                              color: "#dddddd",
                              fontSize: width * 0.032,
                              flex: 1,
                            }}
                          >
                            {item}
                          </Text>
                        </View>
                      ))}
                    </View>
                  ),
                )}
              </View>
            </View>
            {/* Contact Information */}
            <View
              style={{
                marginTop: height * 0.02,
                backgroundColor: "rgba(255,255,255,0.1)",
                borderRadius: width * 0.03,
                padding: width * 0.03,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  paddingLeft: width * 0.02,
                  alignItems: "center",
                }}
              >
                <InfoIcon
                  width={width * 0.08}
                  height={width * 0.08}
                  style={{
                    marginRight: width * 0.02,
                  }}
                />

                <View
                  style={{
                    flexDirection: "column",
                    gap: 4,
                  }}
                >
                  <Text style={{ color: "#FFFFFF", fontSize: width * 0.034 }}>
                    Contact Information:
                  </Text>

                  <Text style={{ color: "#FFFFFF", fontSize: width * 0.034 }}>
                    Email: tavernasia1@gmail.com
                  </Text>
                </View>
              </View>
            </View>
            {/* Reason for Cancellation */}
            <Text
              style={{
                marginTop: height * 0.03,
                color: "#FFFFFF",
                fontSize: width * 0.045,
                fontWeight: "bold",
                marginBottom: height * 0.015,
              }}
            >
              Reason for Cancellation
            </Text>
            <CollapsibleDropdown
              options={cancellationReasons}
              onSelect={(reason) => setSelectedReason(reason)}
            />
            {selectedReason == "Other" && (
              <View
                style={{
                  backgroundColor: "#404040",
                  borderRadius: width * 0.03,
                  paddingVertical: width * 0.04,
                  padding: width * 0.03,
                  marginBottom: height * 0.02,
                  height: height * 0.1,
                }}
              >
                <TextInput
                  value={otherReasonNote}
                  onChangeText={setOtherReasonNote}
                  placeholder="Please Specify"
                  placeholderTextColor="#CCCCCC"
                  style={{
                    color: "#FFFFFF",
                    fontSize: width * 0.034,
                  }}
                ></TextInput>
              </View>
            )}

            {/* Notes Label*/}
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: width * 0.045,
                fontWeight: "bold",
                marginBottom: height * 0.015,
              }}
            >
              Notes
            </Text>

            {/* Notes Input */}
            <View
              style={{
                backgroundColor: "#404040",
                borderRadius: width * 0.03,
                paddingVertical: width * 0.04,
                padding: width * 0.03,
                height: height * 0.1,
              }}
            >
              <TextInput
                value={notes}
                onChangeText={setNotes}
                placeholder="Anything else we should know?"
                placeholderTextColor="#CCCCCC"
                multiline
                style={{
                  color: "#FFFFFF",
                  fontSize: width * 0.034,
                }}
              ></TextInput>
            </View>

            {/* Checkbox Agreement */}
            <View
              style={{
                flexDirection: "column",
              }}
            >
              {/* I have read... */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: height * 0.015,
                }}
              >
                <TouchableOpacity
                  onPress={() => setIsRead(!isRead)}
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
                      backgroundColor: isRead ? "#D4AF37" : "transparent",
                    }}
                  >
                    {isRead && (
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
                    fontSize: width * 0.033,
                    flexShrink: 1,
                  }}
                >
                  I have read and agreed to Tavern’s terms and condition of
                  Cancellation of Reservation Request.
                </Text>
              </View>

              {/* I have confirmed... */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: height * 0.015,
                }}
              >
                <TouchableOpacity
                  onPress={() => setIsConfirmed(!isConfirmed)}
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
                      backgroundColor: isConfirmed ? "#D4AF37" : "transparent",
                    }}
                  >
                    {isConfirmed && (
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
                    fontSize: width * 0.033,
                    flexShrink: 1,
                  }}
                >
                  I have confirmed that all the details I input is correct.
                </Text>
              </View>
            </View>

            {/* Request Cancellation */}
            <TouchableOpacity
              onPress={() => handleCancellation()}
              disabled={!checkCompleted}
              style={[
                {
                  marginTop: height * 0.05,
                  backgroundColor: "#8B0000",
                  paddingVertical: 16,
                  borderRadius: 16,
                  alignItems: "center",
                },
                !checkCompleted && { opacity: 0.5 },
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
                Request Cancellation
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAwareScrollView>
      </View>
    </View>
  );
};

export default ReservationCancellationScreen;
