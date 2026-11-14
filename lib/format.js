// Small display helpers shared by the bike list, map, detail and alerts screens.

export const timeAgo = (iso) => {
  if (!iso) return "Never seen";
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
};

// One status per bike, in priority order: lost, in range now, seen before, never seen.
export const bikeStatus = (bike, nearby) => {
  if (bike.is_lost) {
    return { key: "lost", label: "Lost", icon: "alert-circle", color: "#FF4444" };
  }
  if (nearby?.has(bike.tag_uuid)) {
    return { key: "nearby", label: "With you", icon: "bluetooth-connect", color: "#00F704" };
  }
  if (bike.last_seen_at) {
    return { key: "away", label: "Out of range", icon: "map-marker-distance", color: "#FFA500" };
  }
  return { key: "new", label: "Not seen yet", icon: "help-circle", color: "#9CA3AF" };
};

export const lastSeenLine = (bike, nearby) => {
  if (nearby?.has(bike.tag_uuid)) return "In range now";
  if (!bike.last_seen_at) return "Waiting for first sighting";
  const who = bike.last_source === "crowd" ? "Spotted by the mesh" : "Seen by your phone";
  return `${who} • ${timeAgo(bike.last_seen_at)}`;
};

export const hasPosition = (bike) =>
  typeof bike?.last_lat === "number" && typeof bike?.last_lng === "number";

export const directionsUrl = (latitude, longitude) =>
  `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
