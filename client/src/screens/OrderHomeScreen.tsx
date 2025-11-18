import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  LayoutChangeEvent,
  Keyboard,
} from "react-native";
import { width, height } from "../utils/dimensions";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamLists } from "../types/rootStackParamLists";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAuthStore } from "../stores/useAuthStore";
import MainBackground from "../assets/backgrounds/main-background.svg";
import SearchIcon from "../assets/images/search.svg";
import Promo1 from "../assets/images/promo1.svg";
import Promo2 from "../assets/images/promo2.svg";
import Appetizer from "../assets/images/appetizer.svg";
import MainCourse from "../assets/images/main-course.svg";
import Dessert from "../assets/images/dessert.svg";
import Drinks from "../assets/images/drinks.svg";
import Basket from "../assets/images/basket.svg";

import { appetizers, mainCourse, desserts, drinks } from "../data/menu";
import { useOrderStore } from "../stores/useOrderStore";

type OrderHomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamLists,
  "OrderHomeScreen"
>;

type OrderHomeScreenRouteProp = RouteProp<
  RootStackParamLists,
  "OrderHomeScreen"
>;

interface Props {
  navigation: OrderHomeScreenNavigationProp;
  route: OrderHomeScreenRouteProp;
}

const OrderHomeScreen: React.FC<Props> = ({ navigation, route }) => {
  const { orders } = useOrderStore();
  const allDrinks = Object.values(drinks).flat();
  const menuData = [...appetizers, ...mainCourse, ...desserts, ...allDrinks];

  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filteredData, setFilteredData] = useState(menuData);

  const itemPositions = useRef<{ [key: string]: number }>({});
  const scrollViewRef = useRef<ScrollView | null>(null);

  const filteredCategories =
    selectedCategory === null
      ? ["Appetizer", "MainCourse", "Dessert", "Drinks"]
      : [selectedCategory];

  const getCategory = (result: any) => {
    if (appetizers.find((item) => item.name === result.name))
      return "Appetizer";
    if (mainCourse.find((item) => item.name === result.name))
      return "MainCourse";
    if (desserts.find((item) => item.name === result.name)) return "Dessert";
    if (
      Object.values(drinks)
        .flat()
        .find((item) => item.name === result.name)
    )
      return "Drinks";

    return null; // not found
  };

  // testing part:
  // useEffect(() => {
  //   console.info("updated orders", orders);
  // }, [orders]);

  // functions:

  function isOrderExisting(name: string): boolean {
    return orders.orderItems.some((item) => item.orderName === name);
  }

  const handleSearch = (text: string) => {
    setQuery(text);
    if (text.trim() === "") {
      setFilteredData([]);
    } else {
      const result = menuData.filter((item) =>
        item.name.toLowerCase().includes(text.toLowerCase())
      );

      setFilteredData(result);
    }
  };

  const onSearchResultPress = (result: any) => {
    const resultCategory = getCategory(result);
    setSelectedCategory(resultCategory);
    Keyboard.dismiss();
    setQuery("");

    setTimeout(() => {
      const y = itemPositions.current[result.name];
      if (y !== undefined && scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ y: y + 100, animated: true });
      }
    }, 300);
  };

  const handleCustomizeOrder = (order: any) => {
    navigation.navigate("CustomizationScreen", {
      order,
      from: "OrderHomeScreen",
    });
  };

  return (
    <View style={styles.mainContainer}>
      <MainBackground
        width={width}
        height={height}
        preserveAspectRatio="none"
        style={styles.bg}
      />
      <ScrollView
        ref={scrollViewRef}
        style={{ width: "100%" }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled" // para maclick muna yung content nang di umaalis sa keyboard
        contentContainerStyle={{ alignItems: "center", paddingBottom: 100 }}
      >
        <View style={styles.content}>
          <Text style={styles.menuTitle}>Welcome to Tavern Asia!</Text>
          {/* search bar */}
          <View style={styles.searchContainer}>
            <SearchIcon width={22} height={22} style={{ marginRight: 1 }} />
            <TextInput
              placeholder="What food do you crave?"
              placeholderTextColor="#999"
              onChangeText={handleSearch}
              style={[
                styles.input,
                {
                  flex: 1,
                  marginBottom: 0,
                  backgroundColor: "transparent",
                  color: "#000",
                },
              ]}
            />
          </View>

          {/* search results */}
          {query.trim() !== "" && (
            <View style={styles.dropdownContainer}>
              {filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => onSearchResultPress(item)}
                    style={styles.dropdownItem}
                    activeOpacity={0.8}
                  >
                    <SearchIcon
                      width={22}
                      height={22}
                      style={{ marginRight: 10 }}
                    />
                    <Text style={styles.dropdownText}>{item.name}</Text>
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.noResult}>No results found</Text>
              )}
            </View>
          )}

          {/* special promos */}
          <Text style={styles.menuTitle}>Special Promos</Text>
          <View style={{ width: "100%", height: 147, marginBottom: 25 }}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              // keyboardShouldPersistTaps="handled" // or "always" - di ko alam kung gumagana ba to
              pagingEnabled
              snapToAlignment="center"
              decelerationRate="fast"
              contentContainerStyle={{ paddingHorizontal: 10 }}
            >
              <View style={styles.promoCard}>
                <Promo1 width="100%" height="100%" />
              </View>
              <View style={styles.promoCard}>
                <Promo2 width="100%" height="100%" />
              </View>
            </ScrollView>
          </View>
          {/* Category Icons */}
          <View style={styles.categoryContainer}>
            <TouchableOpacity
              style={[
                styles.categoryCard,
                {
                  backgroundColor:
                    selectedCategory === "Appetizer" ? "#A72D2D" : "#3C2415",
                },
              ]}
              onPress={() => setSelectedCategory("Appetizer")}
            >
              <Appetizer width={45} height={45} />
              <Text style={styles.categoryText}>Appetizer</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.categoryCard,
                {
                  backgroundColor:
                    selectedCategory === "MainCourse" ? "#A72D2D" : "#3C2415",
                },
              ]}
              onPress={() => setSelectedCategory("MainCourse")}
            >
              <MainCourse width={45} height={45} />
              <Text style={styles.categoryText}>Main Course</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.categoryCard,
                {
                  backgroundColor:
                    selectedCategory === "Dessert" ? "#A72D2D" : "#3C2415",
                },
              ]}
              onPress={() => setSelectedCategory("Dessert")}
            >
              <Dessert width={45} height={45} />
              <Text style={styles.categoryText}>Dessert</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.categoryCard,
                {
                  backgroundColor:
                    selectedCategory === "Drinks" ? "#A72D2D" : "#3C2415",
                },
              ]}
              onPress={() => setSelectedCategory("Drinks")}
            >
              <Drinks width={45} height={45} />
              <Text style={styles.categoryText}>Drinks</Text>
            </TouchableOpacity>
          </View>
          {/* Menu Sections */}

          {/* Appetizer section */}
          {filteredCategories.includes("Appetizer") && (
            <>
              <View>
                <Text style={styles.menuTtitle}>Appetizer</Text>
              </View>
              <View style={styles.menuGrid}>
                {appetizers.map((item, index) => (
                  <View
                    key={index}
                    style={styles.menuCard}
                    onLayout={(e) => {
                      itemPositions.current[item.name] = e.nativeEvent.layout.y;
                    }}
                  >
                    <View>
                      <Image source={item.image} style={styles.menuImage} />
                      <TouchableOpacity
                        style={[
                          styles.plusButton,
                          isOrderExisting(item.name) && { opacity: 0.5 },
                        ]}
                        disabled={isOrderExisting(item.name)}
                        onPress={() => handleCustomizeOrder(item)}
                      >
                        <Text style={styles.plusText}>+</Text>
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.menuItemName}>{item.name}</Text>
                    <Text style={styles.menuItemPrice}>
                      ₱{item.price.toFixed(2)}
                    </Text>
                  </View>
                ))}
              </View>
            </>
          )}

          {/* MainCourse section */}
          {filteredCategories.includes("MainCourse") && (
            <>
              <View>
                <Text style={styles.menuTtitle}>Main Course</Text>
              </View>
              <View style={styles.menuGrid}>
                {mainCourse.map((item, index) => (
                  <View
                    key={index}
                    style={styles.menuCard}
                    onLayout={(e) => {
                      itemPositions.current[item.name] = e.nativeEvent.layout.y;
                    }}
                  >
                    <View>
                      <Image source={item.image} style={styles.menuImage} />
                      <TouchableOpacity
                        style={[
                          styles.plusButton,
                          isOrderExisting(item.name) && { opacity: 0.5 },
                        ]}
                        disabled={isOrderExisting(item.name)}
                        onPress={() => handleCustomizeOrder(item)}
                      >
                        <Text style={styles.plusText}>+</Text>
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.menuItemName}>{item.name}</Text>
                    <Text style={styles.menuItemPrice}>
                      ₱{item.price.toFixed(2)}
                    </Text>
                  </View>
                ))}
              </View>
            </>
          )}

          {/* Dessert section */}
          {filteredCategories.includes("Dessert") && (
            <>
              <View>
                <Text style={styles.menuTtitle}>Dessert</Text>
              </View>
              <View style={styles.menuGrid}>
                {desserts.map((item, index) => (
                  <View
                    key={index}
                    style={styles.menuCard}
                    onLayout={(e) => {
                      itemPositions.current[item.name] = e.nativeEvent.layout.y;
                    }}
                  >
                    <View>
                      <Image source={item.image} style={styles.menuImage} />
                      <TouchableOpacity
                        style={[
                          styles.plusButton,
                          isOrderExisting(item.name) && { opacity: 0.5 },
                        ]}
                        disabled={isOrderExisting(item.name)}
                        onPress={() => handleCustomizeOrder(item)}
                      >
                        <Text style={styles.plusText}>+</Text>
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.menuItemName}>{item.name}</Text>
                    <Text style={styles.menuItemPrice}>
                      ₱{item.price.toFixed(2)}
                    </Text>
                  </View>
                ))}
              </View>
            </>
          )}

          {/* Drinks  section */}
          {filteredCategories.includes("Drinks") && (
            <>
              <View>
                <Text style={styles.menuTtitle}>Drinks</Text>
              </View>
              <View style={styles.menuGrid}>
                {Object.values(drinks)
                  .flat()
                  .map((item: any, index) => (
                    <View
                      key={index}
                      style={styles.menuCard}
                      onLayout={(e) => {
                        itemPositions.current[item.name] =
                          e.nativeEvent.layout.y;
                      }}
                    >
                      <View>
                        <Image source={item.image} style={styles.menuImage} />
                        <TouchableOpacity
                          style={[
                            styles.plusButton,
                            isOrderExisting(item.name) && { opacity: 0.5 },
                          ]}
                          disabled={isOrderExisting(item.name)}
                          onPress={() => handleCustomizeOrder(item)}
                        >
                          <Text style={styles.plusText}>+</Text>
                        </TouchableOpacity>
                      </View>
                      <Text style={styles.menuItemName}>{item.name}</Text>
                      <Text style={styles.menuItemPrice}>
                        ₱{item.price.toFixed(2)}
                      </Text>
                    </View>
                  ))}
              </View>
            </>
          )}
        </View>
      </ScrollView>

      {/* 🟢 Fixed Basket Bar at bottom */}
      <TouchableOpacity
        style={styles.basketBar}
        onPress={() => navigation.navigate("CartScreen")}
      >
        <Basket width={28} height={28} style={{ marginRight: 8 }} />
        <Text style={styles.basketText}>Basket</Text>
        <Text style={styles.basketItems}>{orders.orderItems.length} items</Text>
        <View style={{ flex: 1 }} />
        <Text style={styles.basketPrice}>
          ₱ {orders.total?.toFixed(2).toLocaleString()}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    width,
    height,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  bg: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  content: {
    width: "90%",
    alignItems: "center",
    marginTop: height * 0.08,
  },
  input: {
    width: "100%",
    backgroundColor: "white",
    color: "#333",
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
    fontSize: width * 0.04,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 4,
    marginBottom: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    width: width * 0.9,
  },
  menuTitle: {
    color: "white",
    fontSize: width * 0.08,
    fontWeight: "bold",
    marginBottom: 10,
    alignSelf: "flex-start",
    marginLeft: 5,
  },
  menuTtitle: {
    color: "white",
    fontSize: width * 0.08,
    fontWeight: "bold",
    marginBottom: 10,
    marginLeft: -165,
  },
  promoCard: {
    width: width * 0.8,
    height: "100%",
    borderRadius: 15,
    overflow: "hidden",
    marginRight: 15,
    backgroundColor: "#fff",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  categoryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 2,
    marginTop: 10,
    marginBottom: 25,
  },
  categoryCard: {
    flex: 1,
    marginHorizontal: 5,
    aspectRatio: 1,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryText: {
    color: "white",
    fontWeight: "bold",
    fontSize: width * 0.03,
    marginTop: 5,
    textAlign: "center",
  },
  menuGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 10,
  },
  menuCard: {
    width: "48%",
    marginBottom: 25,
  },
  menuImage: {
    width: "100%",
    height: 180,
    borderRadius: 15,
  },
  plusButton: {
    position: "absolute",
    bottom: 10,
    left: 115,
    backgroundColor: "#4A0A0A",
    width: 35,
    height: 35,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  plusText: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    lineHeight: 24,
  },
  basketBar: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#8A1717",
    width: "90%",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 15,
    elevation: 10,
  },
  basketText: {
    color: "white",
    fontSize: width * 0.045,
    fontWeight: "bold",
  },
  basketItems: {
    color: "white",
    fontSize: width * 0.04,
    marginLeft: 10,
    opacity: 0.8,
  },
  basketPrice: {
    color: "white",
    fontSize: width * 0.045,
    fontWeight: "bold",
  },
  menuItemName: {
    color: "white",
    fontSize: width * 0.045,
    fontWeight: "bold",
    marginTop: 8,
  },
  menuItemPrice: {
    color: "white",
    fontSize: width * 0.04,
    opacity: 0.8,
  },
  // results:
  dropdownContainer: {
    position: "absolute", // overlay other content
    marginTop: height * 0.14, // adjust depending on search bar height
    left: 0, // align with search bar start
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 999,
    paddingVertical: 8,
    paddingRight: 40,
    width: width * 0.9,
  },

  dropdownItem: {
    flexDirection: "row",
    alignContent: "center",
    textAlign: "center",

    paddingVertical: 10,
    paddingLeft: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  dropdownText: {
    fontSize: 16,
    color: "#111",
  },

  noResult: {
    textAlign: "center",
    color: "#999",
    paddingVertical: 10,
    fontSize: 16,
  },
});

export default OrderHomeScreen;
