import { Image, StyleSheet, Text, View, Animated } from "react-native";
import React, { useEffect, useRef } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { icons, images } from "../constants";

const SplashScreen = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <LinearGradient
      colors={['#0F0F23', '#1A1A2E', '#16213E']}
      className="flex-1 items-center justify-center"
    >
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        }}
        className="items-center"
      >
        {/* Logo Container */}
        <View className="w-32 h-32 bg-secondary/20 rounded-3xl items-center justify-center mb-8 border border-secondary/30">
          <Image
            source={icons.logo}
            resizeMode="contain"
            className="w-20 h-20"
          />
        </View>

        {/* App Name */}
        <Text className="text-4xl font-bold text-white text-center mb-4">
          Bike Mesh
        </Text>

        {/* Tagline */}
        <Text className="text-xl text-gray-300 text-center mb-8 px-8">
          The best asset tracker app alive
        </Text>

        {/* Loading Indicator */}
        <View className="flex-row items-center space-x-2">
          <View className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
          <View className="w-2 h-2 bg-secondary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
          <View className="w-2 h-2 bg-secondary rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
        </View>
      </Animated.View>
    </LinearGradient>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({});
