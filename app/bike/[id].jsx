import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Share,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import colors from "../../config/colors";

const BikeDetailsScreen = () => {
  const { id } = useLocalSearchParams();
  const [bike, setBike] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Sample bike data - replace with real data from your backend
  const sampleBikes = [
    {
      id: "1",
      title: "Commuter",
      emoji: "🚲",
      type: "road",
      status: "home",
      battery: 85,
      lastSeen: "8 min ago",
      location: {
        latitude: 40.7128,
        longitude: -74.0060,
        address: "123 Main St, New York, NY"
      },
      speed: 0,
      distance: 12.5,
      trips: 24,
      avgSpeed: 15.2,
      geofences: [
        { id: "home", name: "Home", type: "circle" },
        { id: "work", name: "Work", type: "polygon" }
      ],
      firmwareVersion: "2.1.0",
      hasUpdate: true,
      lastTrip: {
        date: "2024-01-15",
        distance: 5.2,
        duration: "25 min",
        avgSpeed: 12.4
      }
    },
    {
      id: "2",
      title: "Mountain Bike",
      emoji: "🚵",
      type: "mountain",
      status: "away",
      battery: 45,
      lastSeen: "2 hours ago",
      location: {
        latitude: 40.7150,
        longitude: -74.0080,
        address: "456 Park Ave, New York, NY"
      },
      speed: 0,
      distance: 8.3,
      trips: 12,
      avgSpeed: 18.7,
      geofences: [
        { id: "home", name: "Home", type: "circle" }
      ],
      firmwareVersion: "2.0.5",
      hasUpdate: false,
      lastTrip: {
        date: "2024-01-14",
        distance: 3.8,
        duration: "18 min",
        avgSpeed: 12.7
      }
    }
  ];

  useEffect(() => {
    // Simulate loading bike data
    const loadBike = () => {
      const foundBike = sampleBikes.find(b => b.id === id);
      if (foundBike) {
        setBike(foundBike);
      } else {
        Alert.alert("Error", "Bike not found");
        router.back();
      }
      setIsLoading(false);
    };

    setTimeout(loadBike, 500);
  }, [id]);

  const handleBack = () => {
    router.back();
  };

  const handleEdit = () => {
    Alert.prompt(
      "Rename Bike",
      "Enter new name:",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Rename",
          onPress: (newName) => {
            if (newName && newName.trim()) {
              setBike(prev => ({ ...prev, title: newName.trim() }));
            }
          },
        },
      ],
      "plain-text",
      bike?.title
    );
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out my bike "${bike?.title}" at ${bike?.location.address}`,
        title: bike?.title,
      });
    } catch (error) {
      console.log("Error sharing:", error);
    }
  };

  const handleFindBike = () => {
    router.push("/(tabs)/find");
  };

  const handleViewOnMap = () => {
    router.push("/(tabs)/map");
  };

  const handleSetHome = () => {
    // Navigate to geofence editor
    router.push({
      pathname: "/(tabs)/map",
      params: { openGeofenceEditor: true, bikeId: bike?.id }
    });
  };

  const handlePingBike = () => {
    Alert.alert(
      "Ping Bike",
      "Make your bike beep to help you find it?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Ping", onPress: () => {
          // Simulate pinging the bike
          Alert.alert("Success", "Ping sent to your bike!");
        }}
      ]
    );
  };

  const handleFirmwareUpdate = () => {
    // Navigate to firmware update modal
    router.push({
      pathname: "/(tabs)/home",
      params: { openFirmwareUpdate: true, bikeId: bike?.id }
    });
  };

  const handleNavigate = () => {
    const { latitude, longitude } = bike?.location || {};
    if (latitude && longitude) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
      Linking.openURL(url);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "home": return "#00F704";
      case "away": return "#FFA500";
      default: return "#808080";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "home": return "At Home";
      case "away": return "Away";
      default: return "Unknown";
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1" style={{ backgroundColor: colors.dark }}>
        <View className="flex-1 justify-center items-center">
          <Text className="text-white text-base">Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!bike) {
    return (
      <SafeAreaView className="flex-1" style={{ backgroundColor: colors.dark }}>
        <View className="flex-1 justify-center items-center">
          <Text className="text-white text-base">Bike not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.dark }}>
      <Stack.Screen 
        options={{ 
          headerShown: false,
          title: bike.title
        }} 
      />

      {/* Header */}
      <View className="flex-row items-center px-5 py-4 border-b border-gray-800">
        <TouchableOpacity onPress={handleBack} className="p-2">
          <MaterialCommunityIcons
            name="arrow-left"
            size={24}
            color={colors.white}
          />
        </TouchableOpacity>
        
        <View className="flex-1 ml-3">
          <Text className="text-white text-xl font-semibold">{bike.title}</Text>
          <View className="flex-row items-center mt-1">
            <View 
              className="w-2 h-2 rounded-full mr-2"
              style={{ backgroundColor: getStatusColor(bike.status) }}
            />
            <Text className="text-secondary text-sm">{getStatusText(bike.status)}</Text>
          </View>
        </View>

        <View className="flex-row">
          <TouchableOpacity onPress={handleEdit} className="p-2 ml-2">
            <MaterialCommunityIcons
              name="pencil"
              size={20}
              color={colors.secondary}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleShare} className="p-2 ml-2">
            <MaterialCommunityIcons
              name="share-variant"
              size={20}
              color={colors.secondary}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Bike Icon and Basic Info */}
        <View className="flex-row items-center p-5">
          <View className="w-20 h-20 rounded-full bg-gray-800 justify-center items-center mr-4">
            <Text className="text-4xl">{bike.emoji}</Text>
          </View>
          <View className="flex-1">
            <Text className="text-white text-2xl font-bold mb-1">{bike.title}</Text>
            <Text className="text-secondary text-base capitalize">{bike.type} bike</Text>
          </View>
        </View>

        {/* Status Overview */}
        <View className="px-5 mb-5">
          <View className="bg-gray-800 rounded-2xl p-5 flex-row justify-between">
            <View className="items-center flex-1">
              <MaterialCommunityIcons
                name="battery"
                size={24}
                color={bike.battery > 20 ? "#00F704" : "#FF4444"}
              />
              <Text className="text-secondary text-xs mt-2 mb-1">Battery</Text>
              <Text className="text-white text-base font-semibold">{bike.battery}%</Text>
            </View>
            
            <View className="items-center flex-1">
              <MaterialCommunityIcons
                name="clock-outline"
                size={24}
                color={colors.secondary}
              />
              <Text className="text-secondary text-xs mt-2 mb-1">Last Seen</Text>
              <Text className="text-white text-base font-semibold">{bike.lastSeen}</Text>
            </View>

            <View className="items-center flex-1">
              <MaterialCommunityIcons
                name="speedometer"
                size={24}
                color={colors.secondary}
              />
              <Text className="text-secondary text-xs mt-2 mb-1">Speed</Text>
              <Text className="text-white text-base font-semibold">{bike.speed} km/h</Text>
            </View>
          </View>
        </View>

        {/* Location Map */}
        <View className="px-5 mb-5">
          <Text className="text-white text-lg font-semibold mb-3">Current Location</Text>
          <View className="relative rounded-2xl overflow-hidden mb-2">
            <MapView
              className="h-48"
              provider={PROVIDER_GOOGLE}
              initialRegion={{
                ...bike.location,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              <Marker
                coordinate={bike.location}
                title={bike.title}
              >
                <View className="w-8 h-8 rounded-full bg-primary justify-center items-center border-2 border-white">
                  <MaterialCommunityIcons
                    name="bike"
                    size={16}
                    color={colors.white}
                  />
                </View>
              </Marker>
            </MapView>
            <TouchableOpacity 
              className="absolute bottom-3 right-3 bg-primary flex-row items-center px-3 py-2 rounded-full"
              onPress={handleNavigate}
            >
              <MaterialCommunityIcons
                name="navigation"
                size={20}
                color={colors.white}
              />
              <Text className="text-white text-sm font-semibold ml-1">Navigate</Text>
            </TouchableOpacity>
          </View>
          <Text className="text-secondary text-sm text-center">{bike.location.address}</Text>
        </View>

        {/* Quick Actions */}
        <View className="px-5 mb-5">
          <Text className="text-white text-lg font-semibold mb-3">Quick Actions</Text>
          <View className="flex-row flex-wrap justify-between">
            <TouchableOpacity className="bg-gray-800 rounded-2xl p-4 items-center w-[48%] mb-3" onPress={handleFindBike}>
              <MaterialCommunityIcons
                name="radar"
                size={32}
                color={colors.primary}
              />
              <Text className="text-white text-sm font-semibold mt-2 mb-1">Find Bike</Text>
              <Text className="text-secondary text-xs text-center">Use radar to locate</Text>
            </TouchableOpacity>

            <TouchableOpacity className="bg-gray-800 rounded-2xl p-4 items-center w-[48%] mb-3" onPress={handleViewOnMap}>
              <MaterialCommunityIcons
                name="map"
                size={32}
                color={colors.primary}
              />
              <Text className="text-white text-sm font-semibold mt-2 mb-1">View on Map</Text>
              <Text className="text-secondary text-xs text-center">See on full map</Text>
            </TouchableOpacity>

            <TouchableOpacity className="bg-gray-800 rounded-2xl p-4 items-center w-[48%] mb-3" onPress={handleSetHome}>
              <MaterialCommunityIcons
                name="home"
                size={32}
                color={colors.primary}
              />
              <Text className="text-white text-sm font-semibold mt-2 mb-1">Set Home</Text>
              <Text className="text-secondary text-xs text-center">Create geofence</Text>
            </TouchableOpacity>

            <TouchableOpacity className="bg-gray-800 rounded-2xl p-4 items-center w-[48%] mb-3" onPress={handlePingBike}>
              <MaterialCommunityIcons
                name="bell"
                size={32}
                color={colors.primary}
              />
              <Text className="text-white text-sm font-semibold mt-2 mb-1">Ping Bike</Text>
              <Text className="text-secondary text-xs text-center">Make it beep</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Statistics */}
        <View className="px-5 mb-5">
          <Text className="text-white text-lg font-semibold mb-3">Statistics</Text>
          <View className="flex-row justify-between">
            <View className="bg-gray-800 rounded-2xl p-4 items-center flex-1 mx-1">
              <Text className="text-white text-xl font-bold mb-1">{bike.distance}</Text>
              <Text className="text-secondary text-xs text-center">Total Distance (km)</Text>
            </View>
            <View className="bg-gray-800 rounded-2xl p-4 items-center flex-1 mx-1">
              <Text className="text-white text-xl font-bold mb-1">{bike.trips}</Text>
              <Text className="text-secondary text-xs text-center">Total Trips</Text>
            </View>
            <View className="bg-gray-800 rounded-2xl p-4 items-center flex-1 mx-1">
              <Text className="text-white text-xl font-bold mb-1">{bike.avgSpeed}</Text>
              <Text className="text-secondary text-xs text-center">Avg Speed (km/h)</Text>
            </View>
          </View>
        </View>

        {/* Geofences */}
        <View className="px-5 mb-5">
          <Text className="text-white text-lg font-semibold mb-3">Geofences</Text>
          {bike.geofences.map((geofence) => (
            <View key={geofence.id} className="bg-gray-800 rounded-xl p-4 flex-row items-center mb-2">
              <MaterialCommunityIcons
                name={geofence.type === "circle" ? "circle-outline" : "shape-outline"}
                size={20}
                color={colors.secondary}
              />
              <Text className="text-white text-base font-semibold ml-3 flex-1">{geofence.name}</Text>
              <Text className="text-secondary text-xs capitalize">{geofence.type}</Text>
            </View>
          ))}
        </View>

        {/* Firmware */}
        <View className="px-5 mb-5">
          <Text className="text-white text-lg font-semibold mb-3">Firmware</Text>
          <View className="bg-gray-800 rounded-2xl p-4 flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-white text-base font-semibold mb-1">Version {bike.firmwareVersion}</Text>
              {bike.hasUpdate && (
                <View className="bg-primary px-2 py-1 rounded-xl self-start">
                  <Text className="text-white text-xs font-semibold">Update Available</Text>
                </View>
              )}
            </View>
            {bike.hasUpdate && (
              <TouchableOpacity className="bg-primary px-4 py-2 rounded-full" onPress={handleFirmwareUpdate}>
                <Text className="text-white text-sm font-semibold">Update Now</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Last Trip */}
        <View className="px-5 mb-5">
          <Text className="text-white text-lg font-semibold mb-3">Last Trip</Text>
          <View className="bg-gray-800 rounded-2xl p-4">
            <Text className="text-white text-base font-semibold mb-3">{bike.lastTrip.date}</Text>
            <View className="flex-row justify-between">
              <View className="items-center flex-1">
                <Text className="text-white text-base font-semibold mb-1">{bike.lastTrip.distance} km</Text>
                <Text className="text-secondary text-xs">Distance</Text>
              </View>
              <View className="items-center flex-1">
                <Text className="text-white text-base font-semibold mb-1">{bike.lastTrip.duration}</Text>
                <Text className="text-secondary text-xs">Duration</Text>
              </View>
              <View className="items-center flex-1">
                <Text className="text-white text-base font-semibold mb-1">{bike.lastTrip.avgSpeed} km/h</Text>
                <Text className="text-secondary text-xs">Avg Speed</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BikeDetailsScreen; 