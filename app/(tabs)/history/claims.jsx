import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { Stack, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "../../../config/colors";
import { icons, images } from "../../../constants";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { CustomButton } from "../../../components";
import ListItem from "../../../components/ListItem";
import Icon from "../../../components/Icon";
import ListItemSeparator from "../../../components/ListItemSeparator";

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

  const route = useRoute();
  const { id } = route.params;

  const data = rewards.filter((item) => {
    return id == item.id;
  });
  const reward = data[0];
  return (
    <SafeAreaView style={styles.screen} className="p-4">
      <FlatList
        data={rewards}
        keyExtractor={(reward) => reward.id}
        ItemSeparatorComponent={ListItemSeparator}
        renderItem={({ item }) => (
          <ListItem
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

const styles = StyleSheet.create({});
