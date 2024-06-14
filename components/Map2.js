import { Button, Dimensions, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import CustomMarker from "./CustomMarker";
import { icons, images } from "../constants";
import MapViewDirections from "react-native-maps-directions";

export default function Map2() {
  const GOOGLE_MAPS_APIKEY = "AIzaSyC2npOce5wi7Zm5OMJKFYpRdA32y0XEjyk";

  const initialLocation = {
    latitude: 37.78825,
    longitude: -122.4324,
  };
  const [myLocation, setMyLocation] = useState(initialLocation);
  const [destination, setDestination] = React.useState({
    latitude: 54.604560062217914,
    longitude: -5.927063842931933,
  });
  const [pin, setPin] = useState({});
  const [region, setRegion] = useState({
    latitude: initialLocation.latitude,
    longitude: initialLocation.longitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const mapRef = useRef({ PROVIDER_GOOGLE });
  const local = {
    latitude: "37.78825",
    longitude: "-122.4324",
  };

  useEffect(() => {
    setPin(local);
    _getLocation();
    focusOnLocation();
  }, []);

  const _getLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        console.warn("Permission to access location was denied");
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setMyLocation(location.coords);
      // console.log(location);
    } catch (err) {
      console.warn(err);
    }
  };

  const focusOnLocation = () => {
    if (myLocation.latitude && myLocation.longitude) {
      const newRegion = {
        latitude: parseFloat(myLocation.latitude),
        longitude: parseFloat(myLocation.longitude),
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
      if (mapRef.current) {
        mapRef.current.animateToRegion(newRegion, 1000);
      }
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
        ref={mapRef}
        // provider="google"
      >
        {myLocation.latitude && myLocation.longitude && (
          <Marker
            coordinate={{
              latitude: myLocation.latitude,
              longitude: myLocation.longitude,
            }}
            title="My current location"
            description="I am here"
            titleVisibility="visible"
          />
        )}
        {myLocation.latitude && myLocation.longitude && (
          <CustomMarker
            coordinate={{
              latitude: myLocation.latitude,
              longitude: myLocation.longitude,
            }}
            title="My current location"
            image={icons.loading}
          />
        )}

        {pin.latitude && pin.longitude && (
          <Marker
            coordinate={{
              latitude: parseFloat(pin.latitude),
              longitude: parseFloat(pin.longitude),
            }}
            title="Default location"
            description="I am here"
          />
        )}
        <MapViewDirections
          origin={myLocation}
          destination={destination}
          apikey={GOOGLE_MAPS_APIKEY}
          strokeColor="black"
          strokeWidth={2}
        />
      </MapView>
      <View style={styles.buttonContainer}>
        <Button title="Get Location" onPress={focusOnLocation} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    width: "100%",
    alignItems: "center",
  },
  markerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});
