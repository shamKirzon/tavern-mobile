import React from "react";
import { View } from "react-native";
import { height } from "../../utils/dimensions";

const DottedDivider = (): React.JSX.Element => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        marginVertical: height * 0.015,
      }}
    >
      {[...Array(50)].map((_, i) => (
        <View
          key={i}
          style={{
            width: 2,
            height: 2,
            backgroundColor: "white",
            borderRadius: 50,
            opacity: 0.7,
          }}
        />
      ))}
    </View>
  );
};

export default DottedDivider;
