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
import { appetizers, desserts, drinks, mainCourse } from "../data/menu";

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
        return appetizers;
      case "Main Course":
        return mainCourse;
      case "Desserts":
        return desserts;
      case "Drinks":
        return drinks;
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  const renderMenuItem = ({ item }: { item: MenuItem }) => (
    <View style={styles.menuCard}>
      <Image source={item.image} style={styles.menuImage} />
      <Text style={styles.menuItemName}>{item.name}</Text>
      <Text style={styles.menuItemPrice}>₱{item.price.toFixed(2)}</Text>
    </View>
  );

  return (
    <View style={styles.mainContainer}>
      <MainBackground
        width={width}
        height={height}
        preserveAspectRatio="none"
        style={styles.bg}
      />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
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
          contentContainerStyle={{
            paddingTop: 10,
            paddingHorizontal: width * 0.05,
            paddingBottom: 20,
          }}
        >
          {Object.entries(menuItems as Record<string, MenuItem[]>).map(
            ([section, items]) => (
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
            )
          )}
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
    paddingBottom: 15,
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
