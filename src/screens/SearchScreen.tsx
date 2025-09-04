import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Animated,
  Modal,
  FlatList,
  TouchableWithoutFeedback,
  TextInput,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons';
import FontAwesome5 from '@react-native-vector-icons/fontawesome';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import axios from 'axios';
import dayjs from 'dayjs';
import ROUTES from '../navigation/routes/ROUTES';

// Define vehicle type based on your API response
interface Vehicle {
  _id: string;
  name: string;
  image?: string;
  locations: string[];
  calculatedPrice: number;
  calculatedIncludedKm: number;
  availability: { [key: string]: boolean };
}

// Define navigation param list
type RootStackParamList = {
  Search: { pickupDate: string; pickupTime: string; dropoffDate: string; dropoffTime: string };
  RideConfirmation: {
    selectedVehicle: Vehicle;
    pickupDate: string;
    pickupTime: string;
    dropoffDate: string;
    dropoffTime: string;
    location: string;
  };
  // Add other screens as needed
};

type SearchScreenRouteProp = RouteProp<RootStackParamList, 'Search'>;

const HEADER_EXPANDED_HEIGHT = 220;
const HEADER_COLLAPSED_HEIGHT = 120;

const SearchScreen = () => {
  const scrollY = new Animated.Value(0);
  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_EXPANDED_HEIGHT - HEADER_COLLAPSED_HEIGHT],
    outputRange: [HEADER_EXPANDED_HEIGHT, HEADER_COLLAPSED_HEIGHT],
    extrapolate: 'clamp',
  });
  const navigation = useNavigation();
  const route = useRoute<SearchScreenRouteProp>();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<{ [key: string]: string }>({}); // Typed as object with string keys and values
  const [dropdownVisible, setDropdownVisible] = useState<string | null>(null); // Typed as string or null
  const [searchOverlayVisible, setSearchOverlayVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const { width, height } = Dimensions.get('window');

  const {
    pickupDate,
    pickupTime,
    dropoffDate,
    dropoffTime,
  } = route.params;

  // Format dates using dayjs
  const formattedPickupDate = pickupDate ? dayjs(pickupDate).format('MMM D, YYYY') : 'N/A';
  const formattedDropoffDate = dropoffDate ? dayjs(dropoffDate).format('MMM D, YYYY') : 'N/A';

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await axios.post(
          'http://localhost:3000/api/vehicles/search',
          {
            startDate: pickupDate,
            endDate: dropoffDate,
            startTime: pickupTime,
            endTime: dropoffTime,
          },
        );
        const fetchedVehicles: Vehicle[] = response.data;
        setVehicles(fetchedVehicles);
        setFilteredVehicles(fetchedVehicles);
        // Initialize selectedLocations with the first location of each vehicle
        const initialLocations = fetchedVehicles.reduce((acc: { [key: string]: string }, vehicle: Vehicle) => {
          acc[vehicle._id] = vehicle.locations[0] || '';
          return acc;
        }, {});
        setSelectedLocations(initialLocations);
      } catch (err) {
        console.error('Error fetching vehicles:', err);
      }
    };

    if (pickupDate && pickupTime && dropoffDate && dropoffTime) {
      fetchVehicles();
    }
  }, [pickupDate, pickupTime, dropoffDate, dropoffTime]);

  const handleLocationSelect = (vehicleId: string, location: string) => {
    setSelectedLocations(prev => ({
      ...prev,
      [vehicleId]: location,
    }));
    setDropdownVisible(null);
  };

  const renderDropdown = (vehicleId: string, locations: string[]) => (
    <Modal
      transparent={true}
      visible={dropdownVisible === vehicleId}
      animationType="fade"
      onRequestClose={() => setDropdownVisible(null)}>
      <TouchableWithoutFeedback onPress={() => setDropdownVisible(null)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <TouchableWithoutFeedback>
            <View
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: [{ translateX: -width * 0.4 }, { translateY: -height * 0.2 }],
                backgroundColor: 'white',
                width: width * 0.8,
                maxHeight: height * 0.4,
                borderRadius: 10,
                padding: 10,
              }}>
              <FlatList
                data={locations}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={{
                      padding: 15,
                      borderBottomWidth: 1,
                      borderBottomColor: '#eee',
                    }}
                    onPress={() => handleLocationSelect(vehicleId, item)}>
                    <Text style={{ fontSize: 16, color: '#333' }}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );

  // Handle search input focus and selection
  const handleSearchFocus = () => {
    setFilteredVehicles(vehicles);
    setSearchQuery('');
  };

  const handleVehicleSelect = (model: string) => {
    setSearchQuery(model);
    setFilteredVehicles(vehicles.filter((vehicle: Vehicle) => vehicle.name === model));
    setSearchOverlayVisible(false);
  };

  // Select the first 6 vehicles for the popular vehicles grid
  const popularVehicles = vehicles.slice(0, 6);

  // Check if a vehicle is sold out for the selected location
  const isSoldOut = (vehicleId: string, location: string) => {
    const vehicle = vehicles.find((v: Vehicle) => v._id === vehicleId);
    if (!vehicle || !location || !vehicle.availability) return false;
    return !vehicle.availability[location];
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {/* Header */}
      <Animated.View
        style={{ height: headerHeight }}
        className="bg-yellow-400 rounded-b-3xl px-5 pt-4 pb-6">
        {/* Top Row */}
        <View className="flex-row items-center justify-between mb-4 px-5">
          <Ionicons
            onPress={() => navigation.goBack()}
            name="arrow-back"
            size={24}
            color="black"
          />
          <Text className="text-xl font-bold text-black">RENTAL BIKES</Text>
          <Ionicons name="options-outline" size={24} color="black" />
        </View>

        {/* White Card inside Yellow Header */}
        <View className="bg-white rounded-2xl shadow-lg p-4 flex-row items-center border border-gray-100">
          {/* Pickup */}
          <View className="flex-1 pr-2">
            <Text className="text-gray-500 text-sm font-medium mb-1">Pickup</Text>
            <Text className="text-base font-semibold text-black">
              {formattedPickupDate} <Text className="font-bold">at {pickupTime}</Text>
            </Text>
          </View>

          {/* Divider */}
          <View className="w-px bg-gray-200 h-10 my-auto" />

          {/* Dropoff */}
          <View className="flex-1 pl-2 flex-row justify-between items-center">
            <View>
              <Text className="text-gray-500 text-sm font-medium mb-1">Dropoff</Text>
              <Text className="text-base font-semibold text-black">
                {formattedDropoffDate} <Text className="font-bold">at {dropoffTime}</Text>
              </Text>
            </View>
          </View>
        </View>
      </Animated.View>

      {/* Vehicles List */}
      <Animated.ScrollView
        contentContainerStyle={{ paddingBottom: 100, paddingTop: 0 }}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false },
        )}>
        <View className="p-4 mt-4">
          {filteredVehicles.length > 0 ? (
            filteredVehicles.map((item: Vehicle) => (
              <View
                key={item._id}
                className="bg-white rounded-2xl shadow mb-5 overflow-hidden">
                <Text className="text-lg font-semibold px-4 pt-3">
                  {item.name}
                </Text>
                <Image
                  source={{
                    uri:
                      item.image ||
                      'https://d3vp2rl7047vsp.cloudfront/businesses/bike_models/images/000/000/299/medium/ROYAL_ENFIELD_HIMALAYAN_GRAVEL_GREY.png?1660730284',
                  }}
                  className="w-full h-40 object-contain"
                  resizeMode="contain"
                />

                <View className="px-4 py-2">
                  <Text className="text-gray-500">km limit</Text>
                  <Text className="font-semibold">
                    {item.calculatedIncludedKm} km
                  </Text>
                </View>

                {/* Location Dropdown */}
                <View className="px-4 py-2">
                  <Text className="text-gray-500 text-sm">Select Location</Text>
                  <TouchableOpacity
                    className="flex-row items-center justify-between border border-gray-300 rounded-lg px-3 py-2 bg-white"
                    onPress={() => setDropdownVisible(item._id)}>
                    <Text className="text-base">
                      {selectedLocations[item._id] || 'Select Location'}
                    </Text>
                    <Ionicons name="chevron-down" size={18} color="gray" />
                  </TouchableOpacity>
                  {renderDropdown(item._id, item.locations)}
                </View>

                <View className="border-t border-gray-200 px-4 py-3 flex-row justify-between items-center">
                  <Text className="text-lg font-bold">
                    ₹ {item.calculatedPrice}.00
                  </Text>
                  {selectedLocations[item._id] && isSoldOut(item._id, selectedLocations[item._id]) && (
                    <Text className="text-red-500 font-semibold">Sold Out</Text>
                  )}
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate(ROUTES.RIDECONFIRMATION, {
                        selectedVehicle: item,
                        pickupDate,
                        pickupTime,
                        dropoffDate,
                        dropoffTime,
                        location: selectedLocations[item._id],
                      })
                    }
                    className={`bg-yellow-400 px-6 py-2 rounded-xl ${
                      !selectedLocations[item._id] || isSoldOut(item._id, selectedLocations[item._id]) ? 'opacity-50' : ''
                    }`}
                    disabled={!selectedLocations[item._id] || isSoldOut(item._id, selectedLocations[item._id])}>
                    <Text className="font-semibold text-black">BOOK NOW</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <Text className="text-center text-gray-500">
              No vehicles available for this period
            </Text>
          )}
        </View>
      </Animated.ScrollView>

      {/* Floating Search Button */}
      <TouchableOpacity
        onPress={() => setSearchOverlayVisible(true)}
        className="absolute bottom-5 left-5 bg-gray-700 flex-row items-center px-4 py-3 rounded-full shadow-lg">
        <Ionicons name="search" size={20} color="white" />
        <Text className="text-white ml-2">Search by Model</Text>
      </TouchableOpacity>

      {/* Floating Filter Button */}
      <TouchableOpacity className="absolute bottom-5 right-5 bg-gray-700 w-12 h-12 rounded-full items-center justify-center shadow-lg">
        <FontAwesome5 name="sliders-h" size={20} color="white" />
      </TouchableOpacity>

      {/* Search Overlay Modal */}
      <Modal
        transparent={true}
        visible={searchOverlayVisible}
        animationType="slide"
        onRequestClose={() => setSearchOverlayVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setSearchOverlayVisible(false)}>
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <TouchableWithoutFeedback>
              <View style={{ flex: 1, backgroundColor: 'white', marginTop: 40, padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
                <View className="flex-row justify-between items-center mb-4">
                  <TextInput
                    placeholder="Search models..."
                    value={searchQuery}
                    onChangeText={text => setSearchQuery(text)}
                    onFocus={handleSearchFocus}
                    style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, flex: 1 }}
                  />
                  <TouchableOpacity onPress={() => setSearchOverlayVisible(false)} className="ml-4">
                    <Ionicons name="close" size={24} color="black" />
                  </TouchableOpacity>
                </View>
                {searchQuery.length === 0 && (
                  <View>
                    <Text className="text-lg font-semibold mb-4">Popular Vehicles</Text>
                    {/* First Row */}
                    <View className="flex-row justify-between mb-4">
                      {popularVehicles.map((vehicle: Vehicle, index: number) =>
                        index < 3 && (
                          <TouchableOpacity
                            key={index}
                            className="w-1/3 p-2"
                            onPress={() => handleVehicleSelect(vehicle.name)}>
                            <Image
                              source={{ uri: vehicle.image || 'https://d3vp2rl7047vsp.cloudfront/businesses/bike_models/images/000/000/299/medium/ROYAL_ENFIELD_HIMALAYAN_GRAVEL_GREY.png?1660730284' }}
                              className="w-full h-24 rounded-lg object-cover"
                              resizeMode="contain"
                            />
                            <Text className="text-center mt-2 text-sm font-medium">{vehicle.name}</Text>
                          </TouchableOpacity>
                        )
                      )}
                    </View>
                    {/* Second Row */}
                    <View className="flex-row justify-between">
                      {popularVehicles.map((vehicle: Vehicle, index: number) =>
                        index >= 3 && index < 6 && (
                          <TouchableOpacity
                            key={index}
                            className="w-1/3 p-2"
                            onPress={() => handleVehicleSelect(vehicle.name)}>
                            <Image
                              source={{ uri: vehicle.image || 'https://d3vp2rl7047vsp.cloudfront/businesses/bike_models/images/000/000/299/medium/ROYAL_ENFIELD_HIMALAYAN_GRAVEL_GREY.png?1660730284' }}
                              className="w-full h-24 rounded-lg object-cover"
                              resizeMode="cover"
                            />
                            <Text className="text-center mt-2 text-sm font-medium">{vehicle.name}</Text>
                          </TouchableOpacity>
                        )
                      )}
                    </View>
                  </View>
                )}
                {searchQuery.length > 0 && (
                  <FlatList
                    data={vehicles.map((v: Vehicle) => v.name).filter((name: string) => name.toLowerCase().includes(searchQuery.toLowerCase()))}
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={{ padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee' }}
                        onPress={() => handleVehicleSelect(item)}>
                        <Text style={{ fontSize: 16, color: '#333' }}>{item}</Text>
                      </TouchableOpacity>
                    )}
                  />
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};

export default SearchScreen;
