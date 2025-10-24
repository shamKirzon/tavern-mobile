import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
  Animated,
  ScrollView,
} from "react-native";
import { width, height } from "../utils/dimensions";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamLists } from "../types/rootStackParamLists";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import MainBackground from "../assets/backgrounds/main-background.svg";

type MenuViewingScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamLists,
  "MenuViewingScreen"
>;

type MenuViewingScreenRouteProp = RouteProp<
  RootStackParamLists,
  "MenuViewingScreen"
>;

interface Props {
  navigation: MenuViewingScreenNavigationProp;
  route: MenuViewingScreenRouteProp;
}

interface MenuItem {
  name: string;
  price: number;
  image: any;
}

const MenuViewingScreen: React.FC<Props> = ({ navigation, route }) => {
  const { category } = route.params;

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
    }).start();

    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 700,
      useNativeDriver: true,
    }).start();
  }, []);

  const getMenuItems = (): Record<string, MenuItem[]> | MenuItem[] => {
    switch (category) {
      case "Appetizer":
        return [
          { name: "Pork Symphony from the Highlands", price: 395.0, image: require("../assets/images/appetizer/pork-symphony.jpg") },
          { name: "Crispy Bagnet Delight with Toasted Soy Curd", price: 265.0, image: require("../assets/images/appetizer/crispy-bagnet.jpg") },
          { name: "Seared Squid Discs in Spiced Sambal Emulsion", price: 495.0, image: require("../assets/images/appetizer/sambal-squid.jpg") },
          { name: "Peppery Squid Fritters", price: 300.0, image: require("../assets/images/appetizer/peppery-squid.jpg") },
          { name: "Crispy Pork Sisig Rhapsody Nachos", price: 395.0, image: require("../assets/images/appetizer/nachos-con-queso.jpg") },
          { name: "Nachos con Queso y Fuego", price: 415.0, image: require("../assets/images/appetizer/nachos-fuego.jpg") },
          { name: "Salsa and Chips", price: 125.0, image: require("../assets/images/appetizer/salsa-chips.jpg") },
        ];
      case "Main Course":
        return [
          { name: "Creamy Bangus en Casserole", price: 495.0, image: require("../assets/images/maincourse/creamy-bangus.jpg") },
          { name: "Gochugang-kissed Shrimp Poppers", price: 495.0, image: require("../assets/images/maincourse/shrimp-poppers.jpg") },
          { name: "Pork Sisig Fritters with Liver pate mayo", price: 395.0, image: require("../assets/images/maincourse/pork-sisig.jpg") },
          { name: "Crispy Pork Hock with Spiced Vinegar Sauce", price: 995.0, image: require("../assets/images/maincourse/crispy-pork.png") },
          { name: "Beef A La Bourguignon with Potato Puree", price: 725.0, image: require("../assets/images/maincourse/beef-potato.jpg") },
          { name: "Pollo a la Brasa con Aji Verde", price: 415.0, image: require("../assets/images/maincourse/pollo-verde.jpg") },
          { name: "Lemon Herbed Chicken w/ Patates Sto fourno", price: 415.0, image: require("../assets/images/maincourse/lemon-chicken.png") },
          { name: "Southwestern-Style Fried Chicken", price: 415.0, image: require("../assets/images/maincourse/fried-chicken.jpg") },
          { name: "Savoury Bulgogi Slices with Fermented Kimchi Relish", price: 375.0, image: require("../assets/images/maincourse/bulgogi-beef.jpg") },
        ];
      case "Desserts":
        return [
          { name: "Cheesecake Slice", price: 150.0, image: require("../assets/images/desserts-category.jpg") },
          { name: "Chocolate Lava Cake", price: 200.0, image: require("../assets/images/desserts-category.jpg") },
          { name: "Banoffee Pie", price: 180.0, image: require("../assets/images/desserts-category.jpg") },
          { name: "Tiramisu Cup", price: 190.0, image: require("../assets/images/desserts-category.jpg") },
          { name: "Brownie Fudge", price: 160.0, image: require("../assets/images/desserts-category.jpg") },
          { name: "Caramel Pudding", price: 140.0, image: require("../assets/images/desserts-category.jpg") },
        ];
      case "Drinks":
        return {
          Cocktails: [
            { name: "Old Fashioned", price: 355.0, image: require("../assets/images/drinks/old-fashioned.jpg") },
            { name: "Margarita", price: 355.0, image: require("../assets/images/drinks/margarita.jpg") },
            { name: "Cosmopolitan", price: 355.0, image: require("../assets/images/drinks/cosmopolitan.jpg") },
            { name: "Tequila Sunrise", price: 355.0, image: require("../assets/images/drinks/tequila.jpg") },
            { name: "Amaretto Sour", price: 335.0, image: require("../assets/images/drinks/amaretto.jpg") },
            { name: "Whiskey Sour", price: 355.0, image: require("../assets/images/drinks/whiskey.jpg") },
            { name: "Mojito", price: 355.0, image: require("../assets/images/drinks/mojito.jpg") },
            { name: "Negroni", price: 355.0, image: require("../assets/images/drinks/negroni.jpg") },
            { name: "Sangria", price: 355.0, image: require("../assets/images/drinks/sangria.jpg") },
            { name: "Bespoke Cocktail", price: 450.0, image: require("../assets/images/drinks/bespoke.jpg") },
          ],
          Beer: [
            { name: "Flavored Beer Pint", price: 240.0, image: require("../assets/images/drinks/beer-pint.jpg") },
            { name: "Flavored Beer Big Ass", price: 380.0, image: require("../assets/images/drinks/beer-big-ass.jpg") },
            { name: "Flavored Beer Barrel", price: 950.0, image: require("../assets/images/drinks/beer-barrel.jpg") },
            { name: "San Miguel Light", price: 110.0, image: require("../assets/images/drinks/sm-light.jpg") },
            { name: "San Miguel Pale Pilsen", price: 110.0, image: require("../assets/images/drinks/pilsen.jpg") },
            { name: "San Miguel Super Dry", price: 170.0, image: require("../assets/images/drinks/superdry.jpg") },
            { name: "Red Horse", price: 110.0, image: require("../assets/images/drinks/redhorse.jpg") },
            { name: "Beer Bucket", price: 590.0, image: require("../assets/images/drinks/bucket.jpg") },
          ],
          "Non-Alcoholic": [
            { name: "Coke Regular", price: 80.0, image: require("../assets/images/drinks/coke.jpg") },
            { name: "Coke Zero", price: 80.0, image: require("../assets/images/drinks/coke-zero.jpg") },
            { name: "Sprite Regular", price: 80.0, image: require("../assets/images/drinks/sprite.jpg") },
            { name: "Bottled Water", price: 60.0, image: require("../assets/images/drinks/water.jpg") },
            { name: "Canada Dry Ginger Ale", price: 150.0, image: require("../assets/images/drinks/ginger.jpg") },
            { name: "Schweppes Tonic Water", price: 90.0, image: require("../assets/images/drinks/tonic.jpg") },
            { name: "Schweppes Soda Water", price: 100.0, image: require("../assets/images/drinks/soda.jpg") },
            { name: "Red Bull", price: 180.0, image: require("../assets/images/drinks/red-bull.jpg") },
          ],
        };
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  const renderMenuItem = ({ item }: { item: MenuItem }) => (
    <TouchableOpacity style={styles.menuCard}>
      <Image source={item.image} style={styles.menuImage} />
      <Text style={styles.menuItemName}>{item.name}</Text>
      <Text style={styles.menuItemPrice}>₱{item.price.toFixed(2)}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.mainContainer}>
      <MainBackground width={width} height={height} preserveAspectRatio="none" style={styles.bg} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>

          <Animated.Text
            style={[
              styles.title,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
            ]}
          >
            {category}
          </Animated.Text>
        </View>

        {/* Line divider under header */}
        <View style={styles.headerLine} />
      </View>

      {category === "Drinks" ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: width * 0.05, paddingBottom: 20 }}
        >
          {Object.entries(menuItems as Record<string, MenuItem[]>).map(([section, items]) => (
            <View key={section}>
              <Text style={styles.sectionTitle}>{section}</Text>
              <FlatList
                data={items}
                renderItem={renderMenuItem}
                keyExtractor={(item, index) => index.toString()}
                numColumns={2}
                columnWrapperStyle={styles.columnWrapper}
                scrollEnabled={false}
              />
            </View>
          ))}
        </ScrollView>
      ) : (
        <FlatList
          data={menuItems as MenuItem[]}
          renderItem={renderMenuItem}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
          contentContainerStyle={styles.listContainer}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    width,
    height,
    flex: 1,
    paddingTop: height * 0.06,
  },
  bg: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  header: {
    paddingHorizontal: width * 0.05,
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    width: 35,
    height: 35,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  backText: {
    color: "white",
    fontSize: width * 0.09,
    fontWeight: "600",
  },
  title: {
    color: "white",
    fontSize: width * 0.08,
    fontWeight: "bold",
  },
  headerLine: {
    height: 1,
    backgroundColor: "white",
    opacity: 0.3,
    marginTop: 25,
  },
  listContainer: {
    paddingHorizontal: width * 0.05,
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  sectionTitle: {
    color: "white",
    fontSize: width * 0.065,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 10,
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
});

export default MenuViewingScreen;