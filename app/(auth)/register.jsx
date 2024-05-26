import { useState } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Dimensions, Alert, Image } from "react-native";

import { icons, images } from "../../constants";
import { CustomButton, FormField, Loader } from "../../components";
import { createUser, getCurrentUser, signIn } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";

const Register = () => {
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
    }

    setIsSubmitting(true);

    try {
      const result = await createUser(form.email, form.password, form.username);

      setUser(result);
      setIsLoggedIn(true);

      Alert.alert("Success", "User signed in successfully");
      router.replace("/location");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <Loader isLoading={isSubmitting} />
      <ScrollView>
        <View
          className="w-full flex justify-center h-full px-4"
          style={{
            minHeight: Dimensions.get("window").height - 100,
          }}
        >
          <Image
            source={images.logo2}
            resizeMode="contain"
            className="w-[115px] h-[34px]"
          />
          <Text className="text-3xl font-semibold text-white font-pextrabold">
            Create an account
          </Text>
          <FormField
            title="Username"
            value={form.username}
            handleChangeText={(e) => setForm({ ...form, username: e })}
            otherStyles="mt-4"
          />
          <FormField
            title="email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyboardType="email-address"
          />

          <FormField
            title="password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
          />
          <View className="my-4">
            <Text className="self-center pb-2 justify-center text-gray-500">
              Or Login with
            </Text>
            <View className="flex-row justify-center gap-6">
              <View className="p-2 bg-gray-300 rounded-full">
                <Image source={icons.google} resizeMode="contain" />
              </View>
              <View className="p-2 bg-gray-300 rounded-full">
                <Image source={icons.apple} resizeMode="contain" />
              </View>
              <View className="p-2 bg-gray-300 rounded-full">
                <Image source={icons.facebook} resizeMode="contain" />
              </View>
            </View>
          </View>

          <CustomButton
            title="Register"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={false}
          />

          <View className="flex justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Already have an account?
            </Text>
            <Link
              href="/login"
              className="text-lg font-psemibold text-secondary"
            >
              Login
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Register;
