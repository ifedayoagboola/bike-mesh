import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import MapView, { Marker, Circle, Polygon, PROVIDER_GOOGLE } from "react-native-maps";
import colors from "../config/colors";

const { width, height } = Dimensions.get("window");

const GeofenceEditor = ({ 
  visible, 
  onClose, 
  onGeofenceSaved, 
  initialLocation = null,
  bike = null 
}) => {
  const [geofenceType, setGeofenceType] = useState("circle"); // "circle" or "polygon"
  const [geofenceName, setGeofenceName] = useState("");
  const [radius, setRadius] = useState(100); // meters
  const [center, setCenter] = useState(initialLocation || {
    latitude: 40.7128,
    longitude: -74.0060,
  });
  const [polygonPoints, setPolygonPoints] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const slideAnim = useRef(new Animated.Value(height)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const mapRef = useRef(null);

  useEffect(() => {
    if (visible) {
      slideIn();
      if (initialLocation) {
        setCenter(initialLocation);
      }
      if (bike) {
        setGeofenceName(`${bike.title} Home`);
      }
    } else {
      slideOut();
    }
  }, [visible, initialLocation, bike]);

  const slideIn = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const slideOut = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  const handleMapPress = (event) => {
    if (geofenceType === "polygon" && isDrawing) {
      const newPoint = event.nativeEvent.coordinate;
      setPolygonPoints([...polygonPoints, newPoint]);
    } else if (geofenceType === "circle") {
      setCenter(event.nativeEvent.coordinate);
    }
  };

  const handleMarkerDrag = (event) => {
    setCenter(event.nativeEvent.coordinate);
  };

  const startPolygonDrawing = () => {
    setPolygonPoints([]);
    setIsDrawing(true);
  };

  const finishPolygonDrawing = () => {
    if (polygonPoints.length >= 3) {
      setIsDrawing(false);
    } else {
      Alert.alert("Error", "Polygon must have at least 3 points");
    }
  };

  const clearPolygon = () => {
    setPolygonPoints([]);
    setIsDrawing(false);
  };

  const calculatePolygonArea = () => {
    if (polygonPoints.length < 3) return 0;
    
    // Simple area calculation (approximate)
    let area = 0;
    for (let i = 0; i < polygonPoints.length; i++) {
      const j = (i + 1) % polygonPoints.length;
      area += polygonPoints[i].longitude * polygonPoints[j].latitude;
      area -= polygonPoints[j].longitude * polygonPoints[i].latitude;
    }
    return Math.abs(area) * 111320 * 111320 / 2; // Convert to square meters
  };

  const handleSave = () => {
    if (!geofenceName.trim()) {
      Alert.alert("Error", "Please enter a geofence name");
      return;
    }

    if (geofenceType === "circle" && radius <= 0) {
      Alert.alert("Error", "Please set a valid radius");
      return;
    }

    if (geofenceType === "polygon" && polygonPoints.length < 3) {
      Alert.alert("Error", "Polygon must have at least 3 points");
      return;
    }

    const geofence = {
      id: Date.now().toString(),
      name: geofenceName.trim(),
      type: geofenceType,
      center: center,
      radius: geofenceType === "circle" ? radius : null,
      polygon: geofenceType === "polygon" ? polygonPoints : null,
      area: geofenceType === "polygon" ? calculatePolygonArea() : Math.PI * radius * radius,
      bikeId: bike?.id,
      bikeName: bike?.title,
    };

    onGeofenceSaved(geofence);
    slideOut();
  };

  const renderHeader = () => (
    <View className="flex-row items-center justify-between p-6 border-b border-gray-800">
      <TouchableOpacity onPress={slideOut}>
        <MaterialCommunityIcons
          name="close"
          size={24}
          color={colors.white}
        />
      </TouchableOpacity>
      <Text className="text-white font-psemibold text-lg">
        Create Geofence
      </Text>
      <TouchableOpacity onPress={handleSave}>
        <MaterialCommunityIcons
          name="check"
          size={24}
          color={colors.secondary}
        />
      </TouchableOpacity>
    </View>
  );

  const renderTypeSelector = () => (
    <View className="p-6">
      <Text className="text-white font-psemibold text-lg mb-4">Geofence Type</Text>
      <View className="flex-row space-x-4">
        <TouchableOpacity
          className={`flex-1 p-4 rounded-xl border-2 ${
            geofenceType === "circle" 
              ? "border-primary bg-primary/20" 
              : "border-gray-700 bg-gray-800"
          }`}
          onPress={() => setGeofenceType("circle")}
        >
          <View className="items-center">
            <MaterialCommunityIcons
              name="circle-outline"
              size={32}
              color={geofenceType === "circle" ? colors.secondary : colors.secondary}
            />
            <Text className={`font-psemibold text-base mt-2 ${
              geofenceType === "circle" ? "text-white" : "text-secondary"
            }`}>
              Circle (Outdoor)
            </Text>
            <Text className="text-secondary font-pregular text-xs text-center mt-1">
              Perfect for outdoor areas
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          className={`flex-1 p-4 rounded-xl border-2 ${
            geofenceType === "polygon" 
              ? "border-primary bg-primary/20" 
              : "border-gray-700 bg-gray-800"
          }`}
          onPress={() => setGeofenceType("polygon")}
        >
          <View className="items-center">
            <MaterialCommunityIcons
              name="shape-outline"
              size={32}
              color={geofenceType === "polygon" ? colors.secondary : colors.secondary}
            />
            <Text className={`font-psemibold text-base mt-2 ${
              geofenceType === "polygon" ? "text-white" : "text-secondary"
            }`}>
              Polygon (Indoor)
            </Text>
            <Text className="text-secondary font-pregular text-xs text-center mt-1">
              Perfect for warehouses
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderNameInput = () => (
    <View className="px-6 mb-4">
      <Text className="text-white font-pregular text-sm mb-2">Geofence Name</Text>
      <TextInput
        className="bg-gray-800 rounded-xl p-4 text-white border border-gray-700"
        placeholder="Enter geofence name"
        placeholderTextColor={colors.secondary}
        value={geofenceName}
        onChangeText={setGeofenceName}
      />
    </View>
  );

  const renderCircleControls = () => (
    <View className="px-6 mb-4">
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-white font-pregular text-sm">Radius</Text>
        <Text className="text-secondary font-psemibold text-sm">{radius}m</Text>
      </View>
      <View className="bg-gray-800 rounded-xl p-4">
        <View className="flex-row items-center space-x-4">
          <TouchableOpacity
            className="w-10 h-10 bg-primary rounded-full items-center justify-center"
            onPress={() => setRadius(Math.max(10, radius - 10))}
          >
            <MaterialCommunityIcons
              name="minus"
              size={20}
              color={colors.white}
            />
          </TouchableOpacity>
          
          <View className="flex-1 bg-gray-700 rounded-full h-2">
            <View 
              className="bg-primary h-2 rounded-full"
              style={{ width: `${(radius / 500) * 100}%` }}
            />
          </View>
          
          <TouchableOpacity
            className="w-10 h-10 bg-primary rounded-full items-center justify-center"
            onPress={() => setRadius(Math.min(500, radius + 10))}
          >
            <MaterialCommunityIcons
              name="plus"
              size={20}
              color={colors.white}
            />
          </TouchableOpacity>
        </View>
        <View className="flex-row justify-between mt-2">
          <Text className="text-secondary font-pregular text-xs">10m</Text>
          <Text className="text-secondary font-pregular text-xs">500m</Text>
        </View>
      </View>
    </View>
  );

  const renderPolygonControls = () => (
    <View className="px-6 mb-4">
      <Text className="text-white font-pregular text-sm mb-2">Polygon Drawing</Text>
      <View className="flex-row space-x-3">
        <TouchableOpacity
          className={`flex-1 p-3 rounded-xl border-2 ${
            isDrawing 
              ? "border-red-500 bg-red-500/20" 
              : "border-primary bg-primary/20"
          }`}
          onPress={isDrawing ? finishPolygonDrawing : startPolygonDrawing}
        >
          <Text className={`font-psemibold text-center ${
            isDrawing ? "text-red-500" : "text-white"
          }`}>
            {isDrawing ? "Finish Drawing" : "Start Drawing"}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          className="flex-1 p-3 rounded-xl border-2 border-gray-700 bg-gray-800"
          onPress={clearPolygon}
        >
          <Text className="text-secondary font-psemibold text-center">Clear</Text>
        </TouchableOpacity>
      </View>
      
      {polygonPoints.length > 0 && (
        <View className="mt-3 bg-gray-800 rounded-xl p-3">
          <Text className="text-secondary font-pregular text-sm">
            Points: {polygonPoints.length} • Area: ~{Math.round(calculatePolygonArea())}m²
          </Text>
        </View>
      )}
    </View>
  );

  const renderMap = () => (
    <View className="flex-1 mx-6 mb-4">
      <MapView
        ref={mapRef}
        style={{ flex: 1, borderRadius: 16 }}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          ...center,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        onPress={handleMapPress}
      >
        {/* Center Marker */}
        <Marker
          coordinate={center}
          draggable={geofenceType === "circle"}
          onDragEnd={handleMarkerDrag}
          pinColor={colors.primary}
        />

        {/* Circle Geofence */}
        {geofenceType === "circle" && (
          <Circle
            center={center}
            radius={radius}
            fillColor="rgba(0, 247, 4, 0.2)"
            strokeColor={colors.secondary}
            strokeWidth={2}
          />
        )}

        {/* Polygon Geofence */}
        {geofenceType === "polygon" && polygonPoints.length >= 3 && (
          <Polygon
            coordinates={polygonPoints}
            fillColor="rgba(0, 247, 4, 0.2)"
            strokeColor={colors.secondary}
            strokeWidth={2}
          />
        )}

        {/* Polygon Points */}
        {geofenceType === "polygon" && polygonPoints.map((point, index) => (
          <Marker
            key={index}
            coordinate={point}
            pinColor="#FF4444"
            title={`Point ${index + 1}`}
          />
        ))}
      </MapView>
    </View>
  );

  const renderInstructions = () => (
    <View className="px-6 mb-6">
      <View className="bg-gray-800 rounded-xl p-4">
        <Text className="text-white font-psemibold text-base mb-2">Instructions:</Text>
        {geofenceType === "circle" ? (
          <Text className="text-secondary font-pregular text-sm">
            • Drag the marker to set the center point{'\n'}
            • Use the slider to adjust the radius{'\n'}
            • Tap the map to move the center
          </Text>
        ) : (
          <Text className="text-secondary font-pregular text-sm">
            • Tap "Start Drawing" to begin{'\n'}
            • Tap the map to add polygon points{'\n'}
            • Tap "Finish Drawing" when done{'\n'}
            • Need at least 3 points
          </Text>
        )}
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent={true}
      onRequestClose={slideOut}
    >
      <Animated.View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          opacity: fadeAnim,
        }}
      >
        <Animated.View
          style={{
            flex: 1,
            transform: [{ translateY: slideAnim }],
          }}
          className="bg-dark"
        >
          {renderHeader()}
          
          <ScrollView showsVerticalScrollIndicator={false}>
            {renderTypeSelector()}
            {renderNameInput()}
            {geofenceType === "circle" ? renderCircleControls() : renderPolygonControls()}
            {renderInstructions()}
          </ScrollView>

          {renderMap()}
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

export default GeofenceEditor; 