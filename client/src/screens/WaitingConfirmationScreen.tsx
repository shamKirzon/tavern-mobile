import React from "react";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamLists } from "../types/rootStackParamLists";
import { height, width } from "../utils/dimensions";
import { View, Text, TouchableOpacity } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import MainBackground from "../assets/backgrounds/main-background.svg";

// ✅ Keep same types as you defined
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
                fontSize: width * 0.06,
                fontWeight: "700",
                fontFamily: "Poppins",
              }}
            >
              Order Status
            </Text>
          </View>

          {/* cinomment ko muna to ah, baka lang kailanganin hehhehee - shams */}
          {/* ===== PROGRESS BAR ===== */}
          {/* <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: height * 0.04,
              paddingHorizontal: width * 0.03,
            }}
          >
            {[0, 1, 2, 3, 4].map((step, index) => (
              <React.Fragment key={step}>
                <View
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 6,
                    backgroundColor:
                      index <= 1 ? "#D4AF37" : "rgba(255, 255, 255, 0.3)",
                  }}
                />
                {index < 4 && (
                  <View
                    style={{
                      flex: 1,
                      height: 2,
                      backgroundColor:
                        index < 1 ? "#D4AF37" : "rgba(255, 255, 255, 0.3)",
                      marginHorizontal: 3,
                    }}
                  />
                )}
              </React.Fragment>
            ))}
          </View> */}

          {/* ===== AWAITING CONFIRMATION ===== */}
          <View style={{ alignItems: "center", marginTop: height * 0.1 }}>
            <Text
              style={{
                color: "#FFF",
                fontSize: width * 0.065,
                fontWeight: "700",
                fontFamily: "Poppins",
              }}
            >
              Awaiting Confirmation
            </Text>
          </View>

          {/* ===== INFO CARD ===== */}
          <View
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.12)",
              borderRadius: 20,
              padding: width * 0.045,
              marginTop: height * 0.04,
              borderWidth: 1,
              borderColor: "rgba(255, 255, 255, 0.15)",
            }}
          >
            <Text
              style={{
                color: "#FFF",
                fontSize: width * 0.045,
                fontWeight: "700",
                marginBottom: height * 0.01,
                fontFamily: "Poppins",
              }}
            >
              What Happens Next?
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
            paddingVertical: height * 0.018,
            borderRadius: 30,
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
              fontSize: width * 0.042,
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
