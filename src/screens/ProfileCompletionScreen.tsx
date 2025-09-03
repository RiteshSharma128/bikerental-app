import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useAuth } from "../contexts/AuthContext";
import ROUTES from "../navigation/routes/ROUTES";

const ProfileCompletionScreen = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const { completeProfile } = useAuth();
  const route = useRoute();
  const navigation = useNavigation();
  const { phone } = route.params;
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    try {
      await completeProfile(phone, firstName, lastName, email);
      navigation.reset({ index: 0, routes: [{ name: ROUTES.MAIN_TABS }] });
    } catch (err) {
      setError('Failed to save profile');
    }
  };

  return (
    <View className="flex-1 bg-white p-6">
      <Text className="text-2xl font-bold text-center mb-6">Complete Your Profile</Text>
      <TextInput className="border border-gray-400 rounded-xl px-4 py-3 mb-4" placeholder="First Name" value={firstName} onChangeText={setFirstName} />
      <TextInput className="border border-gray-400 rounded-xl px-4 py-3 mb-4" placeholder="Last Name" value={lastName} onChangeText={setLastName} />
      <TextInput className="border border-gray-400 rounded-xl px-4 py-3 mb-6" placeholder="Email" keyboardType="email-address" value={email} onChangeText={setEmail} />
      {error && <Text className="text-red-500 mb-4">{error}</Text>}
      <TouchableOpacity className="bg-blue-600 py-4 rounded-xl items-center" onPress={handleSubmit}>
        <Text className="text-white text-lg font-semibold">Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileCompletionScreen;