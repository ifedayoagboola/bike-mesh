import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Linking,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { isBluetoothOn, subscribeToBeacons } from "../bleDiscovery";
import { claimBike, unclaimedTags } from "../lib/api";
import { useGlobalContext } from "../context/GlobalProvider";
import colors from "../config/colors";

const EMOJI_OPTIONS = ["🚲", "🚴", "🚵", "🛵", "⚡", "🔥", "💨", "⭐"];
const HEARD_WINDOW_MS = 10 * 1000;
const TICK_MS = 1500;
const STEPS = 3; // find tag, name it, done

const AddBikeWizard = ({ visible, onClose }) => {
  const { trackingAllowed, enableTracking, refreshBikes } = useGlobalContext();

  const [step, setStep] = useState(1);
  const [tags, setTags] = useState([]); // [{ uuid, rssi }] free to claim, strongest first
  const [bluetoothOff, setBluetoothOff] = useState(false);
  const [permissionBlocked, setPermissionBlocked] = useState(false);
  const [selected, setSelected] = useState(null);
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState(EMOJI_OPTIONS[0]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const heard = useRef(new Map()); // uuid -> { rssi, at }
  const claimable = useRef(new Map()); // uuid -> true (free) | false (taken)

  useEffect(() => {
    if (!visible) return;
    setStep(1);
    setTags([]);
    setSelected(null);
    setName("");
    setEmoji(EMOJI_OPTIONS[0]);
    setSaving(false);
    setError("");
    setPermissionBlocked(false);
    heard.current = new Map();
    claimable.current = new Map();
  }, [visible]);

  // Step 1: listen for tags and keep only the ones nobody has claimed.
  useEffect(() => {
    if (!visible || step !== 1 || !trackingAllowed) return;
    let cancelled = false;

    const unsubscribe = subscribeToBeacons(({ uuid, rssi }) => {
      heard.current.set(uuid, { rssi, at: Date.now() });
    });

    const tick = async () => {
      const on = await isBluetoothOn().catch(() => true);
      if (cancelled) return;
      setBluetoothOff(!on);

      const now = Date.now();
      const inRange = [...heard.current.entries()].filter(
        ([, v]) => now - v.at < HEARD_WINDOW_MS
      );
      const unknown = inRange.map(([uuid]) => uuid).filter((u) => !claimable.current.has(u));
      if (unknown.length > 0) {
        try {
          const free = new Set(await unclaimedTags(unknown));
          unknown.forEach((u) => claimable.current.set(u, free.has(u)));
        } catch (e) {
          if (!cancelled) setError("Could not check tags. Are you online?");
        }
      }
      if (cancelled) return;
      setTags(
        inRange
          .filter(([uuid]) => claimable.current.get(uuid) === true)
          .map(([uuid, v]) => ({ uuid, rssi: v.rssi }))
          .sort((a, b) => b.rssi - a.rssi)
      );
    };

    const timer = setInterval(tick, TICK_MS);
    return () => {
      cancelled = true;
      clearInterval(timer);
      unsubscribe();
    };
  }, [visible, step, trackingAllowed]);

  const handleAllow = async () => {
    const result = await enableTracking();
    setPermissionBlocked(result === "blocked");
  };

  const handleSelect = (tag) => {
    setSelected(tag);
    setName("");
    setError("");
    setStep(2);
  };

  const handleSave = async () => {
    if (!name.trim() || saving) return;
    setSaving(true);
    setError("");
    try {
      await claimBike({ tagUuid: selected.uuid, name, emoji });
      await refreshBikes();
      setStep(3);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const renderPermission = () => (
    <View className="flex-1 items-center justify-center px-6">
      <View className="w-20 h-20 bg-gray-800 rounded-full items-center justify-center mb-4">
        <MaterialCommunityIcons name="bluetooth" size={40} color={colors.secondary} />
      </View>
      <Text className="text-white font-psemibold text-xl mb-2 text-center">
        Let BikeMesh find your tag
      </Text>
      <Text className="text-gray-300 font-pregular text-base text-center mb-8">
        Bluetooth finds the tag on your bike. Location records where your bike was last seen.
      </Text>
      <TouchableOpacity
        className="bg-secondary rounded-xl p-4 w-full"
        onPress={permissionBlocked ? () => Linking.openSettings() : handleAllow}
      >
        <Text className="text-black font-psemibold text-center text-base">
          {permissionBlocked ? "Open phone settings" : "Allow Bluetooth and location"}
        </Text>
      </TouchableOpacity>
      {permissionBlocked && (
        <Text className="text-gray-400 font-pregular text-sm text-center mt-3">
          Permission was turned off. Allow Nearby devices and Location for BikeMesh, then come back.
        </Text>
      )}
    </View>
  );

  const renderScan = () => (
    <View className="flex-1 px-6 pt-8">
      <View className="items-center mb-6">
        <ActivityIndicator size="large" color={colors.secondary} />
        <Text className="text-white font-psemibold text-xl mt-4 mb-1">
          {bluetoothOff ? "Turn on Bluetooth" : "Looking for your tag..."}
        </Text>
        <Text className="text-gray-300 font-pregular text-base text-center">
          {bluetoothOff
            ? "Bluetooth is off. Switch it on to find your tag."
            : "Hold your phone next to the tag on your bike. The closest tag shows first."}
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {tags.map((tag, index) => (
          <TouchableOpacity
            key={tag.uuid}
            className="bg-gray-800 rounded-xl p-4 mb-3 flex-row items-center"
            onPress={() => handleSelect(tag)}
          >
            <View className="w-12 h-12 bg-gray-700 rounded-full items-center justify-center mr-4">
              <MaterialCommunityIcons name="bike" size={24} color={colors.secondary} />
            </View>
            <View className="flex-1">
              <Text className="text-white font-psemibold text-base">
                Tag {tag.uuid.slice(-8).toUpperCase()}
              </Text>
              <Text className="text-gray-400 font-pregular text-sm">
                {index === 0 ? "Closest to you" : "Further away"} • {tag.rssi} dBm
              </Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color={colors.secondary} />
          </TouchableOpacity>
        ))}
        {tags.length === 0 && !bluetoothOff && (
          <Text className="text-gray-400 font-pregular text-sm text-center mt-4">
            Nothing yet. Check the tag has power. Tags that already belong to an account are not
            shown.
          </Text>
        )}
      </ScrollView>
      {!!error && <Text className="text-red-400 text-sm text-center mb-4">{error}</Text>}
    </View>
  );

  const renderName = () => (
    <ScrollView className="flex-1 px-6 pt-8" keyboardShouldPersistTaps="handled">
      <View className="items-center mb-6">
        <View className="w-20 h-20 bg-gray-800 rounded-full items-center justify-center mb-4">
          <Text className="text-4xl">{emoji}</Text>
        </View>
        <Text className="text-white font-psemibold text-xl mb-1">Name your bike</Text>
        <Text className="text-gray-400 font-pregular text-sm">
          Tag {selected?.uuid.slice(-8).toUpperCase()}
        </Text>
      </View>

      <TextInput
        className="bg-gray-800 rounded-xl p-4 text-white border border-gray-700 mb-6"
        style={{ fontSize: 16 }}
        placeholder="e.g. Commuter"
        placeholderTextColor="#6B7280"
        value={name}
        onChangeText={setName}
        maxLength={40}
        autoFocus
        returnKeyType="done"
        onSubmitEditing={handleSave}
      />

      <View className="flex-row flex-wrap justify-center mb-6">
        {EMOJI_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option}
            className={`w-12 h-12 rounded-full items-center justify-center m-1 ${
              emoji === option ? "bg-secondary" : "bg-gray-800"
            }`}
            onPress={() => setEmoji(option)}
          >
            <Text className="text-2xl">{option}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {!!error && <Text className="text-red-400 text-sm text-center mb-4">{error}</Text>}

      <View className="flex-row">
        <TouchableOpacity
          className="flex-1 bg-gray-800 rounded-xl p-4 mr-3"
          onPress={() => setStep(1)}
          disabled={saving}
        >
          <Text className="text-white font-psemibold text-center">Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 bg-secondary rounded-xl p-4 ${
            !name.trim() || saving ? "opacity-50" : ""
          }`}
          onPress={handleSave}
          disabled={!name.trim() || saving}
        >
          <Text className="text-black font-psemibold text-center">
            {saving ? "Saving..." : "Add bike"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderDone = () => (
    <View className="flex-1 items-center justify-center px-6">
      <View className="w-24 h-24 bg-green-500/20 rounded-full items-center justify-center mb-6">
        <Text className="text-5xl">{emoji}</Text>
      </View>
      <Text className="text-white font-psemibold text-2xl mb-2 text-center">
        {name.trim()} is paired
      </Text>
      <Text className="text-gray-300 font-pregular text-base text-center mb-8">
        Your phone now records where it last saw this bike, every time you are near it.
      </Text>
      <TouchableOpacity className="bg-secondary rounded-xl p-4 w-full" onPress={onClose}>
        <Text className="text-black font-psemibold text-center text-base">Done</Text>
      </TouchableOpacity>
    </View>
  );

  const renderStep = () => {
    if (step === 3) return renderDone();
    if (step === 2) return renderName();
    return trackingAllowed ? renderScan() : renderPermission();
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView className="flex-1" style={{ backgroundColor: colors.dark }}>
        <View className="flex-row items-center justify-between p-6 border-b border-gray-800">
          <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <MaterialCommunityIcons name="close" size={24} color={colors.white} />
          </TouchableOpacity>
          <Text className="text-white font-psemibold text-lg">
            Add bike • Step {step} of {STEPS}
          </Text>
          <View className="w-6" />
        </View>
        <View className="h-1 bg-gray-800">
          <View className="h-1 bg-secondary" style={{ width: `${(step / STEPS) * 100}%` }} />
        </View>
        {renderStep()}
      </SafeAreaView>
    </Modal>
  );
};

export default AddBikeWizard;
