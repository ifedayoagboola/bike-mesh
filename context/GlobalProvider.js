import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AppState } from "react-native";
import * as Updates from "expo-updates";
import { supabase } from "../lib/supabase";
import * as api from "../lib/api";
import {
  hasTrackingPermissions,
  requestTrackingPermissions,
} from "../lib/permissions";
import { startTracker } from "../lib/tracker";

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

async function fetchAppUpdate() {
  if (__DEV__) return;
  try {
    const update = await Updates.checkForUpdateAsync();
    if (update.isAvailable) {
      await Updates.fetchUpdateAsync();
      await Updates.reloadAsync();
    }
  } catch (error) {
    console.log("Update check failed:", error);
  }
}

const GlobalProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [bikes, setBikes] = useState([]);
  const [bikesLoaded, setBikesLoaded] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [trackingAllowed, setTrackingAllowed] = useState(false);
  const [nearby, setNearby] = useState(new Map()); // own tag -> rssi
  const [appActive, setAppActive] = useState(AppState.currentState === "active");

  const userId = session?.user?.id ?? null;
  const isLoggedIn = Boolean(session);
  const user = useMemo(
    () =>
      session
        ? {
            id: session.user.id,
            email: session.user.email,
            username:
              session.user.user_metadata?.username ||
              session.user.email?.split("@")[0] ||
              "Rider",
          }
        : null,
    [session]
  );

  // ---- Session ------------------------------------------------------------

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data }) => setSession(data.session))
      .finally(() => setIsLoading(false));
    const { data } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
    });
    fetchAppUpdate();
    return () => data.subscription.unsubscribe();
  }, []);

  const login = useCallback(async (email, password) => {
    setSession(await api.signIn(email, password));
  }, []);

  // Resolves to true when signed in, false when the email must be confirmed first.
  const register = useCallback(async (email, password, username) => {
    const result = await api.signUp(email, password, username);
    if (result.needsEmailConfirmation) return false;
    setSession(result.session);
    return true;
  }, []);

  const verifyEmail = useCallback(async (email, code) => {
    setSession(await api.verifySignupCode(email, code));
  }, []);

  const resetPassword = useCallback(async (email, code, newPassword) => {
    setSession(await api.resetPasswordWithCode(email, code, newPassword));
  }, []);

  const handleLogout = useCallback(async (navigationCallback) => {
    try {
      await api.signOut();
    } catch (error) {
      console.log("Logout error:", error);
    }
    setSession(null);
    navigationCallback?.();
  }, []);

  // ---- Bikes and alerts ---------------------------------------------------

  const refreshBikes = useCallback(async () => {
    setBikes(await api.listBikes());
    setBikesLoaded(true);
  }, []);

  const refreshAlerts = useCallback(async () => {
    setAlerts(await api.listAlerts());
  }, []);

  useEffect(() => {
    if (!userId) {
      setBikes([]);
      setBikesLoaded(false);
      setAlerts([]);
      return;
    }
    const safely = (fn) => fn().catch((e) => console.log("Refresh failed:", e.message));
    safely(refreshBikes);
    safely(refreshAlerts);

    const channel = supabase
      .channel(`rider-${userId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bikes", filter: `owner_id=eq.${userId}` },
        () => safely(refreshBikes)
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "alerts", filter: `user_id=eq.${userId}` },
        () => safely(refreshAlerts)
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, refreshBikes, refreshAlerts]);

  // ---- Tracking (the mesh loop) -------------------------------------------

  useEffect(() => {
    hasTrackingPermissions().then(setTrackingAllowed);
    const sub = AppState.addEventListener("change", (state) => {
      setAppActive(state === "active");
      // The user may have changed permissions in system settings.
      if (state === "active") hasTrackingPermissions().then(setTrackingAllowed);
    });
    return () => sub.remove();
  }, []);

  // Resolves to 'granted', 'denied' or 'blocked'.
  const enableTracking = useCallback(async () => {
    const result = await requestTrackingPermissions();
    setTrackingAllowed(result === "granted");
    return result;
  }, []);

  const ownTagsRef = useRef(new Set());
  useEffect(() => {
    ownTagsRef.current = new Set(bikes.map((b) => b.tag_uuid));
  }, [bikes]);

  useEffect(() => {
    if (!userId || !trackingAllowed || !appActive) return;
    return startTracker({
      getOwnTags: () => ownTagsRef.current,
      onNearby: setNearby,
      onOwnSighting: (tag, coords) => {
        // Show the fresh position at once; realtime confirms it a moment later.
        setBikes((prev) =>
          prev.map((b) =>
            b.tag_uuid === tag
              ? {
                  ...b,
                  last_lat: coords.latitude,
                  last_lng: coords.longitude,
                  last_accuracy: coords.accuracy,
                  last_seen_at: new Date().toISOString(),
                  last_source: "owner",
                }
              : b
          )
        );
      },
    });
  }, [userId, trackingAllowed, appActive]);

  return (
    <GlobalContext.Provider
      value={{
        isLoading,
        isLoggedIn,
        user,
        login,
        register,
        verifyEmail,
        resetPassword,
        handleLogout,
        bikes,
        bikesLoaded,
        refreshBikes,
        alerts,
        refreshAlerts,
        nearby,
        trackingAllowed,
        enableTracking,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
