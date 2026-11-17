import { supabase, isConfigured } from "./supabase";

const NOT_CONFIGURED =
  "The app is not connected to its backend yet. Add the Supabase URL and key to .env and rebuild.";

const unwrap = ({ data, error }) => {
  if (error) throw new Error(error.message);
  return data;
};

const requireConfig = () => {
  if (!isConfigured) throw new Error(NOT_CONFIGURED);
};

// ---- Auth -----------------------------------------------------------------

// Returns { session } when the user is signed in straight away, or
// { needsEmailConfirmation: true } when the project requires email confirmation.
export const signUp = async (email, password, username) => {
  requireConfig();
  const data = unwrap(
    await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { data: { username: username.trim() } },
    })
  );
  if (data.session) return { session: data.session };
  // For an email that is already registered Supabase sends nothing and returns
  // a placeholder user with no identities, so no code will ever arrive.
  if (data.user && data.user.identities && data.user.identities.length === 0) {
    const failure = new Error("An account with this email already exists.");
    failure.accountExists = true;
    throw failure;
  }
  return { needsEmailConfirmation: true };
};

export const signIn = async (email, password) => {
  requireConfig();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });
  if (error) {
    const failure = new Error(error.message);
    // Lets the login screen send the rider to the code screen.
    failure.needsEmailConfirmation = error.code === "email_not_confirmed";
    throw failure;
  }
  return data.session;
};

// Confirms a new account with the code from the sign-up email.
export const verifySignupCode = async (email, code) => {
  const data = unwrap(
    await supabase.auth.verifyOtp({ email: email.trim(), token: code.trim(), type: "signup" })
  );
  return data.session;
};

export const resendSignupCode = async (email) =>
  unwrap(await supabase.auth.resend({ type: "signup", email: email.trim() }));

// Emails a code the rider types in to choose a new password.
export const sendPasswordResetCode = async (email) => {
  requireConfig();
  unwrap(await supabase.auth.resetPasswordForEmail(email.trim()));
};

// Checks the reset code, which signs the rider in, then sets the new password.
export const resetPasswordWithCode = async (email, code, newPassword) => {
  const data = unwrap(
    await supabase.auth.verifyOtp({ email: email.trim(), token: code.trim(), type: "recovery" })
  );
  unwrap(await supabase.auth.updateUser({ password: newPassword }));
  return data.session;
};

export const signOut = async () => {
  await supabase.auth.signOut();
};

// ---- Bikes ----------------------------------------------------------------

const BIKE_COLUMNS =
  "id, tag_uuid, name, emoji, is_lost, lost_at, last_lat, last_lng, last_accuracy, last_seen_at, last_source, created_at";

export const listBikes = async () =>
  unwrap(
    await supabase.from("bikes").select(BIKE_COLUMNS).order("created_at", { ascending: false })
  );

export const claimBike = async ({ tagUuid, name, emoji }) => {
  const { data, error } = await supabase
    .from("bikes")
    .insert({ tag_uuid: tagUuid, name: name.trim(), emoji })
    .select(BIKE_COLUMNS)
    .single();
  if (error?.code === "23505") {
    throw new Error("This tag already belongs to another account.");
  }
  if (error) throw new Error(error.message);
  return data;
};

export const renameBike = async (id, name) =>
  unwrap(await supabase.from("bikes").update({ name: name.trim() }).eq("id", id));

export const setBikeLost = async (id, isLost) =>
  unwrap(await supabase.from("bikes").update({ is_lost: isLost }).eq("id", id));

export const removeBike = async (id) =>
  unwrap(await supabase.from("bikes").delete().eq("id", id));

// Of the tags in range, which have not been claimed by anyone yet?
export const unclaimedTags = async (tags) =>
  unwrap(await supabase.rpc("unclaimed_tags", { p_tags: tags }));

// ---- Sightings ------------------------------------------------------------

export const lostTags = async () => unwrap(await supabase.rpc("lost_tags"));

// Resolves to 'owner', 'crowd', 'throttled' or 'ignored'.
export const reportSighting = async ({ tag, latitude, longitude, accuracy, rssi }) =>
  unwrap(
    await supabase.rpc("report_sighting", {
      p_tag: tag,
      p_lat: latitude,
      p_lng: longitude,
      p_accuracy: accuracy ?? null,
      p_rssi: rssi ?? null,
    })
  );

export const listSightings = async (bikeId, { sinceMs, limit = 200 } = {}) => {
  let query = supabase
    .from("sightings")
    .select("id, bike_id, source, lat, lng, accuracy, rssi, seen_at")
    .eq("bike_id", bikeId)
    .order("seen_at", { ascending: false })
    .limit(limit);
  if (sinceMs) query = query.gte("seen_at", new Date(Date.now() - sinceMs).toISOString());
  return unwrap(await query);
};

// ---- Alerts ---------------------------------------------------------------

export const listAlerts = async () =>
  unwrap(
    await supabase
      .from("alerts")
      .select("id, bike_id, type, title, body, lat, lng, resolved, created_at")
      .order("created_at", { ascending: false })
      .limit(100)
  );

export const setAlertResolved = async (id, resolved) =>
  unwrap(await supabase.from("alerts").update({ resolved }).eq("id", id));
