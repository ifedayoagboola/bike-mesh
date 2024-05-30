import { Redirect, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { Loader } from "../../../components/Loader";
import { useGlobalContext } from "../../../context/GlobalProvider";

const HistoryLayout = () => {
  const { isLoading, isLoggedIn } = useGlobalContext();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default HistoryLayout;
