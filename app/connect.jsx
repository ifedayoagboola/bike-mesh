import {
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "../config/colors";

import { Stack } from "expo-router";
import { icons } from "../constants";

const Connect = () => {
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
      <Text className="text-white font-psemibold text-4xl w-[80%]">
        Connect Bycicle
      </Text>
      <Text>connect Screen</Text>
    </SafeAreaView>
  );
};

export default Connect;

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.danger,
    flex: 1,
  },
});
