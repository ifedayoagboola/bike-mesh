import React, { forwardRef } from "react";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { StyleSheet } from "react-native";

// Wrapping MapView with forwardRef
const ForwardedMapView = forwardRef((props, ref) => (
  <MapView ref={ref} {...props} />
));

const Map = () => {
  const mapRef = React.useRef({ PROVIDER_GOOGLE });
  return (
    <ForwardedMapView
      ref={mapRef}
      style={styles.container}
      initialRegion={{
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
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
