import React from "react";
import { StyleSheet, View, FlatList, Text } from "react-native";

import Icon from "../../components/Icon";
import ListItem from "../../components/ListItem";
import ListItemSeparator from "../../components/ListItemSeparator";
import { router } from "expo-router";
import colors from "../../config/colors";
import Map from "../../components/Map";

const menuItems = [
  {
    id: 1,
    title: "Lauren's bike",
    subtitle: "Near Belfast city centre Since 12:30pm",
    icon: {
      name: "bike",
      backgroundColor: colors.primary,
    },
  },
  {
    id: 2,
    title: "Company truck",
    subtitle: "Near Belfast city centre Since 12:30pm",
    icon: {
      name: "truck",
      backgroundColor: colors.primary,
    },
  },
  {
    id: 3,
    title: "Ride to work scheme HR",
    subtitle: "Near Belfast city centre Since 12:30pm",
    icon: {
      name: "bicycle",
      backgroundColor: colors.primary,
    },
  },
  {
    id: 4,
    title: "My Tesla",
    subtitle: "Near Belfast city centre Since 12:30pm",
    icon: {
      name: "car",
      backgroundColor: colors.primary,
    },
  },

  {
    id: 5,
    title: "Giant TCR Advanced",
    subtitle: "Near Duncregan Village centre Since 01:52pm",
    icon: {
      name: "bicycle",
      backgroundColor: colors.secondary,
    },
    targetScreen: "/profile",
  },
];

const Location = () => {
  return (
    <View style={styles.screen} className="">
      <View className="h-2/3">
        <Map />
      </View>

      <View
        style={styles.container}
        className="bg-[#161622] p-4 rounded-t-2xl h-1/3"
      >
        <Text className="text-secondary font-psemibold text-2xl pl-4 py-2">
          Assets
        </Text>

        <FlatList
          data={menuItems}
          keyExtractor={(menuItem) => menuItem.title}
          ItemSeparatorComponent={ListItemSeparator}
          renderItem={({ item }) => (
            <ListItem
              title={item.title}
              IconComponent={
                <Icon
                  icon={item.icon.name}
                  backgroundColor={colors.light}
                  color={colors.medium}
                />
              }
              subTitle={item.subtitle}
              onPress={() => router.push(item.targetScreen)}
            />
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.light,
  },
  container: {
    // marginVertical: 20,
  },
});

export default Location;
