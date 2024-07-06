import {
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Text,
  View,
  Modal,
  Dimensions,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "../config/colors";

import { Link, Stack } from "expo-router";
import { icons } from "../constants";
import FormField from "../components/FormField";
import CustomButton from "../components/CustomButton";
import Camera from "../components/Camera";
import { useState } from "react";

const Connect = () => {
  const [modalVisible, setModalVisible] = useState(false);
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
      <Text className="text-white">connect Screen</Text>
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
