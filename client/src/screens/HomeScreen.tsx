import React, { useState, JSX } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  StyleSheet,
} from "react-native";
import { width, height } from "../utils/dimensions";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamLists } from "../types/rootStackParamLists";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAuthStore } from "../stores/useAuthStore";
import MainBackground from "../assets/backgrounds/main-background.svg";

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamLists,
  "HomeScreen"
>;

type HomeScreenRouteProp = RouteProp<RootStackParamLists, "HomeScreen">;

interface Props {
  navigation: HomeScreenNavigationProp;
  route: HomeScreenRouteProp;
}

const HomeScreen: React.FC<Props> = ({ navigation, route }) => {
  const { isAuthenticated } = useAuthStore();
  const [email, setEmail] = useState("");

  const menuList = [
    {
      background: require("../assets/images/appetizer-category.jpg"),
      category: "Appetizer",
      description: "Start your meal with something light and flavorful.",
    },
    {
      background: require("../assets/images/maincourse-category.jpg"),
      category: "Main Course",
      description: "Hearty dishes made to satisfy your appetite.",
    },
    {
      background: require("../assets/images/desserts-category.jpg"),
      category: "Desserts",
      description: "Sweet treats to end your meal perfectly.",
    },
    {
      background: require("../assets/images/drinks-category.jpg"),
      category: "Drinks",
      description: "Refreshing beverages to pair with your meal.",
    },
  ];

  const handleContinue = () => {
    // if (!email.trim()) {
    //   alert("Please enter your email");
    // }
    // otp screen
    navigation.navigate("WelcomeScreen");
  };

  // jsx elements

  // non verified customer with no reservation
  const nonVerifiedCustomer = (): JSX.Element => {
    return (
      <View style={{ width: "100%", alignItems: "center" }}>
        <Text
          style={{
            color: "white",
            fontSize: width * 0.065,
            fontWeight: "bold",
            marginBottom: 10,
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
            marginBottom: 30,
            textAlign: "left",
            width: "100%",
            lineHeight: 22,
          }}
        >
          Great food, great drinks, top notch service and a warm inviting
          ambiance.
        </Text>

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
            padding: 16,
            borderRadius: 10,
            marginBottom: 20,
            fontSize: width * 0.04,
          }}
        />

        <TouchableOpacity
          onPress={handleContinue}
          style={{
            backgroundColor: "#8B0001",
            paddingVertical: 16,
            borderRadius: 10,
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
            Verify Email
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  // pending reservation main css
  const pendingReservation = (): JSX.Element => {
    const approvedLabel = (): JSX.Element => {
      return (
        <>
          <Text
            style={{
              color: "white",
              fontSize: width * 0.05,
              fontWeight: "bold",
              marginTop: 20,
              marginBottom: 10,
            }}
          >
            reservation approved
          </Text>
        </>
      );
    };

    return (
      <>
        {approvedLabel()}
        <TouchableOpacity
          onPress={handleContinue}
          style={{
            backgroundColor: "#8B0001",
            paddingVertical: 16,
            paddingHorizontal: 32,
            borderRadius: 20,
            width: width * 0.85,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: "#FFFFFF",
              fontWeight: "bold",
              fontSize: width * 0.04,
            }}
          >
            View Status
          </Text>
        </TouchableOpacity>
      </>
    );
  };

  const menu = (): JSX.Element => {
    return (
      <ScrollView
        style={{ width: "100%", marginTop: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={{
            color: "white",
            fontSize: width * 0.08,
            fontWeight: "bold",
            marginBottom: 20,
            textAlign: "left",
            paddingHorizontal: 10,
          }}
        >
          Our Menu
        </Text>

        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
            paddingHorizontal: 10,
          }}
        >
          {menuList.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={{
                width: "48%",
                marginBottom: 16,
                borderRadius: 20,
                overflow: "hidden",
                height: 200,
              }}
            >
              <ImageBackground
                source={item.background}
                style={{
                  flex: 1,
                  justifyContent: "flex-end",
                  padding: 20,
                }}
                imageStyle={{
                  borderRadius: 20,
                  resizeMode: "cover",
                }}
              >
                <View
                  style={{
                    ...StyleSheet.absoluteFillObject,
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    borderRadius: 20,
                  }}
                />

                <Text
                  style={{
                    color: "white",
                    fontSize: width * 0.06,
                    fontWeight: "bold",
                    marginBottom: 8,
                    zIndex: 1,
                  }}
                >
                  {item.category}
                </Text>

                <Text
                  style={{
                    color: "white",
                    fontSize: width * 0.038,
                    lineHeight: 20,
                    zIndex: 1,
                  }}
                >
                  {item.description}
                </Text>
              </ImageBackground>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    );
  };

  // main design
  return (
    <View
      style={{
        width,
        height,
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: width * 0.08,
      }}
    >
      {/* for testing functional specific component */}
      {/* background layer */}
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

      <View style={{ width: "100%", alignItems: "center" }}>
        {nonVerifiedCustomer()}
        {menu()}
      </View>
    </View>
  );
};

export default HomeScreen;
