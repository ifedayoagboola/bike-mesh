import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import MapView, { Callout, Marker } from "react-native-maps";
import { icons, images } from "../constants";

export default function CustomMarker({
  latitude,
  longitude,
  title,
  image,
  coordinate,
}) {
  // console.log("my location", coordinate);
  return (
    <Marker
      coordinate={coordinate}
      className="w-[30px] h-[30px] items-center justify-center"
    >
      <View style={styles.markerContainer}>
        <Image source={images.bicycle} style={styles.markerImage} />
      </View>
      <Callout tooltip>
        <View>
          <Text>{title}</Text>
        </View>
      </Callout>
    </Marker>
  );
}

const styles = StyleSheet.create({
  markerImage: {
    width: "100%",
    height: "100%",
  },
  markerContainer: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
    borderColor: "red",
    borderWidth: 2,
    backgroundColor: "red",
  },
});
