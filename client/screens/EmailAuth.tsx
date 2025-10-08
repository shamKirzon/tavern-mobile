import React, { useState } from "react";
import Neon from "../assets/icons/neon-logo.svg";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
} from "react-native";

import { width } from "../utils/dimensions";

const EmailAuth = () => {
  const [email, setEmail] = useState("");

  const handleContinue = () => {
    if (!email.trim()) {
      alert("Please enter your email");
      return;
    }
    alert(`Email entered: ${email}`);
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
      <Text
        style={{
          color: "white",
          fontSize: width * 0.06,
          fontWeight: "bold",
          marginTop: 20,
          marginBottom: 10,
        }}
      >
        Enter your email
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
    </View>
  );
};

export default EmailAuth;
