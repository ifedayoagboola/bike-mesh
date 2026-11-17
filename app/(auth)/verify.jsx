import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Alert, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { CustomButton, FormField, Loader } from "../../components";
import { useGlobalContext } from "../../context/GlobalProvider";
import { resendSignupCode } from "../../lib/api";

const RESEND_WAIT_SECONDS = 60;

const Verify = () => {
  const router = useRouter();
  const { email } = useLocalSearchParams();
  const { verifyEmail } = useGlobalContext();
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_WAIT_SECONDS);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft(secondsLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  const submit = async () => {
    if (code.trim().length < 6) {
      Alert.alert("Enter the code", "Type the code from the email we sent you.");
      return;
    }
    setIsSubmitting(true);
    try {
      await verifyEmail(email, code);
      router.replace("/location");
    } catch (error) {
      Alert.alert(
        "That code did not work",
        "Check the code and try again, or ask for a new one."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const resend = async () => {
    try {
      await resendSignupCode(email);
      setCode("");
      setSecondsLeft(RESEND_WAIT_SECONDS);
    } catch (error) {
      Alert.alert("Could not send a new code", error.message);
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <Loader isLoading={isSubmitting} />
      <LinearGradient
        colors={["#0F0F23", "#1A1A2E", "#16213E"]}
        className="absolute w-full h-full"
      />

      <ScrollView
        className="flex-1 px-6"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <TouchableOpacity className="pt-6 pb-8 self-start" onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>

        <Text className="text-4xl font-bold text-white mb-2">Check your email</Text>
        <Text className="text-lg text-gray-300 mb-8">
          We sent a code to <Text className="text-white font-semibold">{email}</Text>. Enter it
          here to finish creating your account.
        </Text>

        <FormField
          title="Code"
          value={code}
          handleChangeText={(text) => setCode(text.replace(/\D/g, ""))}
          otherStyles="mb-6"
          placeholder="Enter the code"
          keyboardType="number-pad"
          maxLength={10}
          autoFocus
          textContentType="oneTimeCode"
          autoComplete="sms-otp"
          returnKeyType="done"
          onSubmitEditing={submit}
        />

        <CustomButton
          title="Confirm"
          handlePress={submit}
          containerStyles="mb-8"
          isLoading={isSubmitting}
        />

        <View className="items-center">
          {secondsLeft > 0 ? (
            <Text className="text-gray-400 text-base">
              You can ask for a new code in {secondsLeft}s
            </Text>
          ) : (
            <TouchableOpacity onPress={resend}>
              <Text className="text-secondary font-bold text-base">Send a new code</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Verify;
