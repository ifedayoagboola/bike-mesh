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
// import ListItem from "../../../components/ListItem";
// import Icon from "../../../components/Icon";
// import ListItemSeparator from "../../../components/ListItemSeparator";
// import ClaimsCard from "../../../components/ClaimsCard";
import { Stack } from "expo-router";
// import { icons, images } from "../../../constants";

const Connect = () => {
  return (
    <SafeAreaView style={styles.screen} className="p-4">
      <Stack.Screen options={{ headerShown: false }} />
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
