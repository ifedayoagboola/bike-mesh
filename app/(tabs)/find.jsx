import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  Vibration,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../../config/colors";

const { width } = Dimensions.get("window");
const RADAR_SIZE = width * 0.7;

const FindScreen = () => {
  const [selectedBike, setSelectedBike] = useState({
    id: "1",
    title: "Commuter",
    rssi: -75,
  });
  const [isScanning, setIsScanning] = useState(true);
  const [isPinging, setIsPinging] = useState(false);

  // Animation refs
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const ring1Anim = useRef(new Animated.Value(0)).current;
  const ring2Anim = useRef(new Animated.Value(0)).current;
  const ring3Anim = useRef(new Animated.Value(0)).current;
  const rssiBarAnim = useRef(new Animated.Value(0)).current;

  // Haptic feedback timer
  const hapticTimer = useRef(null);

  const getDistanceFromRSSI = (rssi) => {
    // Rough estimation based on RSSI values
    if (rssi >= -50) return { label: "Very Near", meters: "< 1m" };
    if (rssi >= -60) return { label: "Near", meters: "1-3m" };
    if (rssi >= -70) return { label: "Mid", meters: "3-10m" };
    if (rssi >= -80) return { label: "Far", meters: "10-20m" };
    if (rssi >= -90) return { label: "Very Far", meters: "20-50m" };
    return { label: "Out of Range", meters: "> 50m" };
  };

  const getRSSIColor = (rssi) => {
    if (rssi >= -60) return "#00F704"; // Green
    if (rssi >= -70) return "#FFA500"; // Orange
    if (rssi >= -80) return "#FF6B35"; // Red-Orange
    return "#FF4444"; // Red
  };

  const getRingSpeed = (rssi) => {
    // Slower animation when RSSI is weak
    if (rssi < -90) return 3000;
    if (rssi < -80) return 2500;
    if (rssi < -70) return 2000;
    return 1500;
  };

  const startRadarAnimation = () => {
    const speed = getRingSpeed(selectedBike.rssi);
    
    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: speed / 2,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: speed / 2,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Ring animations
    Animated.loop(
      Animated.timing(ring1Anim, {
        toValue: 1,
        duration: speed,
        useNativeDriver: true,
      })
    ).start();

    Animated.loop(
      Animated.timing(ring2Anim, {
        toValue: 1,
        duration: speed + 500,
        useNativeDriver: true,
      })
    ).start();

    Animated.loop(
      Animated.timing(ring3Anim, {
        toValue: 1,
        duration: speed + 1000,
        useNativeDriver: true,
      })
    ).start();
  };

  const updateRSSIBar = (rssi) => {
    // Convert RSSI to bar width (0-100%)
    const rssiValue = Math.max(-100, Math.min(-30, rssi));
    const barWidth = ((rssiValue + 100) / 70) * 100; // -100 to -30 range
    
    Animated.timing(rssiBarAnim, {
      toValue: barWidth,
      duration: 500,
      useNativeDriver: false,
    }).start();
  };

  const handleHapticFeedback = (rssi) => {
    if (rssi > -70) {
      // Clear existing timer
      if (hapticTimer.current) {
        clearInterval(hapticTimer.current);
      }
      
      // Start haptic feedback every 2 seconds
      hapticTimer.current = setInterval(() => {
        Vibration.vibrate(100);
      }, 2000);
    } else {
      // Stop haptic feedback
      if (hapticTimer.current) {
        clearInterval(hapticTimer.current);
        hapticTimer.current = null;
      }
    }
  };

  const handlePing = () => {
    setIsPinging(true);
    // Simulate ping effect
    Vibration.vibrate(200);
    
    setTimeout(() => {
      setIsPinging(false);
    }, 1000);
  };

  const simulateRSSIChange = () => {
    // Simulate RSSI changes for demo
    const rssiValues = [-65, -72, -78, -85, -92, -75, -68];
    let index = 0;
    
    const interval = setInterval(() => {
      if (!isScanning) {
        clearInterval(interval);
        return;
      }
      
      const newRSSI = rssiValues[index];
      setSelectedBike(prev => ({ ...prev, rssi: newRSSI }));
      updateRSSIBar(newRSSI);
      handleHapticFeedback(newRSSI);
      
      index = (index + 1) % rssiValues.length;
    }, 3000);
  };

  useEffect(() => {
    if (isScanning) {
      startRadarAnimation();
      updateRSSIBar(selectedBike.rssi);
      handleHapticFeedback(selectedBike.rssi);
      simulateRSSIChange();
    }

    return () => {
      if (hapticTimer.current) {
        clearInterval(hapticTimer.current);
      }
    };
  }, [isScanning, selectedBike.rssi]);

  const distance = getDistanceFromRSSI(selectedBike.rssi);
  const rssiColor = getRSSIColor(selectedBike.rssi);

  return (
    <SafeAreaView style={styles.screen} className="p-4">
      {/* Header */}
      <View className="py-4">
        <Text className="text-white font-psemibold text-3xl">Find Bike</Text>
        <Text className="text-white font-pregular text-base">
          Locate your {selectedBike.title}
        </Text>
      </View>

      {/* Radar Container */}
      <View style={styles.radarContainer}>
        {/* Radar Rings */}
        <View style={styles.radarCenter}>
          <MaterialCommunityIcons
            name="bike"
            size={40}
            color={colors.primary}
          />
        </View>

        {/* Animated Rings */}
        <Animated.View
          style={[
            styles.radarRing,
            {
              opacity: ring1Anim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.3, 0],
              }),
              transform: [
                {
                  scale: ring1Anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.3, 1.2],
                  }),
                },
              ],
            },
          ]}
        />

        <Animated.View
          style={[
            styles.radarRing,
            {
              opacity: ring2Anim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.2, 0],
              }),
              transform: [
                {
                  scale: ring2Anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.2, 1.4],
                  }),
                },
              ],
            },
          ]}
        />

        <Animated.View
          style={[
            styles.radarRing,
            {
              opacity: ring3Anim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.1, 0],
              }),
              transform: [
                {
                  scale: ring3Anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.1, 1.6],
                  }),
                },
              ],
            },
          ]}
        />

        {/* Pulse Effect */}
        <Animated.View
          style={[
            styles.pulseRing,
            {
              opacity: pulseAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.6, 0],
              }),
              transform: [
                {
                  scale: pulseAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1.5],
                  }),
                },
              ],
            },
          ]}
        />
      </View>

      {/* Distance Info */}
      <View style={styles.distanceContainer}>
        <Text style={styles.distanceLabel}>{distance.label}</Text>
        <Text style={styles.distanceMeters}>{distance.meters}</Text>
        
        {/* RSSI Bar */}
        <View style={styles.rssiContainer}>
          <Text style={styles.rssiLabel}>Signal Strength</Text>
          <View style={styles.rssiBarContainer}>
            <Animated.View
              style={[
                styles.rssiBar,
                {
                  width: rssiBarAnim.interpolate({
                    inputRange: [0, 100],
                    outputRange: ['0%', '100%'],
                  }),
                  backgroundColor: rssiColor,
                },
              ]}
            />
          </View>
          <Text style={[styles.rssiValue, { color: rssiColor }]}>
            {selectedBike.rssi} dBm
          </Text>
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={[styles.controlButton, styles.scanButton]}
          onPress={() => setIsScanning(!isScanning)}
        >
          <MaterialCommunityIcons
            name={isScanning ? "stop" : "play"}
            size={24}
            color={colors.white}
          />
          <Text style={styles.controlButtonText}>
            {isScanning ? "Stop Scan" : "Start Scan"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, styles.pingButton, isPinging && styles.pingButtonActive]}
          onPress={handlePing}
          disabled={isPinging}
        >
          <MaterialCommunityIcons
            name="volume-high"
            size={24}
            color={colors.white}
          />
          <Text style={styles.controlButtonText}>
            {isPinging ? "Pinging..." : "Ping"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.dark,
    flex: 1,
  },
  radarContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: RADAR_SIZE,
    position: "relative",
  },
  radarCenter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#2A2D3A",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  radarRing: {
    position: "absolute",
    width: RADAR_SIZE,
    height: RADAR_SIZE,
    borderRadius: RADAR_SIZE / 2,
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: "transparent",
  },
  pulseRing: {
    position: "absolute",
    width: RADAR_SIZE * 0.8,
    height: RADAR_SIZE * 0.8,
    borderRadius: (RADAR_SIZE * 0.8) / 2,
    borderWidth: 3,
    borderColor: colors.primary,
    backgroundColor: "transparent",
  },
  distanceContainer: {
    alignItems: "center",
    marginTop: 20,
    paddingHorizontal: 20,
  },
  distanceLabel: {
    color: colors.white,
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  distanceMeters: {
    color: colors.secondary,
    fontSize: 18,
    marginBottom: 20,
  },
  rssiContainer: {
    width: "100%",
    alignItems: "center",
  },
  rssiLabel: {
    color: colors.white,
    fontSize: 14,
    marginBottom: 8,
  },
  rssiBarContainer: {
    width: "100%",
    height: 8,
    backgroundColor: "#2A2D3A",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  rssiBar: {
    height: "100%",
    borderRadius: 4,
  },
  rssiValue: {
    fontSize: 16,
    fontWeight: "600",
  },
  controlsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 20,
    marginTop: 30,
  },
  controlButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: 120,
    justifyContent: "center",
  },
  scanButton: {
    backgroundColor: colors.primary,
  },
  pingButton: {
    backgroundColor: colors.secondary,
  },
  pingButtonActive: {
    backgroundColor: "#FF4444",
  },
  controlButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});

export default FindScreen; 