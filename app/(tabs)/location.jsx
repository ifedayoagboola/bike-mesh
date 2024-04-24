import React from "react";
import { StyleSheet, View, FlatList, Text } from "react-native";

import Icon from "../../components/Icon";
import { SafeAreaView } from "react-native-safe-area-context";
import ListItem from "../../components/ListItem";
import ListItemSeparator from "../../components/ListItemSeparator";
import { router } from "expo-router";
import colors from "../../config/colors";
import Map from "../../components/Map";
import { StatusBar } from "expo-status-bar";

const menuItems = [
  {
    title: "Trek Domane SLR",
    subtitle: "Near Belfast city centre Since 12:30pm",
    icon: {
      name: "image",
      backgroundColor: colors.primary,
    },
  },

  {
    title: "Giant TCR Advanced",
    subtitle: "Near Duncregan Village centre Since 01:52pm",
    icon: {
      name: "image",
      backgroundColor: colors.secondary,
    },
    targetScreen: "/profile",
  },
];

function Location() {
  return (
    <SafeAreaView style={styles.screen} className="flex-1">
      <View className="flex-auto h-full w-full">
        <Map />
      </View>

      <View style={styles.container} className="bg-black p-4 rounded-2xl">
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
                  name={item.icon.name}
                  backgroundColor={item.icon.backgroundColor}
                />
              }
              subTitle={item.subtitle}
              onPress={() => router.push(item.targetScreen)}
            />
          )}
        />
      </View>
      <StatusBar backgroundColor="#161622" style={colors.light} hidden={true} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.light,
  },
  container: {
    // marginVertical: 20,
  },
});

export default Location;
