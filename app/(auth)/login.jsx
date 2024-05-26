import { useState } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Dimensions, Alert, Image } from "react-native";

import { icons, images } from "../../constants";
import { CustomButton, FormField } from "../../components";
import { getCurrentUser, signIn } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";

const Login = () => {
  const { setUser, setIsLoggedIn } = useGlobalContext();
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const submit = async () => {
    if (form.email === "" || form.password === "") {
      Alert.alert("Error", "Please fill in all fields");
    }

    setSubmitting(true);

    try {
      await signIn(form.email, form.password);
      const result = await getCurrentUser();
      setUser(result);
      setIsLoggedIn(true);

      Alert.alert("Success", "User signed in successfully");
      router.replace("/location");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View
          className="w-full flex justify-center h-full px-4"
          // style={{
          //   minHeight: Dimensions.get("window").height - 100,
          // }}
        >
          <Image
            source={images.logo2}
            resizeMode="contain"
            className="w-[115px] h-[34px]"
          />

          <Text className="text-4xl font-semibold text-white mt-10 font-pextrabold">
            Welcome back Michael!
          </Text>

          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyboardType="email-address"
          />

          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
          />
          <Link href="" className="self-end font-psemibold text-secondary">
            Forgot password
          </Link>

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
            title="Login"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={false}
          />
          <View className="flex justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Don't have an account?
            </Text>
            <Link
              href="/register"
              className="text-lg font-psemibold text-secondary self-end"
            >
              Register
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Login;
