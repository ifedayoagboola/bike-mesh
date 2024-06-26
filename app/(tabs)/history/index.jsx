import { FlatList, StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AssetCard from "../../../components/AssetCard";
import colors from "../../../config/colors";
import AddAsset from "../../../components/AddAsset";
import { router } from "expo-router";

const History = () => {
  const assets = [
    {
      id: 1,
      assetName: "Lauren's bike",
      assetType: "bicycle",
      lastSeen: "Near Duncregan Village centre Since 01:52pm",
      icon: "bicycle",
    },
    {
      id: 2,
      assetName: "Giant TCR Advanced",
      assetType: "bicycle",
      lastSeen: "Near Duncregan Village centre Since 01:52pm",
      icon: "bicycle",
    },
    {
      id: 3,
      assetName: "HR Ride to work scheme",
      assetType: "bicycle",
      lastSeen: "Near Duncregan Village centre Since 01:52pm",
      icon: "bicycle",
    },
    {
      id: 4,
      assetName: "Giant TCR",
      assetType: "bicycle",
      lastSeen: "Near Duncregan Village centre Since 01:52pm",
      icon: "bicycle",
    },
    {
      id: 5,
      assetName: "My Delivery Bike",
      assetType: "bicycle",
      lastSeen: "Near Duncregan Village centre Since 01:52pm",
      icon: "bicycle",
    },
    {
      id: 6,
    },
  ];

  return (
    <SafeAreaView style={styles.screen} className="p-4">
      <View className="py-4">
        <Text className="text-white font-psemibold text-3xl">History</Text>
        <Text className="text-white font-pregular text-base">
          Track distance, reward and add asset
        </Text>
      </View>
      <FlatList
        data={assets}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        renderItem={({ item }) =>
          item.assetName ? (
            <AssetCard
              item={item}
              onPress={() => router.push(`history/${item.id}`)}
            />
          ) : (
            <AddAsset />
          )
        }
      />
      {/* <AddAsset /> */}
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
