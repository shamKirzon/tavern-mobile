import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import MainBackground from "../assets/backgrounds/main-background.svg";
import { RouteProp } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamLists } from "../types/rootStackParamLists";

import { appetizers, mainCourse, desserts, drinks } from "../data/menu";
import { useOrderStore } from "../stores/useOrderStore";
import { width, height } from "../utils/dimensions";

type AdditionalOrderCustomizationScreenRouteProps = RouteProp<
  RootStackParamLists,
  "AdditionalOrderCustomizationScreen"
>;
type AdditionalOrderCustomizationScreenNavigationProps =
  NativeStackNavigationProp<
    RootStackParamLists,
    "AdditionalOrderCustomizationScreen"
  >;

type Servings = "Solo" | "Regular" | "To Share";

interface Props {
  route: AdditionalOrderCustomizationScreenRouteProps;
  navigation: AdditionalOrderCustomizationScreenNavigationProps;
}

const AdditionalOrderCustomizationScreen: React.FC<Props> = ({
  route,
  navigation,
}) => {
  const { order, from } = route.params;
  const { addOrders, updateOrder } = useOrderStore();

  const orderName = order.name || order.orderName;
  const buttonLabel =
    from === "AdditionalOrderCart" ? "Update Basket" : "Add to Cart";

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

  useEffect(() => {
    const servingPrice =
      servingOptions.find((s) => s.label === selectedServing)?.price || 0;
    setTotalPrice((computedPrice + servingPrice) * quantity);
  }, [quantity, selectedServing]);

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
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
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
    if (from === "AdditionalOrderCart") updateOrder(orderName, newOrderItem);
    else addOrders({ orderItems: [newOrderItem] });
    navigation.goBack();
  };

  const handleQuantityChange = (change: number) => {
    setQuantity((prev: any) => Math.max(1, prev + change));
  };

  let description = order.description?.join(", ") || "";
  description = description.charAt(0).toUpperCase() + description.slice(1);

  return (
    <View style={{ flex: 1 }}>
      {/* Background */}
      <MainBackground
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid slice"
        style={{ position: "absolute", top: 0, left: 0 }}
      />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: height * 0.08,
          paddingBottom: height * 0.15,
        }}
      >
        {/* HEADER */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: height * 0.02,
            paddingHorizontal: width * 0.05,
            width: "100%",
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ marginRight: width * 0.03, padding: width * 0.01 }}
          >
            <Text style={{ color: "#FFF", fontSize: width * 0.08 }}>‹</Text>
          </TouchableOpacity>
          <Text
            style={{
              color: "#FFF",
              fontSize: width * 0.065,
              fontWeight: "700",
            }}
          >
            Menu
          </Text>
        </View>

        {/* FOOD IMAGE */}
        <View style={{ alignItems: "center" }}>
          <Image
            source={order.image}
            style={{
              width: width * 0.9,
              height: height * 0.3,
              borderRadius: width * 0.04,
            }}
            resizeMode="cover"
          />
        </View>

        {/* CONTENT */}
        <View
          style={{
            backgroundColor: "transparent",
            paddingHorizontal: width * 0.05,
            paddingVertical: height * 0.03,
            borderTopLeftRadius: width * 0.05,
            borderTopRightRadius: width * 0.05,
            marginTop: -height * 0.015,
            width: "100%",
          }}
        >
          {/* Title and Base Price */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: width * 0.045,
                fontWeight: "700",
                flexShrink: 1,
                width: "70%",
              }}
            >
              {order.name || order.orderName}
            </Text>
            <View style={{ alignItems: "flex-end" }}>
              <Text
                style={{
                  color: "#fff",
                  fontSize: width * 0.045,
                  fontWeight: "700",
                }}
              >
                ₱{computedPrice.toFixed(2)}
              </Text>
              <Text style={{ color: "#f4d03f", fontSize: width * 0.03 }}>
                Base price
              </Text>
            </View>
          </View>

          <Text
            style={{
              color: "#ccc",
              fontSize: width * 0.035,
              marginTop: height * 0.01,
              marginBottom: height * 0.01,
              lineHeight: height * 0.035,
            }}
          >
            {description}
          </Text>

          <View
            style={{
              borderBottomColor: "rgba(255,255,255,0.3)",
              borderBottomWidth: 1,
              marginBottom: height * 0.01,
            }}
          />

          {/* Servings */}
          {category !== "Dessert" && category !== "Drinks" && (
            <>
              <View style={{ marginBottom: height * 0.03 }}>
                <Text
                  style={{
                    color: "#fff",
                    fontSize: width * 0.04,
                    fontWeight: "600",
                    marginBottom: height * 0.013,
                  }}
                >
                  Servings
                </Text>

                {servingOptions.map((option) => (
                  <View
                    key={option.label}
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: height * 0.015,
                    }}
                  >
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <TouchableOpacity
                        onPress={() => setSelectedServing(option.label as any)}
                      >
                        <View
                          style={{
                            width: width * 0.045,
                            height: width * 0.045,
                            borderRadius: width * 0.0225,
                            borderWidth: 1.5,
                            borderColor:
                              selectedServing === option.label
                                ? "#ff3b30"
                                : "#999",
                            justifyContent: "center",
                            alignItems: "center",
                            marginRight: width * 0.03,
                          }}
                        >
                          {selectedServing === option.label && (
                            <View
                              style={{
                                width: width * 0.0225,
                                height: width * 0.0225,
                                borderRadius: width * 0.011,
                                backgroundColor: "#ff3b30",
                              }}
                            />
                          )}
                        </View>
                      </TouchableOpacity>
                      <Text style={{ color: "#fff", fontSize: width * 0.035 }}>
                        {option.label}
                      </Text>
                    </View>
                    <Text style={{ color: "#fff", fontSize: width * 0.035 }}>
                      {option.price === 0
                        ? "0.00"
                        : `+${option.price.toFixed(2)}`}
                    </Text>
                  </View>
                ))}
              </View>
            </>
          )}

          {/* Quantity */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              paddingBottom: height * 0.02,
            }}
          >
            <TouchableOpacity
              onPress={() => handleQuantityChange(-1)}
              disabled={quantity === 1}
              style={{
                borderWidth: 1.5,
                borderColor: "#fff",
                borderRadius: width * 0.05,
                width: width * 0.09,
                height: width * 0.09,
                justifyContent: "center",
                alignItems: "center",
                opacity: quantity === 1 ? 0.3 : 1,
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontSize: width * 0.06,
                  fontWeight: "800",
                }}
              >
                −
              </Text>
            </TouchableOpacity>
            <Text
              style={{
                color: "#fff",
                fontSize: width * 0.045,
                fontWeight: "600",
                marginHorizontal: width * 0.06,
              }}
            >
              {quantity}
            </Text>
            <TouchableOpacity
              onPress={() => handleQuantityChange(1)}
              style={{
                borderWidth: 1.5,
                borderColor: "#fff",
                borderRadius: width * 0.05,
                width: width * 0.09,
                height: width * 0.09,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontSize: width * 0.06,
                  fontWeight: "800",
                }}
              >
                +
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom Button */}
      <View
        style={{
          position: "absolute",
          bottom: height * 0.02,
          left: 0,
          right: 0,
          paddingHorizontal: width * 0.05,
          paddingTop: height * 0.015,
          paddingBottom: height * 0.04,
          backgroundColor: "transparent",
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: "#c0392b",
            paddingVertical: height * 0.025,
            borderRadius: width * 0.04,
          }}
          onPress={handleOrderAction}
        >
          <Text
            style={{
              color: "#fff",
              fontSize: width * 0.045,
              fontWeight: "700",
              textAlign: "center",
            }}
          >
            {buttonLabel} - ₱{totalPrice.toFixed(2)}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AdditionalOrderCustomizationScreen;
