import React from "react";
import { View, Text } from "react-native";
import { useRoute } from "@react-navigation/native";
import { Stack } from "expo-router";

const HistoryDetails = () => {
  const assets = [
    {
      id: 1,
      assetName: "Giant TCR Advanced",
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
      assetName: "Giant TCR Advanced",
      assetType: "bicycle",
      lastSeen: "Near Duncregan Village centre Since 01:52pm",
      icon: "bicycle",
    },
    {
      id: 4,
      assetName: "Giant TCR Advanced",
      assetType: "bicycle",
      lastSeen: "Near Duncregan Village centre Since 01:52pm",
      icon: "bicycle",
    },
    {
      id: 5,
      assetName: "Giant TCR Advanced",
      assetType: "bicycle",
      lastSeen: "Near Duncregan Village centre Since 01:52pm",
      icon: "bicycle",
    },
    {
      id: 6,
    },
  ];

  const route = useRoute();
  const { id } = route.params;

  const header = assets.filter((item) => {
    return id == item.id;
  });

  return (
    <View>
      <Stack.Screen options={{ headerTitle: header[0].assetName }} />
      <Text>History Details Page</Text>
      <Text>History ID: {id}</Text>
    </View>
  );
};

export default HistoryDetails;
