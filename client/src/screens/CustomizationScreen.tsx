import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import MainBackground from "../assets/backgrounds/main-background.svg";
import { RouteProp } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamLists } from "../types/rootStackParamLists";

import { appetizers, mainCourse, desserts, drinks } from "../data/menu";
import { useOrderStore } from "../stores/useOrderStore";
import { ordersData } from "../types/orders";
import { width } from "../utils/dimensions";

type CustomizationScreenRouteProps = RouteProp<
  RootStackParamLists,
  "CustomizationScreen"
>;
type CustomizationScreenNavigationProps = NativeStackNavigationProp<
  RootStackParamLists,
  "CustomizationScreen"
>;

type Servings = "Solo" | "Regular" | "To Share";

interface Props {
  route: CustomizationScreenRouteProps;
  navigation: CustomizationScreenNavigationProps;
}

const CustomizationScreen: React.FC<Props> = ({ route, navigation }) => {
  const { order, from } = route.params;
  const { addOrders, updateOrder, orders } = useOrderStore();

  const orderName = order.name || order.orderName;
  const buttonLabel = from === "CartScreen" ? "Update Basket" : "Add to Cart";

  // Initialize state with previous order info
  const [selectedServing, setSelectedServing] = useState<Servings>(
    order.serving?.servingSize
      ? (capitalize(order.serving.servingSize) as Servings)
      : "Solo"
  );
  const [quantity, setQuantity] = useState(order.quantity || 1);
  const [note, setNote] = useState(order.note || "");
  const [computedPrice, setComputedPrice] = useState(order.price);
  const [totalPrice, setTotalPrice] = useState(
    order.total || order.price * (order.quantity || 1)
  );
  const servingOptions = [
    { label: "Solo", price: 0 },
    { label: "Regular", price: 350 },
    { label: "To Share", price: 680 },
  ];

  const category = getCategory(order);

  // Recompute total only if quantity or serving changes
  useEffect(() => {
    const servingPrice =
      servingOptions.find((s) => s.label === selectedServing)?.price || 0;
    const newTotal = (computedPrice + servingPrice) * quantity;
    setTotalPrice(newTotal);
  }, [quantity, selectedServing]);

  // Functions

  function getCategory(result: any) {
    if (
      appetizers.find((item) => item.name === (result.name || result.orderName))
    )
      return "Appetizer";
    if (
      mainCourse.find((item) => item.name === (result.name || result.orderName))
    )
      return "MainCourse";
    if (
      desserts.find((item) => item.name === (result.name || result.orderName))
    )
      return "Dessert";
    if (
      Object.values(drinks)
        .flat()
        .find((item) => item.name === (result.name || result.orderName))
    )
      return "Drinks";
    return null;
  }

  function capitalize(str: string) {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  const handleOrderAction = () => {
    const servingPrice =
      servingOptions.find((s) => s.label === selectedServing)?.price || 0;

    const newOrderItem = {
      orderName: order.name || order.orderName,
      serving:
        category === "Appetizer" || category === "MainCourse"
          ? {
              servingSize: selectedServing.toLowerCase() as
                | "solo"
                | "regular"
                | "to share",
              servingPrice,
            }
          : undefined,
      quantity,
      note,
      price: computedPrice,
      total: (computedPrice + servingPrice) * quantity,
      image: order.image!,
      description: order.description!,
    };

    if (from === "CartScreen") {
      updateOrder(orderName, newOrderItem);
    } else {
      addOrders({ orderItems: [newOrderItem] });
    }

    navigation.goBack();
  };

  const handleQuantityChange = (change: number) => {
    setQuantity((prev: any) => Math.max(1, prev + change));
  };

  let description = order.description?.join(", ") || "";
  description = description.charAt(0).toUpperCase() + description.slice(1);

  return (
    <View style={styles.container}>
      <MainBackground
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid slice"
        style={StyleSheet.absoluteFillObject}
      />

      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ marginTop: 60, paddingBottom: 100 }}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid
        extraScrollHeight={20}
      >
        {/* HEADER */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 10,
            paddingHorizontal: 20,
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ marginRight: 10, padding: 5 }}
          >
            <Text style={{ color: "#FFF", fontSize: 30 }}>‹</Text>
          </TouchableOpacity>
          <Text style={{ color: "#FFF", fontSize: 24, fontWeight: "700" }}>
            Menu
          </Text>
        </View>

        {/* FOOD IMAGE */}
        <View style={{ alignItems: "center" }}>
          <Image source={order.image} style={styles.image} resizeMode="cover" />
        </View>

        {/* CONTENT */}
        <View style={styles.overlayContainer}>
          {/* Title and Base Price */}
          <View style={styles.rowBetween}>
            <Text style={styles.title}>{order.name || order.orderName}</Text>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={styles.price}>₱{computedPrice.toFixed(2)}</Text>
              <Text style={styles.basePriceLabel}>Base price</Text>
            </View>
          </View>

          <Text style={styles.description}>{description}</Text>
          <View style={styles.divider} />

          {/* Servings */}
          {category !== "Dessert" && category !== "Drinks" && (
            <>
              <View style={styles.section}>
                <View style={styles.rowBetween}>
                  <Text style={styles.sectionTitle}>Servings</Text>
                </View>

                {servingOptions.map((option) => (
                  <View style={styles.radioRow} key={option.label}>
                    <View style={styles.radioContainer}>
                      <TouchableOpacity
                        onPress={() => setSelectedServing(option.label as any)}
                      >
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
                      </TouchableOpacity>
                      <Text style={styles.radioLabel}>{option.label}</Text>
                    </View>
                    <Text style={styles.radioPrice}>
                      {option.price === 0
                        ? "0.00"
                        : `+${option.price.toFixed(2)}`}
                    </Text>
                  </View>
                ))}
              </View>
              <View style={styles.divider} />
            </>
          )}

          {/* Note */}
          <View style={styles.section}>
            <View style={styles.rowBetween}>
              <Text style={styles.sectionTitle}>Note to restaurant</Text>
            </View>
            <TextInput
              style={[
                styles.textInput,
                (category === "Dessert" || category === "Drinks") && {
                  height: 100,
                },
              ]}
              value={note}
              placeholder="Specify any additional requests"
              placeholderTextColor="#999"
              multiline
              onChangeText={setNote}
            />
          </View>

          {/* Quantity */}
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              onPress={() => handleQuantityChange(-1)}
              disabled={quantity === 1}
              style={[styles.qtyButton, quantity === 1 && { opacity: 0.3 }]}
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

          {/* Update Button */}
          <TouchableOpacity
            style={styles.updateButton}
            onPress={handleOrderAction}
          >
            <Text style={styles.updateButtonText}>
              {buttonLabel} - ₱{totalPrice.toFixed(2)}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default CustomizationScreen;

