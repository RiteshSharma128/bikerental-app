import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@react-native-vector-icons/ionicons";
import MaterialIcons from "@react-native-vector-icons/ant-design";
import FontAwesome5 from "@react-native-vector-icons/entypo";
import { useNavigation } from "@react-navigation/native";

import { useAuth } from "../contexts/AuthContext";
import useAuthStore from "../../store/authStore";

const MenuScreen = () => {
  const { logout } = useAuth();
  const navigation = useNavigation();
  const { user } = useAuth();

  console.log("Data",user);

  const handleViewProfile = () => {
    navigation.navigate("UpdateProfile");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        {/* Header Section */}
        <View className="bg-yellow-400 rounded-b-3xl px-6 pt-8 pb-10">
          <View className="flex-row items-center gap-4">
            {/* Profile Icon */}
            <View className="w-20 h-20 rounded-full border-4 border-green-400 flex items-center justify-center bg-white">
              <Ionicons name="person-outline" size={40} color="#fbbf24" />
            </View>

            {/* User Info */}
            <View className="flex-1">
              <Text className="text-xl font-bold text-black">
                {user.firstName || user.phone || "User"}
              </Text>
              <Text className="text-sm text-gray-700">
                Account Status:{" "}
                <Text className="text-blue-600">
                  {user.firstName && user.email ? "Profile Updated" : "Update Your Information"}
                </Text>
              </Text>
              {user.email && <Text className="text-sm text-gray-700">{user.email}</Text>}
            </View>
          </View>

          {/* View Profile Button (compact, not full width) */}
          <TouchableOpacity
            onPress={handleViewProfile}
            className="self-start mt-5 bg-white py-2 px-5 rounded-xl shadow"
          >
            <Text className="text-black font-semibold">VIEW PROFILE ➝</Text>
          </TouchableOpacity>
        </View>

        {/* Menu Items */}
        <View className="p-5 space-y-4">
          {/* My Bookings */}
          <TouchableOpacity className="flex-row justify-between items-center bg-white p-5 rounded-2xl shadow">
            <Text className="text-base font-medium">My Bookings</Text>
            <MaterialIcons name="assignment-turned-in" size={24} color="black" />
          </TouchableOpacity>

          {/* Saved Addresses */}
          <TouchableOpacity className="flex-row justify-between items-center bg-white p-5 rounded-2xl shadow">
            <Text className="text-base font-medium">Saved Addresses</Text>
            <Ionicons name="location-outline" size={24} color="black" />
          </TouchableOpacity>

          {/* RB Wallet */}
          <View className="flex-row justify-between items-center bg-white p-5 rounded-2xl shadow">
            <Text className="text-base font-medium">RB Wallet</Text>
            <Text className="text-gray-600 font-medium">₹ 0.00</Text>
          </View>

          {/* Help & Support */}
          <TouchableOpacity className="flex-row justify-between items-center bg-white p-5 rounded-2xl shadow">
            <Text className="text-base font-medium">Help & Support</Text>
            <Ionicons name="help-circle-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>

        {/* Legal Section */}
        <View className="p-5">
          <Text className="text-lg font-semibold mb-4">Legal</Text>

          <TouchableOpacity className="flex-row justify-between items-center bg-white p-5 rounded-2xl shadow mb-4">
            <Text className="text-base font-medium">Cancellation Policy</Text>
            <MaterialIcons name="cancel" size={24} color="black" />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row justify-between items-center bg-white p-5 rounded-2xl shadow mb-4">
            <Text className="text-base font-medium">Terms & Conditions</Text>
            <MaterialIcons name="article" size={24} color="black" />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row justify-between items-center bg-white p-5 rounded-2xl shadow">
            <Text className="text-base font-medium">Privacy Policy</Text>
            <FontAwesome5 name="shield-alt" size={22} color="black" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={logout}
            className="flex-row justify-between items-center bg-white p-5 rounded-2xl shadow"
          >
            <Text className="text-base font-medium">Logout</Text>
            <FontAwesome5 name="shield-alt" size={22} color="black" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MenuScreen;
