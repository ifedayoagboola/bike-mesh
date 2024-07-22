import {
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "../../../config/colors";
import Icon from "../../../components/Icon";
import ClaimsCard from "../../../components/ClaimsCard";
import { Stack, router } from "expo-router";
import { icons, images } from "../../../constants";

const MakeClaims = () => {
  const rewards = [
    {
      id: 1,
      toAndFro: "From home to school",
      distance: "80km",
      time: "01:52pm",
      icon: "calendar",
    },
    {
      id: 2,
      toAndFro: "From home to school",
      distance: "80km",
      time: "01:52pm",
      icon: "calendar",
    },
    {
      id: 3,
      toAndFro: "From home to school",
      distance: "80km",
      time: "01:52pm",
      icon: "calendar",
    },
    {
      id: 4,
      toAndFro: "From home to school",
      distance: "80km",
      time: "01:52pm",
      icon: "calendar",
    },
    {
      id: 5,
      toAndFro: "From home to school",
      distance: "80km",
      time: "01:52pm",
      icon: "calendar",
    },
  ];

  return (
    <SafeAreaView style={styles.screen} className="p-4">
      <Stack.Screen options={{ headerShown: false }} />
      <TouchableOpacity
        onPress={() => {
          router.back() || router.push("/history");
        }}
      >
        <Image source={icons.back} resizeMode="contain" className="w-6 h-6" />
      </TouchableOpacity>
      <Text className="text-white font-psemibold text-2xl w-[80%] py-2">
        Make Claims
      </Text>

      <View className="w-[200px] h-[200px] flex self-center justify-center items-center my-4">
        <Image source={images.chart} resizeMode="contain" className="w-full" />
        <Text className="text-gray-400 text-sm">Total Earnings</Text>
        <Text className="text-white text-lg font-psemibold">£250</Text>
      </View>

      <FlatList
        data={rewards}
        keyExtractor={(reward) => reward.id}
        ItemSeparatorComponent={false}
        renderItem={({ item }) => (
          <ClaimsCard
            title={item.toAndFro}
            IconComponent={
              <Icon
                icon={item.icon}
                backgroundColor={colors.light}
                color={colors.medium}
              />
            }
            subTitle={item.distance}
            onPress={() => focusOnLocation()}
          />
        )}
      />
    </SafeAreaView>
  );
};

export default MakeClaims;

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.dark,
    flex: 1,
  },
});
