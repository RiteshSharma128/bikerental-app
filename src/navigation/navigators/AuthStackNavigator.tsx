// src/navigation/AuthStackNavigator.tsx
import React, {lazy, Suspense} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ROUTES from '../routes/ROUTES';
import PhoneNumberScreen from '../../screens/PhoneNumberScreen';
import ProfileCompletionScreen from '../../screens/ProfileCompletionScreen';
import ChooseLoginSignupScreen from '../../screens/ChooseLoginSignupScreen';

// Lazy load screens

const OtpScreen = lazy(() => import('../../screens/OtpScreen'));

const Stack = createNativeStackNavigator();

const AuthStackNavigator: React.FC = () => (
  <Suspense fallback={null}>
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {/* <Stack.Screen
        name={ROUTES.CHOOSE_LOGIN_SIGNUP}
        component={ChooseLoginSignupScreen}
      /> */}
      <Stack.Screen name={ROUTES.PHONE_NUMBER} component={PhoneNumberScreen} />
      <Stack.Screen name="Otp" component={OtpScreen} />
      <Stack.Screen
        name="ProfileCompletion"
        component={ProfileCompletionScreen}
      />
    </Stack.Navigator>
  </Suspense>
);

export default AuthStackNavigator;
