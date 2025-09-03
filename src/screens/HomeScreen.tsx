import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  Animated,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons';
import { Calendar } from 'react-native-calendars';
import dayjs from 'dayjs';
import { useNavigation } from '@react-navigation/native';
import ROUTES from '../navigation/routes/ROUTES';

const generateTimeSlots = (selectedDate: string | null) => {
  const times: string[] = [];
  const now = dayjs();
  let start;

  // If no date is selected or date is in the future, start from 12:00 AM
  if (!selectedDate || dayjs(selectedDate).isAfter(now, 'day')) {
    start = dayjs().startOf('day').hour(0).minute(0).second(0);
  } else {
    // If date matches today, start from the next available 30-minute slot
    start = dayjs().minute() > 30
      ? dayjs().add(1, 'hour').minute(0).second(0)
      : dayjs().minute(30).second(0);
  }

  const end = dayjs().endOf('day').hour(23).minute(59);

  while (start.isBefore(end)) {
    times.push(start.format('hh:mm A'));
    start = start.add(30, 'minute');
  }
  return times;
};

const HomeScreen = () => {
  const [pickupDate, setPickupDate] = useState<string | null>(null);
  const [pickupTime, setPickupTime] = useState<string | null>(null);
  const [dropoffDate, setDropoffDate] = useState<string | null>(null);
  const [dropoffTime, setDropoffTime] = useState<string | null>(null);

  const [showPickupDate, setShowPickupDate] = useState(false);
  const [showPickupTime, setShowPickupTime] = useState(false);
  const [showDropoffDate, setShowDropoffDate] = useState(false);
  const [showDropoffTime, setShowDropoffTime] = useState(false);

  const navigation = useNavigation();

  // Generate time slots dynamically based on selected dates
  const pickupTimes = generateTimeSlots(pickupDate);
  const dropoffTimes = generateTimeSlots(dropoffDate);

  const handleSearch = () => {
    if (pickupDate && pickupTime && dropoffDate && dropoffTime) {
      navigation.navigate(ROUTES.SEARCH, {
        pickupDate,
        pickupTime,
        dropoffDate,
        dropoffTime,
      });
    } else {
      console.log('Please select all dates and times');
    }
  };

  // Animation setup
  const screenWidth = Dimensions.get('window').width;
  const animation = useRef(new Animated.Value(-screenWidth)).current;

  useEffect(() => {
    const moveScooty = () => {
      Animated.sequence([
        Animated.timing(animation, {
          toValue: screenWidth,
          duration: 5000,
          useNativeDriver: true,
        }),
        Animated.timing(animation, {
          toValue: screenWidth,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(animation, {
          toValue: -screenWidth,
          duration: 0,
          useNativeDriver: true,
        }),
      ]).start(() => {
        moveScooty();
      });
    };

    moveScooty();

    return () => animation.stopAnimation();
  }, [animation, screenWidth]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
        <TouchableOpacity className="flex-row items-center">
          <Text className="text-lg font-semibold mr-1">Bangalore</Text>
          <Ionicons name="chevron-down" size={18} />
        </TouchableOpacity>
        <TouchableOpacity className="flex-row items-center">
          <Ionicons name="pricetag-outline" size={20} />
          <Text className="ml-1 text-base">Offers</Text>
        </TouchableOpacity>
      </View>

      {/* Background with Moving Scooty */}
      {/* <View className="relative w-full h-40 overflow-hidden mb-4">
        <Image
          source={{ uri: "https://cdn-icons-png.flaticon.com/128/979/979882.png" }}
          className="absolute w-full h-full"
          resizeMode="cover"
        />
        <Animated.View
          style={{
            position: "absolute",
            left: animation,
            top: 10,
            width: screenWidth,
            height: 40,
            justifyContent: "center",
          }}
        >
          <Image
            source={{ uri: "https://cdn-icons-png.flaticon.com/128/7910/7910028.png" }}
            className="w-24 h-24"
            resizeMode="contain"
          />
        </Animated.View>
      </View> */}

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Booking Form */}
        <View className="px-4 mt-4">
          <Text className="text-2xl font-bold mb-3">Book Now, Ride Anywhere</Text>

          <View className="bg-white rounded-xl shadow-sm border border-yellow-200 p-4">
            {/* Pickup */}
            <Text className="font-semibold mb-2">Pick up</Text>
            <View className="flex-row mb-4 gap-2">
              {/* Pickup Date */}
              <TouchableOpacity
                className="flex-1 flex-row items-center border border-gray-200 rounded-lg px-3 py-2 bg-white"
                onPress={() => {
                  setShowPickupDate(true);
                  setShowPickupTime(false);
                }}>
                <Ionicons name="calendar-outline" size={18} color="gray" />
                <Text className="ml-2 text-sm text-gray-700">
                  {pickupDate || 'Date'}
                </Text>
              </TouchableOpacity>

              {/* Pickup Time */}
              <TouchableOpacity
                className="flex-1 flex-row items-center border border-gray-200 rounded-lg px-3 py-2 bg-white"
                onPress={() => {
                  setShowPickupTime(true);
                  setShowPickupDate(false);
                }}>
                <Ionicons name="time-outline" size={18} color="gray" />
                <Text className="ml-2 text-sm text-gray-700">
                  {pickupTime || 'Time'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Dropoff */}
            <Text className="font-semibold mb-2">Dropoff</Text>
            <View className="flex-row mb-4 gap-2">
              {/* Dropoff Date */}
              <TouchableOpacity
                className="flex-1 flex-row items-center border border-gray-200 rounded-lg px-3 py-2 bg-white"
                onPress={() => {
                  setShowDropoffDate(true);
                  setShowDropoffTime(false);
                }}>
                <Ionicons name="calendar-outline" size={18} color="gray" />
                <Text className="ml-2 text-sm text-gray-700">
                  {dropoffDate || 'Date'}
                </Text>
              </TouchableOpacity>

              {/* Dropoff Time */}
              <TouchableOpacity
                className="flex-1 flex-row items-center border border-gray-200 rounded-lg px-3 py-2 bg-white"
                onPress={() => {
                  setShowDropoffTime(true);
                  setShowDropoffDate(false);
                }}>
                <Ionicons name="time-outline" size={18} color="gray" />
                <Text className="ml-2 text-sm text-gray-700">
                  {dropoffTime || 'Time'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Search Button */}
            <TouchableOpacity
              onPress={handleSearch}
              className="bg-yellow-400 py-3 rounded-lg">
              <Text className="text-center text-black font-bold text-base">
                SEARCH
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Cards Section */}
        <View className="mt-6">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16 }}>
            <View className="w-48 mr-4 rounded-xl">
              <Image
                source={{
                  uri: 'https://d3vp2rl7047vsp.cloudfront.net/bike_models/images/000/000/151/medium/HONDA_HORNET_160.png',
                }}
                className="w-48 h-32 rounded-xl"
                resizeMode="cover"
              />
              <Text className="text-center font-semibold mt-2 mb-3">
                RBX Subscription
              </Text>
            </View>
            <View className="w-48 mr-4 rounded-xl">
              <Image
                source={{
                  uri: 'https://d3vp2rl7047vsp.cloudfront.net/bike_models/images/000/000/247/medium/Bajaj_Pulsar_150_neon.png',
                }}
                className="w-48 h-32 rounded-xl"
                resizeMode="cover"
              />
              <Text className="text-center font-semibold mt-2 mb-3">
                Low Prices
              </Text>
            </View>
            <View className="w-48 rounded-xl">
              <Image
                source={{
                  uri: 'https://d3vp2rl7047vsp.cloudfront.net/bike_models/images/000/000/299/medium/ROYAL_ENFIELD_HIMALAYAN_GRAVEL_GREY.png?1660730284',
                }}
                className="w-48 h-32 rounded-xl"
                resizeMode="cover"
              />
              <Text className="text-center font-semibold mt-2 mb-3">
                Adventures by RB
              </Text>
            </View>
          </ScrollView>
        </View>

        {/* Promo Banner */}
        <View className="mt-6 px-4">
          <View className="bg-white rounded-xl shadow-md overflow-hidden">
            <Image
              source={{
                uri: 'https://d36g7qg6pk2cm7.cloudfront.net/assets/RBX-offer-194940429645abdee50c6e6711844bb4c8554a72c9c46a339ce202888c57e5d9.jpg',
              }}
              className="w-full h-52"
              resizeMode="contain"
            />
          </View>
        </View>

        {/* User's Top Picks */}
        <View className="mt-6">
          <View className="flex-row items-center justify-between px-4 mb-3">
            <Text className="text-lg font-bold">User's Top Picks</Text>
            <TouchableOpacity>
              <Text className="text-sm font-semibold text-blue-600">
                VIEW ALL
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16 }}>
            {/* Example Vehicle Card */}
            <View className="w-40 mr-4 bg-white rounded-xl shadow-md">
              <Image
                source={{
                  uri: 'https://d3vp2rl7047vsp.cloudfront.net/bike_models/images/000/000/272/medium/Activa-6G.png?1666077785',
                }}
                className="w-full h-28"
                resizeMode="contain"
              />
              <Text className="text-center font-semibold mt-2 mb-3">
                Honda Activa 6G
              </Text>
            </View>

            <View className="w-40 mr-4 bg-white rounded-xl shadow-md">
              <Image
                source={{
                  uri: 'https://d3vp2rl7047vsp.cloudfront.net/bike_models/images/000/000/299/medium/ROYAL_ENFIELD_HIMALAYAN_GRAVEL_GREY.png?1660730284',
                }}
                className="w-full h-28"
                resizeMode="contain"
              />
              <Text className="text-center font-semibold mt-2 mb-3">
                Royal Enfield Himalayan
              </Text>
            </View>

            <View className="w-40 bg-white rounded-xl shadow-md">
              <Image
                source={{
                  uri: 'https://d3vp2rl7047vsp.cloudfront.net/bike_models/images/000/000/257/medium/TVS_NTORQ_125.png?1660732837',
                }}
                className="w-full h-28"
                resizeMode="contain"
              />
              <Text className="text-center font-semibold mt-2 mb-3">
                TVS Ntorq 125
              </Text>
            </View>
          </ScrollView>
        </View>
      </ScrollView>

      {/* Pickup Date Modal */}
      <Modal
        visible={showPickupDate}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowPickupDate(false)}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
          }}>
          <View className="bg-white rounded-xl p-4 w-11/12">
            <Calendar
              onDayPress={day => {
                setPickupDate(day.dateString);
                setShowPickupDate(false);
              }}
              markedDates={{
                [pickupDate || '']: { selected: true, selectedColor: '#FFD700' },
              }}
            />
          </View>
        </View>
      </Modal>

      {/* Dropoff Date Modal */}
      <Modal
        visible={showDropoffDate}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDropoffDate(false)}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
          }}>
          <View className="bg-white rounded-xl p-4 w-11/12">
            <Calendar
              onDayPress={day => {
                setDropoffDate(day.dateString);
                setShowDropoffDate(false);
              }}
              markedDates={{
                [dropoffDate || '']: { selected: true, selectedColor: '#FFD700' },
              }}
            />
          </View>
        </View>
      </Modal>

      {/* Pickup Time Modal */}
      <Modal
        visible={showPickupTime}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowPickupTime(false)}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
          }}>
          <View className="bg-white rounded-xl p-4 w-11/12 max-h-80">
            <FlatList
              data={pickupTimes}
              keyExtractor={item => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className="px-4 py-3 border-b border-gray-100"
                  onPress={() => {
                    setPickupTime(item);
                    setShowPickupTime(false);
                  }}>
                  <Text className="text-base">{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* Dropoff Time Modal */}
      <Modal
        visible={showDropoffTime}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDropoffTime(false)}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
          }}>
          <View className="bg-white rounded-xl p-4 w-11/12 max-h-80">
            <FlatList
              data={dropoffTimes}
              keyExtractor={item => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className="px-4 py-3 border-b border-gray-100"
                  onPress={() => {
                    setDropoffTime(item);
                    setShowDropoffTime(false);
                  }}>
                  <Text className="text-base">{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default HomeScreen;
