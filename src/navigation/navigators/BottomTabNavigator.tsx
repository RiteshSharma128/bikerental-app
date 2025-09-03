import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@react-native-vector-icons/ionicons'; // ✅ Correct import
import ROUTES from '../routes/ROUTES';

// Screens
import SubscriptionScreen from '../../screens/SubscriptionScreen';
import MenuScreen from '../../screens/MenuScreen';
import HomeScreen from '../../screens/HomeScreen';

export type BottomTabParamList = {
  [ROUTES.HOME]: undefined;
  [ROUTES.SUBSCRIPTION]: undefined;
  [ROUTES.MENU]: undefined;
};

const Tab = createBottomTabNavigator();

const BottomTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }: { route: { name: keyof BottomTabParamList } }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: {
          height: 70,
          paddingBottom: 10,
          paddingTop: 5,
        },
        tabBarLabelStyle: {
          textDecorationLine: 'none', // ✅ removes underline
        },
        tabBarIcon: ({
          focused,
          color,
          size,
        }: {
          focused: boolean;
          color: string;
          size: number;
        }) => {
          let iconName = '';

          if (route.name === ROUTES.HOME) {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === ROUTES.SUBSCRIPTION) {
            iconName = focused ? 'card' : 'card-outline';
          } else if (route.name === ROUTES.MENU) {
            iconName = focused ? 'menu' : 'menu-outline';
          }

          return <Ionicons name={iconName} size={size} color={focused ? '#FEBE10' : 'gray'} />; // ✅ Yellow when active
        },
        tabBarActiveTintColor: '#FFD700', // ✅ Yellow active
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name={ROUTES.HOME} component={HomeScreen} />
      <Tab.Screen name={ROUTES.SUBSCRIPTION} component={SubscriptionScreen} />
      <Tab.Screen name={ROUTES.MENU} component={MenuScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
