// ReservationScreen.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  FlatList,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
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

/* ---------- Constants & rules (from your spec) ---------- */
const MAX_PAX_PER_DAY = 100;
const INCLUSIVE_RATE = 1000;
const EXCLUSIVE_RATE = 2000;
const INCLUSIVE_MAX = 70;
const EXCLUSIVE_MAX = 30;
const EXCLUSIVE_MIN = 15;

/* ---------- Helper utils ---------- */
const formatDateKey = (d: Date) => d.toISOString().slice(0, 10); // YYYY-MM-DD
const getTwoWeeks = (start = new Date()) => {
  const startDay = new Date(start);
  startDay.setHours(0, 0, 0, 0);
  return Array.from({ length: 14 }).map((_, i) => {
    const d = new Date(startDay);
    d.setDate(startDay.getDate() + i);
    return d;
  });
};

const onlyLettersRegex = /^[A-Za-z\s'-]+$/; // allows spaces, hyphens, apostrophes

/* ---------- Dummy server-state: existing reservations ---------- */
/* In real app, fetch from backend. For demo we prepopulate some dates. */
const prepopulatedBookings: Record<
  string,
  { inclusiveCount: number; exclusiveCount: number }
> = (() => {
  const map: Record<string, { inclusiveCount: number; exclusiveCount: number }> = {};
  // Example: mark tomorrow as having an exclusive 10 pax already (so exclusive exists)
  const t = new Date();
  t.setDate(t.getDate() + 2);
  map[formatDateKey(t)] = { inclusiveCount: 0, exclusiveCount: 10 };

  // Example: one day with inclusive 30
  const t2 = new Date();
  t2.setDate(t2.getDate() + 4);
  map[formatDateKey(t2)] = { inclusiveCount: 30, exclusiveCount: 0 };

  return map;
})();

/* ----------------- Component ----------------- */
const ReservationScreen: React.FC<Props> = ({ navigation }) => {
  // Inputs
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [contact, setContact] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [reservationType, setReservationType] = useState<"Inclusive" | "Exclusive">(
    "Exclusive"
  );
  const [pax, setPax] = useState<number>(15); // default for exclusive minimum
  const [uploadedIdName, setUploadedIdName] = useState<string | null>(null);

  // Animation for card entrance
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Bookings state: in real app, you'd fetch/update from backend
  const [bookings, setBookings] = useState(prepopulatedBookings);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 450,
      useNativeDriver: true,
    }).start();
  }, []);

  // Generate date list (2 weeks)
  const dateList = useMemo(() => getTwoWeeks(new Date()), []);

  // Availability checks for a date
  const getAvailability = (date: Date) => {
    const key = formatDateKey(date);
    const existing = bookings[key] ?? { inclusiveCount: 0, exclusiveCount: 0 };
    const inclusiveRemaining = Math.max(INCLUSIVE_MAX - existing.inclusiveCount, 0);
    const exclusiveRemaining = Math.max(EXCLUSIVE_MAX - existing.exclusiveCount, 0);
    const totalExisting = existing.inclusiveCount + existing.exclusiveCount;
    const totalRemaining = Math.max(MAX_PAX_PER_DAY - totalExisting, 0);
    const hasExclusiveAlready = existing.exclusiveCount > 0;
    return { existing, inclusiveRemaining, exclusiveRemaining, totalRemaining, hasExclusiveAlready };
  };

  // Selecting a date sets pax defaults
  const onSelectDate = (d: Date) => {
    setSelectedDate(d);
    // If exclusive selected and current pax out of allowed bounds, clamp
    if (reservationType === "Exclusive") {
      if (pax < EXCLUSIVE_MIN) setPax(EXCLUSIVE_MIN);
      if (pax > EXCLUSIVE_MAX) setPax(EXCLUSIVE_MAX);
    } else {
      if (pax > INCLUSIVE_MAX) setPax(INCLUSIVE_MAX);
      if (pax < 1) setPax(1);
    }
  };

  // Toggle reservation type but respect availability rules
  const onSetReservationType = (type: "Inclusive" | "Exclusive") => {
    setReservationType(type);
    // adjust pax to fit rule ranges
    if (type === "Exclusive" && pax < EXCLUSIVE_MIN) setPax(EXCLUSIVE_MIN);
    if (type === "Exclusive" && pax > EXCLUSIVE_MAX) setPax(EXCLUSIVE_MAX);
    if (type === "Inclusive" && pax > INCLUSIVE_MAX) setPax(INCLUSIVE_MAX);
    if (type === "Inclusive" && pax < 1) setPax(1);
  };

  // Compute fee
  const fee = reservationType === "Exclusive" ? pax * EXCLUSIVE_RATE : pax * INCLUSIVE_RATE;

  // Simple file picker stub (replace with real picker in production)
  const pickFile = async () => {
    // TODO: use react-native-document-picker or expo-document-picker
    // This is a stub to simulate pick
    // In production, store uri/path and upload to server
    setUploadedIdName("mock-id.png");
    Alert.alert("File selected (stub)", "Replace with real file picker.");
  };

  /* --------------- Validation --------------- */
  const validateAll = (): boolean => {
    // Name & surname required & letters only
    if (!firstName.trim()) {
      Alert.alert("Validation", "Please enter your first name.");
      return false;
    }
    if (!onlyLettersRegex.test(firstName.trim())) {
      Alert.alert("Validation", "First name may only contain letters, spaces, - or '.");
      return false;
    }
    if (!lastName.trim()) {
      Alert.alert("Validation", "Please enter your last name.");
      return false;
    }
    if (!onlyLettersRegex.test(lastName.trim())) {
      Alert.alert("Validation", "Last name may only contain letters, spaces, - or '.");
      return false;
    }

    // Contact number: Philippines format: 11 digits, starts with 09
    const normalized = contact.replace(/\s+/g, "");
    if (!/^\d{11}$/.test(normalized)) {
      Alert.alert("Validation", "Contact number must be exactly 11 digits (e.g. 09123456789).");
      return false;
    }
    if (!normalized.startsWith("09")) {
      Alert.alert("Validation", "Contact number must start with '09' for Philippines mobile numbers.");
      return false;
    }

    // Date required
    if (!selectedDate) {
      Alert.alert("Validation", "Please pick a schedule date.");
      return false;
    }

    // Pax rules
    const { existing, totalRemaining, hasExclusiveAlready } = getAvailability(selectedDate);
    // If exclusive exists already, we treat that as blocking inclusive reservations (per assumption)
    if (reservationType === "Inclusive" && hasExclusiveAlready) {
      Alert.alert(
        "Validation",
        "Selected date already has an Exclusive reservation and is not available for Inclusive bookings."
      );
      return false;
    }

    if (reservationType === "Exclusive") {
      if (pax < EXCLUSIVE_MIN) {
        Alert.alert("Validation", `Exclusive has a minimum of ${EXCLUSIVE_MIN} pax.`);
        return false;
      }
      if (pax > EXCLUSIVE_MAX) {
        Alert.alert("Validation", `Exclusive maximum is ${EXCLUSIVE_MAX} pax.`);
        return false;
      }
      // check remaining capacity on that date (exclusive bucket)
      if (existing.exclusiveCount + pax > EXCLUSIVE_MAX) {
        Alert.alert("Validation", "Not enough exclusive capacity remaining on that date.");
        return false;
      }
    } else {
      // inclusive
      if (pax < 1) {
        Alert.alert("Validation", "Please set the number of guests.");
        return false;
      }
      if (existing.inclusiveCount + pax > INCLUSIVE_MAX) {
        Alert.alert("Validation", "Not enough inclusive capacity remaining on that date.");
        return false;
      }
    }

    if (pax > totalRemaining) {
      Alert.alert("Validation", "Total daily maximum pax exceeded for selected date.");
      return false;
    }

    // ID upload required
    if (!uploadedIdName) {
      Alert.alert("Validation", "Please upload one (1) valid ID.");
      return false;
    }

    return true;
  };

  /* --------------- Submit (book) --------------- */
  const onBookNow = () => {
    if (!validateAll()) return;

    if (!selectedDate) return;
    const key = formatDateKey(selectedDate);
    const existing = bookings[key] ?? { inclusiveCount: 0, exclusiveCount: 0 };

    const updated = { ...bookings };
    if (!updated[key]) updated[key] = { inclusiveCount: 0, exclusiveCount: 0 };

    if (reservationType === "Exclusive") {
      updated[key].exclusiveCount += pax;
    } else {
      updated[key].inclusiveCount += pax;
    }
    setBookings(updated);

    // In real app: send to backend
    Alert.alert(
      "Reservation Confirmed",
      `Thanks ${firstName}! Your ${reservationType} reservation for ${pax} guests on ${key} has been recorded.\nFee: ₱${fee.toLocaleString()}`
    );

    // Optionally navigate or reset form
    navigation.goBack();
  };

  /* --------------- UI render helpers --------------- */
  const renderDateItem = (d: Date) => {
    const key = formatDateKey(d);
    const { hasExclusiveAlready, totalRemaining } = getAvailability(d);
    const selected = selectedDate && formatDateKey(selectedDate) === key;
    const disabledBecauseExclusive =
      hasExclusiveAlready && reservationType === "Inclusive"; // per assumption

    const dayLabel = d.toLocaleString(undefined, { weekday: "short" }); // Mon, Tue
    const dateNum = d.getDate();

    return (
      <TouchableOpacity
        key={key}
        onPress={() => {
          if (disabledBecauseExclusive) {
            Alert.alert("Unavailable", "This date is reserved exclusively and cannot accept inclusive reservations.");
            return;
          }
          if (totalRemaining <= 0) {
            Alert.alert("Unavailable", "No remaining capacity on this date.");
            return;
          }
          onSelectDate(d);
        }}
        style={[
          styles.dateItem,
          selected ? styles.dateItemSelected : undefined,
          disabledBecauseExclusive ? styles.dateItemDisabled : undefined,
        ]}
      >
        <Text style={[styles.dateDayText, selected ? styles.selectedText : undefined]}>
          {dayLabel}
        </Text>
        <Text style={[styles.dateNumText, selected ? styles.selectedText : undefined]}>
          {dateNum}
        </Text>
        {disabledBecauseExclusive && <Text style={styles.smallBadge}>Exclusive</Text>}
      </TouchableOpacity>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container}>
        <MainBackground width={width} height={height} preserveAspectRatio="none" style={styles.bg} />

        <Animated.ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          style={{ opacity: fadeAnim }}
        >
          {/* Header */}
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Text style={styles.backArrow}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Reservation</Text>
          </View>

          {/* Glass Card - Information */}
          <View style={styles.glassCard}>
            <Text style={styles.sectionTitle}>Enter Your Information</Text>

            <View style={styles.row}>
              <TextInput
                placeholder="First Name"
                placeholderTextColor="#ddd"
                value={firstName}
                onChangeText={setFirstName}
                style={[styles.input, { marginRight: 10 }]}
                autoCapitalize="words"
                keyboardType="default"
              />
              <TextInput
                placeholder="Last Name"
                placeholderTextColor="#ddd"
                value={lastName}
                onChangeText={setLastName}
                style={[styles.input, { marginLeft: 10 }]}
                autoCapitalize="words"
                keyboardType="default"
              />
            </View>

            <TextInput
              placeholder="Contact Number (09XXXXXXXXX)"
              placeholderTextColor="#ddd"
              value={contact}
              onChangeText={(t) => {
                // Keep only digits, limit to 11
                const digits = t.replace(/\D/g, "");
                setContact(digits.slice(0, 11));
              }}
              style={[styles.input, { marginTop: 12 }]}
              keyboardType="phone-pad"
              maxLength={11}
            />
          </View>

          {/* Schedule - glass card */}
          <View style={[styles.glassCard, { marginTop: 18 }]}>
            <Text style={styles.sectionTitle}>When to visit?</Text>

            <View style={styles.datePickerCard}>
              <Text style={styles.pickerHeader}>Pick a Schedule</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.datesRow}
              >
                {dateList.map((d) => renderDateItem(d))}
              </ScrollView>
            </View>

            {/* Type & Guests row */}
            <View style={styles.rowBetween}>
              <View style={{ flex: 1 }}>
                <Text style={styles.smallLabel}>Type of Reservation</Text>
                <TouchableOpacity
                  style={styles.typeDropdown}
                  onPress={() =>
                    onSetReservationType(reservationType === "Exclusive" ? "Inclusive" : "Exclusive")
                  }
                >
                  <Text style={styles.typeText}>{reservationType}</Text>
                  <Text style={styles.typeCaret}>▾</Text>
                </TouchableOpacity>
              </View>

              <View style={{ width: 18 }} />

              <View style={{ width: 120 }}>
                <Text style={styles.smallLabel}>Guests</Text>
                <View style={styles.paxRow}>
                  <TouchableOpacity
                    style={styles.paxBtn}
                    onPress={() => setPax((p) => Math.max(1, p - 1))}
                  >
                    <Text style={styles.paxBtnText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.paxText}>{pax}</Text>
                  <TouchableOpacity
                    style={styles.paxBtn}
                    onPress={() => {
                      // increment, but clamp to allowed max (and total remaining)
                      if (!selectedDate) {
                        // use general caps if date not selected
                        const cap = reservationType === "Exclusive" ? EXCLUSIVE_MAX : INCLUSIVE_MAX;
                        setPax((p) => Math.min(cap, p + 1));
                        return;
                      }
                      const { existing, totalRemaining } = getAvailability(selectedDate);
                      const dateSpecificCap =
                        reservationType === "Exclusive"
                          ? EXCLUSIVE_MAX - existing.exclusiveCount
                          : INCLUSIVE_MAX - existing.inclusiveCount;
                      const allowed = Math.min(dateSpecificCap, totalRemaining);
                      setPax((p) => Math.min(allowed, p + 1));
                    }}
                  >
                    <Text style={styles.paxBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.noteText}>
                  {reservationType === "Exclusive"
                    ? `Min ${EXCLUSIVE_MIN}, Max ${EXCLUSIVE_MAX}`
                    : `Per pax: ₱${INCLUSIVE_RATE.toLocaleString()}`}
                </Text>
              </View>
            </View>

            {reservationType === "Exclusive" && (
              <Text style={styles.warningText}>Exclusive requires minimum {EXCLUSIVE_MIN} pax.</Text>
            )}
          </View>

          {/* Price summary */}
          <View style={[styles.glassCard, { marginTop: 18 }]}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Reservation Fee:</Text>
              <Text style={styles.priceValue}>₱{fee.toLocaleString()}</Text>
            </View>

            <View style={styles.uploadRow}>
              <Text style={styles.uploadLabel}>Upload One (1) Valid ID</Text>
              <TouchableOpacity onPress={pickFile} style={styles.browseBtn}>
                <Text style={styles.browseText}>{uploadedIdName ? "Change File" : "Browse File"}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Book Button */}
          <TouchableOpacity onPress={onBookNow} style={styles.bookBtn}>
            <Text style={styles.bookBtnText}>Book Now</Text>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </Animated.ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ReservationScreen;

