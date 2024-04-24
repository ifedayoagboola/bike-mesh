import React from "react";
import { StyleSheet, View, FlatList } from "react-native";

import colors from "../../config/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "../../components/Icon";
import ListItem from "../../components/ListItem";
import ListItemSeparator from "../../components/ListItemSeparator";

const menuItems = [
  {
    title: "Account Details",
    icon: {
      name: "format-list-bulleted",
      backgroundColor: colors.primary,
    },
  },
  {
    title: "Preference",
    icon: {
      name: "format-list-bulleted",
      backgroundColor: colors.primary,
    },
  },
  {
    title: "Privacy Policy",
    icon: {
      name: "format-list-bulleted",
      backgroundColor: colors.primary,
    },
  },
  {
    title: "Support",
    icon: {
      name: "format-list-bulleted",
      backgroundColor: colors.primary,
    },
  },
  {
    title: "About us",
    icon: {
      name: "email",
      backgroundColor: colors.secondary,
    },
    targetScreen: "/profile",
  },
];

function Profile({ navigation }) {
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <ListItem
          title="Big Mike"
          subTitle="Bike.mesh@gmail.com"
          image={require("../../assets/images/profile.png")}
        />
      </View>
      <View style={styles.container}>
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
              onPress={() => navigation.navigate(item.targetScreen)}
            />
          )}
        />
      </View>
      <ListItem
        title="Log Out"
        IconComponent={<Icon name="logout" backgroundColor="#ffe66d" />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.dark,
  },
  container: {
    marginVertical: 20,
  },
});

export default Profile;
