import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import axios from 'axios';
import { CheckCheck } from 'lucide-react-native';

// ✅ Define types
interface Vehicle {
  name?: string;
  image?: string;
}

interface Booking {
  vehicleId?: Vehicle;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  location: string;
  totalPrice: number;
  status: 'confirmed' | 'pending' | 'cancelled' | string;
}

const BookingsScreen: React.FC = () => {
  const { token } = useAuth();
  const navigation = useNavigation<NavigationProp<any>>();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get<Booking[]>('http://localhost:3000/api/bookings/user', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookings(response.data);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          setError(err.message);
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Something went wrong');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [token]);

  // format date as "Sep 20, 2025"
  const formatDate = (date: string | Date): string =>
    new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#FFD700" />
        <Text className="text-lg text-gray-500 mt-4">Loading your bookings...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row items-center justify-center bg-yellow-500 py-6 rounded-b-3xl shadow-md">
        <Text className="text-3xl font-extrabold text-white">My Bookings</Text>
        <CheckCheck size={28} color="white" className="ml-3" />
      </View>

      <ScrollView className="p-4">
        {error ? (
          <Text className="text-red-500 text-center text-lg">{error}</Text>
        ) : bookings.length === 0 ? (
          <View className="flex-1 items-center justify-center py-12">
            <Image
              source={{ uri: 'https://via.placeholder.com/200x200.png?text=No+Bookings' }}
              className="w-40 h-40 mb-6 opacity-80"
              resizeMode="contain"
            />
            <Text className="text-2xl font-bold text-gray-800 text-center mb-2">
              No Bookings Yet
            </Text>
            <Text className="text-gray-500 text-center mb-6 px-6">
              Looks like you haven’t booked a ride yet. Start your journey now!
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Home')}
              className="bg-yellow-500 py-3 px-10 rounded-full shadow-lg active:bg-yellow-600">
              <Text className="text-black font-semibold text-lg">Book a Ride</Text>
            </TouchableOpacity>
          </View>
        ) : (
          bookings.map((booking, index) => (
            <View
              key={index}
              className="bg-white rounded-3xl shadow-lg p-5 mb-6 border border-gray-100">
              {/* Vehicle Image */}
              <Image
                source={{ uri: booking.vehicleId?.image || 'https://via.placeholder.com/150' }}
                className="w-full h-48 rounded-2xl mb-4 bg-gray-100"
                resizeMode="contain"
              />

              {/* Vehicle Name + Price */}
              <View className="flex-row justify-between items-center">
                <Text className="text-xl font-bold text-gray-900">
                  {booking.vehicleId?.name || 'Unknown Vehicle'}
                </Text>
                <Text className="text-lg font-bold text-green-600">
                  ₹{booking.totalPrice.toFixed(2)}
                </Text>
              </View>

              {/* Dates */}
              <View className="mt-3 bg-gray-50 p-3 rounded-xl">
                <Text className="text-gray-700 text-sm">
                  📅 From: {formatDate(booking.startDate)} {booking.startTime}
                </Text>
                <Text className="text-gray-700 text-sm mt-1">
                  📅 To: {formatDate(booking.endDate)} {booking.endTime}
                </Text>
              </View>

              {/* Location */}
              <Text className="text-gray-600 text-base mt-3">📍 {booking.location}</Text>

              {/* Status Badge */}
              <View className="mt-4 flex-row">
                <Text
                  className={`px-4 py-1 rounded-full text-white text-sm font-semibold ${
                    booking.status.toLowerCase() === 'confirmed'
                      ? 'bg-green-500'
                      : booking.status.toLowerCase() === 'pending'
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }`}
                >
                  {booking.status}
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default BookingsScreen;
