import React, { useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  Linking,
  Modal,
  RefreshControl,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../../config/colors";
import BikeCard from "../../components/BikeCard";
import Text from "../../components/Text";
import AddBikeWizard from "../../components/AddBikeWizard";
import { useGlobalContext } from "../../context/GlobalProvider";
import { removeBike, renameBike } from "../../lib/api";

const HomeScreen = () => {
  const {
    user,
    bikes,
    bikesLoaded,
    refreshBikes,
    nearby,
    trackingAllowed,
    enableTracking,
  } = useGlobalContext();

  const [refreshing, setRefreshing] = useState(false);
  const [showAddBikeWizard, setShowAddBikeWizard] = useState(false);
  const [bikeToRename, setBikeToRename] = useState(null);
  const [newBikeName, setNewBikeName] = useState("");

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refreshBikes();
    } catch (e) {
      Alert.alert("Could not refresh", e.message);
    } finally {
      setRefreshing(false);
    }
  }, [refreshBikes]);

  const handleEnableTracking = async () => {
    const result = await enableTracking();
    if (result === "blocked") Linking.openSettings();
  };

  const openRename = (bike) => {
    setBikeToRename(bike);
    setNewBikeName(bike.name);
  };

  const confirmRename = async () => {
    const name = newBikeName.trim();
    const bike = bikeToRename;
    setBikeToRename(null);
    if (!name || name === bike.name) return;
    try {
      await renameBike(bike.id, name);
      await refreshBikes();
    } catch (e) {
      Alert.alert("Could not rename", e.message);
    }
  };

  const handleRemove = (bike) => {
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
            } catch (e) {
              Alert.alert("Could not remove", e.message);
            }
          },
        },
      ]
    );
  };

  const renderEmpty = () => {
    if (!bikesLoaded) return null;
    return (
      <View className="items-center px-6 pt-16">
        <View className="w-24 h-24 bg-gray-800 rounded-full items-center justify-center mb-6">
          <MaterialCommunityIcons name="bike" size={48} color={colors.secondary} />
        </View>
        <Text className="text-white font-psemibold text-2xl text-center mb-2">
          Welcome{user?.username ? `, ${user.username}` : ""}
        </Text>
        <Text className="text-gray-300 font-pregular text-base text-center mb-8">
          Pair the tag on your bike and BikeMesh will remember where it was last seen.
        </Text>
        <TouchableOpacity
          className="bg-secondary rounded-xl p-4 w-full"
          onPress={() => setShowAddBikeWizard(true)}
        >
          <Text className="text-black font-psemibold text-center text-base">
            Add your first bike
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.screen} className="p-4">
      <View className="py-4 flex-row items-center justify-between">
        <View>
          <Text className="text-white font-psemibold text-3xl">My Bikes</Text>
          <Text className="text-gray-300 font-pregular text-base">
            {bikes.length === 0
              ? "No bikes paired yet"
              : `${bikes.length} bike${bikes.length > 1 ? "s" : ""} paired`}
          </Text>
        </View>
        {bikes.length > 0 && (
          <TouchableOpacity
            className="w-12 h-12 bg-secondary rounded-full items-center justify-center"
            onPress={() => setShowAddBikeWizard(true)}
          >
            <MaterialCommunityIcons name="plus" size={24} color={colors.black} />
          </TouchableOpacity>
        )}
      </View>

      {bikes.length > 0 && !trackingAllowed && (
        <TouchableOpacity
          className="bg-gray-800 rounded-xl p-4 mb-2 flex-row items-center"
          onPress={handleEnableTracking}
        >
          <MaterialCommunityIcons name="bluetooth-off" size={24} color="#FFA500" />
          <View className="flex-1 ml-3">
            <Text className="text-white font-psemibold text-base">Tracking is off</Text>
            <Text className="text-gray-400 font-pregular text-sm">
              Allow Bluetooth and location so your phone can see your bikes.
            </Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color="#6B7280" />
        </TouchableOpacity>
      )}

      <FlatList
        data={bikes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <BikeCard
            bike={item}
            nearby={nearby}
            onPress={() => router.push(`/bike/${item.id}`)}
            onRename={() => openRename(item)}
            onRemove={() => handleRemove(item)}
          />
        )}
        ListEmptyComponent={renderEmpty}
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

      <AddBikeWizard
        visible={showAddBikeWizard}
        onClose={() => setShowAddBikeWizard(false)}
      />

      <Modal
        visible={!!bikeToRename}
        transparent
        animationType="fade"
        onRequestClose={() => setBikeToRename(null)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-gray-800 rounded-2xl p-6 mx-4 w-80">
            <Text className="text-white text-lg font-semibold mb-4 text-center">
              Rename bike
            </Text>
            <TextInput
              className="bg-gray-700 rounded-xl p-4 text-white border border-gray-600 mb-6"
              placeholder="Enter new name"
              placeholderTextColor="#9CA3AF"
              value={newBikeName}
              onChangeText={setNewBikeName}
              autoFocus
              maxLength={40}
            />
            <View className="flex-row">
              <TouchableOpacity
                className="flex-1 bg-gray-700 rounded-xl py-3 mr-3"
                onPress={() => setBikeToRename(null)}
              >
                <Text className="text-white text-center font-semibold">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 bg-secondary rounded-xl py-3"
                onPress={confirmRename}
              >
                <Text className="text-black text-center font-semibold">Rename</Text>
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
