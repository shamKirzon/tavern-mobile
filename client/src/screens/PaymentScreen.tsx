import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import MainBackground from "../assets/backgrounds/main-background.svg";

const { width, height } = Dimensions.get("window");

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
        <View style={styles.inlineProgressWrapper}>
          <View style={styles.inlineProgressContainer}>
            {[0, 1, 2, 3, 4].map((step) => (
              <React.Fragment key={step}>
                <View
                  style={[
                    styles.inlineCircle,
                    step <= 1
                      ? styles.inlineCircleActive
                      : styles.inlineCircleInactive,
                  ]}
                />
                {step < 4 && <View style={styles.inlineLine} />}
              </React.Fragment>
            ))}
          </View>
        </View>

        {/* Note Box */}
        <View style={styles.noteBox}>
          <View style={styles.noteHeader}>
            <View style={styles.infoIcon}>
              <Text style={styles.infoText}>i</Text>
            </View>
            <Text style={styles.noteTitle}>Note:</Text>
          </View>

          <Text style={styles.noteText}>
            A reservation fee is required to secure your booking. 50% of this
            amount is consumable and can be used for food and drink orders during
            your event.
          </Text>
        </View>

        {/* Payment Methods */}
        <View style={styles.paymentContainer}>
          <Text style={styles.paymentTitle}>Payment Method</Text>

          <View style={styles.qrRow}>
            {/* GCash */}
            <View style={styles.qrCard}>
              <Image
                source={require("../assets/payments/GCashLogo.png")}
                style={styles.logo}
              />
              <Image
                source={require("../assets/payments/GCashQR.png")}
                style={styles.qrImage}
              />
              <Text style={[styles.accountText, { color: "#1F51FF" }]}>
                Tavern GCash
              </Text>
              <Text style={[styles.accountText, { color: "#1F51FF" }]}>
                09615124880
              </Text>
            </View>

            {/* BPI */}
            <View style={styles.qrCard}>
              <Image
                source={require("../assets/payments/BPILogo.png")}
                style={styles.logo}
              />
              <Image
                source={require("../assets/payments/BPIQR.png")}
                style={styles.qrImage}
              />
              <Text style={[styles.accountText, { color: "#FF0000" }]}>
                Tavern
              </Text>
              <Text style={[styles.accountText, { color: "#FF0000" }]}>
                Account No.
              </Text>
            </View>

            {/* PayMaya */}
            <View style={styles.qrCard}>
              <Image
                source={require("../assets/payments/MayaLogo.png")}
                style={styles.logo}
              />
              <Image
                source={require("../assets/payments/MayaQR.png")}
                style={styles.qrImage}
              />
              <Text style={[styles.accountText, { color: "#006400" }]}>
                Tavern PM
              </Text>
              <Text style={[styles.accountText, { color: "#006400" }]}>
                Account No.
              </Text>
            </View>
          </View>

          {/* Total Payable */}
          <View style={styles.totalPayableBox}>
            <Text style={styles.totalLabel}>Total Payable Amount is:</Text>
            <Text style={styles.totalAmount}>₱30,000.00</Text>
          </View>
        </View>

        {/* Upload Proof */}
        <View style={styles.uploadContainer}>
          <Text style={styles.uploadLabel}>Upload Proof of Payment</Text>
          <TouchableOpacity style={styles.browseButton}>
            <Text style={styles.browseButtonText}>Browse File</Text>
          </TouchableOpacity>
        </View>

        {/* Confirm Payment Button - pushed lower */}
        <View style={styles.fixedButtonContainer}>
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={() => navigation.navigate("ConfirmationScreen")}
          >
            <Text style={styles.confirmButtonText}>Confirm Payment</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default PaymentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
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
  inlineProgressWrapper: {
    width: width,
    alignSelf: "center",
    marginVertical: 25,
  },
  inlineProgressContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: width * 0.9,
    alignSelf: "center",
  },
  inlineCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  inlineCircleActive: { backgroundColor: "#FFD85A" },
  inlineCircleInactive: { backgroundColor: "#fff", opacity: 0.9 },
  inlineLine: {
    flex: 1,
    height: 2,
    backgroundColor: "#fff",
    opacity: 0.8,
  },

  /** NOTE **/
  noteBox: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
  },
  noteHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  infoIcon: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  infoText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  noteTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  noteText: {
    color: "#fff",
    fontSize: 13,
    lineHeight: 18,
  },

  /** PAYMENT **/
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
  totalPayableBox: {
    marginTop: 15,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
  },
  totalLabel: {
    color: "#fff",
    fontSize: 15,
  },
  totalAmount: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },

  /** UPLOAD **/
  uploadContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 150, // ⬅️ Increased from 90 to 150 to move it lower
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

  /** CONFIRM BUTTON LOWER **/
  fixedButtonContainer: {
    position: "absolute",
    bottom: 100,
    left: 20,
    right: 20,
  },
  confirmButton: {
    backgroundColor: "#8B0000",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
