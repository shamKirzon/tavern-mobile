import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, TextInput } from "react-native";
import MainBackground from "../assets/backgrounds/main-background.svg";
import { RouteProp } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamLists } from "../types/rootStackParamLists";

import { appetizers, mainCourse, desserts, drinks } from "../data/menu";
import { useOrderStore } from "../stores/useOrderStore";
import { width, height, paddingTop } from "../utils/dimensions";
import { Servings } from "../types/orders";

type CustomizationScreenRouteProps = RouteProp<
  RootStackParamLists,
  "CustomizationScreen"
>;
type CustomizationScreenNavigationProps = NativeStackNavigationProp<
  RootStackParamLists,
  "CustomizationScreen"
>;

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
    <View style={{ flex: 1, backgroundColor: "transparent" }}>
      <MainBackground
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid slice"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />

      {/* Header */}
      <View
        style={{
          paddingTop: paddingTop,
          paddingHorizontal: width * 0.05,

          flexDirection: "row",
          alignItems: "center",
          marginBottom: height * 0.01,
        }}
      >
        <TouchableOpacity
          style={{
            width: width * 0.09,
            height: width * 0.09,
            justifyContent: "center",
            alignItems: "center",
            marginRight: width * 0.025,
          }}
          onPress={() => navigation?.goBack?.()}
        >
          <View
            style={{
              width: width * 0.035,
              height: width * 0.035,
              borderLeftWidth: width * 0.008,
              borderBottomWidth: width * 0.008,
              borderColor: "#fff",
              transform: [{ rotate: "45deg" }],
            }}
          />
        </TouchableOpacity>

        <Text
          style={{
            color: "#FFFFFF",
            fontSize: width * 0.07,
            fontWeight: "bold",
          }}
        >
          Menu
        </Text>
      </View>

      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: height * 0.05,
          paddingHorizontal: width * 0.05,
        }}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid
        extraScrollHeight={height * 0.03}
      >
        {/* FOOD IMAGE */}
        <View style={{ alignItems: "center" }}>
          <Image
            source={order.image}
            style={{
              width: "100%",
              height: height * 0.2,
              borderRadius: width * 0.04,
              marginVertical: height * 0.025,
            }}
            resizeMode="cover"
          />
        </View>

        {/* CONTENT */}
        <View
          style={{
            backgroundColor: "transparent",
            // marginTop: height * 0.0,
            borderTopLeftRadius: width * 0.05,
            borderTopRightRadius: width * 0.05,
          }}
        >
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
                fontSize: width * 0.05,
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
                  fontSize: width * 0.05,
                  fontWeight: "700",
                }}
              >
                ₱{computedPrice.toFixed(2)}
              </Text>
              <Text
                style={{
                  color: "#f4d03f",
                  fontSize: width * 0.027,
                }}
              >
                Base price
              </Text>
            </View>
          </View>

          <Text
            style={{
              color: "#ccc",
              fontSize: width * 0.035,
              marginBottom: height * 0.02,
              lineHeight: height * 0.035,
            }}
          >
            {description}
          </Text>
          <View
            style={{
              borderBottomColor: "rgba(255,255,255,0.3)",
              borderBottomWidth: height * 0.0015,
              marginBottom: height * 0.025,
            }}
          />

          {/* Servings */}
          {category !== "Dessert" && category !== "Drinks" && (
            <>
              <View style={{ marginBottom: height * 0.02 }}>
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
                      fontWeight: "600",
                    }}
                  >
                    Servings
                  </Text>
                </View>

                {servingOptions.map((option) => (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: height * 0.025,
                    }}
                    key={option.label}
                  >
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <TouchableOpacity
                        onPress={() => setSelectedServing(option.label as any)}
                      >
                        <View
                          style={[
                            {
                              width: width * 0.05,
                              height: width * 0.05,
                              borderRadius: width * 0.025,
                              borderWidth: height * 0.003,
                              borderColor: "#999",
                              justifyContent: "center",
                              alignItems: "center",
                              marginRight: width * 0.03,
                            },
                            selectedServing === option.label && {
                              borderColor: "#ff3b30",
                            },
                          ]}
                        >
                          {selectedServing === option.label && (
                            <View
                              style={{
                                width: width * 0.025,
                                height: width * 0.025,
                                borderRadius: width * 0.0125,
                                backgroundColor: "#ff3b30",
                              }}
                            />
                          )}
                        </View>
                      </TouchableOpacity>
                      <Text
                        style={{
                          color: "#fff",
                          fontSize: width * 0.04,
                        }}
                      >
                        {option.label}
                      </Text>
                    </View>
                    <Text
                      style={{
                        color: "#fff",
                        fontSize: width * 0.04,
                      }}
                    >
                      {option.price === 0
                        ? "0.00"
                        : `+${option.price.toFixed(2)}`}
                    </Text>
                  </View>
                ))}
              </View>
              <View
                style={{
                  borderBottomColor: "rgba(255,255,255,0.3)",
                  borderBottomWidth: height * 0.0015,
                  marginBottom: height * 0.025,
                }}
              />
            </>
          )}

          {/* Note */}
          <View style={{ marginBottom: height * 0.04 }}>
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
                  fontWeight: "600",
                }}
              >
                Note to restaurant
              </Text>
            </View>
            <TextInput
              style={{
                backgroundColor: "transparent",
                color: "#fff",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.3)",
                borderRadius: width * 0.03,
                padding: height * 0.02,
                marginTop: height * 0.02,
                fontSize: width * 0.035,
                height: height * 0.12,
                textAlignVertical: "top",
              }}
              value={note}
              placeholder="Specify any additional requests"
              placeholderTextColor="#999"
              multiline
              onChangeText={setNote}
            />
          </View>

          {/* Quantity */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              // paddingBottom: height * 0.12,
            }}
          >
            <TouchableOpacity
              onPress={() => handleQuantityChange(-1)}
              disabled={quantity === 1}
              style={[
                {
                  borderWidth: height * 0.004,
                  borderColor: "#fff",
                  borderRadius: width * 0.15,
                  width: width * 0.1,
                  height: width * 0.1,
                  justifyContent: "center",
                  alignItems: "center",
                },
                quantity === 1 && { opacity: 0.3 },
              ]}
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
                fontSize: width * 0.05,
                fontWeight: "600",
                marginHorizontal: width * 0.08,
              }}
            >
              {quantity}
            </Text>
            <TouchableOpacity
              onPress={() => handleQuantityChange(1)}
              style={{
                borderWidth: height * 0.004,
                borderColor: "#fff",
                borderRadius: width * 0.15,
                width: width * 0.1,
                height: width * 0.1,
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
      </KeyboardAwareScrollView>

      <View
        style={{
          paddingHorizontal: width * 0.05,
          paddingBottom: 30,
          paddingTop: 15,
        }}
      >
        {/* Update Button */}
        <TouchableOpacity
          style={{
            backgroundColor: "#8B0000",
            paddingVertical: 20,
            borderRadius: 20,
            alignItems: "center",
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

export default CustomizationScreen;
