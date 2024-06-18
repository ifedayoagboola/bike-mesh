import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { Stack, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "../../../config/colors";
import { icons, images } from "../../../constants";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { CustomButton } from "../../../components";

const MakeClaims = () => {
  const assets = [
    {
      id: 1,
      assetName: "Lauren's bike",
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
      assetName: "HR Ride to work scheme",
      assetType: "bicycle",
      lastSeen: "Near Duncregan Village centre Since 01:52pm",
      icon: "bicycle",
    },
    {
      id: 4,
      assetName: "Giant TCR",
      assetType: "bicycle",
      lastSeen: "Near Duncregan Village centre Since 01:52pm",
      icon: "bicycle",
    },
    {
      id: 5,
      assetName: "My Delivery Bike",
      assetType: "bicycle",
      lastSeen: "Near Duncregan Village centre Since 01:52pm",
      icon: "bicycle",
    },
    {
      id: 6,
    },
  ];

  const route = useRoute();
  const { id } = route.params;

  const data = assets.filter((item) => {
    return id == item.id;
  });
  const asset = data[0];
  return (
    <SafeAreaView style={styles.screen} className="p-4">
      <ScrollView>
        <View className="space-y-4">
          {/* <Stack.Screen options={{ headerTitle: header[0].assetName }} /> */}
          <Stack.Screen options={{ headerShown: false }} />
          <TouchableOpacity
            onPress={() => {
              router.back() || router.push("/history");
            }}
          >
            <Image
              source={icons.back}
              resizeMode="contain"
              className="w-6 h-6"
            />
          </TouchableOpacity>
          <Text className="text-white font-psemibold text-4xl w-[80%]">
            Make Claims
          </Text>
          <View className="flex-row justify-between items-center">
            <Text className="text-white font-pregular text-base">
              Bike No: 23487
            </Text>
            <View className="flex-row items-center justify-center">
              <MaterialCommunityIcons
                color={colors.secondary}
                name="circle"
                size={15}
              />
              <Text className="text-white font-pregular text-base pl-2">
                Connected
              </Text>
            </View>
          </View>
          <View className="items-center justify-center">
            <Image
              source={images.bicycle}
              resizeMode="contain"
              className="w-[200px] h-[200px]"
            />
          </View>
          <View className="flex-row items-center justify-around bg-gray-800 border rounded-xl">
            <View className="p-4 space-y-2">
              <Text className="text-white font-psemibold text-xl">£250</Text>
              <Text className="text-gray-400 font-pregular text-base">
                Earnings
              </Text>
            </View>
            <View className="w-[0.5px] h-[80%] bg-gray-400"></View>
            <View className="p-4 space-y-2">
              <Text className="text-white font-psemibold text-xl">64KM</Text>
              <Text className="text-gray-400 font-pregular text-base">
                Distance
              </Text>
            </View>
            <View className="w-[0.5px] h-[80%] bg-gray-400"></View>
            <View className="p-4 space-y-2">
              <Text className="text-white font-psemibold text-xl">52h 13m</Text>
              <Text className="text-gray-400 font-pregular text-base">
                Usage Time
              </Text>
            </View>
          </View>

          <TouchableOpacity className="flex-row justify-between items-center px-6">
            <Text className="text-white text-base">Recent Rides</Text>
            <MaterialCommunityIcons
              color={colors.secondary}
              name="chevron-right"
              size={15}
            />
          </TouchableOpacity>

          <View className="w-full h-[150px]">
            <Image
              source={images.frame}
              resizeMode="contain"
              className="w-full h-full"
            />
          </View>
          <View className="w-[200px] self-center">
            <CustomButton
              title="Make Claim"
              containerStyles="mt-7"
              isLoading={false}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MakeClaims;

const styles = StyleSheet.create({});
