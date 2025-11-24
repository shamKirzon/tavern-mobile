import React, { useState, useMemo, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";

import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  Keyboard,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Modal,
  Pressable,
} from "react-native";
import { width, height } from "../utils/dimensions";
import MainBackground from "../assets/backgrounds/main-background.svg";
import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamLists } from "../types/rootStackParamLists";
import { useReservationStore } from "../stores/useReservationStore";
import { ReservationData } from "../types/reservation";
import { getEmailByToken } from "../services/token";
import { createReservation, uploadImage } from "../services/reservation";
import Loading from "./ui/Loading";

type ReservationScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamLists,
  "ReservationScreen"
>;
type ReservationScreenRouteProp = RouteProp<
  RootStackParamLists,
  "ReservationScreen"
>;

type Props = {
  navigation: ReservationScreenNavigationProp;
  route: ReservationScreenRouteProp;
};

const MAX_PAX_INCLUSIVE = 70;
const MAX_PAX_EXCLUSIVE = 30;
const MIN_PAX_EXCLUSIVE = 15;
const PRICE_PER_PAX_INCLUSIVE = 1000;
const PRICE_PER_PAX_EXCLUSIVE = 2000;

const ReservationScreen: React.FC<Props> = ({ navigation, route }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isGuestInvalid, setIsGuestInvalid] = useState(false);
  const { setReservationData, customerReservationData } = useReservationStore();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [contactNumber, setContactNumber] = useState("09");
  const [guests, setGuests] = useState(1);
  const [reservationType, setReservationType] = useState("Inclusive");
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [validId, setValidId] = useState<string>("");
  const [currentMonth, setCurrentMonth] = useState("November");
  const [showDropdown, setShowDropdown] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const [errors, setErrors] = useState<{
    firstName: boolean;
    lastName: boolean;
    contactNumber: boolean;
    guests: boolean;
    schedule: boolean;
    validId: boolean;
  }>({
    firstName: true,
    lastName: true,
    contactNumber: true,
    guests: true,
    schedule: true,
    validId: true,
  });

  const today = new Date();
  const reservationTypes = ["Exclusive", "Inclusive"];
  const bookNowDisabled =
    !firstName ||
    !lastName ||
    !contactNumber ||
    !guests ||
    !reservationType ||
    !selectedDate ||
    !validId;

  const { maxGuests, minGuests, pricePerPax } = useMemo(() => {
    if (reservationType === "Exclusive") {
      return {
        maxGuests: MAX_PAX_EXCLUSIVE,
        minGuests: MIN_PAX_EXCLUSIVE,
        pricePerPax: PRICE_PER_PAX_EXCLUSIVE,
      };
    }
    return {
      maxGuests: MAX_PAX_INCLUSIVE,
      minGuests: 1,
      pricePerPax: PRICE_PER_PAX_INCLUSIVE,
    };
  }, [reservationType]);

  useEffect(() => {
    if (guests > maxGuests) {
      setGuests(maxGuests);
    } else if (guests < minGuests) {
      setGuests(minGuests);
    }
  }, [reservationType]);

  const totalFee = guests * pricePerPax;

  const allDays = Array.from({ length: 14 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    return {
      name: date.toLocaleDateString("en-US", { weekday: "short" }),
      date: date.getDate(),
    };
  });

  const handleUpload = async () => {
    setIsUploading(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (result.canceled) {
        console.log("User cancelled image picking");
        return;
      }

      const imageUri = result.assets[0].uri;

      const validIdUrl = await uploadImage(imageUri, "validId");
      if (validIdUrl) {
        console.log("valid id url successfully:", validIdUrl);
        setValidId(validIdUrl);
        setReservationData({ validIdUrl });
      }
    } catch (error) {
      console.error("Error picking valid ID:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const capitalizeWords = (name: string) => {
    return name
      .split(/\s+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };
  const createDate = (day: number, month: string, year: number): Date => {
    const months: Record<string, number> = {
      january: 0,
      february: 1,
      march: 2,
      april: 3,
      may: 4,
      june: 5,
      july: 6,
      august: 7,
      september: 8,
      october: 9,
      november: 10,
      december: 11,
    };

    const monthIndex = months[month.toLowerCase()];

    if (monthIndex === undefined) {
      console.error("Invalid month name:", month);
      return new Date(NaN); // invalid date
    }

    const date = new Date(year, monthIndex, day);
    console.log("CREATE DATE RESULTS:", date);
    return date;
  };

  const handleBookNow = async () => {
    const email = await getEmailByToken();

    const date = createDate(selectedDate!, currentMonth, 2025);

    // container:
    const reservationData: ReservationData = {
      email,
      firstName: capitalizeWords(firstName),
      lastName: capitalizeWords(lastName),
      mobileNumber: contactNumber.trim(),
      reservationType: reservationType.toLowerCase(),
      date,
      pax: guests,
      reservationAmount: totalFee,
    };

    setReservationData(reservationData);

    // navigation:
    navigation.navigate("BookingSummaryScreen", {
      name: `${reservationData.firstName}${reservationData.lastName}`,
      date: reservationData.date?.toISOString()!,
      guests: reservationData.pax!,
      reservationType:
        reservationData.reservationType?.charAt(0).toUpperCase()! +
        reservationData.reservationType?.slice(1),
      reservationFee: reservationData.reservationAmount?.toString()!,
    });
  };

  const handleSelectReservationType = (type: string) => {
    setReservationType(type);
    setShowDropdown(false);
  };

  return (
    <>
      {isUploading && Loading("Uploading file...")}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Pressable
            onPress={() => Keyboard.dismiss()}
            style={{
              flex: 1,
              width: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: width * 0.08,
            }}
          >
            <Pressable
              onPress={() => {}}
              style={{
                backgroundColor: "#171717",
                padding: width * 0.06,
                borderRadius: width * 0.06,
                width: "100%",
                alignItems: "center",
                paddingBottom: height * 0.04,
                borderWidth: 1,
                borderColor: "rgba(255, 255, 255, 0.08)",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.4,
                shadowRadius: 24,
                elevation: 16,
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  paddingTop: height * 0.02,
                  color: "#fff",
                  fontSize: width * 0.06,
                  fontWeight: "bold",
                  alignSelf: "center",
                }}
              >
                Are you sure you want to exit?
              </Text>

              {/* subtext:  */}
              <Text
                style={{
                  paddingTop: height * 0.02,
                  textAlign: "center",
                  color: "#fff",
                  fontSize: width * 0.04,
                  fontWeight: "200",
                  marginBottom: height * 0.07,
                }}
              >
                You have unsaved changes. Exiting now will lose all your
                progress.
              </Text>

              {/* Buttons */}
              <View style={{ flexDirection: "row", gap: width * 0.04 }}>
                {["Cancel", "Exit"].map((item, index) => (
                  <Pressable
                    key={index}
                    style={({ pressed }) => ({
                      backgroundColor: index === 0 ? "#FFFF" : "#8A1717",
                      paddingVertical: height * 0.02,
                      borderRadius: width * 0.03,
                      alignItems: "center",
                      width: width * 0.34,
                      opacity: pressed ? 0.7 : 1,
                      transform: [{ scale: pressed ? 0.97 : 1 }],
                    })}
                    onPress={() => {
                      {
                        if (index === 0) {
                          setModalVisible(false);
                        } else if (index === 1) {
                          setModalVisible(false);
                          navigation.navigate("HomeScreen");
                        }
                      }
                    }}
                  >
                    <Text
                      style={{
                        color: index === 0 ? "#8A1717" : "#FFFF",
                        fontSize: width * 0.04,
                        fontWeight: "600",
                      }}
                    >
                      {item}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </Pressable>
          </Pressable>
        </View>
      </Modal>

      <KeyboardAvoidingView
        style={{
          width,
          height,
          flex: 1,
        }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        <MainBackground
          width={width}
          height={height}
          preserveAspectRatio="none"
          style={{ position: "absolute", top: 0, left: 0 }}
        />

        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center", // vertically centers icon with text
            justifyContent: "flex-start",
            paddingHorizontal: width * 0.05,
            paddingTop: Platform.OS === "ios" ? height * 0.06 : height * 0.02,
            paddingBottom: height * 0.02,
            zIndex: 1,
          }}
        >
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={{
              width: 35,
              height: 35,
              justifyContent: "center",
              alignItems: "center",
              marginRight: 10,
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: width * 0.09,
                fontWeight: "600",
              }}
            >
              ←
            </Text>
          </TouchableOpacity>
          <Text
            style={{
              fontSize: width * 0.08,
              fontWeight: "bold",
              color: "white",
            }}
          >
            Reservation
          </Text>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingHorizontal: width * 0.05,
            paddingBottom: 40,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ gap: 18 }}>
            {/* User Info */}
            <Text
              style={{
                fontSize: width * 0.06,
                fontWeight: "600",
                color: "white",
                marginBottom: 8,
              }}
            >
              Enter Your Information
            </Text>
            {/* Input Fields */}
            <View style={{ flexDirection: "row", gap: 12 }}>
              <TextInput
                placeholder="First Name"
                value={firstName}
                onChangeText={(text) => {
                  // Only allow letters and spaces
                  const cleanedText = text.replace(/[^a-zA-Z\s]/g, "");
                  setFirstName(cleanedText);

                  // Set error if empty
                  setErrors((prev) => ({
                    ...prev,
                    firstName: cleanedText.trim() === "",
                  }));
                }}
                placeholderTextColor="#999"
                style={{
                  flex: 1,
                  backgroundColor: "white",
                  borderRadius: 12,
                  paddingVertical: 16,
                  paddingHorizontal: 18,
                  fontSize: width * 0.04,
                  color: "#000",

                  borderWidth: errors.firstName ? 2 : 0,
                  borderColor: errors.firstName ? "red" : "transparent",
                }}
              />

              {/* last name */}
              <TextInput
                placeholder="Last Name"
                value={lastName}
                onChangeText={(text) => {
                  // Only allow letters and spaces
                  const cleanedText = text.replace(/[^a-zA-Z\s]/g, "");
                  setLastName(cleanedText);

                  // Set error if empty
                  setErrors((prev) => ({
                    ...prev,
                    lastName: cleanedText.trim() === "",
                  }));
                }}
                placeholderTextColor="#999"
                style={{
                  flex: 1,
                  backgroundColor: "white",
                  borderRadius: 12,
                  paddingVertical: 16,
                  paddingHorizontal: 18,
                  fontSize: width * 0.04,
                  color: "#000",
                  borderWidth: errors.lastName ? 2 : 0,
                  borderColor: errors.lastName ? "red" : "transparent",
                }}
              />
            </View>

            <TextInput
              placeholder="Contact Number"
              value={contactNumber}
              onChangeText={(text) => {
                // Only allow numeric characters
                let numericText = text.replace(/[^0-9]/g, "");

                // Always start with "09"
                if (!numericText.startsWith("09")) {
                  numericText = "09";
                }

                if (numericText.length !== 11)
                  setErrors((prev) => ({ ...prev, contactNumber: true }));
                // Limit to 11 digits
                if (numericText.length > 11) {
                  numericText = numericText.slice(0, 11);
                }

                if (numericText.length == 11)
                  setErrors((prev) => ({ ...prev, contactNumber: false }));

                setContactNumber(numericText);
              }}
              placeholderTextColor="#999"
              keyboardType="phone-pad"
              style={{
                backgroundColor: "white",
                borderRadius: 12,
                paddingVertical: 16,
                paddingHorizontal: 18,
                fontSize: width * 0.04,
                color: "#000",
                borderWidth: errors.contactNumber ? 2 : 0,
                borderColor: errors.contactNumber ? "red" : "transparent",
              }}
            />

            {/* Schedule Picker */}
            <View>
              <Text
                style={{
                  color: "white",
                  fontSize: width * 0.06,
                  fontWeight: "600",
                  marginBottom: 12,
                }}
              >
                When to visit?
              </Text>
              <View
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  borderRadius: 16,
                  padding: 20,

                  borderWidth: errors.schedule ? 1 : 0,
                  borderColor: errors.schedule
                    ? "red"
                    : "rgba(255, 255, 255, 0.15)",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 18,
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: width * 0.05,
                      fontWeight: "600",
                    }}
                  >
                    Pick a Schedule
                  </Text>
                  <TouchableOpacity
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.15)",
                      paddingVertical: 8,
                      paddingHorizontal: 25,
                      borderRadius: 20,
                      borderWidth: 1,
                      borderColor: "rgba(255, 255, 255, 0.36)",
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontSize: width * 0.038,
                        fontWeight: "700",
                      }}
                    >
                      {currentMonth}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Days Carousel */}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <TouchableOpacity
                    onPress={() =>
                      setStartIndex((prev) => Math.max(0, prev - 6))
                    }
                    disabled={startIndex === 0}
                    style={{ padding: 8, opacity: startIndex === 0 ? 0.4 : 1 }}
                  >
                    <Text style={{ color: "white", fontSize: width * 0.08 }}>
                      ‹
                    </Text>
                  </TouchableOpacity>

                  <View
                    style={{
                      flexDirection: "row",
                      flex: 1,
                      justifyContent: "space-between",
                      gap: 1,
                    }}
                  >
                    {allDays
                      .slice(startIndex, startIndex + 6)
                      .map((day, index) => (
                        <TouchableOpacity
                          key={day.date + index}
                          onPress={() => {
                            setErrors((prev) => ({ ...prev, schedule: false }));
                            setSelectedDate(day.date);
                          }}
                          style={{
                            flex: 1,
                            alignItems: "center",
                            paddingVertical: 20,
                            borderRadius: 10,
                            backgroundColor:
                              selectedDate === day.date
                                ? "#8A1717"
                                : "transparent",
                          }}
                        >
                          <Text
                            style={{
                              color: "white",
                              fontSize: width * 0.03,
                              marginBottom: 2,
                              opacity: 0.9,
                            }}
                          >
                            {day.name}
                          </Text>
                          <Text
                            style={{
                              color: "white",
                              fontSize: width * 0.06,
                              fontWeight: "600",
                            }}
                          >
                            {day.date}
                          </Text>
                        </TouchableOpacity>
                      ))}
                  </View>

                  <TouchableOpacity
                    onPress={() =>
                      setStartIndex((prev) => Math.min(prev + 6, 8))
                    }
                    disabled={startIndex >= 8}
                    style={{ padding: 8, opacity: startIndex >= 8 ? 0.4 : 1 }}
                  >
                    <Text style={{ color: "white", fontSize: width * 0.08 }}>
                      ›
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            {/* Reservation Type and Guests */}
            <View style={{ flexDirection: "row", gap: 12 }}>
              <View style={{ flex: 1, zIndex: showDropdown ? 100 : 1 }}>
                <Text
                  style={{
                    color: "white",
                    fontSize: width * 0.038,
                    fontWeight: "500",
                    marginBottom: 8,
                  }}
                >
                  Type of Reservation
                </Text>

                <TouchableOpacity
                  onPress={() => {
                    Keyboard.dismiss();
                    setShowDropdown(!showDropdown);
                  }}
                  activeOpacity={0.7}
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    borderRadius: 12,
                    paddingVertical: 14,
                    paddingHorizontal: 16,
                    borderWidth: 1,
                    borderColor: "rgba(255, 255, 255, 0.2)",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: width * 0.038,
                      fontWeight: "500",
                    }}
                  >
                    {reservationType}
                  </Text>
                  <Text style={{ color: "white", fontSize: width * 0.025 }}>
                    ▼
                  </Text>
                </TouchableOpacity>

                {/* Overlay behind dropdown */}
                {showDropdown && (
                  <TouchableOpacity
                    style={{
                      position: "absolute",
                      top: 0,
                      left: -width * 0.05,
                      width: width,
                      height: height,
                      backgroundColor: "transparent",
                      zIndex: 90,
                    }}
                    onPress={() => setShowDropdown(false)}
                    activeOpacity={1}
                  />
                )}

                {/* Dropdown List */}
                {showDropdown && (
                  <View
                    style={{
                      position: "absolute",
                      top: 80,
                      left: 0,
                      right: 0,
                      backgroundColor: "#2a2a2a",
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: "rgba(255, 255, 255, 0.3)",
                      overflow: "hidden",
                      zIndex: 100,
                    }}
                  >
                    {reservationTypes.map((type, index) => (
                      <TouchableOpacity
                        key={type}
                        onPress={() => {
                          handleSelectReservationType(type);
                          setShowDropdown(false);
                        }}
                        activeOpacity={0.8}
                        style={{
                          paddingVertical: 14,
                          paddingHorizontal: 16,
                          borderBottomWidth:
                            index < reservationTypes.length - 1 ? 1 : 0,
                          borderBottomColor: "rgba(255, 255, 255, 0.1)",
                          backgroundColor:
                            reservationType === type
                              ? "rgba(138, 23, 23, 0.6)"
                              : "transparent",
                        }}
                      >
                        <Text
                          style={{
                            color: "white",
                            fontSize: width * 0.038,
                            fontWeight:
                              reservationType === type ? "700" : "500",
                          }}
                        >
                          {type}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              {/* Guests */}
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: "white",
                    fontSize: width * 0.037,
                    fontWeight: "500",
                    marginBottom: 8,
                  }}
                >
                  Guests (Min: {minGuests} | Max: {maxGuests})
                </Text>

                <TextInput
                  value={guests.toString()}
                  onChangeText={(text) => {
                    const numericValue = text.replace(/[^0-9]/g, "");
                    if (numericValue === "") {
                      setGuests(0);
                      setIsGuestInvalid(true);
                      return;
                    }

                    const newGuests = parseInt(numericValue);
                    setGuests(newGuests);

                    if (newGuests < minGuests || newGuests > maxGuests) {
                      setIsGuestInvalid(true);
                    } else {
                      setIsGuestInvalid(false);
                    }
                  }}
                  keyboardType="numeric"
                  placeholderTextColor="#999"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    borderRadius: 12,
                    paddingVertical: 14,
                    paddingHorizontal: 16,
                    borderWidth: 2,
                    borderColor: isGuestInvalid
                      ? "red"
                      : "rgba(255, 255, 255, 0.2)",
                    color: "white",
                    fontSize: width * 0.045,
                    fontWeight: "600",
                    textAlign: "center",
                  }}
                />
              </View>
            </View>
            {/* Reservation Fee */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "rgba(60, 60, 60, 0.6)",
                borderRadius: 12,
                paddingVertical: 18,
                paddingHorizontal: 20,
                borderWidth: 1,
                borderColor: "rgba(255, 255, 255, 0.2)",
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: width * 0.043,
                  fontWeight: "500",
                }}
              >
                Total Reservation Fee:
              </Text>
              <Text
                style={{
                  color: "white",
                  fontSize: width * 0.045,
                  fontWeight: "700",
                }}
              >
                {totalFee.toLocaleString("en-US")} PHP
              </Text>
            </View>

            {/* Upload Section */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: "white",
                    fontSize: width * 0.044,
                    fontWeight: "500",
                  }}
                >
                  Upload One (1) Valid ID
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  handleUpload();
                  setErrors((prev) => ({ ...prev, validId: false }));
                }}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: validId
                    ? "rgba(0, 200, 100, 0.2)"
                    : "rgba(255, 255, 255, 0.1)",
                  borderRadius: 12,
                  paddingVertical: 12,
                  paddingHorizontal: width * 0.06,

                  borderWidth: errors.validId ? 1 : 0,
                  borderColor: errors.validId
                    ? "red"
                    : validId
                    ? "rgba(0, 200, 100, 0.2)"
                    : "transparent",
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: width * 0.038,
                    fontWeight: "500",
                  }}
                >
                  {validId ? "File Uploaded" : "Browse File"}
                </Text>
              </TouchableOpacity>
            </View>
            {/* Book Now */}
            <TouchableOpacity
              disabled={bookNowDisabled}
              onPress={handleBookNow}
              style={[
                {
                  backgroundColor: "#8A1717",
                  paddingVertical: 18,
                  borderRadius: 14,
                  alignItems: "center",
                  marginTop: 20,
                },
                bookNowDisabled && { opacity: 0.5 },
              ]}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: width * 0.05,
                  fontWeight: "700",
                }}
              >
                Book Now
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default ReservationScreen;
