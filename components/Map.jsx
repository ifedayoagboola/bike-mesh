import React, { forwardRef, useEffect } from "react";
import MapView from "react-native-maps";
import { StyleSheet } from "react-native";
import CustomMarker from "./CustomMarker";

// Wrapping MapView with forwardRef
const ForwardedMapView = forwardRef((props, ref) => (
  <MapView ref={ref} {...props}>
    {/* {props.myLocation.latitude && props.myLocation.longitude && (
      <Marker
        coordinate={{
          latitude: props.myLocation.latitude,
          longitude: props.myLocation.longitude,
        }}
        title="My current location"
        description="I am here"
        titleVisibility="visible"
      />
    )} */}
    {props.myLocation.latitude && props.myLocation.longitude && (
      <CustomMarker
        coordinate={{
          latitude: props.myLocation.latitude,
          longitude: props.myLocation.longitude,
        }}
        title="My current location"
      />
    )}
  </MapView>
));

const Map = ({ myLocation, _getLocation, mapRef, destination }) => {
  useEffect(() => {
    _getLocation();
  }, []);
  return (
    <ForwardedMapView
      ref={mapRef}
      mapType="standard"
      style={styles.container}
      initialRegion={{
        // latitude: 37.78825,
        // longitude: -122.4324,
        latitude: 54.604560062217914,
        longitude: -5.927063842931933,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
      myLocation={myLocation}
      destination={destination}
      onMapReady={() => console.log("Map is ready")}
      onRegionChangeComplete={(region) => console.log("Region changed", region)}
    />
  );
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
