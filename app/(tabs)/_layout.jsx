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
          name="history"
          options={{
            title: "History",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <Icon
                icon="history"
                backgroundColor=""
                title=""
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
                title=""
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
