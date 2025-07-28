import {
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  View,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "../config/colors";

import { Stack, router } from "expo-router";
import { icons } from "../constants";
import FormField from "../components/FormField";
import CustomButton from "../components/CustomButton";
import Camera from "../components/Camera";
import { useEffect, useState } from "react";
import { startDiscovery, stopDiscovery } from "../bleDiscovery";

const Connect = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [seen, setSeen] = useState(new Map());
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    if (isScanning) {
      startDiscovery(({ uuid, rssi }) => {
        setSeen(m => new Map(m).set(uuid, { rssi }));
        console.log(`Found ${uuid} @ ${rssi} dBm`);
      });
      return stopDiscovery;
    }
  }, [isScanning]);

  const startScan = () => {
    setIsScanning(true);
    setSeen(new Map());
  };

  const stopScan = () => {
    setIsScanning(false);
    stopDiscovery();
  };

  return (
    <SafeAreaView style={styles.screen} className="p-4">
      <Stack.Screen options={{ headerShown: false }} />
      <TouchableOpacity
        onPress={() => {
          router.back() || router.push("/history");
        }}
      >
        <Image source={icons.back} resizeMode="contain" className="w-6 h-6" />
      </TouchableOpacity>
      <Text className="text-white font-psemibold text-4xl w-[200px] py-3">
        Connect Bicycle
      </Text>
      
      {/* BLE Scanning Section */}
      <View className="mb-6">
        <Text className="text-white font-pmedium text-lg mb-3">
          Scan for Nearby Bikes
        </Text>
        <View className="flex-row space-x-3 mb-4">
          <CustomButton 
            title={isScanning ? "Stop Scan" : "Start Scan"} 
            textStyles="font-pmedium"
            onPress={isScanning ? stopScan : startScan}
          />
        </View>
        
        {seen.size > 0 && (
          <View className="bg-gray-800 rounded-lg p-4">
            <Text className="text-white font-pmedium mb-2">
              Found {seen.size} device(s):
            </Text>
            {[...seen.entries()].map(([uuid, { rssi }]) => (
              <TouchableOpacity 
                key={uuid}
                className="bg-gray-700 rounded p-3 mb-2"
                onPress={() => {
                  // Handle device selection
                  console.log(`Selected device: ${uuid}`);
                }}
              >
                <Text className="text-white font-pmedium">
                  Bike {uuid.slice(0, 8)}...
                </Text>
                <Text className="text-gray-300 text-sm">
                  RSSI: {rssi} dBm
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <FormField otherStyles="py-6" placeholder="Tracking ID" />
      <CustomButton title="Connect Asset" textStyles="font-pmedium" />

      <Text
        className="text-lg text-secondary pt-12 font"
        onPress={() => {
          setModalVisible(true);
        }}
      >
        Scan code instead?
      </Text>

      <View style={styles.centeredView}>
        <Modal animationType="slide" transparent={true} visible={modalVisible}>
          <View style={styles.centeredView}>
            <View style={styles.modalView} className="w-full h-full">
              <Camera />
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

export default Connect;

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.dark,
    flex: 1,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
