import React, { useState } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  TouchableOpacity,
} from "react-native";

import Icon from "../../components/Icon";
import ListItem from "../../components/ListItem";
import ListItemSeparator from "../../components/ListItemSeparator";
import { router } from "expo-router";
import colors from "../../config/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Map from "../../components/Map";

import * as Location from "expo-location";
import { PROVIDER_GOOGLE } from "react-native-maps";

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

const LocationScreen = () => {
  const [myLocation, setMyLocation] = useState({});
  const [destination, setDestination] = React.useState({
    latitude: 54.604560062217914,
    longitude: -5.927063842931933,
  });
  const mapRef = React.useRef({ PROVIDER_GOOGLE });

  const _getLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        console.warn("Permission to access location was denied");
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setMyLocation(location.coords);
      // console.log(location);
    } catch (err) {
      console.warn(err);
    }
  };

  const focusOnLocation = () => {
    if (myLocation.latitude && myLocation.longitude) {
      const newRegion = {
        latitude: parseFloat(myLocation.latitude),
        longitude: parseFloat(myLocation.longitude),
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
      if (mapRef.current) {
        mapRef.current.animateToRegion(newRegion, 1000);
      }
    }
  };
  return (
    <View style={styles.screen} className="">
      <View className="h-2/3">
        <Map
          myLocation={myLocation}
          destination={destination}
          _getLocation={_getLocation}
          focusOnLocation={focusOnLocation}
          mapRef={mapRef}
        />
      </View>

      <View
        style={styles.container}
        className="bg-[#161622] p-4 rounded-t-2xl h-1/3"
      >
        <View className="flex-row items-center justify-between">
          <Text className="text-secondary font-psemibold text-2xl">Assets</Text>
          <TouchableOpacity
            className="mr-4"
            onPress={() => router.push("connect")}
          >
            <MaterialCommunityIcons
              color={colors.secondary}
              name="plus"
              size={25}
            />
          </TouchableOpacity>
        </View>

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
              // onPress={() => focusOnLocation()}
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

export default LocationScreen;
