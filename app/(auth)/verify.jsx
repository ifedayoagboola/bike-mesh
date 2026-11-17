import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Text, Alert, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { CustomButton, FormField } from "../../components";
import AuthScreen from "../../components/AuthScreen";
import { useGlobalContext } from "../../context/GlobalProvider";
import { resendSignupCode } from "../../lib/api";

// Supabase refuses a second email to the same address inside 60 seconds.
const RESEND_WAIT_SECONDS = 60;

const Verify = () => {
  const router = useRouter();
  // sendOnOpen=1 when we arrive from sign-in: no email has been sent yet.
  const { email, sendOnOpen } = useLocalSearchParams();
  const { verifyEmail } = useGlobalContext();
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(sendOnOpen ? 0 : RESEND_WAIT_SECONDS);
  // What happened to the last email request, always shown so nothing fails silently.
  const [sendStatus, setSendStatus] = useState(
    sendOnOpen ? null : { ok: true, text: "Code sent. It can take a minute to arrive." }
  );

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft(secondsLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  const resend = async () => {
    if (isSending) return;
    setIsSending(true);
    try {
      await resendSignupCode(email);
      setCode("");
      setSecondsLeft(RESEND_WAIT_SECONDS);
      const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      setSendStatus({ ok: true, text: `New code sent at ${time}. Use the newest email.` });
    } catch (error) {
      setSendStatus({ ok: false, text: `The email was not sent: ${error.message}` });
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    if (sendOnOpen) resend();
  }, []);

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
        "Codes expire and only the newest one works. Check it and try again, or send a new code."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const resendBlocked = secondsLeft > 0 || isSending;

  return (
    <AuthScreen isLoading={isSubmitting}>
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
          containerStyles="mb-6"
          isLoading={isSubmitting}
        />

        {sendStatus && (
          <Text
            className={`text-center text-base mb-2 ${
              sendStatus.ok ? "text-gray-300" : "text-red-400"
            }`}
          >
            {sendStatus.text}
          </Text>
        )}

        <TouchableOpacity
          className={`items-center py-3 ${resendBlocked ? "opacity-50" : ""}`}
          onPress={resend}
          disabled={resendBlocked}
        >
          <Text className="text-secondary font-bold text-base">
            {isSending
              ? "Sending..."
              : secondsLeft > 0
              ? `Send a new code (in ${secondsLeft}s)`
              : "Send a new code"}
          </Text>
        </TouchableOpacity>

        <Text className="text-gray-400 text-sm text-center mt-4">
          Nothing in your inbox? Check spam and promotions for an email from Supabase Auth.
        </Text>
    </AuthScreen>
  );
};

export default Verify;
