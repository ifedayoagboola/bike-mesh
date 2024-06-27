import React from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableHighlight,
  ImageBackground,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import colors from "../config/colors";
import Text from "../components/Text";
import { images } from "../constants";
import { useGlobalContext } from "../context/GlobalProvider";

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
  const { isLoading } = useGlobalContext();
  return (
    <View className="my-4">
      <GestureHandlerRootView>
        <Swipeable renderRightActions={renderRightActions}>
          <TouchableHighlight underlayColor={colors.light} className="flex-1">
            <ImageBackground
              className="flex-1 justify-center"
              source={images.claimscardbg}
              resizeMode="cover"
            >
              <View style={styles.container} {...args}>
                {image && <Image style={styles.image} source={image} />}
                <View style={styles.detailsContainer}>
                  <Text className="text-white text-lg">{title}</Text>

                  <Text className="text-gray-400 py-2 text-sm">
                    Completed 80km
                  </Text>

                  <View className="flex-row items-center justify-between gap-2">
                    <View className="flex-row items-center justify-start">
                      <View>{IconComponent}</View>
                      <Text className="text-gray-100 text-sm">
                        Today 08:30 AM
                      </Text>
                    </View>

                    <TouchableOpacity
                      activeOpacity={0.7}
                      className={`bg-secondary rounded-2xl flex flex-row justify-center items-center p-2${
                        isLoading ? "opacity-50" : ""
                      }`}
                      disabled={isLoading}
                    >
                      <Text className={`text-primary font-normal text-sm`}>
                        Claim Reward
                      </Text>

                      {isLoading && (
                        <ActivityIndicator
                          animating={isLoading}
                          color="#fff"
                          size="small"
                          className="ml-2"
                        />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </ImageBackground>
          </TouchableHighlight>
        </Swipeable>
      </GestureHandlerRootView>
    </View>
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