// styles remain the same (you can reuse your original styles)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
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
    marginVertical: 15,
  },
  overlayContainer: {
    backgroundColor: "transparent",
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
    color: "#f4d03f",
    fontSize: 11,
  },
  description: {
    color: "#ccc",
    fontSize: 14,
    marginTop: 8,
    marginBottom: 15,
    lineHeight: 20,
  },
  divider: {
    borderBottomColor: "rgba(255,255,255,0.3)",
    borderBottomWidth: 1,
    marginBottom: 15,
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
    backgroundColor: "transparent",
    color: "#fff",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    borderRadius: 10,
    padding: 12,
    marginTop: 25,
    fontSize: 14,
  },
  quantityContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: width * 0.07,
  },
  qtyButton: {
    borderWidth: 1.5,
    borderColor: "#fff",
    borderRadius: 50,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
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
  },
  updateButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },

  // ✅ Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: 250,
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingVertical: 25,
    paddingHorizontal: 15,
    alignItems: "center",
  },
  modalText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  noButton: {
    flex: 1,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#c0392b",
    borderRadius: 25,
    paddingVertical: 10,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  yesButton: {
    flex: 1,
    backgroundColor: "#c0392b",
    borderRadius: 25,
    paddingVertical: 10,
    alignItems: "center",
  },
  noButtonText: {
    color: "#c0392b",
    fontWeight: "700",
  },
  yesButtonText: {
    color: "#fff",
    fontWeight: "700",
  },
});
