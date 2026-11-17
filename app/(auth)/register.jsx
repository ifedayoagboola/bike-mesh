import { useState } from "react";
import { Link, useRouter } from "expo-router";
import { View, Text, Alert, Image } from "react-native";

import { images } from "../../constants";
import { CustomButton, FormField } from "../../components";
import AuthScreen from "../../components/AuthScreen";
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
    if (form.username.trim() === "" || form.email.trim() === "" || form.password === "") {
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

  const header = (
    <View className="pt-8 pb-8">
      <View className="items-center mb-6">
        <View className="w-20 h-20 bg-secondary/20 rounded-3xl items-center justify-center mb-4">
          <Image source={images.logo} resizeMode="contain" className="w-12 h-12" />
        </View>
        <Text className="text-2xl font-bold text-white text-center mb-2">Bike Mesh</Text>
        <Text className="text-gray-400 text-center text-base">
          Always know where your bike is
        </Text>
      </View>
      <Text className="text-4xl font-bold text-white mb-2">Create Account</Text>
      <Text className="text-lg text-gray-300">Pair your bike in the next step</Text>
    </View>
  );

  return (
    <AuthScreen header={header} isLoading={isSubmitting}>
      <FormField
        title="Username"
        value={form.username}
        handleChangeText={(e) => setForm({ ...form, username: e })}
        otherStyles="mb-6"
        placeholder="Choose a username"
        maxLength={40}
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
        autoCapitalize="none"
        placeholder="At least 6 characters"
        returnKeyType="done"
        onSubmitEditing={submit}
      />

      <CustomButton
        title="Create Account"
        handlePress={submit}
        containerStyles="mb-8"
        isLoading={isSubmitting}
      />

      <View className="items-center">
        <Text className="text-gray-400 text-base">
          Already have an account?{" "}
          <Link href="/login" className="text-secondary font-bold">
            Sign in
          </Link>
        </Text>
      </View>
    </AuthScreen>
  );
};

export default Register;
