import React from "react";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamLists } from "../types/rootStackParamLists";
import { height, width } from "../utils/dimensions";
import { View, Text, TouchableOpacity } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import MainBackground from "../assets/backgrounds/main-background.svg";
import InfoIcon from "../assets/images/info.svg";
import LoadingIcon from "../assets/images/loading.svg";

type WatingConfirmationScreenRouteProp = RouteProp<
  RootStackParamLists,
  "WaitingConfirmationScreen"
>;
type WatingConfirmationScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamLists,
  "WaitingConfirmationScreen"
>;

interface Props {
  route: WatingConfirmationScreenRouteProp;
  navigation: WatingConfirmationScreenNavigationProp;
}

const WaitingConfirmationScreen: React.FC<Props> = ({ navigation }) => {
  const handleBackToHome = () => {
    navigation.navigate("HomeScreen");
  };

  return (
    <View style={{ width, height, flex: 1 }}>
      {/* ===== BACKGROUND ===== */}
      <MainBackground style={{ position: "absolute", height: "100%" }} />

      {/* ===== MAIN CONTAINER ===== */}
      <View
        style={{
          flex: 1,
          padding: width * 0.05,
          paddingTop: height * 0.06,
          justifyContent: "space-between",
        }}
      >
        {/* ===== HEADER ===== */}
        <View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: height * 0.02,
            }}
          >
            <TouchableOpacity
              onPress={handleBackToHome}
              style={{ marginRight: width * 0.03, padding: 5 }}
            >
              <Text
                style={{
                  color: "#FFF",
                  fontSize: 30,
                  fontWeight: "300",
                  lineHeight: 30,
                }}
              >
                ‹
              </Text>
            </TouchableOpacity>
            <Text
              style={{
                color: "#FFF",
                fontSize: 25,
                fontWeight: "700",
                fontFamily: "Poppins",
              }}
            >
              Order Status
            </Text>
          </View>
        </View>

        {/* ===== CENTERED CONTENT (Loading Icon to Info Card) ===== */}
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <LoadingIcon
            width={width * 0.15}
            height={width * 0.15}
            style={{ marginBottom: height * 0.03 }}
          />
          <Text
            style={{
              color: "#FFF",
              fontSize: width * 0.065,
              fontWeight: "700",
              fontFamily: "Poppins",
              marginBottom: height * 0.04,
            }}
          >
            Awaiting Confirmation
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
                What Happens Next?
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
              Please allow up to 48 hours for us to manually verify your
              payment. You will receive a confirmation email as soon as it is
              approved.
            </Text>
          </View>
        </View>

        {/* ===== BACK TO HOME BUTTON ===== */}
        <TouchableOpacity
          onPress={handleBackToHome}
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
  );
};

export default WaitingConfirmationScreen;