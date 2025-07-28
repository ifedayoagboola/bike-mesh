import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
  ScrollView,
  Linking,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../config/colors";

const { width, height } = Dimensions.get("window");

const FirmwareUpdateModal = ({ visible, onClose, bike, onUpdateComplete }) => {
  const [updateProgress, setUpdateProgress] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentStep, setCurrentStep] = useState("preparing"); // preparing, downloading, installing, complete
  const [showReleaseNotes, setShowReleaseNotes] = useState(false);
  const [bleStrength, setBleStrength] = useState(-65); // Simulated BLE strength

  const progressAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(height)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Simulated firmware update data
  const firmwareData = {
    currentVersion: "v2.1.4",
    newVersion: "v2.2.0",
    size: "1.2 MB",
    releaseNotes: {
      title: "Enhanced Performance & New Features",
      summary: "This update brings significant improvements to battery life, GPS accuracy, and adds new geofencing capabilities.",
      changes: [
        "🔋 Improved battery optimization (up to 30% longer life)",
        "📍 Enhanced GPS accuracy and faster location updates",
        "🏠 New advanced geofencing with multiple zones",
        "📱 Better app connectivity and reduced disconnections",
        "🛡️ Security improvements and bug fixes",
        "⚡ Faster boot time and improved responsiveness"
      ],
      breakingChanges: [
        "⚠️ New firmware requires app version 1.2.0 or higher"
      ]
    },
    changelogUrl: "https://bikemesh.app/changelog/v2.2.0"
  };

  useEffect(() => {
    if (visible) {
      slideIn();
    } else {
      slideOut();
    }
  }, [visible]);

  useEffect(() => {
    if (isUpdating) {
      simulateUpdate();
    }
  }, [isUpdating]);

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

  const simulateUpdate = () => {
    setCurrentStep("preparing");
    setUpdateProgress(0);
    
    // Simulate preparation phase
    setTimeout(() => {
      setCurrentStep("downloading");
      animateProgress(0, 40, 3000);
    }, 1000);

    // Simulate download phase
    setTimeout(() => {
      setCurrentStep("installing");
      animateProgress(40, 90, 5000);
    }, 4000);

    // Simulate installation phase
    setTimeout(() => {
      setCurrentStep("complete");
      animateProgress(90, 100, 2000);
      setIsUpdating(false);
      setTimeout(() => {
        onUpdateComplete && onUpdateComplete();
        slideOut();
      }, 2000);
    }, 9000);
  };

  const animateProgress = (from, to, duration) => {
    Animated.timing(progressAnim, {
      toValue: to,
      duration: duration,
      useNativeDriver: false,
    }).start();
    
    const interval = setInterval(() => {
      setUpdateProgress(prev => {
        const newProgress = prev + (to - from) / (duration / 100);
        if (newProgress >= to) {
          clearInterval(interval);
          return to;
        }
        return newProgress;
      });
    }, 100);
  };

  const startUpdate = () => {
    setIsUpdating(true);
  };

  const getBleStrengthColor = (strength) => {
    if (strength >= -60) return "#00F704";
    if (strength >= -70) return "#FFA500";
    if (strength >= -80) return "#FF6B35";
    return "#FF4444";
  };

  const getBleStrengthLabel = (strength) => {
    if (strength >= -60) return "Excellent";
    if (strength >= -70) return "Good";
    if (strength >= -80) return "Fair";
    return "Poor";
  };

  const renderHeader = () => (
    <View className="flex-row items-center justify-between p-6 border-b border-gray-800">
      <TouchableOpacity onPress={slideOut} disabled={isUpdating}>
        <MaterialCommunityIcons
          name="close"
          size={24}
          color={isUpdating ? colors.secondary : colors.white}
        />
      </TouchableOpacity>
      <Text className="text-white font-psemibold text-lg">
        Firmware Update
      </Text>
      <View className="w-6" />
    </View>
  );

  const renderUpdateInfo = () => (
    <View className="p-6">
      <View className="bg-gray-800 rounded-xl p-4 mb-6">
        <View className="flex-row items-center mb-4">
          <View className="w-12 h-12 bg-primary rounded-full items-center justify-center mr-4">
            {bike?.emoji ? (
              <Text style={{ fontSize: 24 }}>{bike.emoji}</Text>
            ) : (
              <MaterialCommunityIcons
                name="bike"
                size={24}
                color={colors.secondary}
              />
            )}
          </View>
          <View className="flex-1">
            <Text className="text-white font-psemibold text-lg">{bike?.title}</Text>
            <Text className="text-secondary font-pregular text-sm">
              {firmwareData.currentVersion} → {firmwareData.newVersion}
            </Text>
          </View>
        </View>

        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <MaterialCommunityIcons
              name="download"
              size={20}
              color={colors.secondary}
            />
            <Text className="text-secondary font-pregular text-sm ml-2">
              {firmwareData.size}
            </Text>
          </View>
          <View className="flex-row items-center">
            <MaterialCommunityIcons
              name="wifi"
              size={20}
              color={getBleStrengthColor(bleStrength)}
            />
            <Text className="text-secondary font-pregular text-sm ml-2">
              {getBleStrengthLabel(bleStrength)} ({bleStrength} dBm)
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderProgress = () => (
    <View className="px-6 mb-6">
      <View className="bg-gray-800 rounded-xl p-6">
        <View className="items-center mb-6">
          <View className="relative">
            <View className="w-24 h-24 rounded-full border-4 border-gray-700 items-center justify-center">
              <Animated.View
                style={{
                  position: 'absolute',
                  width: 96,
                  height: 96,
                  borderRadius: 48,
                  borderWidth: 4,
                  borderColor: colors.primary,
                  borderTopColor: 'transparent',
                  borderLeftColor: 'transparent',
                  transform: [{
                    rotate: progressAnim.interpolate({
                      inputRange: [0, 100],
                      outputRange: ['0deg', '360deg'],
                    })
                  }]
                }}
              />
              <Text className="text-white font-psemibold text-xl">
                {Math.round(updateProgress)}%
              </Text>
            </View>
          </View>
          <Text className="text-white font-psemibold text-lg mt-4 capitalize">
            {currentStep}
          </Text>
          <Text className="text-secondary font-pregular text-sm text-center mt-2">
            {currentStep === "preparing" && "Preparing update files..."}
            {currentStep === "downloading" && "Downloading firmware..."}
            {currentStep === "installing" && "Installing firmware..."}
            {currentStep === "complete" && "Update completed successfully!"}
          </Text>
        </View>

        {!isUpdating && currentStep !== "complete" && (
          <TouchableOpacity
            className="bg-primary rounded-xl p-4"
            onPress={startUpdate}
          >
            <Text className="text-white font-psemibold text-center text-lg">
              Start Update
            </Text>
          </TouchableOpacity>
        )}

        {currentStep === "complete" && (
          <View className="bg-green-500/20 border border-green-500 rounded-xl p-4">
            <Text className="text-green-500 font-psemibold text-center">
              ✅ Firmware updated successfully!
            </Text>
          </View>
        )}
      </View>
    </View>
  );

  const renderReleaseNotes = () => (
    <View className="px-6 mb-6">
      <TouchableOpacity
        className="bg-gray-800 rounded-xl p-4"
        onPress={() => setShowReleaseNotes(!showReleaseNotes)}
      >
        <View className="flex-row items-center justify-between">
          <Text className="text-white font-psemibold text-lg">Release Notes</Text>
          <MaterialCommunityIcons
            name={showReleaseNotes ? "chevron-up" : "chevron-down"}
            size={24}
            color={colors.secondary}
          />
        </View>
      </TouchableOpacity>

      {showReleaseNotes && (
        <View className="bg-gray-800 rounded-xl p-4 mt-2">
          <Text className="text-white font-psemibold text-lg mb-3">
            {firmwareData.releaseNotes.title}
          </Text>
          <Text className="text-secondary font-pregular text-sm mb-4">
            {firmwareData.releaseNotes.summary}
          </Text>

          <Text className="text-white font-psemibold text-base mb-2">What's New:</Text>
          {firmwareData.releaseNotes.changes.map((change, index) => (
            <Text key={index} className="text-secondary font-pregular text-sm mb-1">
              {change}
            </Text>
          ))}

          {firmwareData.releaseNotes.breakingChanges.length > 0 && (
            <View className="mt-4">
              <Text className="text-orange-500 font-psemibold text-base mb-2">Important:</Text>
              {firmwareData.releaseNotes.breakingChanges.map((change, index) => (
                <Text key={index} className="text-orange-500 font-pregular text-sm mb-1">
                  {change}
                </Text>
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  );

  const renderChangelog = () => (
    <View className="px-6 mb-6">
      <TouchableOpacity
        className="bg-gray-800 rounded-xl p-4 flex-row items-center justify-between"
        onPress={() => Linking.openURL(firmwareData.changelogUrl)}
      >
        <View className="flex-row items-center">
          <MaterialCommunityIcons
            name="file-document"
            size={24}
            color={colors.secondary}
          />
          <Text className="text-white font-psemibold text-lg ml-3">Changelog</Text>
        </View>
        <MaterialCommunityIcons
          name="open-in-new"
          size={20}
          color={colors.secondary}
        />
      </TouchableOpacity>
    </View>
  );

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
            {renderUpdateInfo()}
            {renderProgress()}
            {renderReleaseNotes()}
            {renderChangelog()}
          </ScrollView>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

export default FirmwareUpdateModal; 