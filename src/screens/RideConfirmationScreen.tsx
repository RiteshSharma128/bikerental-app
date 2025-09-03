import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute, useNavigation } from "@react-navigation/native";
import axios from 'axios';
import { useAuth } from "../contexts/AuthContext"; // Assume you have an AuthContext for token
import ROUTES from "../navigation/routes/ROUTES";

const RideConfirmationScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { selectedVehicle, pickupDate, pickupTime, dropoffDate, dropoffTime, location } = route.params || {};
  const { token } = useAuth(); // Get auth token from context;
  console.log("Data",token);

  const handleProceedToPay = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/bookings/create', {
        vehicleId: selectedVehicle._id,
        startDate: pickupDate,
        startTime: pickupTime,
        endDate: dropoffDate,
        endTime: dropoffTime,
        location,
        totalPrice: selectedVehicle.calculatedPrice * 1.28,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Navigate to BookingConfirmationScreen with booking details
      navigation.navigate(ROUTES.BOOKCONFIRMATION, { booking: response.data.booking });
    } catch (err) {
      console.error('Error creating booking:', err);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="bg-yellow-400 rounded-b-3xl px-5 pt-4 pb-6">
          <Text className="text-black text-lg font-semibold text-center">SUMMARY</Text>
          <Image
            source={{ uri: selectedVehicle?.image || "https://www.honda2wheelersindia.com/assets/images/activa-125/Activa-125-Main-Image.png" }}
            className="w-full h-40 object-contain mt-4"
            resizeMode="contain"
          />
          <Text className="text-black text-lg font-semibold mt-4">{selectedVehicle?.name || "Honda Activa 125 (BS6)"}</Text>
        </View>

        {/* Booking Details */}
        <View className="bg-white rounded-2xl shadow mx-4 mt-4 p-4">
          <Text className="text-gray-700 text-base font-semibold mb-3">Booking Details</Text>
          <View className="bg-gray-50 p-3 rounded-lg mb-3">
            <View className="flex-row justify-between items-center mb-2">
              <View className="flex-row items-center">
                <Text className="text-gray-500 text-sm mr-2">Pickup:</Text>
                <Text className="text-black font-medium">{pickupDate || "16 Sep 2025"}</Text>
                <Text className="text-gray-500 text-sm ml-1">at</Text>
                <Text className="text-black font-medium ml-1">{pickupTime || "11:00 AM"}</Text>
              </View>
              <Text className="text-gray-400 text-xs">📍</Text>
            </View>
            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center">
                <Text className="text-gray-500 text-sm mr-2">Dropoff:</Text>
                <Text className="text-black font-medium">{dropoffDate || "25 Sep 2025"}</Text>
                <Text className="text-gray-500 text-sm ml-1">at</Text>
                <Text className="text-black font-medium ml-1">{dropoffTime || "09:30 AM"}</Text>
              </View>
              <Text className="text-gray-400 text-xs">📍</Text>
            </View>
          </View>
          <View className="bg-gray-50 p-3 rounded-lg mb-3">
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-500 text-sm">Location</Text>
              <Text className="text-black font-medium">{location || "BTM 2nd Stage"}</Text>
            </View>
          </View>
          <View className="bg-gray-50 p-3 rounded-lg mb-3">
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-500 text-sm">km Included</Text>
              <Text className="text-black font-medium">{selectedVehicle?.calculatedIncludedKm || "690"} km</Text>
            </View>
          </View>
          <View className="bg-red-50 p-3 rounded-lg">
            <Text className="text-gray-700 text-sm font-medium">Excludes:</Text>
            <Text className="text-red-600 text-sm mt-1">Exceeding KM limit is chargeable at ₹4/km.</Text>
            <Text className="text-red-600 text-sm">Fuel is not included as part of the booking.</Text>
          </View>
        </View>

        {/* Offers/Coupons */}
        <View className="bg-white rounded-2xl shadow mx-4 mt-4 p-4">
          <Text className="text-black text-lg font-semibold">Offers/Coupons</Text>
          <TouchableOpacity className="flex-row justify-between items-center mt-2 border border-gray-300 rounded-lg px-3 py-2">
            <View className="flex-row items-center">
              <Text className="text-gray-500 text-sm">Apply Coupon</Text>
            </View>
            <Text className="text-black">›</Text>
          </TouchableOpacity>
        </View>

        {/* Addons */}
        <View className="bg-white rounded-2xl shadow mx-4 mt-4 p-4">
          <Text className="text-black text-lg font-semibold">Addons</Text>
          <TouchableOpacity className="flex-row justify-between items-center mt-2 border border-gray-300 rounded-lg px-3 py-2">
            <Text className="text-blue-500">Customize your ride</Text>
            <Text className="text-black">+</Text>
          </TouchableOpacity>
        </View>

        {/* Wallet */}
        <View className="bg-white rounded-2xl shadow mx-4 mt-4 p-4">
          <Text className="text-black text-lg font-semibold">Wallet</Text>
          <TouchableOpacity className="flex-row justify-between items-center mt-2 border border-gray-300 rounded-lg px-3 py-2">
            <Text className="text-gray-400">RB WALLET (₹0.00)</Text>
            <Text className="text-black">Apply</Text>
          </TouchableOpacity>
        </View>

        {/* Charges */}
        <View className="bg-white rounded-2xl shadow mx-4 mt-4 p-4">
          <View className="flex-row justify-between">
            <Text className="text-black">Vehicle Rental Charges</Text>
            <Text className="text-black">₹{selectedVehicle?.calculatedPrice || "2819.48"}</Text>
          </View>
          <View className="border-b border-gray-300 my-2" />
          <View className="flex-row justify-between">
            <Text className="text-black">Taxes</Text>
            <Text className="text-black">₹{(selectedVehicle?.calculatedPrice * 0.28).toFixed(2) || "789.45"}</Text>
          </View>
          <View className="border-b border-gray-300 my-2" />
          <View className="flex-row justify-between">
            <Text className="text-black font-semibold">Subtotal</Text>
            <Text className="text-black font-semibold">₹{(selectedVehicle?.calculatedPrice * 1.28).toFixed(2) || "3608.93"}</Text>
          </View>
        </View>

        {/* Total Payable Amount */}
        <View className="bg-white rounded-2xl shadow mx-4 mt-4 p-4">
          <View className="flex-row justify-between">
            <Text className="text-black font-semibold">Total Payable Amount</Text>
            <Text className="text-black font-semibold">₹{(selectedVehicle?.calculatedPrice * 1.28).toFixed(2) || "3608.93"}</Text>
          </View>
        </View>

        {/* Proceed to Pay Button */}
        <TouchableOpacity onPress={handleProceedToPay} className="bg-yellow-400 rounded-xl mx-4 mt-4 p-4">
          <Text className="text-black text-center font-semibold">PROCEED TO PAY</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RideConfirmationScreen;