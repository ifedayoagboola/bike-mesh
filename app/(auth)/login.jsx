import { useState } from "react";
import { Link, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Dimensions, Alert, Image, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { icons, images } from "../../constants";
import { CustomButton, FormField, Loader } from "../../components";
import { getCurrentUser, logout, signIn } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";

const Login = () => {
  const router = useRouter();
  const { setUser, setIsLoggedIn } = useGlobalContext();
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const submit = async () => {
    if (form.email === "" || form.password === "") {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setSubmitting(true);

    try {
      await signIn(form.email, form.password);
      const result = await getCurrentUser();
      setUser(result);
      setIsLoggedIn(true);

      // Alert.alert("Success", "User signed in successfully");
      router.replace("/location");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSocialLogin = (platform) => {
    Alert.alert("Coming Soon", `${platform} login will be available soon!`);
  };

  return (
    <SafeAreaView className="flex-1">
      <Loader isLoading={isSubmitting} />
      
      {/* Background Gradient */}
      <LinearGradient
        colors={['#0F0F23', '#1A1A2E', '#16213E']}
        className="absolute w-full h-full"
      />
      
      <ScrollView 
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Header Section */}
        <View className="pt-8 pb-12">
          {/* Logo */}
          <View className="items-center mb-8">
            <View className="w-20 h-20 bg-secondary/20 rounded-3xl items-center justify-center mb-4">
              <Image
                source={images.logo}
                resizeMode="contain"
                className="w-12 h-12"
              />
            </View>
            <Text className="text-2xl font-bold text-white text-center mb-2">
              Bike Mesh
            </Text>
            <Text className="text-gray-400 text-center text-base">
              The best asset tracker app alive
            </Text>
          </View>

          {/* Welcome Text */}
          <View className="mb-8">
            <Text className="text-4xl font-bold text-white mb-2">
              Welcome back!
            </Text>
            <Text className="text-lg text-gray-300">
              Sign in to continue tracking your assets
            </Text>
          </View>
        </View>

        {/* Form Section */}
        <View className="mb-8">
          <FormField
            title="Email Address"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mb-6"
            keyboardType="email-address"
            placeholder="Enter your email"
          />

          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mb-4"
            placeholder="Enter your password"
          />
          
          <TouchableOpacity className="self-end mb-6">
            <Text className="text-secondary font-semibold text-base">
              Forgot password?
            </Text>
          </TouchableOpacity>

          <CustomButton
            title="Sign In"
            handlePress={submit}
            containerStyles="mb-8"
            isLoading={isSubmitting}
          />
        </View>

        {/* Divider */}
        <View className="flex-row items-center mb-8">
          <View className="flex-1 h-px bg-gray-700" />
          <Text className="mx-4 text-gray-500 font-medium">or continue with</Text>
          <View className="flex-1 h-px bg-gray-700" />
        </View>

        {/* Social Login Buttons */}
        <View className="flex-row justify-center gap-4 mb-8">
          <TouchableOpacity
            onPress={() => handleSocialLogin("Google")}
            className="w-16 h-16 bg-white/10 border border-gray-700 rounded-2xl items-center justify-center active:bg-white/20 active:scale-95"
            activeOpacity={0.7}
          >
            <Image source={icons.google} className="w-8 h-8" resizeMode="contain" />
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => handleSocialLogin("Apple")}
            className="w-16 h-16 bg-white/10 border border-gray-700 rounded-2xl items-center justify-center active:bg-white/20 active:scale-95"
            activeOpacity={0.7}
          >
            <Image source={icons.apple} className="w-8 h-8" resizeMode="contain" />
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => handleSocialLogin("Facebook")}
            className="w-16 h-16 bg-white/10 border border-gray-700 rounded-2xl items-center justify-center active:bg-white/20 active:scale-95"
            activeOpacity={0.7}
          >
            <Image source={icons.facebook} className="w-8 h-8" resizeMode="contain" />
          </TouchableOpacity>
        </View>

        {/* Sign Up Link */}
        <View className="items-center">
          <Text className="text-gray-400 text-base">
            Don't have an account?{" "}
            <Link href="/register" className="text-secondary font-bold">
              Sign up
            </Link>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Login;
