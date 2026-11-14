import React, { useState } from "react";
import {
  Alert,
  Linking,
  ScrollView,
  Share,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import Constants from "expo-constants";
import colors from "../../config/colors";
import { useGlobalContext } from "../../context/GlobalProvider";

const SettingsScreen = () => {
  const { user, handleLogout, trackingAllowed, enableTracking } = useGlobalContext();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const name = user?.username || "Rider";

  const handleTracking = async () => {
    if (trackingAllowed) {
      Linking.openSettings();
      return;
    }
    const result = await enableTracking();
    if (result === "blocked") Linking.openSettings();
  };

  const handleLogoutPress = () => {
    Alert.alert("Log out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log out",
        style: "destructive",
        onPress: async () => {
          setIsLoggingOut(true);
          await handleLogout(() => router.replace("/login"));
        },
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 p-4" style={{ backgroundColor: colors.dark }}>
      <View className="py-4">
        <Text className="text-white font-psemibold text-3xl">Settings</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text className="text-white font-psemibold text-xl mb-4">Account</Text>
        <View className="bg-gray-800 rounded-xl p-4 mb-6 flex-row items-center">
          <View className="w-12 h-12 bg-gray-600 rounded-full items-center justify-center mr-3">
            <Text className="text-white font-psemibold text-lg">
              {name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View className="flex-1">
            <Text className="text-white font-psemibold text-lg">{name}</Text>
            <Text className="text-gray-400 font-pregular">{user?.email}</Text>
          </View>
        </View>

        <Text className="text-white font-psemibold text-xl mb-4">Tracking</Text>
        <TouchableOpacity
          className="bg-gray-800 rounded-xl p-4 mb-6 flex-row items-center"
          onPress={handleTracking}
        >
          <MaterialCommunityIcons
            name={trackingAllowed ? "bluetooth-connect" : "bluetooth-off"}
            size={24}
            color={trackingAllowed ? colors.secondary : "#FFA500"}
          />
          <View className="flex-1 ml-3">
            <Text className="text-white font-psemibold text-base">
              {trackingAllowed ? "Tracking is on" : "Tracking is off"}
            </Text>
            <Text className="text-gray-400 font-pregular text-sm">
              {trackingAllowed
                ? "While the app is open, your phone records where your bikes are and helps find bikes other riders have marked lost."
                : "Allow Bluetooth and location so your phone can see your bikes."}
            </Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={20} color="#CDCDE0" />
        </TouchableOpacity>

        <Text className="text-white font-psemibold text-xl mb-4">About</Text>
        <View className="bg-gray-800 rounded-xl p-4 mb-6">
          <TouchableOpacity
            className="flex-row items-center justify-between mb-4"
            onPress={() =>
              Share.share({
                message:
                  "I use BikeMesh to keep track of my bike. https://www.bikemesh.co.uk",
              })
            }
          >
            <Text className="text-white font-pregular">Share BikeMesh</Text>
            <MaterialCommunityIcons name="chevron-right" size={20} color="#CDCDE0" />
          </TouchableOpacity>
          <View className="flex-row items-center justify-between">
            <Text className="text-white font-pregular">Version</Text>
            <Text className="text-gray-400 font-pregular">
              {Constants.expoConfig?.version ?? ""}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          className={`border rounded-xl p-4 mb-6 flex-row items-center justify-center ${
            isLoggingOut ? "bg-gray-600/20 border-gray-500" : "bg-red-500/20 border-red-500"
          }`}
          onPress={handleLogoutPress}
          disabled={isLoggingOut}
        >
          <MaterialCommunityIcons
            name="logout"
            size={20}
            color={isLoggingOut ? "#9CA3AF" : "#FF4444"}
          />
          <Text
            className={`font-psemibold text-base ml-3 ${
              isLoggingOut ? "text-gray-400" : "text-red-500"
            }`}
          >
            {isLoggingOut ? "Logging out..." : "Log out"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;
