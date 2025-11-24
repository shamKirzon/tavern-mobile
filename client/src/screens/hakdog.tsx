import React from "react";

export const walaLang = (): React.JSX.Element => {
  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Pressable
            onPress={() => Keyboard.dismiss()}
            style={{
              flex: 1,
              width: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: width * 0.08,
            }}
          >
            <Pressable
              onPress={() => {}}
              style={{
                backgroundColor: "#171717",
                padding: width * 0.06,
                borderRadius: width * 0.06,
                width: "100%",
                alignItems: "center",
                paddingBottom: height * 0.04,
                borderWidth: 1,
                borderColor: "rgba(255, 255, 255, 0.08)",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.4,
                shadowRadius: 24,
                elevation: 16,
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  paddingTop: height * 0.02,
                  color: "#fff",
                  fontSize: width * 0.06,
                  fontWeight: "bold",
                }}
              >
                Are you sure you want to exit?
              </Text>

              {/* subtext:  */}
              <Text
                style={{
                  paddingTop: height * 0.03,
                  textAlign: "center",
                  color: "#fff",
                  fontSize: width * 0.04,
                  fontWeight: "200",
                  marginBottom: height * 0.05,
                }}
              >
                You have unsaved changes. Exiting now will lose all your
                progress.
              </Text>

              {/* Buttons */}
              <View style={{ flexDirection: "row", gap: width * 0.04 }}>
                {["Cancel", "Exit"].map((item, index) => (
                  <Pressable
                    key={index}
                    style={({ pressed }) => ({
                      backgroundColor: index === 0 ? "#FFFF" : "#8A1717",
                      paddingVertical: height * 0.02,
                      borderRadius: width * 0.03,
                      alignItems: "center",
                      width: width * 0.34,
                      opacity: pressed ? 0.7 : 1,
                      transform: [{ scale: pressed ? 0.97 : 1 }],
                    })}
                    onPress={() => {
                      {
                        if (index === 0) {
                          setModalVisible(false);
                        } else if (index === 1) {
                          setModalVisible(false);
                          navigation.navigate("HomeScreen");
                        }
                      }
                    }}
                  >
                    <Text
                      style={{
                        color: index === 0 ? "#8A1717" : "#FFFF",
                        fontSize: width * 0.04,
                        fontWeight: "600",
                      }}
                    >
                      {item}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </Pressable>
          </Pressable>
        </View>
      </Modal>
    </>
  );
};
