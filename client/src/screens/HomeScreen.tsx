import React, { useState, JSX } from "react";
import Neon from "../assets/icons/neon-logo.svg";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
} from "react-native";

import { width, height } from "../utils/dimensions";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamLists } from "../types/type";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamLists,
  "HomeScreen"
>;
type HomeScreenRouteProp = RouteProp<RootStackParamLists, "HomeScreen">;

interface Props {
  navigation: HomeScreenNavigationProp;
  route: HomeScreenRouteProp;
}

const HomeScreen: React.FC<Props> = ({ navigation, route }) => {
  const { isAuthenticated } = route.params;

  const [email, setEmail] = useState("");

  const handleContinue = () => {
    if (!email.trim()) {
      alert("Please enter your email");
      return;
    }
  };

  // jsx elements
  const authenticatedContent = (): JSX.Element => {
    return (
      <>
        <Text
          style={{
            color: "white",
            fontSize: width * 0.09,
            fontWeight: "bold",
            marginTop: 20,
            marginBottom: 10,
          }}
        >
          waiting for approval
        </Text>

        <TouchableOpacity
          onPress={handleContinue}
          style={{
            backgroundColor: "white",
            paddingVertical: 12,
            paddingHorizontal: 30,
            borderRadius: 10,
          }}
        >
          <Text style={{ color: "#ea580c", fontWeight: "bold" }}>Continue</Text>
        </TouchableOpacity>
      </>
    );
  };
  const notAuthenticatedContent = (): JSX.Element => {
    return (
      <>
        <Text
          style={{
            color: "white",
            fontSize: width * 0.09,
            fontWeight: "bold",
            marginTop: 20,
            marginBottom: 10,
          }}
        >
          Enter your Email
        </Text>

        <TextInput
          placeholder="you@example.com"
          placeholderTextColor="#ddd"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          style={{
            width: "100%",
            backgroundColor: "rgba(255,255,255,0.2)",
            color: "white",
            padding: 12,
            borderRadius: 10,
            marginBottom: 20,
          }}
        />

        <TouchableOpacity
          onPress={handleContinue}
          style={{
            backgroundColor: "white",
            paddingVertical: 12,
            paddingHorizontal: 30,
            borderRadius: 10,
          }}
        >
          <Text style={{ color: "#ea580c", fontWeight: "bold" }}>Continue</Text>
        </TouchableOpacity>
      </>
    );
  };

  return (
    <View
      style={{
        backgroundColor: "#27272a",
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: width * 0.08,
      }}
    >
      <Neon width={100} height={100} />
      {isAuthenticated ? authenticatedContent() : notAuthenticatedContent()}
    </View>
  );
};

export default HomeScreen;
