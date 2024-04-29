import { StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import React from "react";
import colors from "../config/colors";

const AddAsset = () => {
  return (
    <View className="items-center justify-center border border-secondary h-[150px] w-[120px] m-2 self-center">
      <MaterialCommunityIcons color={colors.secondary} name="plus" size={25} />
      <Text className="text-secondary font-pregular text-sm">Add Asset</Text>
    </View>
  );
};

export default AddAsset;

const styles = StyleSheet.create({});
