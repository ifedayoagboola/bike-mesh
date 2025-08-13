import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { icons, images } from '../constants';

const { width, height } = Dimensions.get('window');

const OnboardingScreen = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const onboardingData = [
    {
      id: 1,
      title: "Welcome to Bike Mesh",
      subtitle: "Track your valuable assets with precision and ease. Never lose sight of what matters most.",
      image: images.logo,
      backgroundColor: '#0F0F23',
      iconBg: 'bg-secondary/20',
      iconBorder: 'border-secondary/30',
    },
    {
      id: 2,
      title: "Smart Asset Tracking",
      subtitle: "Real-time GPS tracking, Bluetooth connectivity, and instant notifications keep your assets secure.",
      image: images.bicycle,
      backgroundColor: '#1A1A2E',
      iconBg: 'bg-secondary/20',
      iconBorder: 'border-secondary/30',
    },
    {
      id: 3,
      title: "Always Know Where",
      subtitle: "Get instant alerts, view real-time locations, and manage all your tracked assets from one powerful app.",
      image: icons.location,
      backgroundColor: '#16213E',
      iconBg: 'bg-secondary/20',
      iconBorder: 'border-secondary/30',
    },
    {
      id: 4,
      title: "Easy Setup",
      subtitle: "Install the tracker in minutes, download the app, and you're protected. No complex wiring or monthly fees.",
      image: icons.plus,
      backgroundColor: '#0F0F23',
      iconBg: 'bg-secondary/20',
      iconBorder: 'border-secondary/30',
    },
    {
      id: 5,
      title: "Trusted by Thousands",
      subtitle: "Join millions of users worldwide who trust Bike Mesh to protect their valuable assets. Your security is our priority.",
      image: icons.profile,
      backgroundColor: '#1A1A2E',
      iconBg: 'bg-secondary/20',
      iconBorder: 'border-secondary/30',
    },
  ];

  const nextSlide = () => {
    if (currentIndex < onboardingData.length - 1) {
      setCurrentIndex(currentIndex + 1);
      scrollViewRef.current?.scrollTo({
        x: (currentIndex + 1) * width,
        animated: true,
      });
    } else {
      onComplete();
    }
  };

  const skipToEnd = () => {
    onComplete();
  };

  const renderSlide = (item, index) => (
    <View key={item.id} style={{ width }} className="flex-1 items-center justify-center px-8">
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateX: slideAnim }],
        }}
        className="items-center"
      >
        {/* Logo Container */}
        <View className={`w-32 h-32 ${item.iconBg} rounded-3xl items-center justify-center mb-8 border ${item.iconBorder}`}>
          <Image
            source={item.image}
            resizeMode="contain"
            className="w-20 h-20"
          />
        </View>

        {/* Title */}
        <Text className="text-3xl font-bold text-white text-center mb-6 leading-tight">
          {item.title}
        </Text>

        {/* Subtitle */}
        <Text className="text-lg text-gray-300 text-center leading-relaxed px-4">
          {item.subtitle}
        </Text>
      </Animated.View>
    </View>
  );

  const renderDots = () => (
    <View className="flex-row justify-center items-center space-x-3 mb-8">
      {onboardingData.map((_, index) => (
        <View
          key={index}
          className={`w-3 h-3 rounded-full ${
            index === currentIndex ? 'bg-secondary' : 'bg-gray-600'
          }`}
        />
      ))}
    </View>
  );

  const renderButtons = () => (
    <View className="flex-row justify-between items-center px-8 pb-8">
      <TouchableOpacity onPress={skipToEnd} className="px-6 py-3">
        <Text className="text-gray-400 font-semibold text-lg">Skip</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={nextSlide}
        className="bg-secondary px-8 py-4 rounded-2xl"
      >
        <Text className="text-black font-bold text-lg">
          {currentIndex === onboardingData.length - 1 ? 'Start Protecting Your Assets' : 'Next'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  useEffect(() => {
    // Reset animations when slide changes
    fadeAnim.setValue(0);
    slideAnim.setValue(50);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentIndex]);

  return (
    <View className="flex-1">
      <LinearGradient
        colors={['#0F0F23', '#1A1A2E', '#16213E']}
        className="flex-1"
      >
        {/* Content */}
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(event) => {
            const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
            setCurrentIndex(newIndex);
          }}
          className="flex-1"
        >
          {onboardingData.map((item, index) => renderSlide(item, index))}
        </ScrollView>

        {/* Dots */}
        {renderDots()}

        {/* Buttons */}
        {renderButtons()}
      </LinearGradient>
    </View>
  );
};

export default OnboardingScreen; 