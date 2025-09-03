import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@react-native-vector-icons/ionicons";
import { useAuth } from "../contexts/AuthContext";
import useAuthStore from "../../store/authStore";

const UpdateProfileScreen = ({ navigation }) => {
  const { user, completeProfile, token } = useAuth();
  const phone = user?.phone || ""; // Safely get phone from user, default to empty string
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [error, setError] = useState<string | null>(null);
  console.log("user",user);

  const handleSave = async () => {
    if (!phone) {
      Alert.alert("Error", "User phone number is missing. Please log in again.");
      return;
    }
    if (!firstName || !email) {
      Alert.alert("Error", "First name and email are required");
      return;
    }

    setError(null);
    try {
      console.log("Sending data:", { phone, firstName, lastName, email });
      await completeProfile(phone, firstName, lastName, email);
      useAuthStore.setState({
        user: { phone, firstName, lastName, email },
      });
      Alert.alert("Success", "Profile updated successfully");
      navigation.goBack();
    } catch (error: any) {
      console.error("Profile update error:", error.response?.data || error.message);
      setError(error.response?.data?.error || "Failed to update profile");
      Alert.alert("Error", error.response?.data?.error || "Failed to update profile");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView className="p-5">
        {/* Header */}
        <View className="flex-row items-center mb-6">
          <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-black">Update Profile</Text>
        </View>

        {/* Form */}
        <View className="bg-white rounded-2xl p-6 shadow-lg mb-5">
          <Text className="text-lg font-semibold mb-4 text-gray-700">
            Personal Information
          </Text>

          <TextInput
            placeholder="First Name"
            value={firstName}
            onChangeText={setFirstName}
            className="border border-gray-300 rounded-lg p-3 mb-4 text-base"
            autoCapitalize="words"
          />

          <TextInput
            placeholder="Last Name (Optional)"
            value={lastName}
            onChangeText={setLastName}
            className="border border-gray-300 rounded-lg p-3 mb-4 text-base"
            autoCapitalize="words"
          />

          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            className="border border-gray-300 rounded-lg p-3 mb-4 text-base"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {error && <Text className="text-red-500 mb-4">{error}</Text>}

          <TouchableOpacity
            onPress={handleSave}
            className="bg-yellow-400 rounded-lg py-3 mt-4"
          >
            <Text className="text-center text-black font-semibold text-base">
              Save Changes
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UpdateProfileScreen;
