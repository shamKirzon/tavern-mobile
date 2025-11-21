import React, { useState, useRef } from "react";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamLists } from "../types/rootStackParamLists";
import { height, width } from "../utils/dimensions";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Animated,
  Modal,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import MainBackground from "../assets/backgrounds/main-background.svg";
import { useOrderStore } from "../stores/useOrderStore";
import { createOrder } from "../services/order";
import Loading from "./ui/Loading";
import { formatCurrency } from "../utils/formatCurrency";

type AdditionalOrderCartScreenRouteProps = RouteProp<
  RootStackParamLists,
  "AdditionalOrderCartScreen"
>;
type AdditionalOrderCartScreenNavigationProps = NativeStackNavigationProp<
  RootStackParamLists,
  "AdditionalOrderCartScreen"
>;

interface Props {
  route: AdditionalOrderCartScreenRouteProps;
  navigation: AdditionalOrderCartScreenNavigationProps;
}

const HEADER_MAX_HEIGHT = height * 0.25;
const HEADER_MIN_HEIGHT = height * 0.12;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const AdditionalOrderCartScreen: React.FC<Props> = ({ route, navigation }) => {
  const { qrResult, isValid } = route.params;

  const { orders, removeOrders, spendLimit } = useOrderStore();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const numericSpendLimit = Number(spendLimit.replace(/,/g, ""));
  const isTotalLessThanSpendLimit = orders.total! < numericSpendLimit;

  const removeItem = (orderName: string) => {
    setItemToDelete(orderName);
    setDeleteModalVisible(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) removeOrders(itemToDelete);
    setDeleteModalVisible(false);
    setItemToDelete(null);
  };

  const cancelDelete = () => {
    setDeleteModalVisible(false);
    setItemToDelete(null);
  };

  const editItem = (order: any) => {
    navigation.navigate("CustomizationScreen", {
      order,
      from: "CartScreen",
    });
  };

  const getSpendStatusMessage = (): React.JSX.Element | null => {
    if (!orders.total) return null;
    const spendMessage =
      orders.total < numericSpendLimit
        ? `You must add more items to reach the minimum spend of ₱${spendLimit}. Any excess amount will be paid at the counter on your reservation date.`
        : `You already achieved the minimum spend of ₱${spendLimit}. Any additional charges will be paid at the counter on the reservation date.`;

    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-start",
          marginTop: width * 0.02,
        }}
      >
        <Text
          style={{
            fontSize: width * 0.035,
            color: "#fff",
            marginRight: width * 0.02,
            marginTop: height * 0.003,
          }}
        />
        <Text
          style={{
            flex: 1,
            fontSize: width * 0.028,
            color: isTotalLessThanSpendLimit
              ? "rgba(255,100,100,0.6)"
              : "rgba(255,255,255,0.6)",
            fontFamily: "Poppins",
            lineHeight: width * 0.04,
          }}
        >
          {spendMessage}
        </Text>
      </View>
    );
  };

  const handleAddItems = () => navigation.goBack();

  const handlePlaceOrder = async () => {
    try {
      navigation.navigate("StaffQRResultScreen", {
        additionalOrder: orders,
        isValid,
        qrResult,
      });
      //   setIsLoading(true);
      // const res = await createOrder(orders);
      // if (!res) return;
      //   navigation.navigate("StaffHomeScreen");/
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: "clamp",
  });

  const imageOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 0.5, 0],
    extrapolate: "clamp",
  });

  const imageTranslate = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, -50],
    extrapolate: "clamp",
  });

  const headerBackgroundOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  return (
    <>
      {isLoading && Loading("Placing Your Orders...")}
      <View style={{ flex: 1, backgroundColor: "#000" }}>
        <MainBackground
          width={width}
          height={height}
          style={{ position: "absolute", top: 0, left: 0 }}
        />

        {/* Animated Header */}
        <Animated.View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 10,
            overflow: "hidden",
            height: headerHeight,
          }}
        >
          <Animated.View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: imageOpacity,
              transform: [{ translateY: imageTranslate }],
            }}
          >
            <Image
              source={require("../assets/images/tavernasia-bg.jpg")}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />
          </Animated.View>

          <Animated.View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.85)",
              opacity: headerBackgroundOpacity,
            }}
          />

          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              flexDirection: "row",
              alignItems: "flex-start",
              paddingTop: height * 0.08,
              paddingHorizontal: width * 0.05,
            }}
          >
            <TouchableOpacity
              style={{ marginRight: width * 0.04 }}
              onPress={() => navigation.goBack()}
            >
              <Text
                style={{
                  color: "#FFF",
                  fontSize: width * 0.08,
                  fontWeight: "300",
                  lineHeight: width * 0.08,
                }}
              >
                ‹
              </Text>
            </TouchableOpacity>
            <Text
              style={{
                fontSize: width * 0.06,
                fontWeight: "700",
                color: "#fff",
                fontFamily: "Poppins",
              }}
            >
              Cart
            </Text>
          </View>
        </Animated.View>

        <Animated.ScrollView
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          contentContainerStyle={{ paddingTop: HEADER_MAX_HEIGHT }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "transparent",
              paddingVertical: height * 0.02,
            }}
          >
            {/* Order Summary Header */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingHorizontal: width * 0.05,
                marginBottom: height * 0.02,
              }}
            >
              <Text
                style={{
                  fontSize: width * 0.05,
                  fontWeight: "600",
                  color: "#fff",
                  fontFamily: "Poppins",
                }}
              >
                Order Summary
              </Text>
              {orders.orderItems.length > 0 && (
                <TouchableOpacity onPress={handleAddItems}>
                  <Text
                    style={{
                      fontSize: width * 0.035,
                      color: "#EFD974",
                      fontFamily: "Poppins",
                    }}
                  >
                    Add Items
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* No Orders */}
            {orders.orderItems.length === 0 ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  paddingVertical: height * 0.1,
                  paddingHorizontal: width * 0.1,
                }}
              >
                <Text
                  style={{
                    fontSize: width * 0.06,
                    fontWeight: "700",
                    color: "#fff",
                    textAlign: "center",
                    marginBottom: height * 0.01,
                  }}
                >
                  Your Basket is Empty
                </Text>
                <Text
                  style={{
                    fontSize: width * 0.035,
                    color: "rgba(255,255,255,0.6)",
                    textAlign: "center",
                    marginBottom: height * 0.03,
                  }}
                >
                  Add some delicious items to get started!
                </Text>
                <TouchableOpacity
                  style={{
                    backgroundColor: "#8A1717",
                    paddingVertical: height * 0.02,
                    paddingHorizontal: width * 0.1,
                    borderRadius: width * 0.03,
                  }}
                  onPress={() => navigation.navigate("OrderHomeScreen")}
                >
                  <Text
                    style={{
                      fontSize: width * 0.04,
                      fontWeight: "600",
                      color: "#fff",
                    }}
                  >
                    Browse Menu
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={{ paddingHorizontal: width * 0.05 }}>
                {orders.orderItems.map((item: any, index) => (
                  <View
                    key={`${item.orderName}-${index}`}
                    style={{
                      flexDirection: "row",
                      backgroundColor: "transparent",
                      paddingVertical: height * 0.01,
                      marginBottom: height * 0.01,
                      alignItems: "center",
                    }}
                  >
                    <Image
                      source={item.image}
                      style={{
                        width: width * 0.17,
                        height: width * 0.17,
                        borderRadius: width * 0.02,
                        marginRight: width * 0.03,
                      }}
                    />
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: width * 0.035,
                          fontWeight: "500",
                          color: "#fff",
                          marginBottom: height * 0.01,
                        }}
                      >
                        {item.orderName}
                      </Text>
                      <View style={{ flexDirection: "row", gap: width * 0.02 }}>
                        <TouchableOpacity
                          style={{
                            backgroundColor: "transparent",
                            borderWidth: 1,
                            borderColor: "#EFD974",
                            paddingHorizontal: width * 0.05,
                            paddingVertical: height * 0.008,
                            borderRadius: width * 0.05,
                            alignItems: "center",
                          }}
                          onPress={() => editItem(item)}
                        >
                          <Text
                            style={{ fontSize: width * 0.03, color: "#fff" }}
                          >
                            Edit
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={{
                            backgroundColor: "transparent",
                            borderWidth: 1,
                            borderColor: "#EFD974",
                            paddingHorizontal: width * 0.03,
                            paddingVertical: height * 0.008,
                            borderRadius: width * 0.05,
                            alignItems: "center",
                          }}
                          onPress={() => removeItem(item.orderName)}
                        >
                          <Text
                            style={{ fontSize: width * 0.03, color: "#fff" }}
                          >
                            🗑
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    <View
                      style={{
                        alignItems: "flex-end",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: width * 0.04,
                          fontWeight: "600",
                          color: "#fff",
                          marginBottom: height * 0.01,
                        }}
                      >
                        ₱{item.total.toFixed(2)}
                      </Text>
                      <View
                        style={{
                          backgroundColor: "transparent",
                          borderWidth: 1,
                          borderColor: "#EFD974",
                          borderRadius: width * 0.05,
                          minWidth: width * 0.1,
                          height: width * 0.08,
                          justifyContent: "center",
                          alignItems: "center",
                          paddingHorizontal: width * 0.03,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: width * 0.03,
                            fontWeight: "600",
                            color: "#fff",
                          }}
                        >
                          {item.quantity}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        </Animated.ScrollView>

        {/* Bottom Section */}
        {orders.orderItems.length > 0 && (
          <View
            style={{
              backgroundColor: "rgba(255,255,255,0.05)",
              paddingHorizontal: width * 0.05,
              paddingTop: height * 0.02,
              paddingBottom: height * 0.03,
              borderTopLeftRadius: width * 0.05,
              borderTopRightRadius: width * 0.05,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: height * 0.03,
              }}
            >
              <Text
                style={{
                  fontSize: width * 0.05,
                  fontWeight: "600",
                  color: "#fff",
                }}
              >
                Total
              </Text>
              <Text
                style={{
                  fontSize: width * 0.06,
                  fontWeight: "700",
                  color: "#fff",
                }}
              >
                ₱ {formatCurrency(orders.total!)}
              </Text>
            </View>

            <TouchableOpacity
              style={{
                backgroundColor: "#8A1717",
                paddingVertical: height * 0.02,
                borderRadius: width * 0.03,
                alignItems: "center",
                marginBottom: height * 0.02,
                opacity: isTotalLessThanSpendLimit ? 0.3 : 1,
              }}
              onPress={handlePlaceOrder}
              disabled={isTotalLessThanSpendLimit}
            >
              <Text
                style={{
                  fontSize: width * 0.04,
                  fontWeight: "600",
                  color: "#fff",
                }}
              >
                Add to Order
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Delete Modal */}
        <Modal
          visible={deleteModalVisible}
          transparent
          animationType="fade"
          onRequestClose={cancelDelete}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.8)",
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: width * 0.08,
            }}
          >
            <View
              style={{
                backgroundColor: "rgba(0,0,0,0.7)",
                borderRadius: width * 0.04,
                borderWidth: 1,
                borderColor: "#EFD974",
                padding: width * 0.06,
                width: "100%",
                maxWidth: width * 0.9,
              }}
            >
              <Text
                style={{
                  fontSize: width * 0.05,
                  fontWeight: "700",
                  color: "#fff",
                  textAlign: "center",
                  marginBottom: height * 0.015,
                }}
              >
                Remove Item
              </Text>
              <Text
                style={{
                  fontSize: width * 0.035,
                  color: "rgba(255,255,255,0.8)",
                  textAlign: "center",
                  marginBottom: height * 0.03,
                  lineHeight: width * 0.04,
                }}
              >
                Are you sure you want to remove this item from your basket?
              </Text>
              <View style={{ flexDirection: "row", gap: width * 0.03 }}>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor: "transparent",
                    borderWidth: 1,
                    borderColor: "#fff",
                    paddingVertical: height * 0.015,
                    borderRadius: width * 0.02,
                    alignItems: "center",
                  }}
                  onPress={cancelDelete}
                >
                  <Text
                    style={{
                      fontSize: width * 0.035,
                      fontWeight: "600",
                      color: "#fff",
                    }}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor: "#8A1717",
                    paddingVertical: height * 0.015,
                    borderRadius: width * 0.02,
                    alignItems: "center",
                  }}
                  onPress={confirmDelete}
                >
                  <Text
                    style={{
                      fontSize: width * 0.035,
                      fontWeight: "600",
                      color: "#fff",
                    }}
                  >
                    Remove
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </>
  );
};

export default AdditionalOrderCartScreen;
