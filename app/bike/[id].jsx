import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import colors from "../../config/colors";
import { useGlobalContext } from "../../context/GlobalProvider";
import { listSightings, removeBike, setBikeLost } from "../../lib/api";
import {
  bikeStatus,
  directionsUrl,
  hasPosition,
  lastSeenLine,
  timeAgo,
} from "../../lib/format";

const BikeDetailsScreen = () => {
  const { id } = useLocalSearchParams();
  const { bikes, bikesLoaded, refreshBikes, nearby } = useGlobalContext();
  const bike = bikes.find((b) => b.id === id);

  const [sightings, setSightings] = useState([]);
  const [busy, setBusy] = useState(false);

  const loadSightings = useCallback(async () => {
    try {
      setSightings(await listSightings(id, { limit: 20 }));
    } catch (e) {
      console.log("Could not load sightings:", e.message);
    }
  }, [id]);

  // Reload the history whenever a new sighting lands on the bike.
  useEffect(() => {
    loadSightings();
  }, [loadSightings, bike?.last_seen_at]);

  if (!bike) {
    return (
      <SafeAreaView className="flex-1" style={{ backgroundColor: colors.dark }}>
        <Stack.Screen options={{ headerShown: false }} />
        <View className="flex-1 justify-center items-center px-6">
          <Text className="text-white text-base mb-4">
            {bikesLoaded ? "This bike is no longer on your account." : "Loading..."}
          </Text>
          {bikesLoaded && (
            <TouchableOpacity onPress={() => router.back()}>
              <Text className="text-secondary font-semibold text-base">Go back</Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    );
  }

  const status = bikeStatus(bike, nearby);
  const located = hasPosition(bike);
  const position = located
    ? { latitude: bike.last_lat, longitude: bike.last_lng }
    : null;

  const toggleLost = async (isLost) => {
    setBusy(true);
    try {
      await setBikeLost(bike.id, isLost);
      await refreshBikes();
    } catch (e) {
      Alert.alert("Could not update", e.message);
    } finally {
      setBusy(false);
    }
  };

  const handleMarkLost = () => {
    Alert.alert(
      `Mark ${bike.name} as lost?`,
      "Other BikeMesh riders' phones will report its location to you when they pass it. They never see who you are.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Mark as lost", style: "destructive", onPress: () => toggleLost(true) },
      ]
    );
  };

  const handleRemove = () => {
    Alert.alert(
      "Remove bike",
      `Remove "${bike.name}"? Its location history is deleted and the tag can be paired again.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              await removeBike(bike.id);
              await refreshBikes();
              router.back();
            } catch (e) {
              Alert.alert("Could not remove", e.message);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.dark }}>
      <Stack.Screen options={{ headerShown: false }} />

      <View className="flex-row items-center px-5 py-4 border-b border-gray-800">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.white} />
        </TouchableOpacity>
        <View className="w-12 h-12 rounded-full bg-gray-800 justify-center items-center ml-2">
          <Text className="text-2xl">{bike.emoji}</Text>
        </View>
        <View className="flex-1 ml-3">
          <Text className="text-white text-xl font-semibold">{bike.name}</Text>
          <View className="flex-row items-center mt-1">
            <View
              className="w-2 h-2 rounded-full mr-2"
              style={{ backgroundColor: status.color }}
            />
            <Text className="text-sm" style={{ color: status.color }}>
              {status.label}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {bike.is_lost && (
          <View className="mx-5 mt-5 bg-red-500/20 border border-red-500 rounded-2xl p-4">
            <Text className="text-white font-semibold text-base mb-1">
              The mesh is looking for {bike.name}
            </Text>
            <Text className="text-gray-300 text-sm">
              You get an alert when another rider's phone passes it. Marked lost{" "}
              {timeAgo(bike.lost_at).toLowerCase()}.
            </Text>
          </View>
        )}

        {/* Last seen */}
        <View className="px-5 mt-5">
          <Text className="text-white text-lg font-semibold mb-3">Last seen</Text>
          {located ? (
            <View className="rounded-2xl overflow-hidden">
              <MapView
                key={`${bike.last_lat},${bike.last_lng}`}
                style={{ height: 220 }}
                provider={PROVIDER_GOOGLE}
                initialRegion={{
                  ...position,
                  latitudeDelta: 0.005,
                  longitudeDelta: 0.005,
                }}
              >
                <Marker coordinate={position} title={bike.name}>
                  <View
                    className="w-9 h-9 rounded-full justify-center items-center border-2 border-white"
                    style={{ backgroundColor: status.color }}
                  >
                    <MaterialCommunityIcons name="bike" size={18} color={colors.black} />
                  </View>
                </Marker>
              </MapView>
            </View>
          ) : (
            <View className="bg-gray-800 rounded-2xl p-5 items-center">
              <MaterialCommunityIcons name="map-marker-question" size={32} color="#9CA3AF" />
              <Text className="text-gray-300 text-sm text-center mt-2">
                No location yet. Keep the app open near your bike for a minute and it will appear
                here.
              </Text>
            </View>
          )}
          <Text className="text-gray-400 text-sm mt-2">{lastSeenLine(bike, nearby)}</Text>

          {located && (
            <TouchableOpacity
              className="bg-secondary rounded-xl p-4 mt-3 flex-row items-center justify-center"
              onPress={() => Linking.openURL(directionsUrl(bike.last_lat, bike.last_lng))}
            >
              <MaterialCommunityIcons name="navigation" size={20} color={colors.black} />
              <Text className="text-black font-semibold text-base ml-2">
                Directions to {bike.name}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Lost / found */}
        <View className="px-5 mt-5">
          {bike.is_lost ? (
            <TouchableOpacity
              className="bg-gray-800 rounded-xl p-4 flex-row items-center justify-center"
              onPress={() => toggleLost(false)}
              disabled={busy}
            >
              <MaterialCommunityIcons name="check-circle" size={20} color={colors.secondary} />
              <Text className="text-white font-semibold text-base ml-2">I found my bike</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              className="bg-red-500/20 border border-red-500 rounded-xl p-4 flex-row items-center justify-center"
              onPress={handleMarkLost}
              disabled={busy}
            >
              <MaterialCommunityIcons name="alert-circle" size={20} color="#FF4444" />
              <Text className="text-red-400 font-semibold text-base ml-2">Mark as lost</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* History */}
        <View className="px-5 mt-6">
          <Text className="text-white text-lg font-semibold mb-3">Recent sightings</Text>
          {sightings.length === 0 && (
            <Text className="text-gray-400 text-sm">Nothing recorded yet.</Text>
          )}
          {sightings.map((s) => (
            <TouchableOpacity
              key={s.id}
              className="bg-gray-800 rounded-xl p-4 flex-row items-center mb-2"
              onPress={() => Linking.openURL(directionsUrl(s.lat, s.lng))}
            >
              <MaterialCommunityIcons
                name={s.source === "crowd" ? "account-group" : "cellphone"}
                size={20}
                color={s.source === "crowd" ? "#FFA500" : colors.secondary}
              />
              <View className="flex-1 ml-3">
                <Text className="text-white text-sm font-semibold">
                  {s.source === "crowd" ? "Spotted by the mesh" : "Seen by your phone"}
                </Text>
                <Text className="text-gray-400 text-xs">
                  {new Date(s.seen_at).toLocaleString()}
                </Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={20} color="#6B7280" />
            </TouchableOpacity>
          ))}
        </View>

        <View className="px-5 mt-6 mb-10">
          <Text className="text-gray-500 text-xs mb-3">
            Tag {bike.tag_uuid.slice(-8).toUpperCase()}
          </Text>
          <TouchableOpacity onPress={handleRemove}>
            <Text className="text-red-400 font-semibold text-base">Remove this bike</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BikeDetailsScreen;
