import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
  ScrollView,
  TextInput,
  Switch,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../config/colors";

const { width, height } = Dimensions.get("window");

const GatewaySetupModal = ({ visible, onClose, onGatewayAdded }) => {
  const [gatewayType, setGatewayType] = useState("wifi"); // "wifi" or "usb"
  const [isScanning, setIsScanning] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Wi-Fi form fields
  const [ssid, setSsid] = useState("");
  const [password, setPassword] = useState("");
  const [networkName, setNetworkName] = useState("");
  
  // USB detection
  const [detectedDevices, setDetectedDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);

  const slideAnim = useRef(new Animated.Value(height)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scanAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      slideIn();
      if (gatewayType === "usb") {
        startUsbScan();
      }
    } else {
      slideOut();
    }
  }, [visible, gatewayType]);

  const slideIn = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const slideOut = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  const startUsbScan = () => {
    setIsScanning(true);
    setDetectedDevices([]);
    
    // Start scanning animation
    Animated.loop(
      Animated.timing(scanAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();

    // Simulate USB device detection
    setTimeout(() => {
      setDetectedDevices([
        { id: "1", name: "USB Gateway v2.1", port: "COM3", status: "available" },
        { id: "2", name: "BikeMesh Gateway", port: "COM5", status: "available" },
        { id: "3", name: "Unknown Device", port: "COM7", status: "busy" },
      ]);
      setIsScanning(false);
      scanAnim.stopAnimation();
    }, 3000);
  };

  const handleConnect = async () => {
    if (gatewayType === "wifi") {
      if (!ssid.trim() || !password.trim()) {
        Alert.alert("Error", "Please enter both SSID and password");
        return;
      }
    } else {
      if (!selectedDevice) {
        Alert.alert("Error", "Please select a USB device");
        return;
      }
    }

    setIsConnecting(true);

    // Simulate connection process
    setTimeout(() => {
      setIsConnecting(false);
      setIsConnected(true);
      
      // Simulate heartbeat verification
      setTimeout(() => {
        const newGateway = {
          id: Date.now().toString(),
          name: gatewayType === "wifi" ? networkName || "Wi-Fi Gateway" : selectedDevice.name,
          type: gatewayType === "wifi" ? "Wi-Fi" : "USB",
          status: "connected",
          lastSeen: "Just now",
          port: gatewayType === "usb" ? selectedDevice.port : null,
          ssid: gatewayType === "wifi" ? ssid : null,
        };

        onGatewayAdded(newGateway);
        
        // Show success toast
        Alert.alert(
          "Success!",
          `${newGateway.name} has been connected successfully.`,
          [{ text: "OK", onPress: slideOut }]
        );
      }, 2000);
    }, 3000);
  };

  const renderHeader = () => (
    <View className="flex-row items-center justify-between p-6 border-b border-gray-800">
      <TouchableOpacity onPress={slideOut} disabled={isConnecting}>
        <MaterialCommunityIcons
          name="close"
          size={24}
          color={isConnecting ? colors.secondary : colors.white}
        />
      </TouchableOpacity>
      <Text className="text-white font-psemibold text-lg">
        Add Gateway
      </Text>
      <View className="w-6" />
    </View>
  );

  const renderGatewayTypeSelector = () => (
    <View className="p-6">
      <Text className="text-white font-psemibold text-lg mb-4">Gateway Type</Text>
      <View className="flex-row space-x-4">
        <TouchableOpacity
          className={`flex-1 p-4 rounded-xl border-2 ${
            gatewayType === "wifi" 
              ? "border-primary bg-primary/20" 
              : "border-gray-700 bg-gray-800"
          }`}
          onPress={() => setGatewayType("wifi")}
          disabled={isConnecting}
        >
          <View className="items-center">
            <MaterialCommunityIcons
              name="wifi"
              size={32}
              color={gatewayType === "wifi" ? colors.secondary : colors.secondary}
            />
            <Text className={`font-psemibold text-base mt-2 ${
              gatewayType === "wifi" ? "text-white" : "text-secondary"
            }`}>
              Wi-Fi Gateway
            </Text>
            <Text className="text-secondary font-pregular text-xs text-center mt-1">
              Connect via wireless network
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          className={`flex-1 p-4 rounded-xl border-2 ${
            gatewayType === "usb" 
              ? "border-primary bg-primary/20" 
              : "border-gray-700 bg-gray-800"
          }`}
          onPress={() => setGatewayType("usb")}
          disabled={isConnecting}
        >
          <View className="items-center">
            <MaterialCommunityIcons
              name="usb"
              size={32}
              color={gatewayType === "usb" ? colors.secondary : colors.secondary}
            />
            <Text className={`font-psemibold text-base mt-2 ${
              gatewayType === "usb" ? "text-white" : "text-secondary"
            }`}>
              USB Gateway
            </Text>
            <Text className="text-secondary font-pregular text-xs text-center mt-1">
              Connect via USB cable
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderWifiForm = () => (
    <View className="px-6 mb-6">
      <Text className="text-white font-psemibold text-lg mb-4">Wi-Fi Configuration</Text>
      
      <View className="space-y-4">
        <View>
          <Text className="text-white font-pregular text-sm mb-2">Network Name</Text>
          <TextInput
            className="bg-gray-800 rounded-xl p-4 text-white border border-gray-700"
            placeholder="Enter gateway name (optional)"
            placeholderTextColor={colors.secondary}
            value={networkName}
            onChangeText={setNetworkName}
            editable={!isConnecting}
          />
        </View>

        <View>
          <Text className="text-white font-pregular text-sm mb-2">Wi-Fi Network (SSID)</Text>
          <TextInput
            className="bg-gray-800 rounded-xl p-4 text-white border border-gray-700"
            placeholder="Enter Wi-Fi network name"
            placeholderTextColor={colors.secondary}
            value={ssid}
            onChangeText={setSsid}
            editable={!isConnecting}
            autoCapitalize="none"
          />
        </View>

        <View>
          <Text className="text-white font-pregular text-sm mb-2">Password</Text>
          <View className="relative">
            <TextInput
              className="bg-gray-800 rounded-xl p-4 text-white border border-gray-700 pr-12"
              placeholder="Enter Wi-Fi password"
              placeholderTextColor={colors.secondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              editable={!isConnecting}
              autoCapitalize="none"
            />
            <TouchableOpacity
              className="absolute right-4 top-4"
              onPress={() => setShowPassword(!showPassword)}
            >
              <MaterialCommunityIcons
                name={showPassword ? "eye-off" : "eye"}
                size={20}
                color={colors.secondary}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  const renderUsbDetection = () => (
    <View className="px-6 mb-6">
      <Text className="text-white font-psemibold text-lg mb-4">USB Device Detection</Text>
      
      {isScanning ? (
        <View className="items-center py-8">
          <Animated.View
            style={{
              transform: [{
                rotate: scanAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '360deg'],
                })
              }]
            }}
            className="w-16 h-16 bg-primary rounded-full items-center justify-center mb-4"
          >
            <MaterialCommunityIcons
              name="usb"
              size={32}
              color={colors.secondary}
            />
          </Animated.View>
          <Text className="text-white font-psemibold text-lg">Scanning for devices...</Text>
          <Text className="text-secondary font-pregular text-sm text-center mt-2">
            Please ensure your USB gateway is connected
          </Text>
        </View>
      ) : detectedDevices.length > 0 ? (
        <View className="space-y-3">
          <Text className="text-secondary font-pregular text-sm mb-2">
            Found {detectedDevices.length} device(s):
          </Text>
          {detectedDevices.map((device) => (
            <TouchableOpacity
              key={device.id}
              className={`p-4 rounded-xl border-2 ${
                selectedDevice?.id === device.id
                  ? "border-primary bg-primary/20"
                  : "border-gray-700 bg-gray-800"
              } ${device.status === "busy" ? "opacity-50" : ""}`}
              onPress={() => device.status === "available" && setSelectedDevice(device)}
              disabled={device.status === "busy" || isConnecting}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center flex-1">
                  <MaterialCommunityIcons
                    name="usb"
                    size={24}
                    color={device.status === "available" ? colors.secondary : colors.secondary}
                  />
                  <View className="ml-3 flex-1">
                    <Text className={`font-psemibold text-base ${
                      device.status === "available" ? "text-white" : "text-secondary"
                    }`}>
                      {device.name}
                    </Text>
                    <Text className="text-secondary font-pregular text-sm">
                      {device.port}
                    </Text>
                  </View>
                </View>
                {device.status === "busy" && (
                  <Text className="text-orange-500 font-pregular text-xs">
                    In Use
                  </Text>
                )}
                {selectedDevice?.id === device.id && (
                  <MaterialCommunityIcons
                    name="check-circle"
                    size={24}
                    color={colors.secondary}
                  />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View className="items-center py-8">
          <MaterialCommunityIcons
            name="usb-off"
            size={48}
            color={colors.secondary}
          />
          <Text className="text-white font-psemibold text-lg mt-4">No devices found</Text>
          <Text className="text-secondary font-pregular text-sm text-center mt-2">
            Please connect your USB gateway and try again
          </Text>
          <TouchableOpacity
            className="bg-primary rounded-xl px-6 py-3 mt-4"
            onPress={startUsbScan}
          >
            <Text className="text-white font-psemibold">Scan Again</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderConnectionStatus = () => {
    if (isConnecting) {
      return (
        <View className="px-6 mb-6">
          <View className="bg-gray-800 rounded-xl p-6 items-center">
            <View className="w-16 h-16 bg-primary rounded-full items-center justify-center mb-4">
              <MaterialCommunityIcons
                name="wifi-sync"
                size={32}
                color={colors.secondary}
              />
            </View>
            <Text className="text-white font-psemibold text-lg">Connecting...</Text>
            <Text className="text-secondary font-pregular text-sm text-center mt-2">
              Verifying gateway heartbeat
            </Text>
          </View>
        </View>
      );
    }

    if (isConnected) {
      return (
        <View className="px-6 mb-6">
          <View className="bg-green-500/20 border border-green-500 rounded-xl p-6 items-center">
            <MaterialCommunityIcons
              name="check-circle"
              size={48}
              color="#00F704"
            />
            <Text className="text-green-500 font-psemibold text-lg mt-4">Connected!</Text>
            <Text className="text-green-500 font-pregular text-sm text-center mt-2">
              Gateway is online and responding
            </Text>
          </View>
        </View>
      );
    }

    return null;
  };

  const renderConnectButton = () => {
    if (isConnecting || isConnected) return null;

    const canConnect = gatewayType === "wifi" 
      ? ssid.trim() && password.trim()
      : selectedDevice && selectedDevice.status === "available";

    return (
      <View className="px-6 mb-6">
        <TouchableOpacity
          className={`rounded-xl p-4 ${
            canConnect ? "bg-primary" : "bg-gray-700"
          }`}
          onPress={handleConnect}
          disabled={!canConnect}
        >
          <Text className={`font-psemibold text-center text-lg ${
            canConnect ? "text-white" : "text-gray-500"
          }`}>
            Connect Gateway
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent={true}
      onRequestClose={slideOut}
    >
      <Animated.View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          opacity: fadeAnim,
        }}
      >
        <Animated.View
          style={{
            flex: 1,
            transform: [{ translateY: slideAnim }],
          }}
          className="bg-dark"
        >
          {renderHeader()}
          
          <ScrollView showsVerticalScrollIndicator={false}>
            {renderGatewayTypeSelector()}
            {gatewayType === "wifi" ? renderWifiForm() : renderUsbDetection()}
            {renderConnectionStatus()}
            {renderConnectButton()}
          </ScrollView>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

export default GatewaySetupModal; 