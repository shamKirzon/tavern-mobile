import React, { useState } from "react";
import { height, width } from "../../utils/dimensions";
import { View, Text, TouchableOpacity, FlatList } from "react-native";

interface Props {
  options: string[];
  onSelect: (item: string) => void;
}

const CollapsibleDropdown: React.FC<Props> = ({ options, onSelect }) => {
  const [expanded, setExpanded] = useState(false);
  const [selectedReason, setSelectedReason] = useState<string>();

  const handleSelect = (selectedOption: string) => {
    setSelectedReason(selectedOption);
    setExpanded(false);
    onSelect(selectedOption);
  };

  return (
    <View
      style={{
        backgroundColor: "rgba(255,255,255,0.1)",
        borderRadius: width * 0.03,
        paddingVertical: width * 0.04,
        padding: width * 0.03,
        marginBottom: height * 0.02,
      }}
    >
      {/* Header */}
      <TouchableOpacity
        onPress={() => setExpanded(!expanded)}
        style={{
          flexDirection: "row",
          paddingLeft: width * 0.02,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={{ color: "#FFFFFF", fontSize: width * 0.035 }}>
            {selectedReason || "Select Reason for Reservation"}
          </Text>
        </View>

        <Text style={{ color: "#FFFFFF", fontSize: width * 0.036 }}>
          {expanded ? "▲" : "▼"}
        </Text>
      </TouchableOpacity>

      {/* Dropdown List */}
      {expanded && (
        <View style={{ marginTop: 8 }}>
          {options.map((reason, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                handleSelect(reason);
                setExpanded(false);
              }}
              style={{
                paddingVertical: 10,
                paddingHorizontal: 8,
                borderBottomWidth: index === options.length - 1 ? 0 : 1,
                borderBottomColor: "rgba(255,255,255,0.2)",
              }}
            >
              <Text style={{ color: "#FFFFFF", fontSize: width * 0.036 }}>
                {reason}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export default CollapsibleDropdown;
