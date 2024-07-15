import { Redirect, router } from "expo-router";
import { View, Image } from "react-native";
import { images } from "../constants";
import { Loader } from "../components";
import { useGlobalContext } from "../context/GlobalProvider";

import Onboarding from "react-native-onboarding-swiper";

const Welcome = () => {
  const { isLoading, isLoggedIn } = useGlobalContext();

  if (!isLoading && isLoggedIn) return <Redirect href="/location" />;

  return (
    <>
      <Loader isLoading={isLoading} />
      <Onboarding
        showSkip={false}
        onDone={() => {
          router.push("/register");
        }}
        pages={[
          {
            backgroundColor: "yellow",
            image: (
              <View>
                <Image
                  source={images.onboarding1}
                  resizeMode="contain"
                  className="w-[350px] h-[350px]"
                />
              </View>
            ),
            title: "Install Tracker",
            subtitle:
              "First, remove handle bars and carefully install the Bike-mesh tracking device",
          },
          {
            backgroundColor: "pink",
            image: (
              <View>
                <Image
                  source={images.onboarding1}
                  resizeMode="contain"
                  className="w-[350px] h-[350px]"
                />
              </View>
            ),
            title: "Install Tracker",
            subtitle:
              "Second, remove handle bars and carefully install the Bike-mesh tracking device",
          },
          {
            backgroundColor: "pink",
            image: (
              <View>
                <Image
                  source={images.onboarding1}
                  resizeMode="contain"
                  className="w-[350px] h-[350px]"
                />
              </View>
            ),
            title: "Install Tracker",
            subtitle:
              "Third, remove handle bars and carefully install the Bike-mesh tracking device",
          },
        ]}
      />
    </>
  );
};

export default Welcome;
