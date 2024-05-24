import {
  View,
  ActivityIndicator,
  Dimensions,
  Platform,
  Text,
  Image,
} from "react-native";
import { icons } from "../constants";

const Loader = ({ isLoading }) => {
  const osName = Platform.OS;
  const screenHeight = Dimensions.get("screen").height;

  if (!isLoading) return null;

  return (
    <View
      className="absolute flex justify-center items-center w-full h-full bg-primary/60 z-10"
      style={{
        height: screenHeight,
      }}
    >
      <Image
        source={icons.loading}
        resizeMode="contain"
        className="w-[150px] h-[150px]"
      />
      {/* <ActivityIndicator
        animating={isLoading}
        color="#fff"
        size={osName === "ios" ? "large" : 50}
      /> */}
    </View>
  );
};

export default Loader;
