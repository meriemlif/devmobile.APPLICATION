import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { COLORS, FONT_SIZES } from '../constants/colors';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

// Room Screens
import RoomListScreen from '../screens/rooms/RoomListScreen';
import RoomDetailScreen from '../screens/rooms/RoomDetailScreen';

// Reservation Screens
import MyReservationsScreen from '../screens/reservations/MyReservationsScreen';
import CreateReservationScreen from '../screens/reservations/CreateReservationScreen';

// Profile & Admin Screens
import ProfileScreen from '../screens/ProfileScreen';
import AdminScreen from '../screens/AdminScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Stack de navigation pour les salles
const RoomsStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="RoomList" component={RoomListScreen} />
            <Stack.Screen name="RoomDetail" component={RoomDetailScreen} />
            <Stack.Screen name="CreateReservation" component={CreateReservationScreen} />
        </Stack.Navigator>
    );
};

// Navigation par onglets (Bottom Tabs)
const MainTabs = () => {
    const { isAdmin } = useAuth(); // Récupérer le statut admin

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Rooms') {
                        iconName = focused ? 'business' : 'business-outline';
                    } else if (route.name === 'MyReservations') {
                        iconName = focused ? 'calendar' : 'calendar-outline';
                    } else if (route.name === 'Admin') {
                        iconName = focused ? 'shield-checkmark' : 'shield-checkmark-outline';
                    } else if (route.name === 'Profile') {
                        iconName = focused ? 'person' : 'person-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: COLORS.textSecondary,
                tabBarStyle: {
                    backgroundColor: COLORS.surface,
                    borderTopColor: COLORS.border,
                    borderTopWidth: 1,
                    paddingBottom: 20,
                    paddingTop: 5,
                    height: 75,
                },
                tabBarLabelStyle: {
                    fontSize: FONT_SIZES.xs,
                    fontWeight: '600',
                },
                headerShown: true,
                headerStyle: {
                    backgroundColor: COLORS.surface,
                    elevation: 0,
                    shadowOpacity: 0,
                    borderBottomWidth: 1,
                    borderBottomColor: COLORS.border,
                },
                headerTitleStyle: {
                    fontSize: FONT_SIZES.lg,
                    fontWeight: '700',
                    color: COLORS.textPrimary,
                },
            })}
        >
            <Tab.Screen
                name="Rooms"
                component={RoomsStack}
                options={{ title: 'Salles', headerShown: false }}
            />
            <Tab.Screen
                name="MyReservations"
                component={MyReservationsScreen}
                options={{ title: 'Réservations' }}
            />
            {isAdmin && (
                <Tab.Screen
                    name="Admin"
                    component={AdminScreen}
                    options={{ title: 'Admin' }}
                />
            )}
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{ title: 'Profil' }}
            />
        </Tab.Navigator>
    );
};

// Stack d'authentification
const AuthStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
            }}
        >
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
    );
};

// Navigateur principal
const AppNavigator = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <LoadingSpinner fullScreen />;
    }

    return (
        <NavigationContainer>
            {user ? <MainTabs /> : <AuthStack />}
        </NavigationContainer>
    );
};

export default AppNavigator;
