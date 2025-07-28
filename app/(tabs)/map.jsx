import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  ScrollView,
  Alert,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import MapView, { Marker, Polygon, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import colors from "../../config/colors";
import GeofenceEditor from "../../components/GeofenceEditor";

const { width, height } = Dimensions.get("window");

// Sample data for demonstration
const sampleBikes = [
  {
    id: "1",
    title: "Commuter",
    coordinates: [
      { latitude: 40.7128, longitude: -74.0060, timestamp: Date.now() - 1000 * 60 * 30 }, // 30 min ago
      { latitude: 40.7130, longitude: -74.0062, timestamp: Date.now() - 1000 * 60 * 60 }, // 1 hour ago
      { latitude: 40.7132, longitude: -74.0065, timestamp: Date.now() - 1000 * 60 * 60 * 2 }, // 2 hours ago
      { latitude: 40.7135, longitude: -74.0068, timestamp: Date.now() - 1000 * 60 * 60 * 6 }, // 6 hours ago
      { latitude: 40.7140, longitude: -74.0070, timestamp: Date.now() - 1000 * 60 * 60 * 12 }, // 12 hours ago
      { latitude: 40.7145, longitude: -74.0075, timestamp: Date.now() - 1000 * 60 * 60 * 24 }, // 24 hours ago
    ],
    status: "active",
  },
  {
    id: "2",
    title: "Mountain Bike",
    coordinates: [
      { latitude: 40.7150, longitude: -74.0080, timestamp: Date.now() - 1000 * 60 * 60 * 2 }, // 2 hours ago
      { latitude: 40.7155, longitude: -74.0085, timestamp: Date.now() - 1000 * 60 * 60 * 6 }, // 6 hours ago
      { latitude: 40.7160, longitude: -74.0090, timestamp: Date.now() - 1000 * 60 * 60 * 12 }, // 12 hours ago
      { latitude: 40.7165, longitude: -74.0095, timestamp: Date.now() - 1000 * 60 * 60 * 24 }, // 24 hours ago
    ],
    status: "inactive",
  },
];

const geofences = [
  {
    id: "home",
    title: "Home",
    coordinates: [
      { latitude: 40.7128, longitude: -74.0060 },
      { latitude: 40.7128, longitude: -74.0050 },
      { latitude: 40.7138, longitude: -74.0050 },
      { latitude: 40.7138, longitude: -74.0060 },
    ],
    color: "#00F70440",
    strokeColor: "#00F704",
  },
  {
    id: "work",
    title: "Work",
    coordinates: [
      { latitude: 40.7150, longitude: -74.0080 },
      { latitude: 40.7150, longitude: -74.0070 },
      { latitude: 40.7160, longitude: -74.0070 },
      { latitude: 40.7160, longitude: -74.0080 },
    ],
    color: "#FFA50040",
    strokeColor: "#FFA500",
  },
];

const MapScreen = () => {
  const [selectedFilter, setSelectedFilter] = useState("24h"); // 24h, week, all
  const [selectedBike, setSelectedBike] = useState(null);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [isReplayMode, setIsReplayMode] = useState(false);
  const [replayProgress, setReplayProgress] = useState(0);
  const [userLocation, setUserLocation] = useState(null);
  const [showGeofenceEditor, setShowGeofenceEditor] = useState(false);
  const [longPressLocation, setLongPressLocation] = useState(null);
  
  const mapRef = useRef(null);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const drawerAnim = useRef(new Animated.Value(0)).current;

  // Get pin color based on timestamp
  const getPinColor = (timestamp) => {
    const age = Date.now() - timestamp;
    const hours = age / (1000 * 60 * 60);
    
    if (hours <= 24) return "#00F704"; // Green - recent
    if (hours <= 168) return "#FFA500"; // Amber - >24h
    return "#808080"; // Grey - week-old
  };

  // Filter coordinates based on selected time range
  const getFilteredCoordinates = () => {
    const now = Date.now();
    const filterTime = selectedFilter === "24h" ? 24 * 60 * 60 * 1000 : 
                      selectedFilter === "week" ? 7 * 24 * 60 * 60 * 1000 : 
                      Infinity;

    return sampleBikes.map(bike => ({
      ...bike,
      coordinates: bike.coordinates.filter(coord => 
        now - coord.timestamp <= filterTime
      )
    }));
  };

  // Get current position based on replay time
  const getCurrentPositions = () => {
    if (!isReplayMode) {
      return getFilteredCoordinates().map(bike => ({
        ...bike,
        currentPosition: bike.coordinates[0]
      }));
    }

    const replayTime = Date.now() - (24 * 60 * 60 * 1000 * (1 - replayProgress));
    
    return getFilteredCoordinates().map(bike => {
      const validCoords = bike.coordinates.filter(coord => coord.timestamp <= replayTime);
      return {
        ...bike,
        currentPosition: validCoords[validCoords.length - 1] || bike.coordinates[0]
      };
    });
  };

  // Get address from coordinates
  const getAddressFromCoordinates = async (latitude, longitude) => {
    try {
      const response = await Location.reverseGeocodeAsync({
        latitude,
        longitude
      });
      
      if (response.length > 0) {
        const address = response[0];
        return `${address.street || ''} ${address.name || ''}, ${address.city || ''}`.trim();
      }
      return "Unknown location";
    } catch (error) {
      return "Unknown location";
    }
  };

  const handleMarkerPress = async (bike) => {
    setSelectedBike(bike);
    
    // Animate drawer up
    Animated.spring(drawerAnim, {
      toValue: 1,
      useNativeDriver: false,
    }).start();

    // Get address
    const address = await getAddressFromCoordinates(
      bike.currentPosition.latitude,
      bike.currentPosition.longitude
    );
    
    setSelectedBike(prev => ({ ...prev, address }));
  };

  const handleNavigate = () => {
    if (!selectedBike) return;
    
    const { latitude, longitude } = selectedBike.currentPosition;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert("Error", "Could not open navigation app");
      }
    });
  };

  const closeDrawer = () => {
    Animated.spring(drawerAnim, {
      toValue: 0,
      useNativeDriver: false,
    }).start(() => {
      setSelectedBike(null);
    });
  };

  const toggleReplayMode = () => {
    setIsReplayMode(!isReplayMode);
    if (!isReplayMode) {
      setReplayProgress(0);
    }
  };

  const handleReplaySlider = (value) => {
    setReplayProgress(value);
  };

  const handleMapLongPress = (event) => {
    setLongPressLocation(event.nativeEvent.coordinate);
    setShowGeofenceEditor(true);
  };

  const handleGeofenceSaved = (geofence) => {
    // Add the new geofence to the list
    geofences.push(geofence);
    console.log("Geofence saved:", geofence);
  };

  useEffect(() => {
    // Get user location
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setUserLocation(location.coords);
    })();
  }, []);

  const currentBikes = getCurrentPositions();

  return (
    <SafeAreaView style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Bike Locations</Text>
        
        {/* Replay Controls */}
        <View style={styles.replayContainer}>
          <TouchableOpacity
            style={[styles.replayButton, isReplayMode && styles.replayButtonActive]}
            onPress={toggleReplayMode}
          >
            <MaterialCommunityIcons
              name="play-circle"
              size={20}
              color={isReplayMode ? colors.white : colors.secondary}
            />
            <Text style={[styles.replayButtonText, isReplayMode && styles.replayButtonTextActive]}>
              Replay
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Time Filter */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[styles.filterButton, selectedFilter === "24h" && styles.filterButtonActive]}
            onPress={() => setSelectedFilter("24h")}
          >
            <Text style={[styles.filterText, selectedFilter === "24h" && styles.filterTextActive]}>
              Last 24h
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.filterButton, selectedFilter === "week" && styles.filterButtonActive]}
            onPress={() => setSelectedFilter("week")}
          >
            <Text style={[styles.filterText, selectedFilter === "week" && styles.filterTextActive]}>
              Week
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.filterButton, selectedFilter === "all" && styles.filterButtonActive]}
            onPress={() => setSelectedFilter("all")}
          >
            <Text style={[styles.filterText, selectedFilter === "all" && styles.filterTextActive]}>
              All
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Replay Slider */}
      {isReplayMode && (
        <View style={styles.sliderContainer}>
          <Text style={styles.sliderLabel}>Timeline</Text>
          <View style={styles.sliderTrack}>
            <Animated.View
              style={[
                styles.sliderFill,
                {
                  width: slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
            <TouchableOpacity
              style={[
                styles.sliderThumb,
                {
                  left: slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, width - 60],
                  }),
                },
              ]}
              onPressIn={() => {
                // Handle slider press
              }}
            />
          </View>
        </View>
      )}

      {/* Map */}
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: 40.7128,
            longitude: -74.0060,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          }}
          showsUserLocation={true}
          showsMyLocationButton={true}
          onLongPress={handleMapLongPress}
        >
          {/* Geofences */}
          {geofences.map((geofence) => (
            <Polygon
              key={geofence.id}
              coordinates={geofence.coordinates}
              fillColor={geofence.color}
              strokeColor={geofence.strokeColor}
              strokeWidth={2}
            />
          ))}

          {/* Bike Markers */}
          {currentBikes.map((bike) => (
            <Marker
              key={bike.id}
              coordinate={bike.currentPosition}
              onPress={() => handleMarkerPress(bike)}
            >
              <View style={[styles.marker, { backgroundColor: getPinColor(bike.currentPosition.timestamp) }]}>
                <MaterialCommunityIcons
                  name="bike"
                  size={16}
                  color={colors.white}
                />
              </View>
            </Marker>
          ))}

          {/* Ghost trail for replay mode */}
          {isReplayMode && currentBikes.map((bike) => (
            bike.coordinates.slice(0, -1).map((coord, index) => (
              <Marker
                key={`${bike.id}-ghost-${index}`}
                coordinate={coord}
                opacity={0.3}
              >
                <View style={[styles.ghostMarker, { backgroundColor: getPinColor(coord.timestamp) }]}>
                  <MaterialCommunityIcons
                    name="bike"
                    size={12}
                    color={colors.white}
                  />
                </View>
              </Marker>
            ))
          ))}
        </MapView>
      </View>

      {/* Bottom Drawer */}
      <Animated.View
        style={[
          styles.drawer,
          {
            transform: [
              {
                translateY: drawerAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [300, 0],
                }),
              },
            ],
          },
        ]}
      >
        {selectedBike && (
          <View style={styles.drawerContent}>
            <View style={styles.drawerHeader}>
              <Text style={styles.drawerTitle}>{selectedBike.title}</Text>
              <TouchableOpacity onPress={closeDrawer}>
                <MaterialCommunityIcons
                  name="close"
                  size={24}
                  color={colors.white}
                />
              </TouchableOpacity>
            </View>
            
            <View style={styles.drawerInfo}>
              <View style={styles.infoRow}>
                <MaterialCommunityIcons
                  name="map-marker"
                  size={20}
                  color={colors.secondary}
                />
                <Text style={styles.infoText}>
                  {selectedBike.address || "Loading address..."}
                </Text>
              </View>
              
              <View style={styles.infoRow}>
                <MaterialCommunityIcons
                  name="clock"
                  size={20}
                  color={colors.secondary}
                />
                <Text style={styles.infoText}>
                  {new Date(selectedBike.currentPosition.timestamp).toLocaleString()}
                </Text>
              </View>
            </View>
            
            <TouchableOpacity
              style={styles.navigateButton}
              onPress={handleNavigate}
            >
              <MaterialCommunityIcons
                name="navigation"
                size={20}
                color={colors.white}
              />
              <Text style={styles.navigateButtonText}>Navigate</Text>
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>

      {/* Geofence Editor Modal */}
      <GeofenceEditor
        visible={showGeofenceEditor}
        onClose={() => setShowGeofenceEditor(false)}
        onGeofenceSaved={handleGeofenceSaved}
        initialLocation={longPressLocation}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.dark,
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    color: colors.white,
    fontSize: 24,
    fontWeight: "bold",
  },
  replayContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  replayButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2A2D3A",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  replayButtonActive: {
    backgroundColor: colors.primary,
  },
  replayButtonText: {
    color: colors.secondary,
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  replayButtonTextActive: {
    color: colors.white,
  },
  filterContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  filterButton: {
    backgroundColor: "#2A2D3A",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
  },
  filterText: {
    color: colors.secondary,
    fontSize: 14,
    fontWeight: "600",
  },
  filterTextActive: {
    color: colors.white,
  },
  sliderContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sliderLabel: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  sliderTrack: {
    height: 4,
    backgroundColor: "#2A2D3A",
    borderRadius: 2,
    position: "relative",
  },
  sliderFill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  sliderThumb: {
    position: "absolute",
    top: -8,
    width: 20,
    height: 20,
    backgroundColor: colors.primary,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.white,
  },
  mapContainer: {
    flex: 1,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    overflow: "hidden",
  },
  map: {
    flex: 1,
  },
  marker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.white,
  },
  ghostMarker: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.white,
  },
  drawer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#232533",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  drawerContent: {
    minHeight: 200,
  },
  drawerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  drawerTitle: {
    color: colors.white,
    fontSize: 20,
    fontWeight: "bold",
  },
  drawerInfo: {
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  infoText: {
    color: colors.white,
    fontSize: 16,
    marginLeft: 12,
    flex: 1,
  },
  navigateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 12,
  },
  navigateButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});

export default MapScreen; 