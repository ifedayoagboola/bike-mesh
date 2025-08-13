import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { icons } from "../constants";

const FormField = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className={`space-y-3 ${otherStyles}`}>
      <Text className="text-base text-gray-100 font-semibold">{title}</Text>

      <View className={`w-full h-16 px-5 rounded-2xl border-2 flex-row items-center ${
        isFocused 
          ? "bg-white/5 border-secondary" 
          : "bg-black/20 border-gray-700"
      }`}>
        <TextInput
          className="flex-1 text-white font-medium text-base"
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#6B7280"
          onChangeText={handleChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={title.toLowerCase().includes("password") && !showPassword}
          style={{ 
            fontSize: 16,
            lineHeight: 24,
          }}
          {...props}
        />

        {title.toLowerCase().includes("password") && (
          <TouchableOpacity 
            onPress={() => setShowPassword(!showPassword)}
            className="p-2"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Image
              source={!showPassword ? icons.eye : icons.eyeHide}
              className="w-6 h-6"
              resizeMode="contain"
              style={{ tintColor: isFocused ? "#00F704" : "#9CA3AF" }}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;
