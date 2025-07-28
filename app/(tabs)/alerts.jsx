import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Animated,
  Dimensions,
  Alert,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import MapView, { Marker, Polygon, PROVIDER_GOOGLE } from "react-native-maps";
import colors from "../../config/colors";

const { width, height } = Dimensions.get("window");

// Sample alerts data
const sampleAlerts = [
  {
    id: "1",
    type: "geofence",
    icon: "🏠",
    title: "Bike left Home zone",
    subtitle: "09:12 • Camden High St.",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
    status: "open",
    bikeId: "1",
    bikeName: "Commuter",
    location: {
      latitude: 40.7128,
      longitude: -74.0060,
    },
    geofence: "Home",
    address: "Camden High St., London",
  },
  {
    id: "2",
    type: "tamper",
    icon: "🚫",
    title: "Unauthorized movement detected",
    subtitle: "08:45 • Oxford Circus",
    timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    status: "open",
    bikeId: "2",
    bikeName: "Mountain Bike",
    location: {
      latitude: 40.7150,
      longitude: -74.0080,
    },
    tamperType: "movement",
    address: "Oxford Circus, London",
  },
  {
    id: "3",
    type: "battery",
    icon: "🔋",
    title: "Low battery warning",
    subtitle: "Yesterday • 15:30 • Soho",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    status: "resolved",
    bikeId: "1",
    bikeName: "Commuter",
    location: {
      latitude: 40.7130,
      longitude: -74.0062,
    },
    batteryLevel: 15,
    address: "Soho, London",
  },
  {
    id: "4",
    type: "geofence",
    icon: "🏠",
    title: "Bike entered Work zone",
    subtitle: "Yesterday • 08:15 • Canary Wharf",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    status: "resolved",
    bikeId: "1",
    bikeName: "Commuter",
    location: {
      latitude: 40.7160,
      longitude: -74.0090,
    },
    geofence: "Work",
    address: "Canary Wharf, London",
  },
  {
    id: "5",
    type: "tamper",
    icon: "🚫",
    title: "Suspicious activity detected",
    subtitle: "2 days ago • 22:30 • Camden",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
    status: "resolved",
    bikeId: "2",
    bikeName: "Mountain Bike",
    location: {
      latitude: 40.7140,
      longitude: -74.0070,
    },
    tamperType: "vibration",
    address: "Camden, London",
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

const AlertsScreen = () => {
  const [selectedSegment, setSelectedSegment] = useState("open"); // open, resolved
  const [alerts, setAlerts] = useState(sampleAlerts);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  
  const slideAnim = useRef(new Animated.Value(0)).current;

  // Filter alerts based on selected segment
  const filteredAlerts = alerts.filter(alert => alert.status === selectedSegment);

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  const getAlertColor = (type) => {
    switch (type) {
      case "geofence":
        return "#FFA500";
      case "tamper":
        return "#FF4444";
      case "battery":
        return "#FF6B35";
      default:
        return colors.secondary;
    }
  };

  const handleAlertPress = (alert) => {
    setSelectedAlert(alert);
    setShowDetailModal(true);
  };

  const handleMarkResolved = (alertId) => {
    setAlerts(prevAlerts =>
      prevAlerts.map(alert =>
        alert.id === alertId ? { ...alert, status: "resolved" } : alert
      )
    );
  };

  const handleSwipeRight = (alertId) => {
    handleMarkResolved(alertId);
  };

  const renderAlertRow = ({ item }) => {
    const alertColor = getAlertColor(item.type);
    
    return (
      <TouchableOpacity
        style={styles.alertRow}
        onPress={() => handleAlertPress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.alertContent}>
          <View style={[styles.alertIcon, { backgroundColor: alertColor + '20' }]}>
            <Text style={styles.alertIconText}>{item.icon}</Text>
          </View>
          
          <View style={styles.alertInfo}>
            <Text style={styles.alertTitle}>{item.title}</Text>
            <Text style={styles.alertSubtitle}>{item.subtitle}</Text>
            <Text style={styles.alertTime}>{formatTimestamp(item.timestamp)}</Text>
          </View>
          
          <View style={styles.alertActions}>
            <TouchableOpacity
              style={[styles.resolveButton, item.status === "resolved" && styles.resolvedButton]}
              onPress={() => handleMarkResolved(item.id)}
            >
              <MaterialCommunityIcons
                name={item.status === "resolved" ? "check-circle" : "check"}
                size={20}
                color={item.status === "resolved" ? "#00F704" : colors.white}
              />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderDetailModal = () => (
    <Modal
      visible={showDetailModal}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.modalContainer}>
        {selectedAlert && (
          <>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowDetailModal(false)}>
                <MaterialCommunityIcons
                  name="close"
                  size={24}
                  color={colors.white}
                />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Alert Details</Text>
              <View style={{ width: 24 }} />
            </View>

            {/* Map Snapshot */}
            <View style={styles.mapContainer}>
              <MapView
                style={styles.map}
                provider={PROVIDER_GOOGLE}
                initialRegion={{
                  latitude: selectedAlert.location.latitude,
                  longitude: selectedAlert.location.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
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

                {/* Alert Location */}
                <Marker coordinate={selectedAlert.location}>
                  <View style={[styles.detailMarker, { backgroundColor: getAlertColor(selectedAlert.type) }]}>
                    <MaterialCommunityIcons
                      name="bike"
                      size={16}
                      color={colors.white}
                    />
                  </View>
                </Marker>
              </MapView>
            </View>

            {/* Alert Details */}
            <View style={styles.detailContent}>
              <View style={styles.detailHeader}>
                <View style={[styles.detailIcon, { backgroundColor: getAlertColor(selectedAlert.type) + '20' }]}>
                  <Text style={styles.detailIconText}>{selectedAlert.icon}</Text>
                </View>
                <View style={styles.detailInfo}>
                  <Text style={styles.detailTitle}>{selectedAlert.title}</Text>
                  <Text style={styles.detailBike}>{selectedAlert.bikeName}</Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <MaterialCommunityIcons
                  name="map-marker"
                  size={20}
                  color={colors.secondary}
                />
                <Text style={styles.detailText}>{selectedAlert.address}</Text>
              </View>

              <View style={styles.detailRow}>
                <MaterialCommunityIcons
                  name="clock"
                  size={20}
                  color={colors.secondary}
                />
                <Text style={styles.detailText}>
                  {selectedAlert.timestamp.toLocaleString()}
                </Text>
              </View>

              {selectedAlert.type === "battery" && (
                <View style={styles.detailRow}>
                  <MaterialCommunityIcons
                    name="battery"
                    size={20}
                    color={colors.secondary}
                  />
                  <Text style={styles.detailText}>
                    Battery level: {selectedAlert.batteryLevel}%
                  </Text>
                </View>
              )}

              {selectedAlert.type === "geofence" && (
                <View style={styles.detailRow}>
                  <MaterialCommunityIcons
                    name="map-marker-radius"
                    size={20}
                    color={colors.secondary}
                  />
                  <Text style={styles.detailText}>
                    Geofence: {selectedAlert.geofence}
                  </Text>
                </View>
              )}

              {selectedAlert.type === "tamper" && (
                <View style={styles.detailRow}>
                  <MaterialCommunityIcons
                    name="alert"
                    size={20}
                    color={colors.secondary}
                  />
                  <Text style={styles.detailText}>
                    Type: {selectedAlert.tamperType}
                  </Text>
                </View>
              )}
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.actionButton, styles.primaryButton]}
                onPress={() => {
                  // Navigate to bike location
                  setShowDetailModal(false);
                }}
              >
                <MaterialCommunityIcons
                  name="map-marker"
                  size={20}
                  color={colors.white}
                />
                <Text style={styles.actionButtonText}>View on Map</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.secondaryButton]}
                onPress={() => {
                  // Navigate to bike
                  setShowDetailModal(false);
                }}
              >
                <MaterialCommunityIcons
                  name="navigation"
                  size={20}
                  color={colors.white}
                />
                <Text style={styles.actionButtonText}>Navigate</Text>
              </TouchableOpacity>

              {selectedAlert.status === "open" && (
                <TouchableOpacity
                  style={[styles.actionButton, styles.resolveButton]}
                  onPress={() => {
                    handleMarkResolved(selectedAlert.id);
                    setShowDetailModal(false);
                  }}
                >
                  <MaterialCommunityIcons
                    name="check"
                    size={20}
                    color={colors.white}
                  />
                  <Text style={styles.actionButtonText}>Mark Resolved</Text>
                </TouchableOpacity>
              )}
            </View>
          </>
        )}
      </SafeAreaView>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.screen} className="p-4">
      {/* Header */}
      <View className="py-4">
        <Text className="text-white font-psemibold text-3xl">Alerts</Text>
        <Text className="text-white font-pregular text-base">
          Geofence & tamper notifications
        </Text>
      </View>

      {/* Segmented Control */}
      <View style={styles.segmentedControl}>
        <TouchableOpacity
          style={[styles.segment, selectedSegment === "open" && styles.segmentActive]}
          onPress={() => setSelectedSegment("open")}
        >
          <Text style={[styles.segmentText, selectedSegment === "open" && styles.segmentTextActive]}>
            Open ({alerts.filter(a => a.status === "open").length})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.segment, selectedSegment === "resolved" && styles.segmentActive]}
          onPress={() => setSelectedSegment("resolved")}
        >
          <Text style={[styles.segmentText, selectedSegment === "resolved" && styles.segmentTextActive]}>
            Resolved ({alerts.filter(a => a.status === "resolved").length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Alerts List */}
      <FlatList
        data={filteredAlerts}
        keyExtractor={(item) => item.id}
        renderItem={renderAlertRow}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      {/* Detail Modal */}
      {renderDetailModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.dark,
    flex: 1,
  },
  segmentedControl: {
    flexDirection: "row",
    backgroundColor: "#2A2D3A",
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  segment: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  segmentActive: {
    backgroundColor: colors.primary,
  },
  segmentText: {
    color: colors.secondary,
    fontSize: 14,
    fontWeight: "600",
  },
  segmentTextActive: {
    color: colors.white,
  },
  alertRow: {
    backgroundColor: "#232533",
    borderRadius: 12,
    marginBottom: 8,
    overflow: "hidden",
  },
  alertContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  alertIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  alertIconText: {
    fontSize: 20,
  },
  alertInfo: {
    flex: 1,
  },
  alertTitle: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  alertSubtitle: {
    color: colors.secondary,
    fontSize: 14,
    marginBottom: 2,
  },
  alertTime: {
    color: colors.secondary,
    fontSize: 12,
  },
  alertActions: {
    marginLeft: 12,
  },
  resolveButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  resolvedButton: {
    backgroundColor: "transparent",
  },
  separator: {
    height: 8,
  },
  modalContainer: {
    backgroundColor: colors.dark,
    flex: 1,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#2A2D3A",
  },
  modalTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  mapContainer: {
    height: 200,
    margin: 20,
    borderRadius: 12,
    overflow: "hidden",
  },
  map: {
    flex: 1,
  },
  detailMarker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.white,
  },
  detailContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  detailHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  detailIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  detailIconText: {
    fontSize: 24,
  },
  detailInfo: {
    flex: 1,
  },
  detailTitle: {
    color: colors.white,
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  detailBike: {
    color: colors.secondary,
    fontSize: 16,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  detailText: {
    color: colors.white,
    fontSize: 16,
    marginLeft: 12,
    flex: 1,
  },
  actionButtons: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: colors.secondary,
  },
  actionButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});

export default AlertsScreen; 