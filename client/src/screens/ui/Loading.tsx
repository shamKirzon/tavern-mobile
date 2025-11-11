import { ActivityIndicator, View, Text } from "react-native";

const Loading = (text?: string): React.JSX.Element => {
  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999,
      }}
    >
      <ActivityIndicator size="large" color="#fff" />
      <Text style={{ color: "#fff", marginTop: 10, fontSize: 16 }}>{text}</Text>
    </View>
  );
};

export default Loading;
