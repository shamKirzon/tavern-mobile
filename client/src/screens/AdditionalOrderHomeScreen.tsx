import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Keyboard,
} from "react-native";
import { width, height, paddingTop } from "../utils/dimensions";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamLists } from "../types/rootStackParamLists";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import MainBackground from "../assets/backgrounds/main-background.svg";
import Appetizer from "../assets/images/appetizer.svg";
import MainCourse from "../assets/images/main-course.svg";
import Dessert from "../assets/images/dessert.svg";
import Drinks from "../assets/images/drinks.svg";
import Basket from "../assets/images/basket.svg";

import { appetizers, mainCourse, desserts, drinks } from "../data/menu";
import { useOrderStore } from "../stores/useOrderStore";

type AdditionalOrderHomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamLists,
  "AdditionalOrderHomeScreen"
>;

type AdditionalOrderHomeScreenRouteProp = RouteProp<
  RootStackParamLists,
  "AdditionalOrderHomeScreen"
>;

interface Props {
  navigation: AdditionalOrderHomeScreenNavigationProp;
  route: AdditionalOrderHomeScreenRouteProp;
}

const AdditionalOrderHomeScreen: React.FC<Props> = ({ navigation, route }) => {
  const { qrResult, isValid } = route.params;

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

    return null;
  };

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
    navigation.navigate("AdditionalOrderCustomizationScreen", {
      order,
      from: "AdditionalOrderHome",
      qrResult,
      isValid,
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

      {/* HEADER */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: paddingTop,
          marginBottom: height * 0.02,
          paddingHorizontal: width * 0.05,
        }}
      >
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("StaffQRResultScreen", { isValid, qrResult })
          }
          style={{
            width: width * 0.09,
            height: width * 0.09,
            justifyContent: "center",
            alignItems: "center",
            marginRight: width * 0.025,
          }}
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
            color: "#FFF",
            fontSize: width * 0.07,
            fontWeight: "700",
          }}
        >
          Back
        </Text>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={{ width: "100%" }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled" // para maclick muna yung content nang di umaalis sa keyboard
        contentContainerStyle={{ alignItems: "center", paddingBottom: 100 }}
      >
        <View style={styles.content}>
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

      <TouchableOpacity
        style={styles.basketBar}
        onPress={() =>
          navigation.navigate("AdditionalOrderCartScreen", {
            qrResult,
            isValid,
          })
        }
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
  },
  bg: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  content: {
    width: "90%",
    alignItems: "center",
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
    bottom: height * 0.0125,
    left: width * 0.3,
    backgroundColor: "#4A0A0A",
    width: width * 0.0875,
    height: width * 0.0875,
    borderRadius: width * 0.05,
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

export default AdditionalOrderHomeScreen;
