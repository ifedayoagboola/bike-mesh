import { useEffect, useState } from "react";
import { Keyboard, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Loader from "./Loader";

// Shared shell for the sign-in, sign-up, code and reset screens.
//
// `header` (logo and welcome text) is hidden while the keyboard is open, so the
// field being typed in and the button below it are never covered by the keyboard.
const AuthScreen = ({ header, children, isLoading = false }) => {
  const [keyboardOpen, setKeyboardOpen] = useState(false);

  useEffect(() => {
    const shown = Keyboard.addListener("keyboardDidShow", () => setKeyboardOpen(true));
    const hidden = Keyboard.addListener("keyboardDidHide", () => setKeyboardOpen(false));
    return () => {
      shown.remove();
      hidden.remove();
    };
  }, []);

  return (
    <SafeAreaView edges={["top"]} style={styles.screen}>
      <Loader isLoading={isLoading} />
      <LinearGradient colors={["#0F0F23", "#1A1A2E", "#16213E"]} style={StyleSheet.absoluteFill} />
      <ScrollView
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 40, paddingTop: keyboardOpen ? 16 : 0 }}
      >
        {!keyboardOpen && header}
        {children}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#16213E" },
});

export default AuthScreen;
