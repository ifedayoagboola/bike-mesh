import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";
import { images } from "../constants";
import ListItem from "./ListItem";
import colors from "../config/colors";

const assets = [
  {
    id: 1,
    assetName: "Giant TCR Advanced",
    assetType: "bicycle",
    lastSeen: "Near Duncregan Village centre Since 01:52pm",
    icon: "bicycle",
  },
  {
    id: 2,
    assetName: "Giant TCR Advanced",
    assetType: "bicycle",
    lastSeen: "Near Duncregan Village centre Since 01:52pm",
    icon: "bicycle",
  },
  {
    id: 3,
    assetName: "Giant TCR Advanced",
    assetType: "bicycle",
    lastSeen: "Near Duncregan Village centre Since 01:52pm",
    icon: "bicycle",
  },
  {
    id: 4,
    assetName: "Giant TCR Advanced",
    assetType: "bicycle",
    lastSeen: "Near Duncregan Village centre Since 01:52pm",
    icon: "bicycle",
  },
  {
    id: 5,
    assetName: "Giant TCR Advanced",
    assetType: "bicycle",
    lastSeen: "Near Duncregan Village centre Since 01:52pm",
    icon: "bicycle",
  },
];

const AssetCard = ({ item }) => {
  return (
    <View className="items-center justify-center border border-gray-200">
      <Image
        source={images.bicycle}
        resizeMode="contain"
        className="w-[120px] h-[120px]"
      />
      <Text className="text-white font-pregular text-base">
        Giant TCR Advanced
      </Text>
      <TouchableOpacity>
        <View className="flex-row">
          <Text className="text-secondary font-pregular text-base">
            Make Claim
          </Text>
          <MaterialCommunityIcons
            color={colors.secondary}
            name="chevron-right"
            size={25}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default AssetCard;

const styles = StyleSheet.create({});
