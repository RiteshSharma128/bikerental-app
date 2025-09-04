import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, SafeAreaView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../contexts/AuthContext";
import ROUTES from "../navigation/routes/ROUTES";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Define navigation param list
type RootStackParamList = {
  PhoneNumber: undefined;
  Otp: { sessionId: string; phone: string; isLogin?: boolean };
  ProfileCompletion: { phone: string };
  Home: undefined;
  // Add other screens as needed
};

type PhoneNumberScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'PhoneNumber'>;

// Define Auth context return type
interface AuthContextType {
  sendOtp: (phone: string) => Promise<string>; // Assuming sendOtp returns sessionId
}

const PhoneNumberScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const navigation = useNavigation<PhoneNumberScreenNavigationProp>();
  const { sendOtp } = useAuth() as AuthContextType;
  const [error, setError] = useState<string | null>(null); // Explicitly type error as string | null
  const [isLogin, setIsLogin] = useState<boolean>(true); // Toggle between Login and Signup

  const handleContinue = async () => {
    if (!phoneNumber) {
      setError("Phone number is required");
      return;
    }
    try {
      const sessionId = await sendOtp(phoneNumber);
      navigation.navigate("Otp", { sessionId, phone: phoneNumber, isLogin });
    } catch (err) {
      setError("Failed to send OTP");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header Image */}
      <View className="items-center mt-6">
        <Image
          source={{ uri: "https://via.placeholder.com/300x200" }} // Replace with actual image URL
          className="w-full h-64 object-cover"
          resizeMode="cover"
        />
        <View className="absolute top-0 left-0 w-full h-64 bg-yellow-300 opacity-50 rounded-b-3xl" />
        <View className="absolute top-4 left-4">
          <Text className="text-white text-xl font-bold">RENTING DREAMS</Text>
          <Text className="text-yellow-200 text-sm font-semibold">SINCE 2015</Text>
        </View>
        <TouchableOpacity className="absolute top-4 right-4" onPress={() => navigation.goBack()}>
          <Text className="text-white text-2xl">×</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View className="flex-1 justify-center items-center px-6">
        <Text className="text-gray-500 text-xl font-semibold mb-8 text-center">
          Mobility for Everyone!
        </Text>
        <Text className="text-gray-700 text-lg font-medium mb-6 text-center">
          {isLogin ? "Login" : "Signup"}
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
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
          </View>
        </View>

        {/* Error Message */}
        {error && <Text className="text-red-500 mb-4">{error}</Text>}

        {/* Get OTP Button */}
        <TouchableOpacity className="w-full bg-yellow-400 py-4 rounded-xl mb-4" onPress={handleContinue}>
          <Text className="text-black text-center font-semibold text-lg">GET OTP</Text>
        </TouchableOpacity>

        {/* Updates Checkbox */}
        <View className="flex-row items-center mb-6">
          <TouchableOpacity className="mr-2">
            <View className="w-5 h-5 border border-gray-400 rounded-sm" />
          </TouchableOpacity>
          <Text className="text-gray-600 text-sm">Get updates on Calls/WhatsApp</Text>
        </View>

        {/* Toggle Login/Signup */}
        <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
          <Text className="text-blue-500 text-sm">
            {isLogin ? "Need to Signup? Click here" : "Already have an account? Login"}
          </Text>
        </TouchableOpacity>

        {/* Terms and Conditions */}
        <Text className="text-blue-500 text-sm text-center mt-4">
          By clicking through, I agree with the Terms & Conditions and Privacy Policy
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default PhoneNumberScreen;
