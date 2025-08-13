import { useState } from "react";
import { Link, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Dimensions, Alert, Image, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { icons, images } from "../../constants";
import { CustomButton, FormField, Loader } from "../../components";
import { createUser, getCurrentUser } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";

const Register = () => {
  const router = useRouter();
  const { setUser, setIsLoggedIn } = useGlobalContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const submit = async () => {
    if (form.username === "" || form.email === "" || form.password === "") {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createUser(form.email, form.password, form.username);

      setUser(result);
      setIsLoggedIn(true);

      Alert.alert("Success", "Account created successfully!");
      router.replace("/location");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialLogin = (platform) => {
    Alert.alert("Coming Soon", `${platform} registration will be available soon!`);
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
              Join the asset tracking revolution
            </Text>
          </View>

          {/* Welcome Text */}
          <View className="mb-8">
            <Text className="text-4xl font-bold text-white mb-2">
              Create Account
            </Text>
            <Text className="text-lg text-gray-300">
              Start tracking your valuable assets today
            </Text>
          </View>
        </View>

        {/* Form Section */}
        <View className="mb-8">
          <FormField
            title="Username"
            value={form.username}
            handleChangeText={(e) => setForm({ ...form, username: e })}
            otherStyles="mb-6"
            placeholder="Choose a username"
          />

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
            otherStyles="mb-6"
            placeholder="Create a strong password"
          />

          <CustomButton
            title="Create Account"
            handlePress={submit}
            containerStyles="mb-8"
            isLoading={isSubmitting}
          />
        </View>

        {/* Divider */}
        <View className="flex-row items-center mb-8">
          <View className="flex-1 h-px bg-gray-700" />
          <Text className="mx-4 text-gray-500 font-medium">or sign up with</Text>
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

        {/* Terms and Sign In Link */}
        <View className="items-center">
          <Text className="text-gray-400 text-center text-sm mb-4 px-4">
            By creating an account, you agree to our{" "}
            <Text className="text-secondary font-semibold">Terms of Service</Text>{" "}
            and{" "}
            <Text className="text-secondary font-semibold">Privacy Policy</Text>
          </Text>
          
          <Text className="text-gray-400 text-base">
            Already have an account?{" "}
            <Link href="/login" className="text-secondary font-bold">
              Sign in
            </Link>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Register;
