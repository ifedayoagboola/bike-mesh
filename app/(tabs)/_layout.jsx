import { StatusBar } from "expo-status-bar";
import { Redirect, Tabs } from "expo-router";
import { Image, Text, View } from "react-native";

import { icons } from "../../constants";
import { Loader } from "../../components";
import { useGlobalContext } from "../../context/GlobalProvider";
import Icon from "../../components/Icon";

const TabLayout = () => {
  const { isLoading, isLoggedIn } = useGlobalContext();

  if (!isLoading && !isLoggedIn) return <Redirect href="/login" />;

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#00F704",
          tabBarInactiveTintColor: "#CDCDE0",
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: "#161622",
            borderTopWidth: 1,
            borderTopColor: "#232533",
            height: 87,
          },
        }}
      >
        <Tabs.Screen
          name="history"
          options={{
            title: "History",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <Icon
                icon="history"
                backgroundColor=""
                title="History"
                focused={focused}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="location"
          options={{
            title: "Location",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <Icon
                icon="map-marker"
                backgroundColor=""
                title="Location"
                focused={focused}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <Icon
                icon="account"
                backgroundColor=""
                title="Profile"
                focused={focused}
                color={color}
              />
            ),
          }}
        />
      </Tabs>

      <Loader isLoading={isLoading} />
      <StatusBar backgroundColor="#161622" style="light" />
    </>
  );
};

export default TabLayout;
