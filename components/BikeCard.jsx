import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../config/colors";
import { bikeStatus, lastSeenLine } from "../lib/format";

const BikeCard = ({ bike, nearby, onPress, onRename, onRemove }) => {
  const status = bikeStatus(bike, nearby);

  return (
    <TouchableOpacity
      className="bg-gray-800 rounded-2xl my-2 mx-1 p-4"
      style={{
        elevation: 8,
        overflow: "hidden",
        borderTopColor: status.color,
        borderTopWidth: 3,
      }}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View className="flex-row items-center mb-3">
        <View className="w-12 h-12 rounded-full bg-gray-700 justify-center items-center mr-3">
          <Text className="text-2xl">{bike.emoji}</Text>
        </View>
        <View className="flex-1">
          <Text className="text-white text-lg font-semibold mb-1.5">{bike.name}</Text>
          <View
            className="flex-row items-center self-start px-2 py-1 rounded-xl"
            style={{ backgroundColor: status.color + "20" }}
          >
            <MaterialCommunityIcons name={status.icon} size={14} color={status.color} />
            <Text className="text-xs font-medium ml-1" style={{ color: status.color }}>
              {status.label}
            </Text>
          </View>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={24} color="#6B7280" />
      </View>

      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center flex-1">
          <MaterialCommunityIcons name="clock-outline" size={16} color="#9CA3AF" />
          <Text className="text-gray-400 text-xs ml-1.5">{lastSeenLine(bike, nearby)}</Text>
        </View>

        <View className="flex-row items-center">
          <TouchableOpacity
            className="w-8 h-8 rounded-full bg-gray-700 justify-center items-center ml-2"
            onPress={onRename}
          >
            <MaterialCommunityIcons name="pencil" size={18} color={colors.secondary} />
          </TouchableOpacity>
          <TouchableOpacity
            className="w-8 h-8 rounded-full bg-gray-700 justify-center items-center ml-2"
            onPress={onRemove}
          >
            <MaterialCommunityIcons name="delete" size={18} color="#FF4444" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default BikeCard;
