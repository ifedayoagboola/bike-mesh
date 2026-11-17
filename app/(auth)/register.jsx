import { useState } from "react";
import { Link, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Alert, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { images } from "../../constants";
import { CustomButton, FormField, Loader } from "../../components";
import { useGlobalContext } from "../../context/GlobalProvider";

const Register = () => {
  const router = useRouter();
  const { register } = useGlobalContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const submit = async () => {
    if (form.username === "" || form.email === "" || form.password === "") {
      Alert.alert("Missing details", "Please fill in every field.");
      return;
    }

    if (form.password.length < 6) {
      Alert.alert("Password too short", "Use at least 6 characters.");
      return;
    }

    setIsSubmitting(true);

    try {
      const signedIn = await register(form.email, form.password, form.username);
      if (signedIn) {
        // Straight to the bike list, which opens on "Add your first bike".
        router.replace("/location");
      } else {
        router.push({ pathname: "/verify", params: { email: form.email.trim() } });
      }
    } catch (error) {
      if (error.accountExists) {
        Alert.alert(
          "You already have an account",
          `${form.email.trim()} is already registered. Sign in, or reset your password if you have forgotten it.`,
          [
            { text: "Cancel", style: "cancel" },
            { text: "Sign in", onPress: () => router.replace("/login") },
          ]
        );
        return;
      }
      Alert.alert("Could not create account", error.message);
    } finally {
      setIsSubmitting(false);
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
              Create Account
            </Text>
            <Text className="text-lg text-gray-300">
              Pair your bike in the next step
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
            autoCapitalize="none"
            autoCorrect={false}
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
