import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import MainBackground from "../assets/backgrounds/main-background.svg";

const PaymentScreen = ({ navigation }: any) => {
  return (
    <View style={{ flex: 1 }}>
      {/* Background */}
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

          <Text style={styles.headerTitle}>Payment</Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          {[0, 1, 2, 3, 4].map((step) => (
            <React.Fragment key={step}>
              <View
                style={[
                  styles.circle,
                  step <= 1 ? styles.circleActive : styles.circleInactive,
                ]}
              />
              {step < 4 && (
                <View
                  style={[
                    styles.line,
                    step < 1 ? styles.lineActive : styles.lineInactive,
                  ]}
                />
              )}
            </React.Fragment>
          ))}
        </View>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Note */}
          <View style={styles.noteBox}>
            <Text style={styles.noteText}>
              Note: A reservation fee is required to secure your booking. 50% of
              this amount is consumable and can be used for food and drink
              orders during your event.
            </Text>
          </View>

          {/* Payment Methods */}
          <View style={styles.paymentContainer}>
            <Text style={styles.paymentTitle}>Payment Method</Text>

            <View style={styles.qrRow}>
              {/* GCash */}
              <View style={styles.qrCard}>
                {/* <Image
                  source={require("../assets/payments/GCashLogo.png")}
                  style={styles.logo}
                />
                <Image
                  source={require("../assets/payments/GCashQR.png")}
                  style={styles.qrImage}
                /> */}
                <Text style={[styles.accountText, { color: "#1F51FF" }]}>
                  Tavern GCash
                </Text>
                <Text style={[styles.accountText, { color: "#1F51FF" }]}>
                  09615124880
                </Text>
              </View>

              {/* BPI */}
              <View style={styles.qrCard}>
                {/* <Image
                  source={require("../assets/payments/BPILogo.png")}
                  style={styles.logo}
                />
                <Image
                  source={require("../assets/payments/BPIQR.png")}
                  style={styles.qrImage}
                /> */}
                <Text style={[styles.accountText, { color: "#FF0000" }]}>
                  Tavern
                </Text>
                <Text style={[styles.accountText, { color: "#FF0000" }]}>
                  Account No.
                </Text>
              </View>

              {/* PayMaya */}
              <View style={styles.qrCard}>
                {/* <Image
                  source={require("../assets/payments/MayaLogo.png")}
                  style={styles.logo}
                />
                <Image
                  source={require("../assets/payments/MayaQR.png")}
                  style={styles.qrImage}
                /> */}
                <Text style={[styles.accountText, { color: "#006400" }]}>
                  Tavern PM
                </Text>
                <Text style={[styles.accountText, { color: "#006400" }]}>
                  Account No.
                </Text>
              </View>
            </View>
          </View>

          {/* Total Payable */}
          <Text style={styles.totalLabel}>Total Payable Amount is:</Text>
          <Text style={styles.totalAmount}>₱30,000.00</Text>

          {/* Upload Proof */}
          <View style={styles.uploadContainer}>
            <Text style={styles.uploadLabel}>Upload Proof of Payment</Text>
            <TouchableOpacity style={styles.browseButton}>
              <Text style={styles.browseButtonText}>Browse File</Text>
            </TouchableOpacity>
          </View>

          {/* Confirm Button */}
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={() => navigation.navigate("ConfirmationScreen")}
          >
            <Text style={styles.confirmButtonText}>Confirm Payment</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
};

export default PaymentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  /** HEADER **/
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 50,
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
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },

  /** PROGRESS **/
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 25,
  },
  circle: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  circleActive: { backgroundColor: "#D4AF37" },
  circleInactive: { backgroundColor: "#fff" },
  line: { height: 2, width: 28 },
  lineActive: { backgroundColor: "#D4AF37" },
  lineInactive: { backgroundColor: "#fff", opacity: 0.6 },

  /** NOTE **/
  noteBox: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
  },
  noteText: {
    color: "#fff",
    fontSize: 13,
    lineHeight: 18,
  },

  /** PAYMENT METHODS **/
  paymentContainer: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  paymentTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  qrRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  qrCard: {
    width: "30%",
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
    paddingVertical: 10,
  },
  logo: {
    width: 70,
    height: 25,
    resizeMode: "contain",
    marginBottom: 5,
  },
  qrImage: {
    width: 90,
    height: 90,
    resizeMode: "contain",
    marginBottom: 8,
  },
  accountText: {
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
  },

  /** TOTAL **/
  totalLabel: {
    color: "#fff",
    textAlign: "center",
    fontSize: 15,
    marginBottom: 5,
  },
  totalAmount: {
    color: "#fff",
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 25,
  },

  /** UPLOAD **/
  uploadContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "transparent",
    marginBottom: 25,
  },
  uploadLabel: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  browseButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  browseButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },

  /** CONFIRM BUTTON **/
  confirmButton: {
    backgroundColor: "#8B0000",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 50,
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  scrollContainer: {
    paddingBottom: 100,
  },
});
