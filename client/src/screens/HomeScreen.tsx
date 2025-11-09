import React, { useState, useEffect, useRef, JSX } from "react";
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
import { category } from "../data/category";
import { generateOtp } from "../services/auth";
import {
  getEmailByToken,
  getOrderIdByToken,
  getReservationIdByToken,
} from "../services/token";

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
  const [hasEmail, setHasEmail] = useState<string | null>(null);
  const [hasReservation, setHasReservation] = useState<string | null>(null);
  const [hasOrder, setHasOrder] = useState<string | null>(null);

  const { showEmailVerifiedToggle, setShowEmailVerifiedToggle } =
    useAuthStore();
  const [email, setEmail] = useState("");
  // const [email, setEmail] = useState("dannahtorres12@gmail.com");
  const [isEmailInvalid, setIsEmailInvalid] = useState<boolean>(false);
  const [showToaster, setShowToaster] = useState(false);
  const [reservationStatus, setReservationStatus] = useState<
    "none" | "pending" | "approved" | "cancelled" | "review"
  >("none");

  const fadeAnim = useRef(new Animated.Value(0)).current;

  // toaster anim.
  useEffect(() => {
    if (showToaster) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => setShowToaster(false));
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showToaster]);

  // testing part:
  useEffect(() => {
    if (showEmailVerifiedToggle) {
      setShowToaster(true);
      // change content
      // for reservation part:
    }

    setShowEmailVerifiedToggle(false);
  }, [showEmailVerifiedToggle]);

  // check auth
  useEffect(() => {
    const fetchData = async () => {
      const email = await getEmailByToken();
      const reservation = await getReservationIdByToken();
      const order = await getOrderIdByToken();

      setHasEmail(email);
      setHasReservation(reservation);
      setHasOrder(order);
    };
    fetchData();
    handleStatus();
  }, []);

  const handleStatus = async () => {
    if (hasEmail && hasReservation && hasOrder) {
      return undefined;
    } else if (hasEmail && hasReservation) {
      // check first the reservation status
    } else if (hasEmail) {
      // book now button
    } else {
      setReservationStatus("none");
    }
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

    return emailRegex.test(email.trim());
  };

  const handleBookNow = () => {};
  // verify email:
  const handleContinue = async () => {
    if (!validateEmail(email)) {
      setIsEmailInvalid(true);
      setEmail("");
      setShowToaster(true);
      return;
    }

    navigation.navigate("EmailVerificationScreen", { email });
    await generateOtp(email);
  };

  const renderToaster = (): JSX.Element | null => {
    if (!showToaster) return null;

    // Only one toaster at a time
    if (isEmailInvalid) {
      return (
        <Animated.View
          style={{
            opacity: fadeAnim,
            backgroundColor: "#D32F2F",
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
            Invalid Email. Please enter a valid email address.
          </Text>
        </Animated.View>
      );
    }

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
            Reservation Approved
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
          // onPress={() => navigation.navigate("EmailVerificationScreen")}
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
        {Object.values(category).map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuCard}
            onPress={() =>
              navigation.navigate("MenuViewingScreen", {
                category: item.header,
              })
            }
          >
            <ImageBackground
              source={item.imagePath}
              style={styles.menuImage}
              imageStyle={styles.menuImageStyle}
            >
              <View style={styles.menuOverlay} />
              <Text style={styles.menuCategory}>{item.header}</Text>
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
            {!hasEmail && (
              <TextInput
                placeholder="email@example.com"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                style={styles.input}
              />
            )}

            {hasEmail ? (
              <TouchableOpacity
                onPress={handleBookNow}
                style={[styles.verifyBtn]}
              >
                <Text style={styles.verifyText}>Book Now</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={handleContinue}
                style={[
                  styles.verifyBtn,
                  !email && { opacity: 0.5 }, // fade when disabled
                ]}
                disabled={!email}
              >
                <Text style={styles.verifyText}>Verify Email</Text>
              </TouchableOpacity>
            )}
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
