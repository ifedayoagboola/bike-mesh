import { StatusBar } from "expo-status-bar";
import { Redirect, router } from "expo-router";
import { View, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Text from "../components/Text";

import { images } from "../constants";
import { CustomButton, Loader } from "../components";
import { useGlobalContext } from "../context/GlobalProvider";

import Onboarding from "react-native-onboarding-swiper";
import SplashScreen from "../components/SplashScreen";

const Welcome = () => {
  const { isLoading, isLoggedIn, user } = useGlobalContext();

  if (!isLoading && isLoggedIn) return <Redirect href="/location" />;
  return (
    // <SafeAreaView className="bg-primary h-full">
    //   <Loader isLoading={isLoading} />

    //   <ScrollView
    //     contentContainerStyle={{
    //       height: "100%",
    //     }}
    //   >
    //     <View className="w-full flex justify-center items-center h-full px-4">
    //       <Image
    //         source={images.logo2}
    //         className="w-[130px] h-[84px]"
    //         resizeMode="contain"
    //       />

    //       <Image
    //         source={images.demo}
    //         className="max-w-[380px] w-full h-[298px]"
    //         resizeMode="contain"
    //       />

    //       <View className="relative mt-5">
    //         <Text className="text-3xl text-white font-bold text-center">
    //           Track your bicycles{"\n"}
    //           with
    //           <Text className="text-secondary-200">Bike Mesh</Text>
    //         </Text>

    //         <Image
    //           source={images.path}
    //           className="w-[136px] h-[15px] absolute -bottom-2 -right-8"
    //           resizeMode="contain"
    //         />
    //       </View>

    //       <Text className="text-sm font-pregular text-gray-100 mt-7 text-center">
    //         Where Creativity Meets Innovation: Embark on a Journey of
    //         Exploration with Bike Mesh
    //       </Text>

    //       <CustomButton
    //         title="Skip Demo"
    //         handlePress={() => router.push("/register")}
    //         containerStyles="w-full mt-7"
    //       />
    //     </View>
    //   </ScrollView>
    // </SafeAreaView>
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
