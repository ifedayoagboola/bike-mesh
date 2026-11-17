import { useEffect, useState } from "react";
import { View } from "react-native";
import { Redirect, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Loader } from "../components";
import { useGlobalContext } from "../context/GlobalProvider";
import OnboardingScreen from "../components/OnboardingScreen";

const ONBOARDED_KEY = "bikemesh.onboarded";

const Welcome = () => {
  const { isLoading, isLoggedIn } = useGlobalContext();
  // null while we look it up, then true or false.
  const [onboarded, setOnboarded] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem(ONBOARDED_KEY)
      .then((value) => setOnboarded(value === "1"))
      .catch(() => setOnboarded(false));
  }, []);

  if (isLoading || onboarded === null) {
    return (
      <View style={{ flex: 1, backgroundColor: "#0F0F23" }}>
        <Loader isLoading />
      </View>
    );
  }
  if (isLoggedIn) return <Redirect href="/location" />;
  // Someone who has seen the intro before goes straight to sign in.
  if (onboarded) return <Redirect href="/login" />;

  const handleOnboardingComplete = () => {
    AsyncStorage.setItem(ONBOARDED_KEY, "1").catch(() => {});
    router.replace("/register");
  };

  return <OnboardingScreen onComplete={handleOnboardingComplete} />;
};

export default Welcome;
