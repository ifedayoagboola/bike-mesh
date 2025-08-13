import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Switch,
  Image,
  Alert,
  Share,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import colors from "../../config/colors";
import GatewaySetupModal from "../../components/GatewaySetupModal";
import { useGlobalContext } from "../../context/GlobalProvider";

const SettingsScreen = () => {
  const { user, handleLogout } = useGlobalContext();
  const [batteryNotifications, setBatteryNotifications] = useState(true);
  const [batteryThreshold, setBatteryThreshold] = useState(20);
  const [darkMode, setDarkMode] = useState(true);
  const [accentColor, setAccentColor] = useState("#00F704");
  const [showGatewaySetup, setShowGatewaySetup] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Use actual user data from context instead of hardcoded data
  const userData = {
    name: user?.username || "User",
    email: user?.email || "user@example.com",
    plan: "Premium",
    avatar: user?.avatar || null,
  };

  const gateways = [
    {
      id: "1",
      name: "Home Gateway",
      type: "Wi-Fi",
      status: "connected",
      lastSeen: "2 min ago",
    },
    {
      id: "2",
      name: "Office Gateway",
      type: "USB",
      status: "disconnected",
      lastSeen: "1 hour ago",
    },
  ];

  const accentColors = [
    "#00F704", // Green
    "#FF6B35", // Orange
    "#4A90E2", // Blue
    "#9B59B6", // Purple
    "#E74C3C", // Red
  ];

  const handleLogoutPress = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Logout", 
          style: "destructive", 
          onPress: async () => {
            setIsLoggingOut(true);
            try {
              await handleLogout(() => {
                router.replace("/login");
              });
            } catch (error) {
              console.log("Logout error:", error);
              setIsLoggingOut(false);
            }
          }
        },
      ]
    );
  };

  const handleDumpScanLog = () => {
    // Simulate dumping scan log
    Alert.alert(
      "Scan Log Dumped",
      "Scan log has been saved to device storage.",
      [{ text: "OK" }]
    );
  };

  const handleShareApp = () => {
    Share.share({
      message: "Check out Bike Mesh - the best asset tracker app!",
      title: "Bike Mesh",
    });
  };

  const handleAddGateway = (gatewayData) => {
    // Handle adding new gateway
    console.log("New gateway:", gatewayData);
    setShowGatewaySetup(false);
  };

  const renderAccountSection = () => (
    <View className="mb-6">
      <Text className="text-white font-psemibold text-xl mb-4">Account</Text>
      <View className="bg-gray-800 rounded-xl p-4">
        <View className="flex-row items-center mb-4">
          <View className="w-12 h-12 bg-gray-600 rounded-full items-center justify-center mr-3">
            {userData.avatar ? (
              <Image source={{ uri: userData.avatar }} className="w-12 h-12 rounded-full" />
            ) : (
              <Text className="text-white font-psemibold text-lg">
                {userData.name.charAt(0).toUpperCase()}
              </Text>
            )}
          </View>
          <View className="flex-1">
            <Text className="text-white font-psemibold text-lg">{userData.name}</Text>
            <Text className="text-gray-400 font-pregular">{userData.email}</Text>
          </View>
        </View>
        <View className="flex-row items-center justify-between">
          <Text className="text-gray-400 font-pregular">Plan</Text>
          <Text className="text-secondary font-psemibold">{userData.plan}</Text>
        </View>
      </View>
    </View>
  );

  const renderGatewaySection = () => (
    <View className="mb-6">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-white font-psemibold text-xl">Gateways</Text>
        <TouchableOpacity
          onPress={() => setShowGatewaySetup(true)}
          className="bg-secondary px-4 py-2 rounded-lg"
        >
          <Text className="text-white font-psemibold">Add</Text>
        </TouchableOpacity>
      </View>
      {gateways.map((gateway) => (
        <View key={gateway.id} className="bg-gray-800 rounded-xl p-4 mb-3">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-white font-psemibold text-lg">{gateway.name}</Text>
            <View className={`px-2 py-1 rounded-full ${
              gateway.status === "connected" ? "bg-green-500/20" : "bg-red-500/20"
            }`}>
              <Text className={`text-xs font-psemibold ${
                gateway.status === "connected" ? "text-green-400" : "text-red-400"
              }`}>
                {gateway.status}
              </Text>
            </View>
          </View>
          <Text className="text-gray-400 font-pregular mb-1">{gateway.type}</Text>
          <Text className="text-gray-500 font-pregular text-sm">Last seen: {gateway.lastSeen}</Text>
        </View>
      ))}
    </View>
  );

  const renderBatterySection = () => (
    <View className="mb-6">
      <Text className="text-white font-psemibold text-xl mb-4">Battery</Text>
      <View className="bg-gray-800 rounded-xl p-4">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-white font-pregular">Low battery notifications</Text>
          <Switch
            value={batteryNotifications}
            onValueChange={setBatteryNotifications}
            trackColor={{ false: "#767577", true: "#00F704" }}
            thumbColor={batteryNotifications ? "#ffffff" : "#f4f3f4"}
          />
        </View>
        <View className="flex-row items-center justify-between">
          <Text className="text-white font-pregular">Battery threshold</Text>
          <Text className="text-secondary font-psemibold">{batteryThreshold}%</Text>
        </View>
      </View>
    </View>
  );

  const renderThemeSection = () => (
    <View className="mb-6">
      <Text className="text-white font-psemibold text-xl mb-4">Theme</Text>
      <View className="bg-gray-800 rounded-xl p-4">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-white font-pregular">Dark mode</Text>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ false: "#767577", true: "#00F704" }}
            thumbColor={darkMode ? "#ffffff" : "#f4f3f4"}
          />
        </View>
        <View className="mb-4">
          <Text className="text-white font-pregular mb-2">Accent color</Text>
          <View className="flex-row gap-2">
            {accentColors.map((color) => (
              <TouchableOpacity
                key={color}
                onPress={() => setAccentColor(color)}
                className={`w-8 h-8 rounded-full border-2 ${
                  accentColor === color ? "border-white" : "border-transparent"
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </View>
        </View>
      </View>
    </View>
  );

  const renderAboutSection = () => (
    <View className="mb-6">
      <Text className="text-white font-psemibold text-xl mb-4">About</Text>
      <View className="bg-gray-800 rounded-xl p-4">
        <TouchableOpacity className="flex-row items-center justify-between mb-4" onPress={handleDumpScanLog}>
          <Text className="text-white font-pregular">Dump scan log</Text>
          <MaterialCommunityIcons name="chevron-right" size={20} color="#CDCDE0" />
        </TouchableOpacity>
        <TouchableOpacity className="flex-row items-center justify-between mb-4" onPress={handleShareApp}>
          <Text className="text-white font-pregular">Share app</Text>
          <MaterialCommunityIcons name="chevron-right" size={20} color="#CDCDE0" />
        </TouchableOpacity>
        <View className="flex-row items-center justify-between">
          <Text className="text-white font-pregular">Version</Text>
          <Text className="text-gray-400 font-pregular">1.0.6</Text>
        </View>
      </View>
    </View>
  );

  const renderLogoutSection = () => (
    <View className="mb-6">
      <TouchableOpacity 
        className={`border rounded-xl p-4 mb-3 flex-row items-center justify-center ${
          isLoggingOut 
            ? "bg-gray-600/20 border-gray-500" 
            : "bg-red-500/20 border-red-500"
        }`}
        onPress={handleLogoutPress}
        disabled={isLoggingOut}
      >
        <MaterialCommunityIcons
          name={isLoggingOut ? "loading" : "logout"}
          size={20}
          color={isLoggingOut ? "#9CA3AF" : "#FF4444"}
        />
        <Text className={`font-psemibold text-base ml-3 ${
          isLoggingOut ? "text-gray-400" : "text-red-500"
        }`}>
          {isLoggingOut ? "Logging out..." : "Logout"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 p-4" style={{ backgroundColor: colors.dark }}>
      {/* Header */}
      <View className="py-4">
        <Text className="text-white font-psemibold text-3xl">Settings</Text>
        <Text className="text-white font-pregular text-base">
          User & app preferences
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {renderAccountSection()}
        {renderGatewaySection()}
        {renderBatterySection()}
        {renderThemeSection()}
        {renderAboutSection()}
        {renderLogoutSection()}
      </ScrollView>

      {/* Gateway Setup Modal */}
      <GatewaySetupModal
        visible={showGatewaySetup}
        onClose={() => setShowGatewaySetup(false)}
        onGatewayAdded={handleAddGateway}
      />
    </SafeAreaView>
  );
};

export default SettingsScreen; 