/* ---------------- Styles (glass look emulated) ---------------- */
const styles = StyleSheet.create({
  container: { flex: 1, width, height },
  bg: { position: "absolute", top: 0, left: 0 },
  content: {
    paddingHorizontal: width * 0.06,
    paddingTop: height * 0.06,
    paddingBottom: 30,
    alignItems: "stretch",
  },
  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 18 },
  backBtn: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  backArrow: { color: "white", fontSize: width * 0.08 },
  headerTitle: { color: "white", fontSize: width * 0.09, fontWeight: "700" },

  glassCard: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 6,
  },

  sectionTitle: { color: "white", fontSize: width * 0.045, fontWeight: "700", marginBottom: 12 },

  row: { flexDirection: "row", alignItems: "center" },

  input: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 10,
    padding: 14,
    color: "white",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },

  datePickerCard: {
    marginTop: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: "rgba(0,0,0,0.25)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  pickerHeader: { color: "white", fontWeight: "700", marginBottom: 8, fontSize: width * 0.04 },
  datesRow: { alignItems: "center" },

  dateItem: {
    width: 86,
    height: 96,
    borderRadius: 12,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.03)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.03)",
  },
  dateItemSelected: {
    backgroundColor: "#8B0001",
    borderColor: "rgba(255,255,255,0.12)",
  },
  dateItemDisabled: {
    opacity: 0.35,
  },
  dateDayText: { color: "white", fontSize: width * 0.03, marginBottom: 6 },
  dateNumText: { color: "white", fontSize: width * 0.06, fontWeight: "700" },
  selectedText: { color: "white" },
  smallBadge: {
    position: "absolute",
    bottom: 6,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    color: "white",
    fontSize: 10,
    overflow: "hidden",
  },

  rowBetween: { flexDirection: "row", alignItems: "center", marginTop: 14, justifyContent: "space-between" },

  smallLabel: { color: "white", marginBottom: 8, fontSize: width * 0.033 },
  typeDropdown: {
    backgroundColor: "rgba(255,255,255,0.04)",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  typeText: { color: "white", fontSize: width * 0.04 },
  typeCaret: { color: "white", marginLeft: 6 },

  paxRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  paxBtn: {
    backgroundColor: "rgba(255,255,255,0.04)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  paxBtnText: { color: "white", fontSize: 18, fontWeight: "700" },
  paxText: { color: "white", fontSize: width * 0.045, paddingHorizontal: 10 },

  noteText: { color: "rgba(255,255,255,0.6)", marginTop: 6, fontSize: width * 0.028 },

  warningText: { color: "#FFD1D1", marginTop: 8 },

  priceRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  priceLabel: { color: "white", fontSize: width * 0.04 },
  priceValue: { color: "white", fontWeight: "700", fontSize: width * 0.045 },

  uploadRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 12 },
  uploadLabel: { color: "white", fontSize: width * 0.035 },
  browseBtn: {
    backgroundColor: "rgba(255,255,255,0.04)",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  browseText: { color: "white" },

  bookBtn: {
    marginTop: 20,
    backgroundColor: "#8B0001",
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: "center",
  },
  bookBtnText: { color: "white", fontSize: width * 0.05, fontWeight: "700" },

  note: { color: "rgba(255,255,255,0.6)", marginTop: 8 },

});
