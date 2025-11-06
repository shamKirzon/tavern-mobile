import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Animated,
} from "react-native";
import { width, height } from "../utils/dimensions";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamLists } from "../types/rootStackParamLists";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import MainBackground from "../assets/backgrounds/main-background.svg";

type ViewOrderStatusScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamLists,
  "ViewOrderStatusScreen"
>;

type ViewOrderStatusScreenRouteProp = RouteProp<
  RootStackParamLists,
  "ViewOrderStatusScreen"
>;

interface Props {
  navigation: ViewOrderStatusScreenNavigationProp;
  route: ViewOrderStatusScreenRouteProp;
}

const ViewOrderStatusScreen: React.FC<Props> = ({ navigation, route }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
    }).start();

    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 700,
      useNativeDriver: true,
    }).start();
  }, []);

  // Mock data - replace with actual data from route.params or API
  const orderData = {
    name: "Dannah Joyce Torres",
    date: "October 07, 2025",
    type: "Exclusive",
    guests: 50,
    reservationFee: 30000.0,
    items: [
      { name: "Tav Special Pork Sisig", price: 3845.0 },
      { name: "Tav Chicken Fingers Platter", price: 2202.0 },
      { name: "Chili Ballpark Nachos", price: 305.0 },
    ],
  };

  const calculateTotal = () => {
    const itemsTotal = orderData.items.reduce(
      (sum, item) => sum + item.price,
      0
    );
    return itemsTotal;
  };

  return (
    <View style={{ width, height, flex: 1, paddingTop: height * 0.06 }}>
      <MainBackground
        width={width}
        height={height}
        preserveAspectRatio="none"
        style={{ position: "absolute", top: 0, left: 0 }}
      />

      {/* Header */}
      <View style={{ paddingHorizontal: width * 0.05, paddingBottom: 15 }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
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

          <Animated.Text
            style={{
              color: "white",
              fontSize: width * 0.08,
              fontWeight: "bold",
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            Order Complete
          </Animated.Text>
        </View>

        <View
          style={{
            height: 1,
            backgroundColor: "white",
            opacity: 0.3,
            marginTop: 25,
          }}
        />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: width * 0.05,
          paddingBottom: 30,
        }}
        style={{ flex: 1 }}
      >
        {/* QR Code Section */}
        <View style={{ alignItems: "center", marginTop: 20 }}>
          <Text
            style={{
              color: "white",
              fontSize: width * 0.05,
              fontWeight: "bold",
              marginBottom: 15,
            }}
          >
            Show this QR Code upon Arrival
          </Text>

          <View
            style={{
              alignItems: "center",
            }}
          >
            <Image
              source={require("../assets/payments/GCashQR.png")}
              style={{
                width: width * 0.5,
                height: width * 0.5,
                marginBottom: 15,
              }}
              resizeMode="contain"
            />

            <TouchableOpacity
              style={{
                backgroundColor: "white",
                paddingVertical: 12,
                paddingHorizontal: 40,
                borderRadius: 25,
              }}
            >
              <Text
                style={{
                  color: "black",
                  fontSize: width * 0.04,
                  fontWeight: "bold",
                }}
              >
                Download QR
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Summary Content */}
        <View style={{ marginTop: 30 }}>
          <Text
            style={{
              color: "white",
              fontSize: width * 0.065,
              fontWeight: "bold",
              marginBottom: 20,
              textAlign: "center",
            }}
          >
            Reservation and Order Summary
          </Text>

          {/* Reservation Details */}
          <View style={{ marginBottom: 1 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: width * 0.04,
                  opacity: 0.9,
                }}
              >
                Name:
              </Text>
              <Text
                style={{
                  color: "white",
                  fontSize: width * 0.04,
                  fontWeight: "600",
                }}
              >
                {orderData.name}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: width * 0.04,
                  opacity: 0.9,
                }}
              >
                Date:
              </Text>
              <Text
                style={{
                  color: "white",
                  fontSize: width * 0.04,
                  fontWeight: "600",
                }}
              >
                {orderData.date}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: width * 0.04,
                  opacity: 0.9,
                }}
              >
                Type of Reservation:
              </Text>
              <Text
                style={{
                  color: "white",
                  fontSize: width * 0.04,
                  fontWeight: "600",
                }}
              >
                {orderData.type}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: width * 0.04,
                  opacity: 0.9,
                }}
              >
                Guests:
              </Text>
              <Text
                style={{
                  color: "white",
                  fontSize: width * 0.04,
                  fontWeight: "600",
                }}
              >
                {orderData.guests}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 15,
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: width * 0.04,
                  opacity: 0.9,
                }}
              >
                Reservation Fee:
              </Text>
              <Text
                style={{
                  color: "white",
                  fontSize: width * 0.04,
                  fontWeight: "600",
                }}
              >
                P{orderData.reservationFee.toFixed(2)}
              </Text>
            </View>
          </View>

          {/* Dotted Divider */}
          <View
            style={{
              borderTopWidth: 1,
              borderColor: "white",
              borderStyle: "dotted",
              opacity: 0.4,
              marginVertical: 15,
            }}
          />

          {/* Order Items */}
          {orderData.items.map((item, index) => (
            <View
              key={index}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: width * 0.04,
                  opacity: 0.9,
                  flex: 1,
                }}
              >
                {item.name}
              </Text>
              <Text
                style={{
                  color: "white",
                  fontSize: width * 0.04,
                  fontWeight: "600",
                }}
              >
                {item.price.toFixed(2)}
              </Text>
            </View>
          ))}

          {/* Total */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 10,
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: width * 0.045,
                fontWeight: "bold",
              }}
            >
              Total:
            </Text>
            <Text
              style={{
                color: "white",
                fontSize: width * 0.045,
                fontWeight: "bold",
              }}
            >
              {calculateTotal().toFixed(2)}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Back to Home Button */}
      <View
        style={{
          paddingHorizontal: width * 0.05,
          paddingBottom: 30,
          paddingTop: 15,
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.navigate("HomeScreen")}
          style={{
            backgroundColor: "#8B0000",
            paddingVertical: 20,
            borderRadius: 20,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: width * 0.045,
              fontWeight: "bold",
            }}
          >
            Back to home
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ViewOrderStatusScreen;