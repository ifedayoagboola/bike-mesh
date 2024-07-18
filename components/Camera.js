import { CameraView, useCameraPermissions } from "expo-camera";
import { useState } from "react";
import {
  Button,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Loader from "./Loader";
import colors from "../config/colors";
import { icons } from "../constants";
import { router } from "expo-router";

export default function Camera() {
  const [facing, setFacing] = useState("back");
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    // Camera permissions are still loading.
    return <Loader />;
  }
  const scanningResult = (BarcodeScanningResult) => {
    console.log(BarcodeScanningResult);
  };

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        BarcodeScanningResult={scanningResult()}
      >
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => {
              router.back() || router.push("/history");
            }}
          >
            <Image
              source={icons.back}
              resizeMode="contain"
              className="w-6 h-6"
            />
          </TouchableOpacity>

          <TouchableOpacity
            className="p-2 rounded-xl"
            style={styles.button}
            onPress={toggleCameraFacing}
          >
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    width: "100%",
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",

    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
    backgroundColor: colors.secondary,
  },
  text: {
    fontSize: 16,
    fontWeight: "normal",
    color: "black",
  },
});
