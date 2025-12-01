import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  Animated,
  ScrollView,
  Platform,
  StatusBar,
} from "react-native";
import { width, height, paddingTop } from "../utils/dimensions";
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
    <View
      style={{
        width: "48%",
        marginBottom: height * 0.04,
      }}
    >
      <Image
        source={item.image}
        style={{
          width: "100%",
          height: height * 0.25,
          borderRadius: width * 0.04,
        }}
      />
      <Text
        style={{
          color: "white",
          fontSize: width * 0.045,
          fontWeight: "bold",
          marginTop: height * 0.01,
        }}
      >
        {item.name}
      </Text>
      <Text
        style={{
          color: "white",
          fontSize: width * 0.04,
          opacity: 0.8,
        }}
      >
        ₱{item.price.toFixed(2)}
      </Text>
    </View>
  );

  return (
    <View
      style={{
        width,
        height,
        flex: 1,
      }}
    >
      <MainBackground
        width={width}
        height={height}
        preserveAspectRatio="none"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
        }}
      />

      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingTop: paddingTop,
          marginBottom: height * 0.01,
          paddingHorizontal: width * 0.05,
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
          {category}
        </Text>
      </View>

      {category === "Drinks" ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingTop: height * 0.015,
            paddingHorizontal: width * 0.05,
            paddingBottom: height * 0.03,
          }}
        >
          {Object.entries(menuItems as Record<string, MenuItem[]>).map(
            ([section, items]) => (
              <View key={section}>
                <Text
                  style={{
                    color: "white",
                    fontSize: width * 0.065,
                    fontWeight: "bold",
                    marginTop: height * 0.02,
                    marginBottom: height * 0.015,
                  }}
                >
                  {section}
                </Text>
                <FlatList
                  data={items}
                  renderItem={renderMenuItem}
                  keyExtractor={(item, index) => index.toString()}
                  numColumns={2}
                  columnWrapperStyle={{
                    justifyContent: "space-between",
                  }}
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
          contentContainerStyle={{
            paddingHorizontal: width * 0.05,
            paddingBottom: height * 0.03,
          }}
          columnWrapperStyle={{
            justifyContent: "space-between",
          }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default MenuViewingScreen;
