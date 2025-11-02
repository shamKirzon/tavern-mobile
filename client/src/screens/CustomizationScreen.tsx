import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import MainBackground from "../assets/backgrounds/main-background.svg";
import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamLists } from "../types/rootStackParamLists";

type CustomizationScreenScreenRouteProps = RouteProp<
  RootStackParamLists,
  "CustomizationScreen"
>;
type CustomizationScreenNavigationProps = NativeStackNavigationProp<
  RootStackParamLists,
  "CustomizationScreen"
>;

interface Props {
  route: CustomizationScreenScreenRouteProps;
  navigation: CustomizationScreenNavigationProps;
}

const CustomizationScreen: React.FC<Props> = ({ route, navigation }) => {
  const basePrice = 435;
  const [selectedServing, setSelectedServing] = useState<
    "Solo" | "Regular" | "To share"
  >("Solo");
  const [quantity, setQuantity] = useState(1);

  const servingOptions = [
    { label: "Solo", price: 0 },
    { label: "Regular", price: 350 },
    { label: "To share", price: 680 },
  ];

  const getSelectedPrice = () => {
    const selected = servingOptions.find((s) => s.label === selectedServing);
    return selected ? selected.price : 0;
  };

  const totalPrice = (basePrice + getSelectedPrice()) * quantity;

  const handleQuantityChange = (change: number) => {
    setQuantity((prev) => Math.max(1, prev + change));
  };

  return (
    <View style={styles.container}>
      {/* ✅ Proper SVG background */}
      <MainBackground
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid slice"
        style={StyleSheet.absoluteFillObject}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Header */}
        <TouchableOpacity style={styles.backButton}>
          <Text style={styles.backArrow}>←</Text>
          <Text style={styles.menuText}>Menu</Text>
        </TouchableOpacity>

        {/* Food Image */}
        <Image
          source={require("../assets/customization/ChiliBallparkNachos.png")}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Content Area */}
        <View style={styles.overlayContainer}>
          {/* Title and Price */}
          <View style={styles.rowBetween}>
            <Text style={styles.title}>Chili Ballpark Nachos</Text>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={styles.price}>₱{basePrice.toFixed(2)}</Text>
              <Text style={styles.basePriceLabel}>Base price</Text>
            </View>
          </View>

          <Text style={styles.description}>
            Tortilla chips, cheese sauce, chili meat, pico de gallo, fresh
            salsa, sour cream
          </Text>

          {/* Servings Section */}
          <View style={styles.section}>
            <View style={styles.rowBetween}>
              <Text style={styles.sectionTitle}>
                Chili Ballpark Nachos Servings
              </Text>
              <View style={styles.pickContainer}>
                <Text style={styles.pickText}>Pick 1</Text>
              </View>
            </View>

            {servingOptions.map((option) => (
              <TouchableOpacity
                key={option.label}
                style={styles.radioRow}
                onPress={() => setSelectedServing(option.label as any)}
              >
                <View style={styles.radioContainer}>
                  <View
                    style={[
                      styles.outerCircle,
                      selectedServing === option.label &&
                        styles.outerCircleActive,
                    ]}
                  >
                    {selectedServing === option.label && (
                      <View style={styles.innerCircle} />
                    )}
                  </View>
                  <Text style={styles.radioLabel}>{option.label}</Text>
                </View>
                <Text style={styles.radioPrice}>
                  {option.price === 0 ? "0.00" : `+${option.price.toFixed(2)}`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Note to restaurant */}
          <View style={styles.section}>
            <View style={styles.rowBetween}>
              <Text style={styles.sectionTitle}>Note to restaurant</Text>
              <View style={styles.pickContainer}>
                <Text style={styles.pickText}>Optional</Text>
              </View>
            </View>
            <TextInput
              style={styles.textInput}
              placeholder="Add your request (subject to restaurant’s discretion)"
              placeholderTextColor="#999"
              multiline
            />
          </View>

          {/* Quantity Selector */}
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              onPress={() => handleQuantityChange(-1)}
              style={styles.qtyButton}
            >
              <Text style={styles.qtySymbol}>−</Text>
            </TouchableOpacity>

            <Text style={styles.qtyText}>{quantity}</Text>

            <TouchableOpacity
              onPress={() => handleQuantityChange(1)}
              style={styles.qtyButton}
            >
              <Text style={styles.qtySymbol}>+</Text>
            </TouchableOpacity>
          </View>

          {/* Update Basket Button */}
          <TouchableOpacity style={styles.updateButton}>
            <Text style={styles.updateButtonText}>
              Update Basket - ₱{totalPrice.toFixed(2)}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default CustomizationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 50,
    marginLeft: 20,
  },
  backArrow: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "600",
  },
  menuText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
    marginLeft: 10,
  },
  image: {
    width: "90%",
    height: 220,
    borderRadius: 15,
    alignSelf: "center",
    marginVertical: 15,
  },
  overlayContainer: {
    backgroundColor: "rgba(0,0,0,0.85)",
    paddingHorizontal: 20,
    paddingVertical: 25,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -10,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    flexShrink: 1,
    width: "70%",
  },
  price: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  basePriceLabel: {
    color: "#bbb",
    fontSize: 11,
  },
  description: {
    color: "#ccc",
    fontSize: 14,
    marginTop: 8,
    marginBottom: 20,
    lineHeight: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  pickContainer: {
    backgroundColor: "#f4d03f",
    borderRadius: 15,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  pickText: {
    color: "#000",
    fontSize: 12,
    fontWeight: "600",
  },
  radioRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  outerCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: "#999",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  outerCircleActive: {
    borderColor: "#ff3b30",
  },
  innerCircle: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: "#ff3b30",
  },
  radioLabel: {
    color: "#fff",
    fontSize: 15,
  },
  radioPrice: {
    color: "#fff",
    fontSize: 15,
  },
  textInput: {
    backgroundColor: "#1a1a1a",
    color: "#fff",
    borderRadius: 10,
    padding: 12,
    marginTop: 10,
    fontSize: 14,
  },
  quantityContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 15,
  },
  qtyButton: {
    backgroundColor: "#333",
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 6,
  },
  qtySymbol: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
  },
  qtyText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginHorizontal: 25,
  },
  updateButton: {
    backgroundColor: "#c0392b",
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  updateButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
});
