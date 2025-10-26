import React, { useState } from "react";
import MainBackground from "../assets/backgrounds/main-background.svg";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from "react-native";

const BookingSummaryScreen = ({ navigation }: any) => {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      {/* Background SVG */}
      <MainBackground
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid slice"
        style={StyleSheet.absoluteFillObject}
      />

      {/* Main Content */}
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backArrowButton}
            onPress={() => navigation?.goBack?.()}
          >
            <View style={styles.customArrow} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Reservation</Text>
        </View>

        {/* Progress Bar (below header, above Booking Summary) */}
        <View style={styles.inlineProgressWrapper}>
          <View style={styles.inlineProgressContainer}>
            {[0, 1, 2, 3, 4].map((step) => (
              <React.Fragment key={step}>
                <View
                  style={[
                    styles.inlineCircle,
                    step === 0
                      ? styles.inlineCircleActive
                      : styles.inlineCircleInactive,
                  ]}
                />
                {step < 4 && <View style={styles.inlineLine} />}
              </React.Fragment>
            ))}
          </View>
        </View>

        {/* Scrollable Content */}
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Reservation Details */}
          <Text style={styles.sectionTitle}>Booking Summary</Text>
          <View style={styles.infoBox}>
            <View style={styles.row}>
              <Text style={styles.label}>Name:</Text>
              <Text style={styles.value}>Dannah Joyce Torres</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Date:</Text>
              <Text style={styles.value}>October 07, 2025</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Type:</Text>
              <Text style={styles.value}>Exclusive</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Guests:</Text>
              <Text style={styles.value}>50</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Reservation Fee:</Text>
              <Text style={styles.value}>₱30,000.00</Text>
            </View>
          </View>

          {/* Terms & Conditions */}
          <View style={styles.termsContainer}>
            <Text style={styles.termsTitle}>Terms and Conditions</Text>

            <View style={styles.policyContainer}>
              <Text style={styles.policyTitle}>Reservation Policy</Text>
              <Text style={styles.policyText}>
                Orders must be placed at least 2 days in advance to ensure
                availability and preparation time.
              </Text>

              <Text style={styles.policyTitle}>Cancellation Policy</Text>
              <Text style={styles.policyText}>
                Cancellations made within 24 hours of pickup/delivery will not be
                refunded.
              </Text>

              <Text style={styles.policyTitle}>Payment Policy</Text>
              <Text style={styles.policyText}>
                Full payment is required to confirm your order. Payments are
                non-refundable once confirmed.
              </Text>

              <Text style={styles.policyTitle}>Special Requests</Text>
              <Text style={styles.policyText}>
                Customizations or specific requests must be communicated upon
                ordering.
              </Text>

              <Text style={styles.policyTitle}>Privacy Policy</Text>
              <Text style={styles.policyText}>
                Customer information is kept confidential and used solely for
                processing your order.
              </Text>
            </View>

            {/* Checkbox Agreement */}
            <Pressable
              onPress={() => setIsChecked(!isChecked)}
              style={styles.checkboxContainer}
            >
              <View
                style={[
                  styles.checkbox,
                  { backgroundColor: isChecked ? "#8B0000" : "transparent" },
                ]}
              />
              <Text style={styles.checkboxLabel}>
                I have read and agree to the ordering and payment policies.
              </Text>
            </Pressable>
          </View>
        </ScrollView>

        {/* Continue Button */}
        <TouchableOpacity
          style={[styles.button, { opacity: isChecked ? 1 : 0.5 }]}
          disabled={!isChecked}
          onPress={() => navigation?.navigate?.("PaymentScreen")}
        >
          <Text style={styles.buttonText}>Continue to Payment</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BookingSummaryScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },

  /** Header **/
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 50,
    marginBottom: 5,
  },
  backArrowButton: {
    width: 35,
    height: 35,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  customArrow: {
    width: 14,
    height: 14,
    borderLeftWidth: 3,
    borderBottomWidth: 3,
    borderColor: "#fff",
    transform: [{ rotate: "45deg" }],
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "bold",
  },

  /** Progress Bar **/
  inlineProgressWrapper: {
    width: "100%",
    alignItems: "center",
    marginBottom: 25,
  },
  inlineProgressContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "90%", // spans across width like your reference
  },
  inlineCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  inlineCircleActive: {
    backgroundColor: "#FFD85A", // gold like in the screenshot
  },
  inlineCircleInactive: {
    backgroundColor: "#FFFFFF",
  },
  inlineLine: {
    flex: 1,
    height: 1.5,
    backgroundColor: "#FFFFFF",
    opacity: 0.9,
  },

  /** Content **/
  scrollContainer: { paddingBottom: 120 },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
  },
  infoBox: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  label: { color: "#FFFFFF", fontSize: 14 },
  value: { color: "#FFFFFF", fontSize: 14, fontWeight: "500" },

  /** Terms **/
  termsContainer: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    padding: 15,
  },
  termsTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  policyContainer: { marginBottom: 20 },
  policyTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  policyText: {
    color: "#dddddd",
    fontSize: 13,
    marginBottom: 8,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#ccc",
    borderRadius: 4,
    marginRight: 8,
  },
  checkboxLabel: { color: "#fff", flex: 1, fontSize: 13 },

  /** Button **/
  button: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: "#8B0000",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
