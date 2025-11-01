import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { width, height } from "../utils/dimensions";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamLists } from "../types/rootStackParamLists";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import MainBackground from "../assets/backgrounds/main-background.svg";

type ReservationScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamLists,
  "Reservation"
>;

type ReservationScreenRouteProp = RouteProp<RootStackParamLists, "Reservation">;

interface Props {
  navigation: ReservationScreenNavigationProp;
  route: ReservationScreenRouteProp;
}

const ReservationScreen: React.FC<Props> = ({ navigation }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [contact, setContact] = useState("");
  const [reservationType, setReservationType] = useState(
    "Inclusive (Shared Space)"
  );
  const [guests, setGuests] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showDropdown, setShowDropdown] = useState(false);

  // Generate up to 2 weeks of dates
  const generateCalendarDates = () => {
    const today = new Date();
    const dates = [];
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const calendarDates = generateCalendarDates();

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const formatDate = (date: Date) =>
    `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;

  const validateInputs = () => {
    const nameRegex = /^[A-Za-z\s]+$/;

    if (!firstName.trim()) {
      Alert.alert("Invalid Input", "Please enter your first name.");
      return false;
    }
    if (!nameRegex.test(firstName)) {
      Alert.alert("Invalid Input", "First name should only contain letters.");
      return false;
    }

    if (!lastName.trim()) {
      Alert.alert("Invalid Input", "Please enter your last name.");
      return false;
    }
    if (!nameRegex.test(lastName)) {
      Alert.alert("Invalid Input", "Last name should only contain letters.");
      return false;
    }

    if (!contact) {
      Alert.alert("Invalid Input", "Please enter your contact number.");
      return false;
    }
    if (!/^09\d{9}$/.test(contact)) {
      Alert.alert(
        "Invalid Input",
        "Contact number must be 11 digits starting with 09 (e.g., 09123456789)."
      );
      return false;
    }

    if (!selectedDate) {
      Alert.alert("Invalid Input", "Please select a date.");
      return false;
    }

    const guestCount = parseInt(guests);
    if (!guests || isNaN(guestCount)) {
      Alert.alert("Invalid Input", "Please enter number of guests.");
      return false;
    }

    if (reservationType === "Exclusive VIP (Private Space)") {
      if (guestCount < 15) {
        Alert.alert(
          "Limit Reached",
          "Exclusive VIP requires minimum 15 persons."
        );
        return false;
      }
      if (guestCount > 30) {
        Alert.alert("Limit Reached", "Exclusive VIP maximum is 30 persons.");
        return false;
      }
    } else {
      if (guestCount < 1) {
        Alert.alert("Invalid Input", "Please enter at least 1 guest.");
        return false;
      }
      if (guestCount > 70) {
        Alert.alert(
          "Limit Reached",
          "Inclusive (Shared Space) maximum is 70 persons."
        );
        return false;
      }
    }

    return true;
  };

  const calculateFees = () => {
    const guestCount = parseInt(guests) || 0;
    const isExclusive = reservationType === "Exclusive VIP (Private Space)";
    const perPax = isExclusive ? 2000 : 1000;
    const total = guestCount * perPax;
    const downPayment = total * 0.5;
    const consumable = total * 0.5;

    return { total, downPayment, consumable, perPax };
  };

  const handleBook = () => {
    if (validateInputs()) {
      Alert.alert("Success", "Reservation submitted successfully!");
    }
  };

  const fees = calculateFees();

  return (
    <View style={styles.mainContainer}>
      <MainBackground
        width={width}
        height={height}
        preserveAspectRatio="none"
        style={styles.bg}
      />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => navigation.navigate("HomeScreen")}
            style={styles.backButton}
          >
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Reservation Details</Text>
        </View>
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        {/* Names */}
        <View style={styles.row}>
          <TextInput
            placeholder="First Name"
            placeholderTextColor="#777"
            value={firstName}
            onChangeText={setFirstName}
            style={[styles.input, { flex: 1, marginRight: 8 }]}
          />
          <TextInput
            placeholder="Last Name"
            placeholderTextColor="#777"
            value={lastName}
            onChangeText={setLastName}
            style={[styles.input, { flex: 1 }]}
          />
        </View>

        {/* Contact */}
        <TextInput
          placeholder="Contact Number"
          placeholderTextColor="#777"
          value={contact}
          onChangeText={setContact}
          keyboardType="number-pad"
          maxLength={11}
          style={styles.input}
        />

        {/* Calendar */}
        <Text style={styles.sectionTitleSmall}>When to visit?</Text>
        <View style={styles.glassCard}>
          <View style={styles.calendarHeader}>
            <View>
              <Text style={styles.cardTitle}>Pick a Schedule</Text>
              <Text style={styles.cardSubtitle}>
                {selectedDate ? formatDate(selectedDate) : "Select a date below"}
              </Text>
            </View>
            <View style={styles.monthButton}>
              <Text style={styles.monthButtonText}>
                {monthNames[currentMonth.getMonth()]}
              </Text>
            </View>
          </View>

          <ScrollView
  horizontal
  showsHorizontalScrollIndicator={false}
  style={styles.calendarScroll}
>
  {calendarDates.map((date, index) => {
    const isSelected =
      selectedDate?.toDateString() === date.toDateString();
    const dayName =
      dayNames[date.getDay() === 0 ? 6 : date.getDay() - 1];
    return (
      <TouchableOpacity
        key={index}
        style={[styles.dateItem, isSelected && styles.dateItemSelected]}
        onPress={() => {
          setSelectedDate(date);
          setCurrentMonth(date);
        }}
      >
        <Text
          style={[styles.dayName, isSelected && styles.dayNameSelected]}
        >
          {dayName}
        </Text>
        <Text
          style={[
            styles.dateNumber,
            isSelected && styles.dateNumberSelected,
          ]}
        >
          {date.getDate()}
        </Text>
      </TouchableOpacity>
    );
  })}
</ScrollView>

        </View>

        {/* Type of Reservation & Guests */}
        <View style={styles.rowBetween}>
          <View style={{ flex: 0.65 }}>
            <Text style={styles.label}>Type of Reservation</Text>
            <View>
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => setShowDropdown(!showDropdown)}
              >
                <Text style={styles.dropdownText}>{reservationType}</Text>
                <Text style={styles.dropdownArrow}>{showDropdown ? "▲" : "▼"}</Text>
              </TouchableOpacity>

              {showDropdown && (
                <View style={styles.dropdownMenu}>
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => {
                      setReservationType("Inclusive (Shared Space)");
                      setShowDropdown(false);
                      setGuests("");
                    }}
                  >
                    <Text style={styles.dropdownItemText}>
                      Inclusive (Shared Space)
                    </Text>
                    <Text style={styles.dropdownItemSubtext}>
                      ₱1,000/pax • Max 70 pax
                    </Text>
                  </TouchableOpacity>
                  <View style={styles.dropdownDivider} />
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => {
                      setReservationType("Exclusive VIP (Private Space)");
                      setShowDropdown(false);
                      setGuests("");
                    }}
                  >
                    <Text style={styles.dropdownItemText}>
                      Exclusive VIP (Private Space)
                    </Text>
                    <Text style={styles.dropdownItemSubtext}>
                      ₱2,000/pax • 15-30 pax
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>

          <View style={{ flex: 0.33 }}>
            <Text style={styles.label}>Guests</Text>
            <TextInput
              placeholder="0"
              placeholderTextColor="#777"
              value={guests}
              onChangeText={setGuests}
              keyboardType="number-pad"
              style={styles.dropdown}
            />
          </View>
        </View>

        {/* Fee Box */}
        <View style={styles.feeCard}>
          <Text style={styles.cardTitle}>
            Reservation Fee: ₱{fees.total.toLocaleString()}
          </Text>
          <View style={styles.feeDivider} />
          <Text style={styles.feeText}>
            Down Payment (50%): ₱{fees.downPayment.toLocaleString()}
          </Text>
          <Text style={styles.feeText}>
            Consumable Balance: ₱{fees.consumable.toLocaleString()}
          </Text>
        </View>

        {/* Upload ID - simplified */}
        <View style={styles.uploadSectionSimple}>
          <Text style={styles.label}>Upload One (1) Valid ID</Text>
          <TouchableOpacity style={styles.browseButtonSimple}>
            <Text style={styles.browseButtonText}>Browse File</Text>
          </TouchableOpacity>
        </View>

        {/* Book Now */}
        <TouchableOpacity style={styles.bookButton} onPress={handleBook}>
          <Text style={styles.bookText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: { width, height, flex: 1 },
  bg: { position: "absolute", top: 0, left: 0 },

  // Header
  header: {
    width: "100%",
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.06,
    paddingBottom: height * 0.02,
    backgroundColor: "transparent",
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 10,
  },
  headerRow: { flexDirection: "row", alignItems: "center" },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  backText: { color: "white", fontSize: width * 0.08, fontWeight: "600" },
  headerTitle: { color: "white", fontSize: width * 0.07, fontWeight: "bold" },

  // Content
  contentContainer: {
    flex: 1,
    paddingHorizontal: width * 0.06,
    paddingTop: height * 0.14,
    paddingBottom: 20,
  },

  row: { flexDirection: "row", marginBottom: 12 },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    marginBottom: 8,
  },

  sectionTitleSmall: {
    color: "white",
    fontSize: width * 0.06, // same as labels
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 12,
  },

  label: {
    color: "white",
    fontWeight: "600",
    marginBottom: 8,
    fontSize: width * 0.05,
  },
  input: {
    backgroundColor: "white",
    color: "black",
    borderRadius: 10,
    padding: 14,
    fontSize: width * 0.04,
  },
  dropdown: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  dropdownText: { color: "white", fontSize: width * 0.04, flex: 1 },
  dropdownArrow: { color: "white", fontSize: 16, marginLeft: 8 },
  dropdownMenu: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: "rgba(30,30,30,0.98)",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    marginTop: 4,
    overflow: "hidden",
    zIndex: 1000,
  },
  dropdownItem: { padding: 14 },
  dropdownItemText: {
    color: "white",
    fontSize: width * 0.04,
    fontWeight: "600",
    marginBottom: 4,
  },
  dropdownItemSubtext: { color: "rgba(255,255,255,0.7)", fontSize: width * 0.035 },
  dropdownDivider: { height: 1, backgroundColor: "rgba(255,255,255,0.2)" },

  glassCard: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    borderRadius: 15,
    padding: 16,
    marginBottom: 5,
  },
  feeCard: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  feeDivider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.3)",
    marginVertical: 6,
  },

  cardTitle: { color: "white", fontSize: width * 0.045, fontWeight: "bold" },
  cardSubtitle: { color: "rgba(255,255,255,0.7)", fontSize: width * 0.035, marginTop: 4 },
  feeText: { color: "rgba(255,255,255,0.9)", fontSize: width * 0.04, marginBottom: 4 },

  calendarHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  monthButton: { backgroundColor: "rgba(255,255,255,0.2)", paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: "rgba(255,255,255,0.3)" },
  monthButtonText: { color: "white", fontSize: width * 0.038, fontWeight: "600" },
  calendarScroll: { marginTop: 8 },
  dateItem: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 10,
    alignItems: "center",
    minWidth: 65,
  },
  dateItemSelected: { backgroundColor: "#A4161A", borderColor: "#A4161A" },
  dayName: { color: "rgba(255,255,255,0.7)", fontSize: width * 0.032, marginBottom: 4 },
  dayNameSelected: { color: "white", fontWeight: "600" },
  dateNumber: { color: "white", fontSize: width * 0.055, fontWeight: "bold" },
  dateNumberSelected: { color: "white" },

  // Simplified Upload ID
  uploadSectionSimple: {
    marginBottom: 16,
  },
  browseButtonSimple: {
    marginTop: 8,
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  browseButtonText: { color: "white", fontSize: width * 0.04, fontWeight: "600" },

  bookButton: { backgroundColor: "#A4161A", paddingVertical: 16, borderRadius: 12, marginTop: 8 },
  bookText: { color: "white", fontSize: width * 0.045, fontWeight: "bold", textAlign: "center" },
});

export default ReservationScreen;
