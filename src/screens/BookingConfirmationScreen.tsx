import React from "react";
import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute, useNavigation } from "@react-navigation/native";
import ConfettiCannon from 'react-native-confetti-cannon'; // Assume installed via npm i react-native-confetti-cannon
import ROUTES from "../navigation/routes/ROUTES";

const BookingConfirmationScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { booking } = route.params || {};

  // Fallback values if booking is undefined or incomplete
  const safeBooking = booking || {};
  const vehicle = safeBooking.vehicleId || {};
  const createdAt = safeBooking.createdAt ? new Date(safeBooking.createdAt) : new Date();
  const startDate = safeBooking.startDate ? new Date(safeBooking.startDate) : new Date();
  const endDate = safeBooking.endDate ? new Date(safeBooking.endDate) : new Date();

  return (
    <SafeAreaView className="flex-1 bg-gradient-to-b from-yellow-100 to-white">
      <ConfettiCannon count={200} origin={{ x: -10, y: 0 }} autoStart={true} fadeOut={true} />
      <ScrollView className="flex-1 px-4 py-6">
        {/* Header */}
        <View className="items-center mb-6">
          <Image
            source={{ uri: 'https://img.icons8.com/color/96/000000/check-circle.png' }} // Success icon
            className="w-24 h-24"
            resizeMode="contain"
          />
          <Text className="text-3xl font-bold text-green-600 mt-4">Booking Confirmed!</Text>
          <Text className="text-lg text-gray-600 mt-2">Your ride is ready to roll!</Text>
        </View>

        {/* Booking ID and Date */}
        <View className="bg-white rounded-xl shadow-md p-4 mb-4">
          <Text className="text-xl font-semibold text-black mb-2">Booking ID: {safeBooking._id || "N/A"}</Text>
          <Text className="text-gray-500">Booked on: {createdAt.toLocaleDateString()}</Text>
        </View>

        {/* Vehicle Details */}
        <View className="bg-white rounded-xl shadow-md p-4 mb-4">
          <Text className="text-xl font-semibold text-black mb-4">Vehicle Details</Text>
          <Image
            source={{ uri: vehicle.image || 'https://via.placeholder.com/150' }} // Fallback image
            className="w-full h-40 rounded-lg object-contain mb-4"
            resizeMode="contain"
          />
          <Text className="text-lg font-bold text-black">{vehicle.name || "Unknown Vehicle"}</Text>
          <Text className="text-gray-500 mt-1">Price: ₹{(safeBooking.totalPrice || 0).toFixed(2)}</Text>
        </View>

        {/* Booking Details */}
        <View className="bg-white rounded-xl shadow-md p-4 mb-4">
          <Text className="text-xl font-semibold text-black mb-4">Booking Details</Text>
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600">Pickup:</Text>
            <Text className="text-black">
              {startDate.toLocaleDateString()} at {safeBooking.startTime || "N/A"}
            </Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600">Dropoff:</Text>
            <Text className="text-black">
              {endDate.toLocaleDateString()} at {safeBooking.endTime || "N/A"}
            </Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600">Location:</Text>
            <Text className="text-black">{safeBooking.location || "N/A"}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-gray-600">Status:</Text>
            <Text className="text-green-600 font-semibold">{(safeBooking.status || "PENDING").toUpperCase()}</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <TouchableOpacity className="bg-yellow-400 rounded-xl py-4 mb-4">
          <Text className="text-black text-center font-bold text-lg">View Invoice</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.replace(ROUTES.MAIN_TABS)} className="bg-blue-500 rounded-xl py-4">
          <Text className="text-white text-center font-bold text-lg">Back to Home</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BookingConfirmationScreen;
