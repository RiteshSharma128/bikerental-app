import React from 'react';
import { View, Text, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SplashScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-yellow-500 justify-center items-center">
      <View className="items-center">
        <Image
          source={{ uri: 'https://d36g7qg6pk2cm7.cloudfront.net/assets/landing_page/royal_brothers_logo-229959d7727f356b2e4fc3bd9c0c527c60127d009c93989a93e2daa0b1c2d556.svg' }}
          className="w-36 h-36"
          resizeMode="contain"
        />
        <Text className="text-2xl font-bold text-gray-800 mt-5">Welcome to Rental Bikes</Text>
        <Text className="text-base text-gray-600 mt-2.5">Loading your ride...</Text>
      </View>
    </SafeAreaView>
  );
};

export default SplashScreen;