import * as Location from "expo-location";
import { subscribeToBeacons } from "../bleDiscovery";
import { lostTags, reportSighting } from "./api";

const REPORT_EVERY_MS = 60 * 1000; // per tag
const LOST_REFRESH_MS = 60 * 1000;
const POSITION_MAX_AGE_MS = 15 * 1000;
const NEARBY_WINDOW_MS = 20 * 1000;
const NEARBY_TICK_MS = 3 * 1000;

/**
 * The mesh loop. While running, the phone listens for BikeMesh tags and
 * reports where it saw (a) the rider's own bikes and (b) anyone's bike that
 * is marked lost. Everything else in range is ignored and never leaves the
 * phone.
 *
 * getOwnTags: () => Set of the rider's tag UUIDs
 * onOwnSighting: (tag, { latitude, longitude, accuracy }) => void
 * onNearby: (Map of own tag -> rssi currently in range) => void
 *
 * Returns a stop function.
 */
export function startTracker({ getOwnTags, onOwnSighting, onNearby }) {
  let stopped = false;
  let lost = new Set();
  const lastReport = new Map(); // tag -> ms of last attempt
  const lastHeard = new Map(); // own tag -> { rssi, at }
  let position = null; // { coords, at }
  let positionPromise = null;
  let nearbyKey = "";

  const refreshLost = async () => {
    try {
      lost = new Set(await lostTags());
    } catch (e) {
      // Offline: keep the last list.
    }
  };

  const getPosition = () => {
    if (position && Date.now() - position.at < POSITION_MAX_AGE_MS) {
      return Promise.resolve(position.coords);
    }
    if (!positionPromise) {
      positionPromise = Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      })
        .catch(() => Location.getLastKnownPositionAsync({ maxAge: 60 * 1000 }))
        .then((loc) => {
          if (!loc) throw new Error("no position");
          position = { coords: loc.coords, at: Date.now() };
          return loc.coords;
        })
        .finally(() => {
          positionPromise = null;
        });
    }
    return positionPromise;
  };

  const onBeacon = async ({ uuid, rssi }) => {
    const now = Date.now();
    const own = getOwnTags().has(uuid);
    if (own) lastHeard.set(uuid, { rssi, at: now });
    if (!own && !lost.has(uuid)) return;
    if (now - (lastReport.get(uuid) || 0) < REPORT_EVERY_MS) return;
    lastReport.set(uuid, now);

    try {
      const coords = await getPosition();
      if (stopped) return;
      const result = await reportSighting({
        tag: uuid,
        latitude: coords.latitude,
        longitude: coords.longitude,
        accuracy: coords.accuracy,
        rssi,
      });
      if (result === "owner" && !stopped) onOwnSighting?.(uuid, coords);
    } catch (e) {
      // No fix or no network: try again in about ten seconds.
      lastReport.set(uuid, now - REPORT_EVERY_MS + 10 * 1000);
    }
  };

  const nearbyTick = () => {
    const now = Date.now();
    const nearby = new Map();
    lastHeard.forEach(({ rssi, at }, tag) => {
      if (now - at < NEARBY_WINDOW_MS) nearby.set(tag, rssi);
    });
    const key = [...nearby.keys()].sort().join(",");
    if (key !== nearbyKey) {
      nearbyKey = key;
      onNearby?.(nearby);
    }
  };

  refreshLost();
  const lostTimer = setInterval(refreshLost, LOST_REFRESH_MS);
  const nearbyTimer = setInterval(nearbyTick, NEARBY_TICK_MS);
  const unsubscribe = subscribeToBeacons(onBeacon);

  return () => {
    stopped = true;
    clearInterval(lostTimer);
    clearInterval(nearbyTimer);
    unsubscribe();
    onNearby?.(new Map());
  };
}
