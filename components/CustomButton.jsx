import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const CustomButton = ({
  title,
  handlePress,
  containerStyles,
  textStyles,
  isLoading,
  variant = "primary", // primary, secondary, outline
  size = "default", // small, default, large
  ...args
}) => {
  const getButtonStyles = () => {
    const baseStyles = "rounded-2xl flex-row justify-center items-center";
    
    switch (variant) {
      case "primary":
        return `${baseStyles} bg-secondary`;
      case "secondary":
        return `${baseStyles} bg-white/10 border border-white/20`;
      case "outline":
        return `${baseStyles} bg-transparent border-2 border-secondary`;
      default:
        return `${baseStyles} bg-secondary`;
    }
  };

  const getTextStyles = () => {
    const baseTextStyles = "font-bold text-center";
    
    switch (variant) {
      case "primary":
        return `${baseTextStyles} text-black`;
      case "secondary":
        return `${baseTextStyles} text-white`;
      case "outline":
        return `${baseTextStyles} text-secondary`;
      default:
        return `${baseTextStyles} text-black`;
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case "small":
        return "min-h-[44px] px-6";
      case "large":
        return "min-h-[60px] px-8";
      default:
        return "min-h-[56px] px-6";
    }
  };

  const getTextSize = () => {
    switch (size) {
      case "small":
        return "text-base";
      case "large":
        return "text-xl";
      default:
        return "text-lg";
    }
  };

  if (variant === "primary") {
    return (
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.8}
        className={`${getButtonStyles()} ${getSizeStyles()} ${containerStyles} ${
          isLoading ? "opacity-60" : ""
        }`}
        disabled={isLoading}
        {...args}
      >
        <LinearGradient
          colors={isLoading ? ['#00F704', '#00D404'] : ['#00F704', '#00D404']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="absolute w-full h-full rounded-2xl"
        />
        
        <View className="flex-row items-center justify-center">
          <Text className={`${getTextStyles()} ${getTextSize()} ${textStyles}`}>
            {title}
          </Text>

          {isLoading && (
            <ActivityIndicator
              animating={isLoading}
              color={variant === "outline" ? "#00F704" : "#000"}
              size="small"
              className="ml-3"
            />
          )}
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.8}
      className={`${getButtonStyles()} ${getSizeStyles()} ${containerStyles} ${
        isLoading ? "opacity-60" : ""
      }`}
      disabled={isLoading}
      {...args}
    >
      <View className="flex-row items-center justify-center">
        <Text className={`${getTextStyles()} ${getTextSize()} ${textStyles}`}>
          {title}
        </Text>

        {isLoading && (
          <ActivityIndicator
            animating={isLoading}
            color={variant === "outline" ? "#00F704" : "#fff"}
            size="small"
            className="ml-3"
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default CustomButton;
