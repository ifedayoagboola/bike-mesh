import React from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableHighlight,
  ImageBackground,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import colors from "../config/colors";
import Text from "../components/Text";
import { images } from "../constants";

function ClaimsCard({
  title,
  subTitle,
  image,
  IconComponent,
  onPress,
  renderRightActions,
  rightArrowIcon,
  ...args
}) {
  return (
    <GestureHandlerRootView>
      <Swipeable renderRightActions={renderRightActions}>
        <TouchableHighlight
          underlayColor={colors.light}
          onPress={onPress}
          className="flex-1 my-3"
        >
          <ImageBackground
            className="flex-1 justify-center"
            source={images.claimscardbg}
            resizeMode="cover"
          >
            <View style={styles.container} {...args} className="">
              {image && <Image style={styles.image} source={image} />}
              <View style={styles.detailsContainer} className="">
                <Text className="text-white text-lg">{title}</Text>

                <Text className="text-gray-400 py-2 text-sm">
                  Completed 80km
                </Text>

                <View className="flex-row items-center justify-start">
                  {IconComponent}
                  <Text className="text-gray-100 text-sm">Today 08:30 AM</Text>
                </View>
              </View>
            </View>
          </ImageBackground>
        </TouchableHighlight>
      </Swipeable>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
    padding: 15,
    // backgroundColor: colors.white,
  },
  detailsContainer: {
    flex: 1,
    marginLeft: 10,
    justifyContent: "center",
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  subTitle: {
    color: colors.medium,
  },
  title: {
    fontWeight: "500",
  },
});

export default ClaimsCard;
