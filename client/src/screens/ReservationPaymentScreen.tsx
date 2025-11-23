import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  Modal,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

import MainBackground from "../assets/backgrounds/main-background.svg";
import PaymentMethod from "../assets/images/payment-method.svg";
import { height, width } from "../utils/dimensions";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamLists } from "../types/rootStackParamLists";
import { RouteProp } from "@react-navigation/native";
import { createReservation, uploadImage } from "../services/reservation";
import { useReservationStore } from "../stores/useReservationStore";
import Loading from "./ui/Loading";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

type ReservationPaymentScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamLists,
  "ReservationPaymentScreen"
>;
type ReservationPaymentScreenRouteProp = RouteProp<
  RootStackParamLists,
  "ReservationPaymentScreen"
>;

type Props = {
  navigation: ReservationPaymentScreenNavigationProp;
  route: ReservationPaymentScreenRouteProp;
};

const ReservationPaymentScreen: React.FC<Props> = ({ navigation, route }) => {
  const { reservationFee } = route.params;
  const { setReservationData, customerReservationData } = useReservationStore();

  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [selectedQR, setSelectedQR] = useState<string | null>(null);
  const [uploadedPayment, setUploadedPayment] = useState<string | null>(null);
  const [paymentReferenceNumber, setPaymentReferenceNumber] = useState("");
  const [paymentAmount, setPaymentAmount] = useState(0);

  const handleQRPress = (qr: string) => {
    setSelectedQR(selectedQR === qr ? null : qr);
  };

  const handleConfirmPayment = async () => {
    if (!paymentReferenceNumber || !paymentAmount) return;

    // since hindi nakukuha agad agad yung latest state
    const updatedCustomerData = {
      ...customerReservationData,
      ...{ paymentReferenceNumber, paymentAmount },
    };
    setReservationData({
      paymentReferenceNumber,
      paymentAmount,
    });

    setIsUploading(true);
    try {
      const res = await createReservation(updatedCustomerData);
      if (res) {
        navigation.navigate("HomeScreen");
      }
    } catch (err) {
      console.error("Error creating reservation:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpload = async () => {
    setIsUploading(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (result.canceled) {
        setIsUploading(false);
        return;
      }

      const imageUri = result.assets[0].uri;
      const paymentUrl = await uploadImage(imageUri, "payment");
      if (paymentUrl) {
        setUploadedPayment(paymentUrl);
        setReservationData({ paymentUrl });
      }
    } catch (error) {
      console.error("Error picking/uploading payment image:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      {isUploading && Loading("")}

      <View style={{ flex: 1 }}>
        {/* Background */}
        <MainBackground
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid slice"
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
          }}
        />

        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: height * 0.03 }}
          keyboardShouldPersistTaps="handled"
          enableOnAndroid
          extraScrollHeight={20}
        >
          <View
            style={{
              flex: 1,
              paddingHorizontal: width * 0.05,
              paddingTop: height * 0.06,
            }}
          >
            {/* Header */}
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TouchableOpacity
                onPress={() => navigation?.goBack?.()}
                style={{
                  width: width * 0.09,
                  height: width * 0.09,
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: width * 0.025,
                }}
              >
                <View
                  style={{
                    width: width * 0.035,
                    height: width * 0.035,
                    borderLeftWidth: 3,
                    borderBottomWidth: 3,
                    borderColor: "#fff",
                    transform: [{ rotate: "45deg" }],
                  }}
                />
              </TouchableOpacity>

              <Text
                style={{
                  color: "#fff",
                  fontSize: width * 0.08,
                  fontWeight: "bold",
                }}
              >
                Payment
              </Text>
            </View>

            {/* Note Box */}
            <View
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.08)",
                borderColor: "rgba(255, 255, 255, 0.15)",
                borderWidth: 1,
                borderRadius: width * 0.04,
                padding: width * 0.03,
                marginVertical: height * 0.02,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View
                  style={{
                    width: width * 0.07,
                    height: width * 0.07,
                    borderRadius: (width * 0.07) / 2,
                    borderWidth: 1.5,
                    borderColor: "rgba(255, 255, 255, 0.9)",
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: width * 0.03,
                  }}
                >
                  <Text
                    style={{
                      color: "#fff",
                      fontSize: width * 0.035,
                      fontWeight: "bold",
                    }}
                  >
                    i
                  </Text>
                </View>

                <Text
                  style={{
                    color: "#fff",
                    fontSize: width * 0.035,
                    lineHeight: width * 0.046,
                    flex: 1,
                  }}
                >
                  <Text style={{ fontWeight: "bold" }}>Note: </Text>A
                  reservation fee is required to secure your booking. 50% of
                  this amount is consumable and can be used for food and drink
                  orders during your event.
                </Text>
              </View>
            </View>

            {/* Payment Methods */}
            <View
              style={{
                backgroundColor: "rgba(255,255,255,0.1)",
                borderRadius: width * 0.03,
                paddingHorizontal: width * 0.037,
                paddingVertical: width * 0.025,
                borderWidth: 1,
                borderColor: "rgba(255, 255, 255, 0.15)",
                marginBottom: height * 0.02,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: height * 0.015,
                }}
              >
                <PaymentMethod
                  style={{
                    width: width * 0.055,
                    height: width * 0.055,
                    marginRight: width * 0.02,
                  }}
                />
                <Text
                  style={{
                    color: "#fff",
                    fontSize: width * 0.044,
                    fontWeight: "600",
                  }}
                >
                  Payment Method
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: height * 0.006,
                }}
              >
                {/* GCash */}
                <TouchableOpacity
                  style={{
                    width: "30%",
                    backgroundColor: "#fff",
                    borderRadius: width * 0.025,
                    alignItems: "center",
                    paddingVertical: height * 0.012,
                  }}
                  onPress={() => handleQRPress("gcash")}
                  activeOpacity={0.8}
                >
                  <Image
                    source={require("../assets/payments/GCashLogo.png")}
                    style={{
                      width: width * 0.18,
                      height: height * 0.03,
                      resizeMode: "contain",
                      marginBottom: height * 0.008,
                    }}
                  />
                  <Image
                    source={require("../assets/payments/GCashQR.png")}
                    style={{
                      width: width * 0.22,
                      height: width * 0.22,
                      resizeMode: "contain",
                      marginBottom: height * 0.01,
                    }}
                  />
                  <Text
                    style={{
                      fontSize: width * 0.03,
                      fontWeight: "600",
                      textAlign: "center",
                      color: "#1F51FF",
                    }}
                  >
                    Tavern GCash
                  </Text>
                  <Text
                    style={{
                      fontSize: width * 0.03,
                      fontWeight: "600",
                      textAlign: "center",
                      color: "#1F51FF",
                    }}
                  >
                    09615124880
                  </Text>
                </TouchableOpacity>

                {/* BPI */}
                <TouchableOpacity
                  style={{
                    width: "30%",
                    backgroundColor: "#fff",
                    borderRadius: width * 0.025,
                    alignItems: "center",
                    paddingVertical: height * 0.012,
                  }}
                  onPress={() => handleQRPress("bpi")}
                  activeOpacity={0.8}
                >
                  <Image
                    source={require("../assets/payments/BPILogo.png")}
                    style={{
                      width: width * 0.18,
                      height: height * 0.03,
                      resizeMode: "contain",
                      marginBottom: height * 0.008,
                    }}
                  />
                  <Image
                    source={require("../assets/payments/BPIQR.png")}
                    style={{
                      width: width * 0.22,
                      height: width * 0.22,
                      resizeMode: "contain",
                      marginBottom: height * 0.01,
                    }}
                  />
                  <Text
                    style={{
                      fontSize: width * 0.03,
                      fontWeight: "600",
                      textAlign: "center",
                      color: "#FF0000",
                    }}
                  >
                    Tavern
                  </Text>
                  <Text
                    style={{
                      fontSize: width * 0.03,
                      fontWeight: "600",
                      textAlign: "center",
                      color: "#FF0000",
                    }}
                  >
                    Account No.
                  </Text>
                </TouchableOpacity>

                {/* PayMaya */}
                <TouchableOpacity
                  style={{
                    width: "30%",
                    backgroundColor: "#fff",
                    borderRadius: width * 0.025,
                    alignItems: "center",
                    paddingVertical: height * 0.012,
                  }}
                  onPress={() => handleQRPress("maya")}
                  activeOpacity={0.8}
                >
                  <Image
                    source={require("../assets/payments/MayaLogo.png")}
                    style={{
                      width: width * 0.18,
                      height: height * 0.03,
                      resizeMode: "contain",
                      marginBottom: height * 0.008,
                    }}
                  />
                  <Image
                    source={require("../assets/payments/MayaQR.png")}
                    style={{
                      width: width * 0.22,
                      height: width * 0.22,
                      resizeMode: "contain",
                      marginBottom: height * 0.01,
                    }}
                  />
                  <Text
                    style={{
                      fontSize: width * 0.03,
                      fontWeight: "600",
                      textAlign: "center",
                      color: "#006400",
                    }}
                  >
                    Tavern PM
                  </Text>
                  <Text
                    style={{
                      fontSize: width * 0.03,
                      fontWeight: "600",
                      textAlign: "center",
                      color: "#006400",
                    }}
                  >
                    Account No.
                  </Text>
                </TouchableOpacity>
              </View>

              {/* TOTAL PAYABLE */}
              <View
                style={{
                  marginTop: height * 0.02,
                  paddingVertical: height * 0.012,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: "#fff",
                    fontSize: width * 0.037,
                  }}
                >
                  Total Payable Amount is:
                </Text>
                <Text
                  style={{
                    color: "#fff",
                    fontSize: width * 0.06,
                    fontWeight: "bold",
                  }}
                >
                  ₱ {Number(reservationFee).toLocaleString()}
                </Text>
              </View>
            </View>

            {/* Upload Proof */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: height * 0.01,
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontSize: width * 0.044,
                  fontWeight: "500",
                  marginTop: height * 0.006,
                }}
              >
                Upload Proof of Payment
              </Text>

              <TouchableOpacity
                onPress={handleUpload}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: uploadedPayment
                    ? "rgba(0, 200, 100, 0.2)"
                    : "rgba(255, 255, 255, 0.1)",
                  borderRadius: width * 0.03,
                  paddingVertical: height * 0.018,
                  paddingHorizontal: width * 0.06,
                  borderWidth: 1,
                  borderColor: uploadedPayment
                    ? "rgba(0, 255, 100, 0.4)"
                    : "rgba(255, 255, 255, 0.2)",
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: width * 0.038,
                    fontWeight: "500",
                  }}
                >
                  {uploadedPayment ? "File Uploaded" : "Browse File"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Payment Info + Confirm Button */}
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
            >
              {/* gap between confirm payment and payment informations */}
              <View style={{ gap: width * 0.04 }}>
                <View style={{ gap: width * 0.01 }}>
                  <Text
                    style={{
                      color: "#fff",
                      fontSize: width * 0.044,
                      fontWeight: "500",
                      marginBottom: width * 0.02,
                    }}
                  >
                    Reference Number
                  </Text>

                  <TextInput
                    placeholder="Enter Reference Number"
                    value={paymentReferenceNumber}
                    onChangeText={setPaymentReferenceNumber}
                    placeholderTextColor="#999"
                    style={{
                      backgroundColor: "white",
                      borderRadius: width * 0.03,
                      paddingVertical: height * 0.015,
                      paddingHorizontal: width * 0.045,
                      fontSize: width * 0.04,
                      color: "#000",
                    }}
                  />

                  <Text
                    style={{
                      color: "#fff",
                      fontSize: width * 0.044,
                      fontWeight: "500",
                      marginVertical: width * 0.02,
                    }}
                  >
                    Payment Amount
                  </Text>

                  <TextInput
                    placeholder={`Amount (e.g. ${Number(
                      reservationFee
                    ).toLocaleString()})`}
                    value={paymentAmount ? String(paymentAmount) : ""}
                    onChangeText={(text) => {
                      const num = Number(text.replace(/,/g, ""));
                      if (!isNaN(num)) setPaymentAmount(num);
                      else setPaymentAmount(0);
                    }}
                    placeholderTextColor="#999"
                    keyboardType="numeric"
                    style={{
                      backgroundColor: "white",
                      borderRadius: width * 0.03,
                      paddingVertical: height * 0.015,
                      paddingHorizontal: width * 0.045,
                      fontSize: width * 0.04,
                      color: "#000",
                    }}
                  />
                </View>

                <TouchableOpacity
                  onPress={handleConfirmPayment}
                  disabled={!uploadedPayment}
                  style={{
                    backgroundColor: "#8B0000",
                    borderRadius: width * 0.03,
                    paddingVertical: height * 0.02,
                    alignItems: "center",
                    opacity: !uploadedPayment ? 0.5 : 1,
                    marginTop: width * 0.03,
                  }}
                >
                  <Text
                    style={{
                      color: "#fff",
                      fontSize: width * 0.045,
                      fontWeight: "bold",
                    }}
                  >
                    Confirm Payment
                  </Text>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </View>
        </KeyboardAwareScrollView>

        {/* Floating QR Modal */}
        <Modal visible={!!selectedQR} transparent animationType="fade">
          <Pressable
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.8)",
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => setSelectedQR(null)}
          >
            <View
              style={{
                backgroundColor: "#fff",
                borderRadius: width * 0.04,
                padding: width * 0.05,
                alignItems: "center",
              }}
            >
              {selectedQR === "gcash" && (
                <>
                  <Image
                    source={require("../assets/payments/GCashLogo.png")}
                    style={{
                      width: width * 0.25,
                      height: height * 0.04,
                      resizeMode: "contain",
                      marginBottom: height * 0.015,
                    }}
                  />
                  <Image
                    source={require("../assets/payments/GCashQR.png")}
                    style={{
                      width: width * 0.7,
                      height: width * 0.7,
                      resizeMode: "contain",
                    }}
                  />
                </>
              )}

              {selectedQR === "bpi" && (
                <>
                  <Image
                    source={require("../assets/payments/BPILogo.png")}
                    style={{
                      width: width * 0.25,
                      height: height * 0.04,
                      resizeMode: "contain",
                      marginBottom: height * 0.015,
                    }}
                  />
                  <Image
                    source={require("../assets/payments/BPIQR.png")}
                    style={{
                      width: width * 0.7,
                      height: width * 0.7,
                      resizeMode: "contain",
                    }}
                  />
                </>
              )}

              {selectedQR === "maya" && (
                <>
                  <Image
                    source={require("../assets/payments/MayaLogo.png")}
                    style={{
                      width: width * 0.25,
                      height: height * 0.04,
                      resizeMode: "contain",
                      marginBottom: height * 0.015,
                    }}
                  />
                  <Image
                    source={require("../assets/payments/MayaQR.png")}
                    style={{
                      width: width * 0.7,
                      height: width * 0.7,
                      resizeMode: "contain",
                    }}
                  />
                </>
              )}
            </View>
          </Pressable>
        </Modal>
      </View>
    </>
  );
};

export default ReservationPaymentScreen;
