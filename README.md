# Bike Mesh - Asset Tracker App

A React Native Expo app for tracking bikes and other assets using Bluetooth LE connectivity, GPS location, and real-time mapping.

## 🚨 Important: Development Build Required

This app **requires a development build** because it uses native modules that aren't supported in Expo Go:

- `react-native-ble-plx` - Bluetooth LE connectivity
- `expo-camera` - Camera functionality
- `expo-location` - GPS and location services
- `react-native-maps` - Native mapping

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **Expo CLI** (install globally: `npm install -g @expo/cli`)
- **Android Studio** (for Android development)
- **Xcode** (for iOS development, macOS only)
- **Physical device** or emulator for testing

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Connect the backend (Supabase)

1. Copy `.env.example` to `.env` and paste the project's anon (publishable) key into `EXPO_PUBLIC_SUPABASE_ANON_KEY`. Find it in the Supabase dashboard under Project Settings, API Keys.
2. Open the Supabase SQL editor, paste the whole of `supabase/migrations/20261114000000_bikemesh_core.sql` and run it once.
3. Emails carry a code the rider types into the app, never a link. In Supabase open Authentication, Emails and edit two templates, "Confirm signup" and "Reset password", so the body shows the code with `{{ .Token }}` instead of the link (`{{ .ConfirmationURL }}`). To skip sign-up confirmation while testing, turn off "Confirm email" under Authentication, Sign In / Providers, Email.
4. Supabase's built-in email sender is for testing only (a few emails an hour, team addresses only). Connect your own sender under Authentication, SMTP settings before other people sign up.

### 3. Build and Install Development Build (Required First Step)

**For Android:**

```bash
npx expo run:android
```

**For iOS:**

```bash
npx expo run:ios
```

### 4. Start Development Server (After Development Build is Installed)

```bash
npx expo start
```

**For Android:**

```bash
npx expo run:android
```

**For iOS:**

```bash
npx expo run:ios
```

## 🔧 Development Workflow

### Starting the App

```bash
# FIRST TIME: Build and install development build
npx expo run:android    # Android
npx expo run:ios        # iOS

# AFTER development build is installed: Start development server
npx expo start
```

### Available Scripts

- `npm start` - Start Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator
- `npm run web` - Run in web browser

## 🐛 Troubleshooting

### "No development build" Error

If you get this error:

```
CommandError: No development build (com.cofounders.bikemesh) for this project is installed.
```

**Solution:** Rebuild the development build:

```bash
npx expo run:android  # or npx expo run:ios
```

### Common Issues

1. **Expo CLI not found**

   ```bash
   npm install -g @expo/cli
   # or use npx expo instead of expo
   ```

2. **Port already in use**
   - Press `y` when prompted to use a different port
   - Or kill the existing process: `lsof -ti:8081 | xargs kill -9`

3. **Metro bundler cache issues**

   ```bash
   npx expo start --clear
   ```

4. **Native module linking issues**
   ```bash
   # Clear and reinstall
   rm -rf node_modules package-lock.json
   npm install
   npx expo run:android  # or ios
   ```

## 📦 Tester build (installable APK)

A standalone file testers can install without Expo or a cable. From `android/`:

```sh
./gradlew app:assembleRelease -x lint -PreactNativeArchitectures=armeabi-v7a,arm64-v8a
```

The file lands in `android/app/build/outputs/apk/release/app-release.apk`. It reads the Supabase URL and key from `.env` at build time. Each tester also needs a tag flashed with the firmware in `firmware/`.

## 🧭 How it works

- **Sign up**, then pair the tag on your bike: the app lists nearby unclaimed tags (iBeacon frames), closest first. One tag belongs to one account.
- **While the app is open**, your phone listens for your tags and records where it last saw each bike (at most once a minute per bike).
- **Mark a bike as lost** and every other rider's phone that passes it reports its location to you. Finders stay anonymous and only lost bikes are ever reported.
- Rebuild the development build after pulling this change: it adds native modules (`async-storage`, `expo-linear-gradient`).

## 📱 App Features

- **Bluetooth LE Connectivity** - Connect to bike tracking devices
- **Real-time GPS Tracking** - Monitor asset location
- **Interactive Maps** - View and manage asset positions
- **Camera Integration** - Capture and upload images
- **Authentication System** - User login and registration
- **Push Notifications** - Real-time alerts

## 🏗️ Project Structure

```
bike-mesh/
├── app/                 # Expo Router screens
├── components/          # Reusable UI components
├── context/            # React Context providers
├── lib/                # Supabase client, API calls, permissions, the tracking loop
├── supabase/           # Database migrations
├── assets/             # Images, fonts, icons
├── android/            # Android native code
├── ios/                # iOS native code
└── config/             # App configuration
```

## 🔌 Native Dependencies

- **Bluetooth**: `react-native-ble-plx`
- **Maps**: `react-native-maps`
- **Camera**: `expo-camera`
- **Location**: `expo-location`
- **Navigation**: `expo-router`
- **Styling**: `nativewind` (Tailwind CSS)

## 📦 Build Configuration

The app uses:

- **Expo SDK 53**
- **React Native 0.79.5**
- **Development Client** for native module support
- **EAS Build** for production builds

## 🚨 Why Not Expo Go?

Expo Go is a sandboxed environment that can't access:

- Bluetooth hardware
- Native camera APIs
- Background location services
- Custom native modules

This is why a development build is essential for testing core functionality.

## 📚 Additional Resources

- [Expo Development Builds](https://docs.expo.dev/development/build/)
- [React Native Bluetooth LE](https://github.com/Polidea/react-native-ble-plx)
- [Expo Router Documentation](https://expo.github.io/router/)
- [NativeWind Documentation](https://www.nativewind.dev/)

## 🤝 Contributing

1. Ensure you have a development build installed
2. Test Bluetooth functionality on a physical device
3. Verify location services work correctly
4. Test camera integration

## 📄 License

Private project - All rights reserved
