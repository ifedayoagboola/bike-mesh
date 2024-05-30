import React from "react";
import { View, Text } from "react-native";
import { useRoute } from "@react-navigation/native";

const HistoryDetails = () => {
  const route = useRoute();
  const { id } = route.params;

  return (
    <View>
      <Text>History Details Page</Text>
      <Text>History ID: {id}</Text>
    </View>
  );
};

export default HistoryDetails;
