import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import Text from "../components/Text";
import { images } from "../constants";
import colors from "../config/colors";

const AssetCard = ({ item, onPress }) => {
  return (
    <TouchableOpacity className="flex-1" onPress={onPress}>
      <View className="items-center justify-center border border-gray-600 rounded-md p-2 m-2 space-y-4">
        <Image
          source={images.bicycle}
          resizeMode="contain"
          className="w-[80px] h-[80px]"
        />

        <Text
          style={{ flexShrink: 1 }}
          className="text-white font-pregular text-sm"
        >
          {item.assetName}
        </Text>

        <View className="flex-row items-center justify-center">
          <Text className="text-secondary font-pregular text-xs">
            Make Claim
          </Text>
          <MaterialCommunityIcons
            color={colors.secondary}
            name="chevron-right"
            size={15}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default AssetCard;

const styles = StyleSheet.create({});
