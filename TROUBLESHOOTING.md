# Troubleshooting Guide - Bike Mesh App

## 🚨 Most Common Issue: "No development build" Error

### Error Message

```
CommandError: No development build (com.cofounders.bikemesh) for this project is installed. Install a development build on the target device and try again.
```

### Why This Happens

- Development build was uninstalled from device
- Build expired or became incompatible
- Device was reset/cleared
- Expo SDK version mismatch

### ✅ Solution: Rebuild Development Build

**For Android:**

```bash
npx expo run:android
```

**For iOS:**

```bash
npx expo run:ios
```

**Note:** This will take several minutes as it compiles the native code.

## 🔧 Other Common Issues

### 1. Expo CLI Not Found

```bash
# Install globally
npm install -g @expo/cli

# Or use npx (recommended)
npx expo start
npx expo run:android
```

### 2. Port Already in Use

```bash
# Kill existing process
lsof -ti:8081 | xargs kill -9

# Or use different port
npx expo start --port 8082
```

### 3. Metro Bundler Cache Issues

```bash
npx expo start --clear
```

### 4. Native Module Linking Problems

```bash
# Clear everything and reinstall
rm -rf node_modules package-lock.json
npm install
npx expo run:android  # or ios
```

### 5. Bluetooth Permissions

Make sure your device has:

- Bluetooth enabled
- Location permissions granted
- App permissions for Bluetooth and Location

## 📱 Device-Specific Issues

### Android

- Enable Developer Options
- Enable USB Debugging
- Allow installation from unknown sources
- Grant all requested permissions

### iOS

- Trust developer certificate
- Enable Developer Mode
- Grant camera, location, and Bluetooth permissions

## 🚀 Quick Recovery Steps

When the app stops working:

1. **First, rebuild the development build:**

   ```bash
   npx expo run:android  # or ios
   ```

2. **If that doesn't work, restart the development server:**

   ```bash
   npx expo start --clear
   ```

3. **If still having issues, clean install:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   npx expo run:android  # or ios
   ```

## 💡 Prevention Tips

- **Don't uninstall the development build** from your device
- **Keep Expo CLI updated:** `npm install -g @expo/cli@latest`
- **Use consistent devices** for development
- **Backup your development builds** if possible

## 📞 When to Get Help

Contact the development team if:

- Rebuilding doesn't work
- Bluetooth functionality is broken
- Maps aren't loading
- Camera integration fails
- App crashes on startup

## 🔍 Debug Mode

Enable debug logging:

```bash
npx expo start --dev-client
```

This provides more detailed error information for troubleshooting.
