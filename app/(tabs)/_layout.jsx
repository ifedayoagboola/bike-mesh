import { StatusBar } from "expo-status-bar";
import { Redirect, Tabs } from "expo-router";
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
          tabBarShowLabel: true,
          tabBarLabelStyle: {
            fontSize: 14,
            fontWeight: "600",
          },
          tabBarStyle: {
            backgroundColor: "#161622",
            borderTopWidth: 1,
            borderTopColor: "#232533",
            height: 87,
          },
        }}
      >
        <Tabs.Screen
          name="location"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <Icon
                icon="home"
                backgroundColor=""
                title=""
                focused={focused}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="find"
          options={{
            title: "Find",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <Icon
                icon="radar"
                backgroundColor=""
                title=""
                focused={focused}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="map"
          options={{
            title: "Map",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <Icon
                icon="map"
                backgroundColor=""
                title=""
                focused={focused}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="alerts"
          options={{
            title: "Alerts",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <Icon
                icon="bell"
                backgroundColor=""
                title=""
                focused={focused}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "Settings",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <Icon
                icon="cog"
                backgroundColor=""
                title=""
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
