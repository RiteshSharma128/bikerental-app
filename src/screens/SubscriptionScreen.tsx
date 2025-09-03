import React, { useState } from 'react'
import { View, Text, TouchableOpacity, Image, SafeAreaView } from 'react-native'
import { Calendar, Clock } from 'lucide-react-native'
import Slider from '@react-native-community/slider'

const SubscriptionScreen = () => {
  const [duration, setDuration] = useState(3)

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header Section */}
      <View className="p-4">
        <View className="flex-row items-center justify-between">
          <Image
            source={{ uri: "https://dummyimage.com/100x40/000/fff&text=RBX" }}
            className="w-24 h-10"
            resizeMode="contain"
          />
          <Text className="text-xs font-semibold">
            MONTHLY RENTAL SUBSCRIPTION
          </Text>
        </View>
      </View>

      {/* Banner Section */}
      <View className="items-center">
        <Image
          source={{ uri: "https://dummyimage.com/400x200/ffc107/000&text=Bike+Delivery" }}
          className="w-full h-48"
          resizeMode="cover"
        />
        <Text className="absolute bottom-2 right-4 bg-yellow-400 px-2 py-1 rounded-md text-black font-bold">
          DOORSTEP DELIVERY
        </Text>
      </View>

      {/* Subscription Form */}
      <View className="p-4 flex-1">
        <Text className="text-lg font-bold text-center mb-6">
          Start your subscription now!
        </Text>

        {/* Start Date and Time */}
        <View className="flex-row space-x-3 mb-6">
          <TouchableOpacity className="flex-1 flex-row items-center border border-gray-300 rounded-lg px-3 py-3">
            <Calendar size={18} color="gray" />
            <Text className="ml-2 text-gray-500">Select Date</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 flex-row items-center border border-gray-300 rounded-lg px-3 py-3">
            <Clock size={18} color="gray" />
            <Text className="ml-2 text-gray-500">Select Time</Text>
          </TouchableOpacity>
        </View>

        {/* Duration */}
        <Text className="text-base font-semibold mb-3">Duration</Text>
        <View className="border border-gray-300 rounded-lg p-4 mb-6">
          <Text className="text-lg text-center font-semibold">
            {duration} {duration === 1 ? 'month' : 'months'}
          </Text>

          {/* Slider */}
          <Slider
            style={{ width: '100%', height: 40 }}
            minimumValue={1}
            maximumValue={12}
            step={1}
            value={duration}
            minimumTrackTintColor="#facc15" // yellow-400
            maximumTrackTintColor="#d1d5db" // gray-300
            thumbTintColor="#facc15"
            onValueChange={(value) => setDuration(value)}
          />
        </View>

        {/* Search Button */}
        <TouchableOpacity className="bg-yellow-400 py-3 rounded-lg items-center">
          <Text className="font-bold text-black text-lg">SEARCH</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Navigation */}
      <View className="border-t border-gray-200 flex-row justify-around py-2">
        <TouchableOpacity className="items-center">
          <Text className="text-xs">HOME</Text>
        </TouchableOpacity>
        <TouchableOpacity className="items-center">
          <Text className="text-xs">TARIFFS</Text>
        </TouchableOpacity>
        <TouchableOpacity className="items-center">
          <Text className="text-xs font-bold text-yellow-500">SUBSCRIPTION</Text>
        </TouchableOpacity>
        <TouchableOpacity className="items-center">
          <Text className="text-xs">MENU</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default SubscriptionScreen
