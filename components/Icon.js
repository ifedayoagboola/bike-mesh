import React from "react";
import { Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

function Icon({
  icon,
  size = 40,
  title,
  focused,
  color,
  backgroundColor = "#000",
  iconColor = "#fff",
}) {
  return (
    <View className="flex items-center justify-center gap-2">
      <MaterialCommunityIcons name={icon} color={color} size={size * 0.5} />
      {title && (
        <Text
          className={`${focused ? "font-psemibold" : "font-pregular"} text-xs`}
          style={{ color: color }}
        >
          {title}
        </Text>
      )}
    </View>
  );
}

export default Icon;
