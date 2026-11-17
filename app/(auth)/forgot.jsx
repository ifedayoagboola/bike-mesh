import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Text, Alert, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { CustomButton, FormField } from "../../components";
import AuthScreen from "../../components/AuthScreen";
import { useGlobalContext } from "../../context/GlobalProvider";
import { sendPasswordResetCode } from "../../lib/api";

// Supabase refuses a second email to the same address inside 60 seconds.
const RESEND_WAIT_SECONDS = 60;

// Two steps on one screen: ask for the email, then the emailed code plus a new password.
const Forgot = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { resetPassword } = useGlobalContext();

  const [email, setEmail] = useState(typeof params.email === "string" ? params.email : "");
  const [codeRequested, setCodeRequested] = useState(false);
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [isBusy, setIsBusy] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [sendStatus, setSendStatus] = useState(null); // { ok, text }

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft(secondsLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  const sendCode = async () => {
    if (!email.trim()) {
      Alert.alert("Enter your email", "Type the email you signed up with.");
      return;
    }
    setIsBusy(true);
    try {
      await sendPasswordResetCode(email);
      const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      setSendStatus({
        ok: true,
        text: `If ${email.trim()} has an account, a code was sent at ${time}. Use the newest email.`,
      });
      setCodeRequested(true);
      setCode("");
      setSecondsLeft(RESEND_WAIT_SECONDS);
    } catch (error) {
      setSendStatus({ ok: false, text: `The email was not sent: ${error.message}` });
    } finally {
      setIsBusy(false);
    }
  };

  const submit = async () => {
    if (code.trim().length < 6) {
      Alert.alert("Enter the code", "Type the code from the email we sent you.");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Password too short", "Use at least 6 characters.");
      return;
    }
    setIsBusy(true);
    try {
      await resetPassword(email, code, password);
      router.replace("/location");
    } catch (error) {
      Alert.alert("Could not reset your password", error.message);
    } finally {
      setIsBusy(false);
    }
  };

  const resendBlocked = secondsLeft > 0 || isBusy;

  return (
    <AuthScreen isLoading={isBusy}>
        <TouchableOpacity className="pt-6 pb-8 self-start" onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>

        <Text className="text-4xl font-bold text-white mb-2">Reset password</Text>
        <Text className="text-lg text-gray-300 mb-8">
          {codeRequested
            ? "Enter the code from the email and choose a new password."
            : "Enter your email and we will send you a code."}
        </Text>

        <FormField
          title="Email Address"
          value={email}
          handleChangeText={setEmail}
          otherStyles="mb-6"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="Enter your email"
          editable={!codeRequested}
        />

        {codeRequested && (
          <>
            <FormField
              title="Code"
              value={code}
              handleChangeText={(text) => setCode(text.replace(/\D/g, ""))}
              otherStyles="mb-6"
              placeholder="Enter the code"
              keyboardType="number-pad"
              maxLength={10}
              textContentType="oneTimeCode"
              autoComplete="sms-otp"
            />
            <FormField
              title="New password"
              value={password}
              handleChangeText={setPassword}
              otherStyles="mb-6"
              placeholder="At least 6 characters"
            />
          </>
        )}

        <CustomButton
          title={codeRequested ? "Save new password" : "Send code"}
          handlePress={codeRequested ? submit : sendCode}
          containerStyles="mb-6"
          isLoading={isBusy}
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

        {codeRequested && (
          <>
            <TouchableOpacity
              className={`items-center py-3 ${resendBlocked ? "opacity-50" : ""}`}
              onPress={sendCode}
              disabled={resendBlocked}
            >
              <Text className="text-secondary font-bold text-base">
                {secondsLeft > 0 ? `Send a new code (in ${secondsLeft}s)` : "Send a new code"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="items-center py-3" onPress={() => setCodeRequested(false)}>
              <Text className="text-gray-300 text-base">Use a different email</Text>
            </TouchableOpacity>
            <Text className="text-gray-400 text-sm text-center mt-4">
              Nothing in your inbox? Check spam and promotions for an email from Supabase Auth.
            </Text>
          </>
        )}
    </AuthScreen>
  );
};

export default Forgot;
