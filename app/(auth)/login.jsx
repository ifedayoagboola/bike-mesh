import { useState } from "react";
import { Link, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Alert, Image, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { images } from "../../constants";
import { CustomButton, FormField, Loader } from "../../components";
import { useGlobalContext } from "../../context/GlobalProvider";

const Login = () => {
  const router = useRouter();
  const { login } = useGlobalContext();
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const submit = async () => {
    if (form.email === "" || form.password === "") {
      Alert.alert("Missing details", "Please fill in every field.");
      return;
    }

    setSubmitting(true);

    try {
      await login(form.email, form.password);
      router.replace("/location");
    } catch (error) {
      if (error.needsEmailConfirmation) {
        // Account exists but the email code was never entered. The code
        // screen sends a fresh one and shows whether that worked.
        router.push({
          pathname: "/verify",
          params: { email: form.email.trim(), sendOnOpen: "1" },
        });
        return;
      }
      Alert.alert("Could not sign in", error.message);
    } finally {
      setSubmitting(false);
    }
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
        keyboardShouldPersistTaps="handled"
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
              Always know where your bike is
            </Text>
          </View>

          {/* Welcome Text */}
          <View className="mb-8">
            <Text className="text-4xl font-bold text-white mb-2">
              Welcome back!
            </Text>
            <Text className="text-lg text-gray-300">
              Sign in to see your bikes
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
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="Enter your email"
          />

          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mb-4"
            placeholder="Enter your password"
          />

          <TouchableOpacity
            className="self-end mb-6"
            onPress={() =>
              router.push({ pathname: "/forgot", params: { email: form.email.trim() } })
            }
          >
            <Text className="text-secondary font-semibold text-base">Forgot password?</Text>
          </TouchableOpacity>

          <CustomButton
            title="Sign In"
            handlePress={submit}
            containerStyles="mb-8"
            isLoading={isSubmitting}
          />
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
