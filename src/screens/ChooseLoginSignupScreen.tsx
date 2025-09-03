import React from "react";
import { View, Text, TouchableOpacity, Image, SafeAreaView,TextInput } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ROUTES from "../navigation/routes/ROUTES";

const ChooseLoginSignupScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header Image */}
      <View className="items-center mt-6">
        <Image
          source={{ uri: "https://images.pexels.com/photos/18358071/pexels-photo-18358071/free-photo-of-group-of-motorcyclist-on-pavement-in-park.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" }} // Replace with actual image URL
          className="w-full h-64 object-cover"
          resizeMode="cover"
        />
        <View className="absolute top-0 left-0 w-full h-64 bg-yellow-300 opacity-75 rounded-b-3xl" />
        <View className="absolute top-4 left-4">
          <Text className="text-white text-xl font-bold">RENTING DREAMS</Text>
          <Text className="text-yellow-200 text-sm font-semibold">SINCE 2015</Text>
        </View>
        <TouchableOpacity className="absolute top-4 right-4">
          <Text className="text-white text-2xl">×</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View className="flex-1 justify-center items-center px-6">
        <Text className="text-gray-500 text-xl font-semibold mb-8 text-center">
          Mobility for Everyone!
        </Text>
        <Text className="text-gray-700 text-lg font-medium mb-6 text-center">
          Login or Signup
        </Text>

        {/* Phone Input */}
        <View className="w-full mb-6">
          <View className="flex-row items-center border border-gray-300 rounded-xl p-3 bg-white">
            <Image
              source={{ uri: "https://flagcdn.com/w20/in.png" }} // Indian flag
              className="w-6 h-4 mr-2"
              resizeMode="contain"
            />
            <Text className="text-gray-500 mr-2">+91 |</Text>
            <TextInput
              className="flex-1 text-lg"
              placeholder="Enter Your Phone Number"
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {/* Get OTP Button */}
        <TouchableOpacity className="w-full bg-yellow-400 py-4 rounded-xl mb-4">
          <Text className="text-black text-center font-semibold text-lg">GET OTP</Text>
        </TouchableOpacity>

        {/* Updates Checkbox */}
        <View className="flex-row items-center mb-6">
          <TouchableOpacity className="mr-2">
            <View className="w-5 h-5 border border-gray-400 rounded-sm" />
          </TouchableOpacity>
          <Text className="text-gray-600 text-sm">Get updates on Calls/WhatsApp</Text>
        </View>

        {/* Terms and Conditions */}
        <Text className="text-blue-500 text-sm text-center">
          By clicking through, I agree with the Terms & Conditions and Privacy Policy
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default ChooseLoginSignupScreen;