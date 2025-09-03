import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import ROUTES from './ROUTES';

// Root stack params
export type RootStackParamList = {
  [ROUTES.ROOT]: undefined;
  [ROUTES.LOGIN]: undefined;
  [ROUTES.SIGNUP]: undefined;
  [ROUTES.MAIN_TABS]: undefined;
  [ROUTES.HOME]: undefined;
  [ROUTES.SUBSCRIPTION]: undefined;
  [ROUTES.MENU]: undefined;
  [ROUTES.SEARCH]: undefined;
  [ROUTES.OTP]: undefined;
  [ROUTES.PHONE_NUMBER]:undefined;
  [ROUTES.RIDECONFIRMATION]:undefined;
  [ROUTES.CHOOSE_LOGIN_SIGNUP]:undefined;
  [ROUTES.BOOKCONFIRMATION]:undefined;
  [ROUTES.SPLASH]:undefined;
  [ROUTES.UPDATEPROFILE]:undefined;
  // Add future standalone screens here (e.g., RideDetails, Profile)
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;
