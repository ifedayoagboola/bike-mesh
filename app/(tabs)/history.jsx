import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AssetCard from "../../components/AssetCard";
import colors from "../../config/colors";

const History = () => {
  return (
    <SafeAreaView style={styles.screen} className="p-4">
      <View>
        <Text className="text-white font-psemibold text-3xl">History</Text>
        <Text className="text-white font-pregular text-base">
          Track distance, reward and add asset
        </Text>
      </View>
      <View className="flex-row items-center justify-center">
        <AssetCard />
        <AssetCard />
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.dark,
    flex: 1,
  },
});
export default History;
