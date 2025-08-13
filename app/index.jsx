import { Redirect, router } from "expo-router";
import { View } from "react-native";
import { Loader } from "../components";
import { useGlobalContext } from "../context/GlobalProvider";
import OnboardingScreen from "../components/OnboardingScreen";

const Welcome = () => {
  const { isLoading, isLoggedIn } = useGlobalContext();

  if (!isLoading && isLoggedIn) return <Redirect href="/location" />;

  const handleOnboardingComplete = () => {
    router.push("/register");
  };

  return (
    <>
      <Loader isLoading={isLoading} />
      <OnboardingScreen onComplete={handleOnboardingComplete} />
    </>
  );
};

export default Welcome;
