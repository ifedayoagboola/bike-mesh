import React, { useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../../config/colors";
import { useGlobalContext } from "../../context/GlobalProvider";
import { setAlertResolved } from "../../lib/api";
import { timeAgo } from "../../lib/format";

const SEGMENTS = [
  { key: "open", label: "Open" },
  { key: "resolved", label: "Resolved" },
];

const AlertsScreen = () => {
  const { alerts, refreshAlerts } = useGlobalContext();
  const [segment, setSegment] = useState("open");
  const [refreshing, setRefreshing] = useState(false);

  const visible = alerts.filter((a) => a.resolved === (segment === "resolved"));
  const openCount = alerts.filter((a) => !a.resolved).length;

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refreshAlerts();
    } catch (e) {
      Alert.alert("Could not refresh", e.message);
    } finally {
      setRefreshing(false);
    }
  }, [refreshAlerts]);

  const toggleResolved = async (alert) => {
    try {
      await setAlertResolved(alert.id, !alert.resolved);
      await refreshAlerts();
    } catch (e) {
      Alert.alert("Could not update", e.message);
    }
  };

  const renderAlert = ({ item }) => (
    <TouchableOpacity
      style={styles.row}
      onPress={() => router.push(`/bike/${item.bike_id}`)}
      activeOpacity={0.7}
    >
      <View style={styles.icon}>
        <MaterialCommunityIcons name="account-group" size={22} color="#FFA500" />
      </View>
      <View style={styles.info}>
        <Text style={styles.rowTitle}>{item.title}</Text>
        <Text style={styles.rowBody}>{item.body}</Text>
        <Text style={styles.rowTime}>{timeAgo(item.created_at)}</Text>
      </View>
      <TouchableOpacity
        style={styles.resolve}
        onPress={() => toggleResolved(item)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <MaterialCommunityIcons
          name={item.resolved ? "undo" : "check"}
          size={20}
          color={item.resolved ? "#CDCDE0" : colors.secondary}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Alerts</Text>
        <Text style={styles.subtitle}>
          {openCount === 0 ? "Nothing needs your attention" : `${openCount} open`}
        </Text>
      </View>

      <View style={styles.segments}>
        {SEGMENTS.map((s) => (
          <TouchableOpacity
            key={s.key}
            style={[styles.segment, segment === s.key && styles.segmentActive]}
            onPress={() => setSegment(s.key)}
          >
            <Text style={[styles.segmentText, segment === s.key && styles.segmentTextActive]}>
              {s.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={visible}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderAlert}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.secondary}
            colors={[colors.secondary]}
          />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <MaterialCommunityIcons name="bell-outline" size={40} color="#6B7280" />
            <Text style={styles.emptyText}>
              {segment === "open"
                ? "No alerts. If you mark a bike as lost, you are told here when another rider's phone passes it."
                : "No resolved alerts yet."}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.dark, flex: 1 },
  header: { paddingHorizontal: 20, paddingVertical: 16 },
  title: { color: colors.white, fontSize: 24, fontWeight: "bold" },
  subtitle: { color: "#CDCDE0", fontSize: 14, marginTop: 4 },
  segments: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: "#232533",
    borderRadius: 12,
    padding: 4,
  },
  segment: { flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: "center" },
  segmentActive: { backgroundColor: colors.secondary },
  segmentText: { color: "#CDCDE0", fontSize: 14, fontWeight: "600" },
  segmentTextActive: { color: colors.black },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#232533",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFA50020",
    justifyContent: "center",
    alignItems: "center",
  },
  info: { flex: 1, marginHorizontal: 12 },
  rowTitle: { color: colors.white, fontSize: 16, fontWeight: "600" },
  rowBody: { color: "#CDCDE0", fontSize: 13, marginTop: 2 },
  rowTime: { color: "#6B7280", fontSize: 12, marginTop: 4 },
  resolve: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#2A2D3A",
    justifyContent: "center",
    alignItems: "center",
  },
  empty: { alignItems: "center", paddingTop: 60, paddingHorizontal: 20 },
  emptyText: { color: "#9CA3AF", fontSize: 14, textAlign: "center", marginTop: 12 },
});

export default AlertsScreen;
