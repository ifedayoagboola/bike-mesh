import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../config/colors";

const BikeCard = ({ 
  bike, 
  onPress, 
  onRename, 
  onRemove,
  onFirmwareUpdate,
  onSetHome
}) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case "home":
        return { name: "home", color: "#00F704", bgColor: "#00F70420" };
      case "away":
        return { name: "map-marker-distance", color: "#FFA500", bgColor: "#FFA50020" };
      case "unknown":
        return { name: "help-circle", color: "#FF4444", bgColor: "#FF444420" };
      default:
        return { name: "help-circle", color: "#FF4444", bgColor: "#FF444420" };
    }
  };

  const getBikeIcon = (type) => {
    switch (type) {
      case "mountain":
        return "bike";
      case "road":
        return "bike-fast";
      case "commuter":
      default:
        return "bike";
    }
  };

  const getBatteryIcon = (battery) => {
    if (battery > 80) return "battery";
    if (battery > 60) return "battery-60";
    if (battery > 40) return "battery-40";
    if (battery > 20) return "battery-20";
    return "battery-alert";
  };

  const getBatteryColor = (battery) => {
    if (battery > 60) return "#00F704";
    if (battery > 20) return "#FFA500";
    return "#FF4444";
  };

  const statusInfo = getStatusIcon(bike.status);
  const batteryColor = getBatteryColor(bike.battery);
  const hasFirmwareUpdate = bike.firmwareUpdate; // Check if firmware update is available

  return (
    <TouchableOpacity 
      className="bg-gray-800 rounded-2xl my-2 mx-1 p-4 shadow-lg"
      style={{ 
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
        position: "relative",
        overflow: "hidden",
      }}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Card Header */}
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-row items-center flex-1">
          <View className="w-12 h-12 rounded-full bg-gray-700 justify-center items-center mr-3">
            {bike.emoji ? (
              <Text className="text-2xl">{bike.emoji}</Text>
            ) : (
              <MaterialCommunityIcons
                name={getBikeIcon(bike.type)}
                size={28}
                color={colors.primary}
              />
            )}
          </View>
          <View className="flex-1">
            <Text className="text-white text-lg font-semibold mb-1.5">{bike.title}</Text>
            <View className="flex-row items-center">
              <View 
                className="flex-row items-center px-2 py-1 rounded-xl"
                style={{ backgroundColor: statusInfo.bgColor }}
              >
                <MaterialCommunityIcons
                  name={statusInfo.name}
                  size={14}
                  color={statusInfo.color}
                />
                <Text 
                  className="text-xs font-medium ml-1"
                  style={{ color: statusInfo.color }}
                >
                  {bike.status === "home" ? "At home" : bike.status === "away" ? "Away" : "Unknown"}
                </Text>
              </View>
            </View>
          </View>
        </View>
        
        <View className="flex-row items-center bg-gray-700 px-2 py-1 rounded-xl">
          <MaterialCommunityIcons
            name={getBatteryIcon(bike.battery)}
            size={20}
            color={batteryColor}
          />
          <Text 
            className="text-xs font-semibold ml-1"
            style={{ color: batteryColor }}
          >
            {bike.battery}%
          </Text>
        </View>
      </View>

            {/* Card Footer with Action Buttons */}
      <View className="flex-row justify-between items-center mt-3">
        <View className="flex-row items-center flex-1">
          <MaterialCommunityIcons
            name="clock-outline"
            size={16}
            color={colors.secondary}
          />
          <Text className="text-secondary text-xs ml-1.5">
            {bike.subTitle.split("•")[2]?.trim() || "Never seen"}
          </Text>
        </View>

        {/* Action Buttons - Aligned with time text */}
        <View className="flex-row items-center">
          <TouchableOpacity
            className="w-8 h-8 rounded-full bg-gray-700 justify-center items-center ml-2"
            onPress={onRename}
          >
            <MaterialCommunityIcons
              name="pencil"
              size={18}
              color={colors.secondary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            className="w-8 h-8 rounded-full bg-gray-700 justify-center items-center ml-2"
            onPress={onSetHome}
          >
            <MaterialCommunityIcons
              name="map-marker-radius"
              size={18}
              color={colors.secondary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            className="w-8 h-8 rounded-full bg-gray-700 justify-center items-center ml-2"
            onPress={onRemove}
          >
            <MaterialCommunityIcons
              name="delete"
              size={18}
              color="#FF4444"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Gradient Border Effect */}
      <View 
        className="absolute top-0 left-0 right-0 h-1 bg-transparent rounded-t-2xl"
        style={{ borderTopColor: statusInfo.color, borderTopWidth: 3 }}
      />

      {/* Firmware Update Banner */}
      {hasFirmwareUpdate && (
        <TouchableOpacity
          className="absolute bottom-0 left-0 right-0 bg-primary rounded-b-2xl py-2 px-3"
          onPress={onFirmwareUpdate}
          activeOpacity={0.8}
        >
          <View className="flex-row items-center justify-between">
            <MaterialCommunityIcons
              name="update"
              size={16}
              color={colors.white}
            />
            <Text className="text-white text-xs font-semibold flex-1 text-center">
              Firmware Update Available
            </Text>
            <MaterialCommunityIcons
              name="chevron-right"
              size={16}
              color={colors.white}
            />
          </View>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

export default BikeCard; 