import React, { useEffect, useRef } from "react";
import { Animated, View, StyleSheet, Easing } from "react-native";

const NUM_DOTS = 8;
const SPINNER_SIZE = 50;
const DOT_WIDTH = 4; // narrower
const DOT_HEIGHT = 12; // taller for elongated look

const CircleSpinner = (): React.JSX.Element => {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000, // slower rotation
        useNativeDriver: true,
        easing: Easing.linear,
      })
    ).start();
  }, [rotateAnim]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const dots = Array.from({ length: NUM_DOTS }).map((_, i) => {
    const angle = (i * 360) / NUM_DOTS;
    return (
      <View
        key={i}
        style={[
          styles.dot,
          {
            width: DOT_WIDTH,
            height: DOT_HEIGHT,
            transform: [
              { rotate: `${angle}deg` },
              { translateY: -SPINNER_SIZE / 2 + DOT_HEIGHT / 2 },
            ],
          },
        ]}
      />
    );
  });

  return (
    <Animated.View
      style={[
        styles.container,
        { width: SPINNER_SIZE, height: SPINNER_SIZE, transform: [{ rotate }] },
      ]}
    >
      {dots}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    position: "absolute",
    borderRadius: 2, // slightly rounded edges
    backgroundColor: "#FFFF", // yellowish for beer
  },
});

export default CircleSpinner;
