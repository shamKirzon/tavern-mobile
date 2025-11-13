import React, { useState, useRef } from "react";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamLists } from "../types/rootStackParamLists";
import { height, width } from "../utils/dimensions";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Animated,
  Modal,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import MainBackground from "../assets/backgrounds/main-background.svg";

type CartScreenRouteProps = RouteProp<RootStackParamLists, "CartScreen">;
type CartScreenNavigationProps = NativeStackNavigationProp<
  RootStackParamLists,
  "CartScreen"
>;

interface Props {
  route: CartScreenRouteProps;
  navigation: CartScreenNavigationProps;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: any;
}

const HEADER_MAX_HEIGHT = height * 0.25;
const HEADER_MIN_HEIGHT = 90;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const CartScreen: React.FC<Props> = ({ route, navigation }) => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: "1",
      name: "Tav Special Pork Sisig",
      price: 3845.0,
      quantity: 1,
      image: require("../assets/images/maincourse/pork-sisig.jpg"),
    },
    {
      id: "2",
      name: "Tav Chicken Fingers Platter",
      price: 2202.0,
      quantity: 1,
      image: require("../assets/images/maincourse/fried-chicken.jpg"),
    },
    {
      id: "3",
      name: "Chili Ballpark Nachos",
      price: 305.0,
      quantity: 1,
      image: require("../assets/images/appetizer/nachos-con-queso.jpg"),
    },
    {
      id: "4",
      name: "Crispy Bagnet",
      price: 450.0,
      quantity: 2,
      image: require("../assets/images/appetizer/crispy-bagnet.jpg"),
    },
    {
      id: "5",
      name: "Beef Potato",
      price: 520.0,
      quantity: 1,
      image: require("../assets/images/maincourse/beef-potato.jpg"),
    },
    {
      id: "6",
      name: "Bulgogi Beef",
      price: 680.0,
      quantity: 1,
      image: require("../assets/images/maincourse/bulgogi-beef.jpg"),
    },
    {
      id: "7",
      name: "Creamy Bangus",
      price: 395.0,
      quantity: 2,
      image: require("../assets/images/maincourse/creamy-bangus.jpg"),
    },
    {
      id: "8",
      name: "Peppery Squid",
      price: 420.0,
      quantity: 1,
      image: require("../assets/images/appetizer/peppery-squid.jpg"),
    },
  ]);

  const calculateTotal = () =>
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (itemId: string) => {
    setItemToDelete(itemId);
    setDeleteModalVisible(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      setCartItems((prev) => prev.filter((item) => item.id !== itemToDelete));
    }
    setDeleteModalVisible(false);
    setItemToDelete(null);
  };

  const cancelDelete = () => {
    setDeleteModalVisible(false);
    setItemToDelete(null);
  };

  const editItem = (itemId: string) =>
    navigation.navigate("CustomizationScreen", { order: "" });
  const handleBack = () => navigation.navigate("OrderHomeScreen");
  const handleAddItems = () => console.log("Navigate to add items");
  const handlePlaceOrder = () => console.log("Place order");

  // Animated values
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
    <View style={s.container}>
      <MainBackground width={width} height={height} style={s.background} />

      {/* Animated Header */}
      <Animated.View style={[s.animatedHeader, { height: headerHeight }]}>
        <Animated.View
          style={[
            s.headerImageContainer,
            {
              opacity: imageOpacity,
              transform: [{ translateY: imageTranslate }],
            },
          ]}
        >
          <Image
            source={require("../assets/images/tavernasia-bg.jpg")}
            style={s.headerImage}
            resizeMode="cover"
          />
        </Animated.View>
        <Animated.View
          style={[s.headerDarkOverlay, { opacity: headerBackgroundOpacity }]}
        />
        <View style={s.headerOverlay}>
          <TouchableOpacity style={s.backButton} onPress={handleBack}>
            <Text style={s.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={s.headerTitle}>Menu</Text>
        </View>
      </Animated.View>

      <Animated.ScrollView
        style={s.scrollContainer}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        contentContainerStyle={{ paddingTop: HEADER_MAX_HEIGHT }}
      >
        <View style={s.contentContainer}>
          <View style={s.orderSummaryHeader}>
            <Text style={s.orderSummaryTitle}>Order Summary</Text>
            <TouchableOpacity onPress={handleAddItems}>
              <Text style={s.addItemsText}>Add Items</Text>
            </TouchableOpacity>
          </View>

          {cartItems.length === 0 ? (
            <View style={s.emptyContainer}>
              <Text style={s.emptyTitle}>Your Basket is Empty</Text>
              <Text style={s.emptySubtitle}>
                Add some delicious items to get started!
              </Text>
              <TouchableOpacity style={s.browseButton} onPress={handleAddItems}>
                <Text style={s.browseButtonText}>Browse Menu</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={s.itemsContainer}>
              {cartItems.map((item) => (
                <View key={item.id} style={s.cartItem}>
                  <Image source={item.image} style={s.itemImage} />
                  <View style={s.itemDetails}>
                    <Text style={s.itemName}>{item.name}</Text>
                    <View style={s.buttonRow}>
                      <TouchableOpacity
                        style={s.editButton}
                        onPress={() => editItem(item.id)}
                      >
                        <Text style={s.buttonText}>Edit</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={s.deleteButton}
                        onPress={() => removeItem(item.id)}
                      >
                        <Text style={s.buttonText}>🗑</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={s.itemActions}>
                    <Text style={s.itemPrice}>₱{item.price.toFixed(2)}</Text>
                    <View style={s.quantityBadge}>
                      <Text style={s.quantityText}>{item.quantity}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </Animated.ScrollView>

      {cartItems.length > 0 && (
        <View style={s.bottomSection}>
          <View style={s.totalContainer}>
            <Text style={s.totalLabel}>Total</Text>
            <Text style={s.totalAmount}>₱{calculateTotal().toFixed(2)}</Text>
          </View>
          <TouchableOpacity
            style={s.placeOrderButton}
            onPress={handlePlaceOrder}
          >
            <Text style={s.placeOrderText}>Place Order</Text>
          </TouchableOpacity>
          <View style={s.noticeContainer}>
            <Text style={s.noticeIcon}>⏱</Text>
            <Text style={s.noticeText}>
              Minimum spend is ₱15,000.00. Lorem ipsum dolor sit amet,
              consectetuer adipiscing.
            </Text>
          </View>
        </View>
      )}

      {/* Custom Delete Modal */}
      <Modal
        visible={deleteModalVisible}
        transparent
        animationType="fade"
        onRequestClose={cancelDelete}
      >
        <View style={s.modalOverlay}>
          <View style={s.modalContainer}>
            <Text style={s.modalTitle}>Remove Item</Text>
            <Text style={s.modalMessage}>
              Are you sure you want to remove this item from your basket?
            </Text>
            <View style={s.modalButtons}>
              <TouchableOpacity
                style={s.modalButtonCancel}
                onPress={cancelDelete}
              >
                <Text style={s.modalButtonCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={s.modalButtonRemove}
                onPress={confirmDelete}
              >
                <Text style={s.modalButtonRemoveText}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  background: { position: "absolute", top: 0, left: 0 },
  scrollContainer: { flex: 1 },
  animatedHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    overflow: "hidden",
  },
  headerImageContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  headerImage: { width: "100%", height: "100%" },
  headerDarkOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.85)",
  },
  headerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    alignItems: "flex-start",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  backButton: { marginRight: 15 },
  backArrow: { fontSize: 28, color: "#fff", fontFamily: "Poppins" },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    fontFamily: "Poppins",
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "transparent",
    paddingTop: 20,
    paddingBottom: 20,
  },
  orderSummaryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  orderSummaryTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
    fontFamily: "Poppins",
  },
  addItemsText: { fontSize: 14, color: "#EFD974", fontFamily: "Poppins" },
  itemsContainer: { paddingHorizontal: 20 },
  cartItem: {
    flexDirection: "row",
    backgroundColor: "transparent",
    paddingVertical: 8,
    marginBottom: 8,
    alignItems: "center",
  },
  itemImage: { width: 70, height: 70, borderRadius: 8, marginRight: 12 },
  itemDetails: { flex: 1 },
  itemName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#fff",
    fontFamily: "Poppins",
    marginBottom: 6,
  },
  buttonRow: { flexDirection: "row", gap: 8 },
  editButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#EFD974",
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 20,
    minWidth: 60,
    alignItems: "center",
  },
  deleteButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#EFD974",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    minWidth: 50,
    alignItems: "center",
  },
  buttonText: { fontSize: 12, color: "#fff", fontFamily: "Poppins" },
  itemActions: { alignItems: "flex-end" },
  itemPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    fontFamily: "Poppins",
    marginBottom: 8,
  },
  quantityBadge: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#EFD974",
    borderRadius: 20,
    minWidth: 40,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  quantityText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
    fontFamily: "Poppins",
  },
  bottomSection: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  totalLabel: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
    fontFamily: "Poppins",
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    fontFamily: "Poppins",
  },
  placeOrderButton: {
    backgroundColor: "#8A1717",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 15,
  },
  placeOrderText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    fontFamily: "Poppins",
  },
  noticeContainer: { flexDirection: "row", alignItems: "flex-start" },
  noticeIcon: { fontSize: 14, color: "#fff", marginRight: 8, marginTop: 2 },
  noticeText: {
    flex: 1,
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.6)",
    fontFamily: "Poppins",
    lineHeight: 16,
  },

  // Empty state styles
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    fontFamily: "Poppins",
    marginBottom: 10,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.6)",
    fontFamily: "Poppins",
    textAlign: "center",
    marginBottom: 30,
  },
  browseButton: {
    backgroundColor: "#8A1717",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 12,
  },
  browseButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    fontFamily: "Poppins",
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  modalContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#EFD974",
    padding: 24,
    width: "100%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    fontFamily: "Poppins",
    marginBottom: 12,
    textAlign: "center",
  },
  modalMessage: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    fontFamily: "Poppins",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  modalButtons: { flexDirection: "row", gap: 12 },
  modalButtonCancel: {
    flex: 1,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#fff",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  modalButtonCancelText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
    fontFamily: "Poppins",
  },
  modalButtonRemove: {
    flex: 1,
    backgroundColor: "#8A1717",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  modalButtonRemoveText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
    fontFamily: "Poppins",
  },
});

export default CartScreen;
