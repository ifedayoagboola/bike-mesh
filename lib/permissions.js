import { PermissionsAndroid, Platform } from "react-native";
import * as Location from "expo-location";

// BLE scanning for beacons needs nearby-devices permission (Android 12+)
// and precise location, which we also use to stamp where a bike was seen.
const androidPermissions = () => {
  const P = PermissionsAndroid.PERMISSIONS;
  if (Platform.Version >= 31) {
    return [P.BLUETOOTH_SCAN, P.BLUETOOTH_CONNECT, P.ACCESS_FINE_LOCATION];
  }
  return [P.ACCESS_FINE_LOCATION];
};

export const hasTrackingPermissions = async () => {
  if (Platform.OS === "android") {
    const results = await Promise.all(
      androidPermissions().map((p) => PermissionsAndroid.check(p))
    );
    return results.every(Boolean);
  }
  const { status } = await Location.getForegroundPermissionsAsync();
  return status === "granted";
};

// Resolves to 'granted', 'denied' or 'blocked' (user must open system settings).
export const requestTrackingPermissions = async () => {
  if (Platform.OS === "android") {
    const results = await PermissionsAndroid.requestMultiple(androidPermissions());
    const values = Object.values(results);
    if (values.every((v) => v === PermissionsAndroid.RESULTS.GRANTED)) return "granted";
    if (values.some((v) => v === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN)) return "blocked";
    return "denied";
  }
  const { status, canAskAgain } = await Location.requestForegroundPermissionsAsync();
  if (status === "granted") return "granted";
  return canAskAgain ? "denied" : "blocked";
};
