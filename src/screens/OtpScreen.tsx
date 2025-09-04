import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import ROUTES from '../navigation/routes/ROUTES';

// Define User type (adjust based on your schema)
interface User {
  firstName?: string;
  email?: string;
  phone?: string;
  id?: string;
}

// Define navigation param list
type RootStackParamList = {
  Otp: { sessionId: string; phone: string; isLogin?: boolean };
  ProfileCompletion: { phone: string };
  Home: undefined; // No params for Home
  // Add other screens as needed
};

type OtpScreenRouteProp = RouteProp<RootStackParamList, 'Otp'>;

// Define Auth context return type
interface AuthContextType {
  verifyOtp: (sessionId: string, otp: string, phone: string) => Promise<User | null>;
}

const OtpScreen: React.FC = () => {
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const { verifyOtp } = useAuth() as AuthContextType;
  const route = useRoute<OtpScreenRouteProp>();
  const navigation = useNavigation();
  const { sessionId, phone } = route.params;
  const [error, setError] = useState<string | null>(null);

  // Properly type the ref array for TextInput
  const inputRefs = useRef<(TextInput | null)[]>(new Array(6).fill(null));

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (value: string, index: number) => {
    if (/^\d$/.test(value) || value === '') {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      } else if (!value && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter a 6-digit OTP');
      return;
    }

    try {
      const user = await verifyOtp(sessionId, otpString, phone);
      if (user && (!user.firstName?.trim() || !user.email?.trim())) {
        navigation.navigate('ProfileCompletion', { phone });
      } else {
        navigation.navigate('Home');
      }
    } catch (err) {
      setError('Invalid OTP');
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <View className="flex-1 bg-white p-6 items-center justify-center">
      <Text className="text-2xl font-bold text-gray-800 mb-2">Enter OTP</Text>
      <Text className="text-gray-500 mb-8">
        We have sent you an OTP on your phone number
      </Text>

      <View className="flex-row justify-between w-2/3 mb-6 gap-1">
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputRefs.current[index] = ref)} // Assign ref to the array
            className="border border-gray-400 rounded-xl px-4 py-3 text-lg text-center w-12"
            keyboardType="numeric"
            maxLength={1}
            value={digit}
            onChangeText={(value) => handleChange(value, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            autoFocus={index === 0}
          />
        ))}
      </View>

      {error && <Text className="text-red-500 mb-4">{error}</Text>}

      <TouchableOpacity
        className="bg-green-600 py-4 px-8 rounded-xl items-center w-2/3"
        onPress={handleVerify}>
        <Text className="text-white text-lg font-semibold">Verify</Text>
      </TouchableOpacity>
    </View>
  );
};

export default OtpScreen;
