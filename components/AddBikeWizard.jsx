import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { startDiscovery, stopDiscovery } from "../bleDiscovery";
import colors from "../config/colors";

const { width, height } = Dimensions.get("window");

const AddBikeWizard = ({ visible, onClose, onBikeAdded }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isScanning, setIsScanning] = useState(false);
  const [discoveredBikes, setDiscoveredBikes] = useState(new Map());
  const [selectedBike, setSelectedBike] = useState(null);
  const [bikeName, setBikeName] = useState("");
  const [bikeEmoji, setBikeEmoji] = useState("🚲");
  const [isSuccess, setIsSuccess] = useState(false);

  const slideAnim = useRef(new Animated.Value(width)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const spinAnim = useRef(new Animated.Value(0)).current;

  const emojiOptions = ["🚲", "🚴", "🚴‍♀️", "🚴‍♂️", "🏍️", "🛵", "⚡", "🔥", "💨", "⭐"];

  useEffect(() => {
    if (visible) {
      setCurrentStep(1);
      setDiscoveredBikes(new Map());
      setSelectedBike(null);
      setBikeName("");
      setBikeEmoji("🚲");
      setIsSuccess(false);
      slideIn();
    }
  }, [visible]);

  useEffect(() => {
    if (currentStep === 1 && visible) {
      startScanning();
    } else {
      stopScanning();
    }
  }, [currentStep, visible]);

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
        toValue: width,
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

  const startScanning = () => {
    setIsScanning(true);
    setDiscoveredBikes(new Map());
    
    startDiscovery(({ uuid, rssi }) => {
      setDiscoveredBikes(m => new Map(m).set(uuid, { rssi, timestamp: Date.now() }));
      console.log(`Found bike ${uuid} @ ${rssi} dBm`);
    });

    // Start spinning animation
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();
  };

  const stopScanning = () => {
    setIsScanning(false);
    stopDiscovery();
    spinAnim.stopAnimation();
  };

  const handleBikeSelect = (uuid, rssi) => {
    setSelectedBike({ uuid, rssi });
    setBikeName(`Bike ${uuid.slice(0, 8)}`);
    nextStep();
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = () => {
    setIsSuccess(true);
    setTimeout(() => {
      const newBike = {
        id: Date.now().toString(),
        title: bikeName,
        emoji: bikeEmoji,
        uuid: selectedBike.uuid,
        status: "home",
        battery: 100,
        lastSeen: new Date(),
        type: "custom",
      };
      onBikeAdded(newBike);
      slideOut();
    }, 2000);
  };

  const renderStep1 = () => (
    <View className="flex-1 items-center justify-center px-6">
      <View className="items-center mb-8">
        <Animated.View
          style={{
            transform: [{
              rotate: spinAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '360deg'],
              })
            }]
          }}
          className="w-20 h-20 bg-primary rounded-full items-center justify-center mb-4"
        >
          <MaterialCommunityIcons
            name="wifi-scan"
            size={40}
            color={colors.secondary}
          />
        </Animated.View>
        <Text className="text-white font-psemibold text-xl mb-2">Searching for bikes...</Text>
        <Text className="text-secondary font-pregular text-base text-center">
          Scanning for nearby unclaimed bicycles
        </Text>
      </View>

      {discoveredBikes.size > 0 && (
        <View className="w-full">
          <Text className="text-white font-psemibold text-lg mb-4">
            Found {discoveredBikes.size} bike(s):
          </Text>
          {[...discoveredBikes.entries()].map(([uuid, { rssi }]) => (
            <TouchableOpacity
              key={uuid}
              className="bg-gray-800 rounded-xl p-4 mb-3 flex-row items-center"
              onPress={() => handleBikeSelect(uuid, rssi)}
            >
              <View className="w-12 h-12 bg-primary rounded-full items-center justify-center mr-4">
                <MaterialCommunityIcons
                  name="bike"
                  size={24}
                  color={colors.secondary}
                />
              </View>
              <View className="flex-1">
                <Text className="text-white font-psemibold text-base">
                  Bike {uuid.slice(0, 8)}...
                </Text>
                <Text className="text-secondary font-pregular text-sm">
                  Signal: {rssi} dBm
                </Text>
              </View>
              <MaterialCommunityIcons
                name="chevron-right"
                size={24}
                color={colors.secondary}
              />
            </TouchableOpacity>
          ))}
        </View>
      )}

      <TouchableOpacity
        className="absolute bottom-8 left-6 right-6 bg-gray-800 rounded-xl p-4"
        onPress={slideOut}
      >
        <Text className="text-secondary font-psemibold text-center">Cancel</Text>
      </TouchableOpacity>
    </View>
  );

  const renderStep2 = () => (
    <View className="flex-1 px-6">
      <View className="items-center mb-8">
        <View className="w-20 h-20 bg-green-500/20 rounded-full items-center justify-center mb-4">
          <MaterialCommunityIcons
            name="check-circle"
            size={40}
            color="#00F704"
          />
        </View>
        <Text className="text-white font-psemibold text-xl mb-2">Bike Selected!</Text>
        <Text className="text-secondary font-pregular text-base text-center">
          Bike {selectedBike?.uuid.slice(0, 8)}... is ready to be paired
        </Text>
      </View>

      <View className="bg-gray-800 rounded-xl p-4 mb-6">
        <Text className="text-white font-psemibold text-base mb-2">Selected Bike:</Text>
        <View className="flex-row items-center">
          <View className="w-12 h-12 bg-primary rounded-full items-center justify-center mr-4">
            <MaterialCommunityIcons
              name="bike"
              size={24}
              color={colors.secondary}
            />
          </View>
          <View className="flex-1">
            <Text className="text-white font-psemibold text-base">
              Bike {selectedBike?.uuid.slice(0, 8)}...
            </Text>
            <Text className="text-secondary font-pregular text-sm">
              Signal: {selectedBike?.rssi} dBm
            </Text>
          </View>
        </View>
      </View>

      <View className="flex-row space-x-4">
        <TouchableOpacity
          className="flex-1 bg-gray-800 rounded-xl p-4"
          onPress={prevStep}
        >
          <Text className="text-secondary font-psemibold text-center">Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-1 bg-primary rounded-xl p-4"
          onPress={nextStep}
        >
          <Text className="text-white font-psemibold text-center">Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View className="flex-1 px-6">
      <View className="items-center mb-8">
        <View className="w-20 h-20 bg-primary rounded-full items-center justify-center mb-4">
          <Text className="text-4xl">{bikeEmoji}</Text>
        </View>
        <Text className="text-white font-psemibold text-xl mb-2">Name Your Bike</Text>
        <Text className="text-secondary font-pregular text-base text-center">
          Give your bike a name and choose an emoji
        </Text>
      </View>

      <View className="mb-6">
        <Text className="text-white font-psemibold text-base mb-3">Bike Name:</Text>
        <TouchableOpacity
          className="bg-gray-800 rounded-xl p-4 border border-gray-700"
          onPress={() => {
            Alert.prompt(
              "Bike Name",
              "Enter a name for your bike:",
              [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Save",
                  onPress: (name) => {
                    if (name && name.trim()) {
                      setBikeName(name.trim());
                    }
                  },
                },
              ],
              "plain-text",
              bikeName
            );
          }}
        >
          <Text className="text-white font-pregular text-base">
            {bikeName || "Tap to enter name..."}
          </Text>
        </TouchableOpacity>
      </View>

      <View className="mb-6">
        <Text className="text-white font-psemibold text-base mb-3">Choose Emoji:</Text>
        <View className="flex-row flex-wrap justify-center">
          {emojiOptions.map((emoji) => (
            <TouchableOpacity
              key={emoji}
              className={`w-12 h-12 rounded-full items-center justify-center m-1 ${
                bikeEmoji === emoji ? "bg-primary" : "bg-gray-800"
              }`}
              onPress={() => setBikeEmoji(emoji)}
            >
              <Text className="text-2xl">{emoji}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View className="flex-row space-x-4">
        <TouchableOpacity
          className="flex-1 bg-gray-800 rounded-xl p-4"
          onPress={prevStep}
        >
          <Text className="text-secondary font-psemibold text-center">Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-1 bg-primary rounded-xl p-4"
          onPress={nextStep}
          disabled={!bikeName.trim()}
        >
          <Text className="text-white font-psemibold text-center">Finish</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStep4 = () => (
    <View className="flex-1 items-center justify-center px-6">
      <View className="items-center">
        <Animated.View
          style={{
            transform: [{
              scale: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.5, 1],
              })
            }]
          }}
          className="w-24 h-24 bg-green-500/20 rounded-full items-center justify-center mb-6"
        >
          <Text className="text-5xl">{bikeEmoji}</Text>
        </Animated.View>
        
        <Text className="text-white font-psemibold text-2xl mb-2 text-center">
          {bikeName} Added!
        </Text>
        <Text className="text-secondary font-pregular text-base text-center mb-8">
          Your bike has been successfully paired and added to your collection
        </Text>

        <View className="bg-gray-800 rounded-xl p-4 w-full">
          <Text className="text-white font-pregular text-center">
            Redirecting to Home...
          </Text>
        </View>
      </View>
    </View>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      default:
        return renderStep1();
    }
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
            transform: [{ translateX: slideAnim }],
          }}
          className="bg-dark"
        >
          {/* Header */}
          <View className="flex-row items-center justify-between p-6 border-b border-gray-800">
            <TouchableOpacity onPress={slideOut}>
              <MaterialCommunityIcons
                name="close"
                size={24}
                color={colors.white}
              />
            </TouchableOpacity>
            <Text className="text-white font-psemibold text-lg">
              Add Bike - Step {currentStep}/4
            </Text>
            <View className="w-6" />
          </View>

          {/* Progress Bar */}
          <View className="h-1 bg-gray-800">
            <View
              className="h-1 bg-primary"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </View>

          {/* Content */}
          {renderStepContent()}
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

export default AddBikeWizard; 