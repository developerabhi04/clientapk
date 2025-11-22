import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../components/screens/loginSignup/LoginScreen';
import SignupScreen from '../components/screens/loginSignup/SignupScreen';
import OTPVerificationScreen from '../components/screens/loginSignup/OTPVerificationScreen';
import NotificationScreen from '../components/screens/Home/NotificationScreen';
import ProfileScreen from '../components/screens/profile/ProfileScreen';
import { COLORS } from '../../src/constants/colors';
import IndicesScreen from '../components/screens/Home/Indices/IndicesScreen';
import HistoryScreen from '../components/screens/profile/HistoryScreen';
import BottomTabNavigator from './BottomTabNavigator';
import RechargeScreen from '../components/screens/Home/Indices/RechargeScreen';
import TransactionHistoryScreen from '../components/screens/TransactionHistoryScreen';
import WithdrawScreen from '../components/screens/profile/WithdrawScreen';
import PaymentScreen from '../components/screens/Home/Indices/PaymentScreen';
import StockDetailScreen from '../components/screens/Home/Indices/StockDetailScreen';
import AccountSettingsScreen from '../components/screens/profile/AccountSettingsScreen';
import PrivacySecurityScreen from '../components/screens/profile/PrivacySecurityScreen';
import AppGuideScreen from '../components/screens/profile/AppGuideScreen';
import BuyStockScreen from '../components/screens/Home/Indices/BuyStockScreen';
import OrderScreen from '../components/screens/orders/OrderScreen';
import SellStockScreen from '../components/screens/portfolio/SellStockScreen';
import ProfileWalletScreen from '../components/screens/profile/ProfileWalletScreen';
import ReferralScreen from '../components/screens/profile/ReferralScreen';
import EditProfileScreen from '../components/screens/profile/EditProfileScreen';

// ✅ Import AuthStorage to check authentication
import AuthStorage from '../services/AuthStorage';

const Stack = createStackNavigator();

const AppNavigator = () => {
    // ✅ State management for authentication
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // ✅ Check authentication status when app starts
    useEffect(() => {
        checkAuthStatus();
    }, []);

    // ✅ Function to check if user is logged in
    const checkAuthStatus = async () => {
        try {
            console.log('🔍 Checking authentication status...');

            // Get token and user from AsyncStorage
            const token = await AuthStorage.getToken();
            const user = await AuthStorage.getUser();

            if (token && user) {
                console.log('✅ User is authenticated:', user.fullName);
                console.log('📱 Phone:', user.phoneNumber);
                console.log('💰 Wallet Balance:', user.walletBalance);
                setIsAuthenticated(true);
            } else {
                console.log('❌ User is not authenticated');
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.error('❌ Error checking auth status:', error);
            setIsAuthenticated(false);
        } finally {
            // Hide loading screen
            setIsLoading(false);
        }
    };

    // ✅ Show loading screen while checking authentication
    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator
                // ✅ Dynamic initial route based on authentication status
                initialRouteName={isAuthenticated ? 'Home' : 'Signup'}
                screenOptions={{
                    headerStyle: {
                        backgroundColor: COLORS.primary,
                        elevation: 0,
                        shadowOpacity: 0,
                    },
                    headerTintColor: COLORS.white,
                    headerTitleStyle: {
                        fontWeight: '600',
                        fontSize: 18,
                    },
                    headerBackTitleVisible: false,
                    cardStyle: {
                        backgroundColor: COLORS.background,
                    },
                }}>

                {/* Authentication Screens */}
                <Stack.Screen
                    name="Login"
                    component={LoginScreen}
                    options={{
                        title: 'Login',
                        headerShown: false,
                    }}
                />

                <Stack.Screen
                    name="Signup"
                    component={SignupScreen}
                    options={{
                        title: 'Sign Up',
                        headerShown: false
                    }}
                />

                <Stack.Screen
                    name="OTPVerification"
                    component={OTPVerificationScreen}
                    options={{
                        title: 'Verify OTP'
                    }}
                />

                {/* Main App Screens */}
                <Stack.Screen
                    name="Home"
                    component={BottomTabNavigator}
                    options={{
                        title: 'Home',
                        headerShown: false,
                        gestureEnabled: false
                    }}
                />

                <Stack.Screen
                    name="Indices"
                    component={IndicesScreen}
                    options={{
                        title: 'Market Indices',
                        headerShown: false
                    }}
                />

                <Stack.Screen
                    name="Notification"
                    component={NotificationScreen}
                    options={{
                        title: 'Notifications',
                        headerShown: false
                    }}
                />

                <Stack.Screen
                    name="Profile"
                    component={ProfileScreen}
                    options={{
                        title: 'Profile',
                        headerShown: false
                    }}
                />

                <Stack.Screen
                    name="History"
                    component={HistoryScreen}
                    options={{
                        title: 'Transaction History',
                        headerShown: false
                    }}
                />

                <Stack.Screen
                    name="TransactionHistory"
                    component={TransactionHistoryScreen}
                    options={{
                        title: 'Transaction History',
                        headerShown: false
                    }}
                />

                <Stack.Screen
                    name="EditProfile"
                    component={EditProfileScreen}
                    options={{
                        headerShown: false
                    }}
                />

                <Stack.Screen
                    name="Recharge"
                    component={RechargeScreen}
                    options={{
                        headerShown: false
                    }}
                />

                <Stack.Screen
                    name="Payment"
                    component={PaymentScreen}
                    options={{
                        headerShown: false
                    }}
                />

                <Stack.Screen
                    name="Withdraw"
                    component={WithdrawScreen}
                    options={{
                        headerShown: false
                    }}
                />

                <Stack.Screen
                    name="StockDetail"
                    component={StockDetailScreen}
                    options={{
                        animation: 'slide_from_right',
                        headerShown: false
                    }}
                />

                <Stack.Screen
                    name="AccountSettings"
                    component={AccountSettingsScreen}
                    options={{
                        animation: 'slide_from_right',
                        headerShown: false
                    }}
                />

                <Stack.Screen
                    name="PrivacySecurity"
                    component={PrivacySecurityScreen}
                    options={{
                        animation: 'slide_from_right',
                        headerShown: false
                    }}
                />

                <Stack.Screen
                    name="HelpSupport"
                    component={AppGuideScreen}
                    options={{
                        animation: 'slide_from_right',
                        headerShown: false
                    }}
                />

                <Stack.Screen
                    name="ReferInvite"
                    component={ReferralScreen}
                    options={{
                        animation: 'slide_from_right',
                        headerShown: false
                    }}
                />

                <Stack.Screen
                    name="ProfileWallet"
                    component={ProfileWalletScreen}
                    options={{
                        headerShown: false
                    }}
                />

                <Stack.Screen
                    name="BuyStock"
                    component={BuyStockScreen}
                    options={{
                        headerShown: false
                    }}
                />

                <Stack.Screen
                    name="SellStock"
                    component={SellStockScreen}
                    options={{
                        headerShown: false
                    }}
                />

                <Stack.Screen
                    name='TopOrder'
                    component={OrderScreen}
                    options={{
                        animation: 'slide_from_right',
                        headerShown: false
                    }}
                />

            </Stack.Navigator>
        </NavigationContainer>
    );
};

// ✅ Styles for loading screen
const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.background || '#000000',
    },
});

export default AppNavigator;
