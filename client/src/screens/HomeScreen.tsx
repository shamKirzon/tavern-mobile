import React, { useState, useEffect, JSX } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Animated,
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

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { isAuthenticated } = useAuthStore();
  const [email, setEmail] = useState("");
  const [showToaster, setShowToaster] = useState(false);
  const [reservationStatus, setReservationStatus] = useState<
    "none" | "pending" | "approved" | "cancelled" | "review"
  >("none");

  const fadeAnim = new Animated.Value(0);

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
    if (!email.trim()) {
      alert("Please enter your email");
      return;
    }

    setShowToaster(true);

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setShowToaster(false);
        setReservationStatus("none");
      });
    }, 3000);
  };

  const renderToaster = (): JSX.Element | null => {
    if (!showToaster) return null;

    return (
      <Animated.View
        style={{
          opacity: fadeAnim,
          backgroundColor: "#4CAF50",
          paddingVertical: 12,
          paddingHorizontal: 20,
          borderRadius: 10,
          marginBottom: 15,
          width: "100%",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: "white",
            fontWeight: "bold",
            fontSize: width * 0.04,
          }}
        >
          Email Verified.
        </Text>
      </Animated.View>
    );
  };

  const renderReservationLabel = (): JSX.Element | null => {
    switch (reservationStatus) {
      case "pending":
        return (
          <Text style={[styles.label, { backgroundColor: "#A88A00" }]}>
            Pending Reservation Approval
          </Text>
        );
      case "approved":
        return (
          <Text style={[styles.label, { backgroundColor: "#4CAF50" }]}>
            Reservation Approved.
          </Text>
        );
      case "cancelled":
        return (
          <Text style={[styles.label, { backgroundColor: "#E05002" }]}>
            Your Reservation has been Cancelled.
          </Text>
        );
      case "review":
        return (
          <Text style={[styles.label, { backgroundColor: "#C6A300" }]}>
            Review Order Summary.
          </Text>
        );
      default:
        return null;
    }
  };

  const reservationSection = (): JSX.Element | null => {
    if (reservationStatus === "none") return null;

    return (
      <View style={{ width: "100%", alignItems: "center", marginBottom: 20 }}>
        {renderReservationLabel()}
        <TouchableOpacity
          onPress={() => navigation.navigate("WelcomeScreen")}
          style={styles.statusButton}
        >
          <Text style={styles.statusText}>View Status</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const menu = (): JSX.Element => (
    <View style={{ width: "100%", marginTop: 30 }}>
      <Text style={styles.menuTitle}>Our Menu</Text>

      <View style={styles.menuContainer}>
        {menuList.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuCard}
            onPress={() =>
              navigation.navigate("MenuViewingScreen", {
                category: item.category,
              })
            }
          >
            <ImageBackground
              source={item.background}
              style={styles.menuImage}
              imageStyle={styles.menuImageStyle}
            >
              <View style={styles.menuOverlay} />
              <Text style={styles.menuCategory}>{item.category}</Text>
              <Text style={styles.menuDescription}>{item.description}</Text>
            </ImageBackground>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.mainContainer}>
      <MainBackground
        width={width}
        height={height}
        preserveAspectRatio="none"
        style={styles.bg}
      />

      <View style={styles.content}>
        <Text style={styles.title}>Book a Reservation.</Text>
        <Text style={styles.subtitle}>
          Great food, great drinks, top notch service and a warm inviting
          ambiance.
        </Text>

        {renderToaster()}

        {reservationStatus === "none" && (
          <>
            <TextInput
              placeholder="email@example.com"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              style={styles.input}
            />

            <TouchableOpacity onPress={handleContinue} style={styles.verifyBtn}>
              <Text style={styles.verifyText}>Verify Email</Text>
            </TouchableOpacity>
          </>
        )}

        {reservationSection()}
        {menu()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    width,
    height,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  bg: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  content: {
    width: "90%",
    alignItems: "center",
    marginBottom: height * 0.02, // lowers everything
  },
  title: {
    color: "white",
    fontSize: width * 0.08,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "left",
    width: "100%",
  },
  subtitle: {
    color: "white",
    fontSize: width * 0.04,
    marginBottom: 30,
    textAlign: "left",
    width: "100%",
    lineHeight: 22,
  },
  input: {
    width: "100%",
    backgroundColor: "white",
    color: "#333",
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
    fontSize: width * 0.04,
  },
  verifyBtn: {
    backgroundColor: "#8B0001",
    paddingVertical: 16,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  verifyText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: width * 0.045,
  },
  label: {
    color: "white",
    fontWeight: "bold",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    textAlign: "center",
    width: "100%",
    marginBottom: 15,
  },
  statusButton: {
    backgroundColor: "#8B0001",
    paddingVertical: 16,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  statusText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: width * 0.045,
  },
  menuTitle: {
    color: "white",
    fontSize: width * 0.075,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "left",
    paddingHorizontal: 10,
  },
  menuContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  menuCard: {
    width: "48%",
    marginBottom: 16,
    borderRadius: 20,
    overflow: "hidden",
    height: 200,
  },
  menuImage: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 20,
  },
  menuImageStyle: {
    borderRadius: 20,
    resizeMode: "cover",
  },
  menuOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
  },
  menuCategory: {
    color: "white",
    fontSize: width * 0.055,
    fontWeight: "bold",
    marginBottom: 8,
    zIndex: 1,
  },
  menuDescription: {
    color: "white",
    fontSize: width * 0.035,
    lineHeight: 18,
    zIndex: 1,
  },
});

export default HomeScreen;
