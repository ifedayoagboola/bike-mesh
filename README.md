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

### 2. Build and Install Development Build (Required First Step)

**For Android:**

```bash
npx expo run:android
```

**For iOS:**

```bash
npx expo run:ios
```

### 3. Start Development Server (After Development Build is Installed)

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
├── lib/                # Utility libraries (Appwrite)
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
