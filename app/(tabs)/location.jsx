import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Modal,
  TextInput,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import colors from "../../config/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import BikeCard from "../../components/BikeCard";
import Text from "../../components/Text";
import AddBikeWizard from "../../components/AddBikeWizard";
import FirmwareUpdateModal from "../../components/FirmwareUpdateModal";
import GeofenceEditor from "../../components/GeofenceEditor";

// Sample bike data - replace with real data from your backend
const sampleBikes = [
  {
    id: "1",
    title: "Commuter",
    subTitle: "At home • 85% battery • 8 min ago",
    status: "home",
    battery: 85,
    lastSeen: new Date(Date.now() - 8 * 60 * 1000), // 8 minutes ago
    uuid: "12345678",
    type: "commuter",
    firmwareUpdate: true, // Show firmware update banner
  },
  {
    id: "2",
    title: "Mountain Bike",
    subTitle: "Away • 60% battery • 2 hr ago",
    status: "away",
    battery: 60,
    lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    uuid: "87654321",
    type: "mountain",
  },
  {
    id: "3",
    title: "Road Bike",
    subTitle: "Unknown • 20% battery • 1 day ago",
    status: "unknown",
    battery: 20,
    lastSeen: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    uuid: "11223344",
    type: "road",
  },
];

const HomeScreen = () => {
  const [bikes, setBikes] = useState(sampleBikes);
  const [refreshing, setRefreshing] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showAddBikeWizard, setShowAddBikeWizard] = useState(false);
  const [showFirmwareUpdate, setShowFirmwareUpdate] = useState(false);
  const [selectedBikeForUpdate, setSelectedBikeForUpdate] = useState(null);
  const [showGeofenceEditor, setShowGeofenceEditor] = useState(false);
  const [selectedBikeForGeofence, setSelectedBikeForGeofence] = useState(null);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [selectedBikeForRename, setSelectedBikeForRename] = useState(null);
  const [newBikeName, setNewBikeName] = useState("");

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate API call to refresh bike data
    setTimeout(() => {
      setRefreshing(false);
      // Update last seen times to simulate fresh data
      setBikes(prevBikes => 
        prevBikes.map(bike => ({
          ...bike,
          lastSeen: new Date(),
        }))
      );
    }, 2000);
  }, []);

  const handleSync = () => {
    setIsSyncing(true);
    // Simulate cloud sync
    setTimeout(() => {
      setIsSyncing(false);
      onRefresh();
    }, 1500);
  };

  const handleBikePress = (bike) => {
    // Navigate directly to bike details screen
    router.push(`/bike/${bike.id}`);
  };

  const handleRename = (bike) => {
    console.log("Rename button pressed for:", bike.title);
    setSelectedBikeForRename(bike);
    setNewBikeName(bike.title);
    setShowRenameModal(true);
  };

  const handleRenameConfirm = () => {
    if (newBikeName && newBikeName.trim() && newBikeName.trim() !== selectedBikeForRename.title) {
      setBikes(prevBikes =>
        prevBikes.map(b =>
          b.id === selectedBikeForRename.id ? { ...b, title: newBikeName.trim() } : b
        )
      );
    }
    setShowRenameModal(false);
    setSelectedBikeForRename(null);
    setNewBikeName("");
  };

  const handleRenameCancel = () => {
    setShowRenameModal(false);
    setSelectedBikeForRename(null);
    setNewBikeName("");
  };

  const handleRemove = (bike) => {
    console.log("Remove button pressed for:", bike.title);
    Alert.alert(
      "Remove Bike",
      `Are you sure you want to remove "${bike.title}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            setBikes(prevBikes => prevBikes.filter(b => b.id !== bike.id));
          },
        },
      ]
    );
  };

  const handleAddBike = (newBike) => {
    setBikes(prevBikes => [newBike, ...prevBikes]);
  };

  const handleFirmwareUpdate = (bike) => {
    setSelectedBikeForUpdate(bike);
    setShowFirmwareUpdate(true);
  };

  const handleFirmwareUpdateComplete = () => {
    // Update the bike's firmware version and remove the update banner
    setBikes(prevBikes =>
      prevBikes.map(bike =>
        bike.id === selectedBikeForUpdate.id
          ? { ...bike, firmwareUpdate: false }
          : bike
      )
    );
  };

  const handleSetHome = (bike) => {
    console.log("Set Home button pressed for:", bike.title);
    setSelectedBikeForGeofence(bike);
    setShowGeofenceEditor(true);
  };

  const handleGeofenceSaved = (geofence) => {
    console.log("Geofence saved for bike:", geofence);
    // In a real app, you'd save this to your backend
  };
  return (
    <SafeAreaView style={styles.screen} className="p-4">
      {/* Header */}
      <View className="py-4">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-white font-psemibold text-3xl">My Bikes</Text>
            <Text className="text-white font-pregular text-base">
              Track your connected bicycles
            </Text>
          </View>
          <TouchableOpacity
            className="w-12 h-12 bg-primary rounded-full items-center justify-center"
            onPress={() => setShowAddBikeWizard(true)}
          >
            <MaterialCommunityIcons
              name="plus"
              size={24}
              color={colors.white}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Sync Button */}
      <View className="flex-row justify-end mb-4">
        <TouchableOpacity
          className="flex-row items-center bg-gray-800 px-4 py-2 rounded-full"
          onPress={handleSync}
          disabled={isSyncing}
        >
          <MaterialCommunityIcons
            name="sync"
            size={20}
            color={colors.secondary}
            style={isSyncing ? { transform: [{ rotate: '360deg' }] } : null}
          />
          <Text className="text-secondary font-pregular text-sm ml-2">
            {isSyncing ? "Syncing..." : "Sync"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Bike List */}
      <FlatList
        data={bikes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <BikeCard
            bike={item}
            onPress={() => handleBikePress(item)}
            onRename={() => handleRename(item)}
            onRemove={() => handleRemove(item)}
            onFirmwareUpdate={() => handleFirmwareUpdate(item)}
            onSetHome={() => handleSetHome(item)}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.secondary}
            colors={[colors.secondary]}
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      {/* Add Bike Wizard */}
      <AddBikeWizard
        visible={showAddBikeWizard}
        onClose={() => setShowAddBikeWizard(false)}
        onBikeAdded={handleAddBike}
      />

      {/* Firmware Update Modal */}
      <FirmwareUpdateModal
        visible={showFirmwareUpdate}
        onClose={() => setShowFirmwareUpdate(false)}
        bike={selectedBikeForUpdate}
        onUpdateComplete={handleFirmwareUpdateComplete}
      />

      {/* Geofence Editor Modal */}
      <GeofenceEditor
        visible={showGeofenceEditor}
        onClose={() => setShowGeofenceEditor(false)}
        onGeofenceSaved={handleGeofenceSaved}
        bike={selectedBikeForGeofence}
      />

      {/* Rename Modal */}
      <Modal
        visible={showRenameModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleRenameCancel}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-gray-800 rounded-2xl p-6 mx-4 w-80">
            <Text className="text-white text-lg font-semibold mb-4 text-center">
              Rename Bike
            </Text>
            
            <TextInput
              className="bg-gray-700 rounded-xl p-4 text-white border border-gray-600 mb-6"
              placeholder="Enter new name"
              placeholderTextColor={colors.secondary}
              value={newBikeName}
              onChangeText={setNewBikeName}
              autoFocus={true}
              maxLength={20}
            />
            
            <View className="flex-row space-x-3">
              <TouchableOpacity
                className="flex-1 bg-gray-700 rounded-xl py-3"
                onPress={handleRenameCancel}
              >
                <Text className="text-white text-center font-semibold">Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                className="flex-1 bg-primary rounded-xl py-3"
                onPress={handleRenameConfirm}
              >
                <Text className="text-white text-center font-semibold">Rename</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.dark,
    flex: 1,
  },
});

export default HomeScreen;
