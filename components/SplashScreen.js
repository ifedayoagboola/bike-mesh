import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import icons from "../constants/icons";

const SplashScreen = () => {
  return (
    <View className="bg-black flex-1 items-center justify-center">
      <Image
        source={icons.appIcon}
        resizeMode="contain"
        className="w-[100px] h-[100px]"
      />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({});
