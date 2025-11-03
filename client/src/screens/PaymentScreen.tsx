import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Modal,
  Pressable,
} from "react-native";
import MainBackground from "../assets/backgrounds/main-background.svg";
import PaymentMethod from "../assets/images/payment-method.svg";

const { width } = Dimensions.get("window");

const PaymentScreen = ({ navigation }: any) => {
  const [selectedQR, setSelectedQR] = useState<string | null>(null);

  const handleQRPress = (qr: string) => {
    setSelectedQR(selectedQR === qr ? null : qr);
  };

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

        {/* NOTE BOX */}
        <View style={styles.noteBox}>
          <View style={styles.noteContent}>
            <View style={styles.infoCircle}>
              <Text style={styles.infoLetter}>i</Text>
            </View>
            <Text style={styles.noteText}>
              <Text style={{ fontWeight: "bold" }}>Note:</Text> A reservation fee
              is required to secure your booking. 50% of this amount is consumable
              and can be used for food and drink orders during your event.
            </Text>
          </View>
        </View>

        {/* PAYMENT METHODS */}
        <View style={styles.paymentContainer}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <PaymentMethod
              style={{ width: 22, height: 22, marginRight: 8 }}
            />
            <Text style={styles.paymentTitle}>Payment Method</Text>
          </View>

          <View style={styles.qrRow}>
            {/* GCash */}
            <TouchableOpacity
              style={styles.qrCard}
              onPress={() => handleQRPress("gcash")}
              activeOpacity={0.8}
            >
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
            </TouchableOpacity>

            {/* BPI */}
            <TouchableOpacity
              style={styles.qrCard}
              onPress={() => handleQRPress("bpi")}
              activeOpacity={0.8}
            >
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
            </TouchableOpacity>

            {/* PayMaya */}
            <TouchableOpacity
              style={styles.qrCard}
              onPress={() => handleQRPress("maya")}
              activeOpacity={0.8}
            >
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
            </TouchableOpacity>
          </View>

          {/* TOTAL PAYABLE */}
          <View style={[styles.totalPayableBox, { borderTopWidth: 0 }]}>
            <Text style={styles.totalLabel}>Total Payable Amount is:</Text>
            <Text style={styles.totalAmount}>₱30,000.00</Text>
          </View>
        </View>

        {/* UPLOAD PROOF */}
        <View style={styles.uploadContainer}>
          <Text style={styles.uploadLabel}>Upload Proof of Payment</Text>
          <TouchableOpacity style={styles.browseButton}>
            <Text style={styles.browseButtonText}>Browse File</Text>
          </TouchableOpacity>
        </View>

        {/* CONFIRM PAYMENT BUTTON */}
        <View style={styles.fixedButtonContainer}>
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={() => navigation.navigate("ConfirmationScreen")}
          >
            <Text style={styles.confirmButtonText}>Confirm Payment</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* FLOATING QR MODAL */}
      <Modal visible={!!selectedQR} transparent animationType="fade">
        <Pressable
          style={styles.overlay}
          onPress={() => setSelectedQR(null)}
        >
          <View style={styles.modalContent}>
            {selectedQR === "gcash" && (
              <>
                <Image
                  source={require("../assets/payments/GCashLogo.png")}
                  style={styles.modalLogo}
                />
                <Image
                  source={require("../assets/payments/GCashQR.png")}
                  style={styles.bigQR}
                />
                <Text style={[styles.modalText, { color: "#1F51FF" }]}>
                  Tavern GCash
                </Text>
                <Text style={[styles.modalText, { color: "#1F51FF" }]}>
                  09615124880
                </Text>
              </>
            )}
            {selectedQR === "bpi" && (
              <>
                <Image
                  source={require("../assets/payments/BPILogo.png")}
                  style={styles.modalLogo}
                />
                <Image
                  source={require("../assets/payments/BPIQR.png")}
                  style={styles.bigQR}
                />
                <Text style={[styles.modalText, { color: "#FF0000" }]}>
                  Tavern
                </Text>
                <Text style={[styles.modalText, { color: "#FF0000" }]}>
                  Account No.
                </Text>
              </>
            )}
            {selectedQR === "maya" && (
              <>
                <Image
                  source={require("../assets/payments/MayaLogo.png")}
                  style={styles.modalLogo}
                />
                <Image
                  source={require("../assets/payments/MayaQR.png")}
                  style={styles.bigQR}
                />
                <Text style={[styles.modalText, { color: "#006400" }]}>
                  Tavern PM
                </Text>
                <Text style={[styles.modalText, { color: "#006400" }]}>
                  Account No.
                </Text>
              </>
            )}
          </View>
        </Pressable>
      </Modal>
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
    fontSize: 25,
    fontWeight: "bold",
  },

  /** NOTE BOX **/
  noteBox: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderColor: "rgba(255, 255, 255, 0.15)",
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    marginVertical: 20,
  },
  noteContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  infoLetter: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  noteText: {
    color: "#fff",
    fontSize: 13,
    lineHeight: 20,
    flex: 1,
  },

  /** PAYMENT **/
  paymentContainer: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    marginBottom: 20,
  },
  paymentTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  qrRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
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
    marginBottom: 150,
  },
  uploadLabel: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "500",
    marginTop: 5,
  },
  browseButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  browseButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },

  /** CONFIRM BUTTON **/
  fixedButtonContainer: {
    position: "absolute",
    bottom: 30,
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

  /** FLOATING QR MODAL **/
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },
  modalLogo: {
    width: 100,
    height: 35,
    resizeMode: "contain",
    marginBottom: 10,
  },
  bigQR: {
    width: width * 0.7,
    height: width * 0.7,
    resizeMode: "contain",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
  },
});