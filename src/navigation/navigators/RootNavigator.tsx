import React, { useEffect } from 'react';
import { NavigationContainer, NavigationState } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  parseAndLogRoute,
  navigationRef,
  setIsNavigationReady,
} from '../Navigation';
import ROUTES from '../routes/ROUTES';
import BottomTabNavigator from './BottomTabNavigator';
import AuthStackNavigator from './AuthStackNavigator';
import Logger from '../../utils/Logger';
import SearchScreen from '../../screens/SearchScreen';
import { AuthProvider, useAuth } from '../../contexts/AuthContext';
import RideConfirmationScreen from '../../screens/RideConfirmationScreen';
import BookingConfirmationScreen from '../../screens/BookingConfirmationScreen';
import SplashScreen from '../../screens/SplashScreen';
import UpdateProfileScreen from '../../screens/UpdateProfileScreen';

const Stack = createNativeStackNavigator();

const AppContent = () => {
  const { isAuthenticated, user, loading } = useAuth();

  const handleStateChange = (state: NavigationState | undefined) => {
    Logger.info('Navigation state changed', { state, isAuthenticated });
    parseAndLogRoute(state);
  };

  useEffect(() => {
    if (navigationRef.current?.isReady()) {
      Logger.info('Navigation is ready');
    }
  }, []);

  useEffect(() => {
    Logger.info('RootNavigator rendered', { isAuthenticated, user });
  }, [isAuthenticated, user]);

  console.log("Data", isAuthenticated);

  return (
    <NavigationContainer
      ref={navigationRef}
      onStateChange={handleStateChange}
      onReady={setIsNavigationReady}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {loading ? ( // Show splash while loading
          <Stack.Screen name={ROUTES.SPLASH} component={SplashScreen} />
        ) : isAuthenticated ? (
          <>
            <Stack.Screen
              name={ROUTES.MAIN_TABS}
              component={BottomTabNavigator}
            />
            <Stack.Screen name={ROUTES.SEARCH} component={SearchScreen} />
            <Stack.Screen
              name={ROUTES.RIDECONFIRMATION}
              component={RideConfirmationScreen}
            />
            <Stack.Screen
              name={ROUTES.BOOKCONFIRMATION}
              component={BookingConfirmationScreen}
            />
            <Stack.Screen
              name={ROUTES.UPDATEPROFILE}
              component={UpdateProfileScreen}
            />
          </>
        ) : (
          <Stack.Screen name={ROUTES.ROOT} component={AuthStackNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const RootNavigator = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default RootNavigator;