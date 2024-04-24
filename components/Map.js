import React from "react";
import MapView from "react-native-maps";
import { StyleSheet, View } from "react-native";

const Map = () => {
  return <MapView style={styles.map} />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
});
export default Map;