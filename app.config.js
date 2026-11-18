// app.json holds the app's settings. This file adds the Google Maps key from
// the environment (.env locally, build secrets on EAS) so the key is never
// committed to the repository.
module.exports = ({ config }) => ({
  ...config,
  android: {
    ...config.android,
    config: {
      ...config.android?.config,
      googleMaps: { apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY },
    },
  },
});
