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

import { Link, Stack } from "expo-router";
import { icons } from "../constants";
import FormField from "../components/FormField";
import CustomButton from "../components/CustomButton";

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
      <Text className="text-white font-psemibold text-4xl w-[200px] py-3">
        Connect Bicycle
      </Text>
      <Text className="text-white">connect Screen</Text>
      <FormField otherStyles="py-6" placeholder="Tracking ID" />
      <CustomButton title="Connect Asset" textStyles="font-pmedium" />

      <Text className="text-lg text-secondary pt-12 font">
        Scan code instead?
      </Text>
    </SafeAreaView>
  );
};

export default Connect;

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.dark,
    flex: 1,
  },
});
