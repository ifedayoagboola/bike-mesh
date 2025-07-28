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
import colors from "../../config/colors";
import GatewaySetupModal from "../../components/GatewaySetupModal";

const SettingsScreen = () => {
  const [batteryNotifications, setBatteryNotifications] = useState(true);
  const [batteryThreshold, setBatteryThreshold] = useState(20);
  const [darkMode, setDarkMode] = useState(true);
  const [accentColor, setAccentColor] = useState("#00F704");
  const [showGatewaySetup, setShowGatewaySetup] = useState(false);

  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    plan: "Premium",
    avatar: null, // You can add avatar image here
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

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", style: "destructive", onPress: () => {
          // Handle logout logic
          console.log("Logout pressed");
        }},
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
      message: "Check out BikeMesh - the ultimate bike tracking app!",
      url: "https://bikemesh.app",
    });
  };

  const handleAddGateway = (newGateway) => {
    // Add the new gateway to the list
    gateways.push(newGateway);
    // In a real app, you'd update state here
    console.log("Gateway added:", newGateway);
  };

  const renderAccountSection = () => (
    <View className="mb-8">
      <Text className="text-white font-psemibold text-xl mb-4">Account</Text>
      <View className="bg-gray-800 rounded-2xl p-5 flex-row items-center">
        <View className="mr-4">
          {user.avatar ? (
            <Image source={{ uri: user.avatar }} className="w-15 h-15 rounded-full" />
          ) : (
            <View className="w-15 h-15 rounded-full bg-gray-700 items-center justify-center">
              <MaterialCommunityIcons
                name="account"
                size={32}
                color={colors.white}
              />
            </View>
          )}
        </View>
        <View className="flex-1">
          <Text className="text-white font-psemibold text-lg mb-1">{user.name}</Text>
          <Text className="text-secondary font-pregular text-sm mb-2">{user.email}</Text>
          <View className="bg-primary px-2 py-1 rounded-xl self-start">
            <Text className="text-white font-psemibold text-xs">{user.plan}</Text>
          </View>
        </View>
        <TouchableOpacity className="w-8 h-8 rounded-full bg-gray-700 items-center justify-center">
          <MaterialCommunityIcons
            name="pencil"
            size={20}
            color={colors.secondary}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderGatewaySection = () => (
    <View className="mb-8">
              <View className="flex-row items-center justify-between mb-4">
          <Text className="text-white font-psemibold text-xl">Gateway Manager</Text>
          <TouchableOpacity 
            className="w-8 h-8 rounded-full bg-gray-700 items-center justify-center"
            onPress={() => setShowGatewaySetup(true)}
          >
            <MaterialCommunityIcons
              name="plus"
              size={20}
              color={colors.primary}
            />
          </TouchableOpacity>
        </View>
      
      {gateways.map((gateway) => (
        <View key={gateway.id} className="bg-gray-800 rounded-xl p-4 mb-3 flex-row items-center">
          <View className="flex-1">
            <View className="flex-row items-center mb-1">
              <Text className="text-white font-psemibold text-base mr-2">{gateway.name}</Text>
              <View className={`w-2 h-2 rounded-full ${gateway.status === "connected" ? "bg-green-500" : "bg-red-500"}`} />
            </View>
            <Text className="text-secondary font-pregular text-sm mb-1">{gateway.type} Gateway</Text>
            <Text className="text-secondary font-pregular text-xs">
              {gateway.status === "connected" ? "Connected" : "Disconnected"} • {gateway.lastSeen}
            </Text>
          </View>
          <TouchableOpacity className="w-8 h-8 rounded-full bg-gray-700 items-center justify-center">
            <MaterialCommunityIcons
              name="dots-vertical"
              size={20}
              color={colors.secondary}
            />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );

  const renderBatterySection = () => (
    <View className="mb-8">
      <Text className="text-white font-psemibold text-xl mb-4">Battery Notifications</Text>
      
      <View className="bg-gray-800 rounded-xl p-4 mb-3 flex-row items-center">
        <View className="flex-1">
          <Text className="text-white font-psemibold text-base mb-1">Enable Notifications</Text>
          <Text className="text-secondary font-pregular text-sm">Get notified when battery is low</Text>
        </View>
        <Switch
          value={batteryNotifications}
          onValueChange={setBatteryNotifications}
          trackColor={{ false: "#2A2D3A", true: colors.primary }}
          thumbColor={colors.white}
        />
      </View>

      {batteryNotifications && (
        <View className="bg-gray-800 rounded-xl p-4">
          <Text className="text-white font-psemibold text-base mb-3">
            Alert Threshold: {batteryThreshold}%
          </Text>
          <View className="flex-row flex-wrap justify-between">
            {[5, 10, 15, 20, 25, 30, 40, 50].map((value) => (
              <TouchableOpacity
                key={value}
                className={`px-3 py-2 rounded-2xl mb-2 min-w-15 items-center ${
                  batteryThreshold === value 
                    ? "bg-primary" 
                    : "bg-gray-700"
                }`}
                onPress={() => setBatteryThreshold(value)}
              >
                <Text className={`font-psemibold text-sm ${
                  batteryThreshold === value 
                    ? "text-white" 
                    : "text-secondary"
                }`}>
                  {value}%
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </View>
  );

  const renderThemeSection = () => (
    <View className="mb-8">
      <Text className="text-white font-psemibold text-xl mb-4">Appearance</Text>
      
      <View className="bg-gray-800 rounded-xl p-4 mb-3 flex-row items-center">
        <View className="flex-1">
          <Text className="text-white font-psemibold text-base mb-1">Dark Mode</Text>
          <Text className="text-secondary font-pregular text-sm">Use dark theme</Text>
        </View>
        <Switch
          value={darkMode}
          onValueChange={setDarkMode}
          trackColor={{ false: "#2A2D3A", true: colors.primary }}
          thumbColor={colors.white}
        />
      </View>

      <View className="bg-gray-800 rounded-xl p-4">
        <Text className="text-white font-psemibold text-base mb-3">Accent Color</Text>
        <View className="flex-row justify-around">
          {accentColors.map((color) => (
            <TouchableOpacity
              key={color}
              className={`w-10 h-10 rounded-full items-center justify-center border-2 ${
                accentColor === color ? "border-white" : "border-transparent"
              }`}
              style={{ backgroundColor: color }}
              onPress={() => setAccentColor(color)}
            >
              {accentColor === color && (
                <MaterialCommunityIcons
                  name="check"
                  size={16}
                  color={colors.white}
                />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  const renderAboutSection = () => (
    <View className="mb-8">
      <Text className="text-white font-psemibold text-xl mb-4">About</Text>
      
      <View className="bg-gray-800 rounded-xl p-4 mb-3 flex-row items-center justify-between">
        <Text className="text-white font-psemibold text-base">App Version</Text>
        <Text className="text-secondary font-pregular text-base">1.0.0</Text>
      </View>
      
      <View className="bg-gray-800 rounded-xl p-4 mb-3 flex-row items-center justify-between">
        <Text className="text-white font-psemibold text-base">Firmware Version</Text>
        <Text className="text-secondary font-pregular text-base">v2.1.4</Text>
      </View>
      
      <View className="bg-gray-800 rounded-xl p-4 mb-3 flex-row items-center justify-between">
        <Text className="text-white font-psemibold text-base">Build Number</Text>
        <Text className="text-secondary font-pregular text-base">2024.01.15</Text>
      </View>

      <TouchableOpacity className="bg-gray-800 rounded-xl p-4 mb-3 flex-row items-center" onPress={handleShareApp}>
        <MaterialCommunityIcons
          name="share"
          size={20}
          color={colors.white}
        />
        <Text className="text-white font-psemibold text-base ml-3">Share App</Text>
      </TouchableOpacity>

      <TouchableOpacity className="bg-gray-800 rounded-xl p-4 mb-3 flex-row items-center" onPress={handleDumpScanLog}>
        <MaterialCommunityIcons
          name="download"
          size={20}
          color={colors.white}
        />
        <Text className="text-white font-psemibold text-base ml-3">Dump Scan Log</Text>
      </TouchableOpacity>

      <TouchableOpacity className="bg-red-500/20 border border-red-500 rounded-xl p-4 mb-3 flex-row items-center" onPress={handleLogout}>
        <MaterialCommunityIcons
          name="logout"
          size={20}
          color="#FF4444"
        />
        <Text className="text-red-500 font-psemibold text-base ml-3">Logout</Text>
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