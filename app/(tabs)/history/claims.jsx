import { StyleSheet, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "../../../config/colors";
import ListItem from "../../../components/ListItem";
import Icon from "../../../components/Icon";
import ListItemSeparator from "../../../components/ListItemSeparator";
import ClaimsCard from "../../../components/ClaimsCard";

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
      <FlatList
        data={rewards}
        keyExtractor={(reward) => reward.id}
        ItemSeparatorComponent={ListItemSeparator}
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

const styles = StyleSheet.create({});
