import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CheckCheck, MapPin, Wallet, HelpCircle, X, FileText, Shield, LogOut } from 'lucide-react-native';
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../contexts/AuthContext";
import { NativeStackNavigationProp } from '@react-navigation/native-stack'; // Import for navigation typing

// Define User type based on your schema
interface User {
  phone: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  id?: string; // Assuming userId might be included in the context
}

// Define the Auth context return type
interface AuthContextType {
  logout: () => Promise<void>;
  user: User | null;
  token?: string; // Optional token if included in useAuth
}

// Assuming a Stack Navigator (adjust based on your navigator)
type RootStackParamList = {
  UpdateProfile: undefined;
  Bookings: undefined;
  // Add other screens as needed
};

const MenuScreen = () => {
  const { logout, user } = useAuth() as AuthContextType; // Type assertion or adjust useAuth typing
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  console.log("Data", user);

  const handleViewProfile = () => {
    navigation.navigate("UpdateProfile");
  };

  const handleMyBookings = () => {
    navigation.navigate("Bookings");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        {/* Header Section */}
        <View className="bg-yellow-400 rounded-b-3xl px-6 pt-8 pb-10">
          <View className="flex-row items-center gap-4">
            {/* Profile Icon */}
            <View className="w-20 h-20 rounded-full border-4 border-green-400 flex items-center justify-center bg-white">
              <CheckCheck size={40} color="#fbbf24" />
            </View>

            {/* User Info */}
            <View className="flex-1">
              <Text className="text-xl font-bold text-black">
                {user?.firstName || user?.phone || "User"}
              </Text>
              <Text className="text-sm text-gray-700">
                Account Status:{" "}
                <Text className="text-blue-600">
                  {user?.firstName && user?.email ? "Profile Updated" : "Update Your Information"}
                </Text>
              </Text>
              {user?.email && <Text className="text-sm text-gray-700">{user.email}</Text>}
            </View>
          </View>

          {/* View Profile Button (compact, not full width) */}
          <TouchableOpacity
            onPress={handleViewProfile}
            className="self-start mt-5 bg-white py-2 px-5 rounded-xl shadow-lg">
            <Text className="text-black font-semibold">VIEW PROFILE ➝</Text>
          </TouchableOpacity>
        </View>

        {/* Menu Items */}
        <View className="p-5 space-y-3">
          {/* My Bookings */}
          <TouchableOpacity
            onPress={handleMyBookings}
            className="flex-row justify-between items-center bg-white p-4 rounded-2xl shadow-lg">
            <Text className="text-lg font-medium text-gray-800">My Bookings</Text>
            <CheckCheck size={24} color="black" />
          </TouchableOpacity>

          {/* Saved Addresses */}
          <TouchableOpacity
            className="flex-row justify-between items-center bg-white p-4 rounded-2xl shadow-lg">
            <Text className="text-lg font-medium text-gray-800">Saved Addresses</Text>
            <MapPin size={24} color="black" />
          </TouchableOpacity>

          {/* RB Wallet */}
          <View className="flex-row justify-between items-center bg-white p-4 rounded-2xl shadow-lg">
            <Text className="text-lg font-medium text-gray-800">RB Wallet</Text>
            <Text className="text-gray-600 font-medium text-lg">₹ 0.00</Text>
            <Wallet size={24} color="black" />
          </View>

          {/* Help & Support */}
          <TouchableOpacity
            className="flex-row justify-between items-center bg-white p-4 rounded-2xl shadow-lg">
            <Text className="text-lg font-medium text-gray-800">Help & Support</Text>
            <HelpCircle size={24} color="black" />
          </TouchableOpacity>
        </View>

        {/* Legal Section */}
        <View className="p-5">
          <Text className="text-xl font-bold mb-4 text-gray-800">Legal</Text>

          <TouchableOpacity
            className="flex-row justify-between items-center bg-white p-4 rounded-2xl shadow-lg mb-3">
            <Text className="text-lg font-medium text-gray-800">Cancellation Policy</Text>
            <X size={24} color="black" />
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row justify-between items-center bg-white p-4 rounded-2xl shadow-lg mb-3">
            <Text className="text-lg font-medium text-gray-800">Terms & Conditions</Text>
            <FileText size={24} color="black" />
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row justify-between items-center bg-white p-4 rounded-2xl shadow-lg">
            <Text className="text-lg font-medium text-gray-800">Privacy Policy</Text>
            <Shield size={24} color="black" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={logout}
            className="flex-row justify-between items-center bg-white p-4 rounded-2xl shadow-lg mt-3">
            <Text className="text-lg font-medium text-gray-800">Logout</Text>
            <LogOut size={24} color="black" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MenuScreen;
