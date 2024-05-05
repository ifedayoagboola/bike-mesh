import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import React from "react";
import colors from "../config/colors";

const AddAsset = () => {
  return (
    <TouchableOpacity>
      <View className="items-center justify-center border border-secondary h-[185px] w-[147px] m-2 self-center rounded-lg">
        <MaterialCommunityIcons
          color={colors.secondary}
          name="plus"
          size={25}
        />
        <Text className="text-secondary font-pregular text-sm">Add Asset</Text>
      </View>
    </TouchableOpacity>
  );
};

export default AddAsset;

const styles = StyleSheet.create({});
