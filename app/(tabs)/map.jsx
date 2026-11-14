import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import colors from "../../config/colors";
import { useGlobalContext } from "../../context/GlobalProvider";
import { listSightings } from "../../lib/api";
import { bikeStatus, directionsUrl, hasPosition, lastSeenLine } from "../../lib/format";

const HOUR = 60 * 60 * 1000;
const FILTERS = [
  { key: "24h", label: "Last 24h", sinceMs: 24 * HOUR },
  { key: "week", label: "Week", sinceMs: 7 * 24 * HOUR },
  { key: "all", label: "All", sinceMs: null },
];

// Belfast, used only until a bike or the rider has a position.
const FALLBACK_REGION = {
  latitude: 54.5973,
  longitude: -5.9301,
  latitudeDelta: 0.08,
  longitudeDelta: 0.08,
};

const MapScreen = () => {
  const { bikes, nearby, trackingAllowed } = useGlobalContext();
  const located = useMemo(() => bikes.filter(hasPosition), [bikes]);

  const [selectedId, setSelectedId] = useState(null);
  const [filter, setFilter] = useState(FILTERS[0]);
  const [trail, setTrail] = useState([]);
  const mapRef = useRef(null);
  const fitted = useRef(false);

  const selected = located.find((b) => b.id === selectedId) || null;

  // Frame all bikes once, the first time we have positions.
  useEffect(() => {
    if (fitted.current || located.length === 0 || !mapRef.current) return;
    fitted.current = true;
    if (located.length === 1) {
      mapRef.current.animateToRegion({
        latitude: located[0].last_lat,
        longitude: located[0].last_lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    } else {
      mapRef.current.fitToCoordinates(
        located.map((b) => ({ latitude: b.last_lat, longitude: b.last_lng })),
        { edgePadding: { top: 80, right: 80, bottom: 80, left: 80 }, animated: true }
      );
    }
  }, [located]);

  // Where has the selected bike been?
  useEffect(() => {
    if (!selected) {
      setTrail([]);
      return;
    }
    let cancelled = false;
    listSightings(selected.id, { sinceMs: filter.sinceMs })
      .then((rows) => {
        if (!cancelled) setTrail(rows);
      })
      .catch(() => {
        if (!cancelled) setTrail([]);
      });
    return () => {
      cancelled = true;
    };
  }, [selected?.id, selected?.last_seen_at, filter]);

  const trailCoords = trail.map((s) => ({ latitude: s.lat, longitude: s.lng }));

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Bike Locations</Text>
      </View>

      {selected && (
        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {FILTERS.map((f) => (
              <TouchableOpacity
                key={f.key}
                style={[styles.filterButton, filter.key === f.key && styles.filterButtonActive]}
                onPress={() => setFilter(f)}
              >
                <Text style={[styles.filterText, filter.key === f.key && styles.filterTextActive]}>
                  {f.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={FALLBACK_REGION}
          showsUserLocation={trackingAllowed}
          showsMyLocationButton={trackingAllowed}
          onPress={() => setSelectedId(null)}
        >
          {trailCoords.length > 1 && (
            <Polyline coordinates={trailCoords} strokeColor="#00F70480" strokeWidth={3} />
          )}
          {trail.slice(1).map((s) => (
            <Marker
              key={`trail-${s.id}`}
              coordinate={{ latitude: s.lat, longitude: s.lng }}
              anchor={{ x: 0.5, y: 0.5 }}
              tracksViewChanges={false}
            >
              <View
                style={[
                  styles.trailDot,
                  { backgroundColor: s.source === "crowd" ? "#FFA500" : "#00F704" },
                ]}
              />
            </Marker>
          ))}
          {located.map((bike) => {
            const status = bikeStatus(bike, nearby);
            return (
              <Marker
                key={`${bike.id}-${status.key}`}
                coordinate={{ latitude: bike.last_lat, longitude: bike.last_lng }}
                onPress={(e) => {
                  e.stopPropagation();
                  setSelectedId(bike.id);
                }}
              >
                <View style={[styles.marker, { backgroundColor: status.color }]}>
                  <Text style={styles.markerEmoji}>{bike.emoji}</Text>
                </View>
              </Marker>
            );
          })}
        </MapView>

        {located.length === 0 && (
          <View style={styles.emptyCard}>
            <MaterialCommunityIcons name="map-marker-question" size={28} color="#9CA3AF" />
            <Text style={styles.emptyText}>
              {bikes.length === 0
                ? "Pair a bike on the Home tab and it will show here."
                : "No location yet. Keep the app open near your bike for a minute."}
            </Text>
          </View>
        )}
      </View>

      {selected && (
        <View style={styles.drawer}>
          <View style={styles.drawerHeader}>
            <Text style={styles.drawerTitle}>
              {selected.emoji} {selected.name}
            </Text>
            <TouchableOpacity onPress={() => setSelectedId(null)}>
              <MaterialCommunityIcons name="close" size={24} color={colors.white} />
            </TouchableOpacity>
          </View>
          <Text style={styles.drawerInfo}>{lastSeenLine(selected, nearby)}</Text>
          <View style={styles.drawerActions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.actionPrimary]}
              onPress={() =>
                Linking.openURL(directionsUrl(selected.last_lat, selected.last_lng))
              }
            >
              <MaterialCommunityIcons name="navigation" size={20} color={colors.black} />
              <Text style={styles.actionPrimaryText}>Directions</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push(`/bike/${selected.id}`)}
            >
              <Text style={styles.actionText}>Details</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.dark, flex: 1 },
  header: { paddingHorizontal: 20, paddingVertical: 16 },
  title: { color: colors.white, fontSize: 24, fontWeight: "bold" },
  filterContainer: { paddingHorizontal: 20, marginBottom: 16 },
  filterButton: {
    backgroundColor: "#2A2D3A",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  filterButtonActive: { backgroundColor: colors.secondary },
  filterText: { color: "#CDCDE0", fontSize: 14, fontWeight: "600" },
  filterTextActive: { color: colors.black },
  mapContainer: {
    flex: 1,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    overflow: "hidden",
  },
  map: { flex: 1 },
  marker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.white,
  },
  markerEmoji: { fontSize: 18 },
  trailDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.white,
  },
  emptyCard: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 16,
    backgroundColor: "#232533",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  emptyText: { color: "#CDCDE0", fontSize: 14, marginLeft: 12, flex: 1 },
  drawer: {
    backgroundColor: "#232533",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  drawerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  drawerTitle: { color: colors.white, fontSize: 20, fontWeight: "bold" },
  drawerInfo: { color: "#CDCDE0", fontSize: 14, marginBottom: 16 },
  drawerActions: { flexDirection: "row" },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2A2D3A",
    paddingVertical: 12,
    borderRadius: 12,
    marginLeft: 12,
  },
  actionPrimary: { backgroundColor: colors.secondary, marginLeft: 0 },
  actionPrimaryText: { color: colors.black, fontSize: 16, fontWeight: "600", marginLeft: 8 },
  actionText: { color: colors.white, fontSize: 16, fontWeight: "600" },
});

export default MapScreen;
