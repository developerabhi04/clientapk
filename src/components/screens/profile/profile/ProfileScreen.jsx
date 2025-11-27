import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    ActivityIndicator,
    RefreshControl,
    Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect } from '@react-navigation/native';
import ApiService from '../../../../services/ApiService';
import AuthStorage from '../../../../services/AuthStorage';

export default function ProfileScreen({ navigation }) {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // ✅ Fetch profile on screen focus
    useFocusEffect(
        useCallback(() => {
            fetchUserProfile();
        }, [])
    );

    const fetchUserProfile = async () => {
        try {
            console.log('👤 Fetching user profile...');
            const response = await ApiService.getUserProfile();

            if (response.success) {
                setUserData(response.data);
                console.log('✅ Profile fetched:', response.data);
            } else {
                console.error('❌ Failed to fetch profile:', response.message);
                // Fallback to cached data
                const cachedUser = await AuthStorage.getUser();
                if (cachedUser) {
                    setUserData(cachedUser);
                }
            }
        } catch (error) {
            console.error('❌ Error fetching profile:', error);
            // Fallback to cached data
            const cachedUser = await AuthStorage.getUser();
            if (cachedUser) {
                setUserData(cachedUser);
            }
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchUserProfile();
    };

    // ✅ Fixed logout handler
    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            console.log('🚪 Logging out...');
                            await ApiService.logout();
                            console.log('✅ Logged out successfully');

                            // Navigate to login screen
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'Login' }],
                            });
                        } catch (error) {
                            console.error('❌ Logout error:', error);
                            Alert.alert('Error', 'Failed to logout. Please try again.');
                        }
                    },
                },
            ]
        );
    };

    // ✅ Fixed navigation handler
    const handleNavigation = (item) => {
        // Check if route is a function (like logout)
        if (typeof item.route === 'function') {
            item.route();
            return;
        }

        // Navigate to screen
        try {
            navigation.navigate(item.route);
        } catch (error) {
            console.log(`Screen ${item.route} not implemented yet`);
            Alert.alert('Coming Soon', `${item.label} feature will be available soon.`);
        }
    };

    // ✅ Settings list with corrected logout
    const settings = [
        { icon: 'account-outline', label: 'Profile', route: 'EditProfile' },
        { icon: 'shield-check', label: 'Privacy & Security', route: 'PrivacySecurity' },
        { icon: 'bell', label: 'Notifications', route: 'Notifications' },
        { icon: 'share', label: 'Refer & Invite', route: 'ReferInvite' },
        { icon: 'help-circle', label: 'Help & Support', route: 'HelpSupport' },
        { icon: 'logout', label: 'Logout', route: handleLogout }, // ✅ Pass function reference
    ];

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#00C896" />
                <Text style={styles.loadingText}>Loading profile...</Text>
            </View>
        );
    }

    const walletBalance = userData?.walletBalance || 0;
    const bonusBalance = userData?.bonusBalance || 0;
    const totalBalance = walletBalance + bonusBalance;

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000000" />

            {/* Fixed Header */}
            <SafeAreaView edges={['top']} style={styles.safeArea}>
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}>
                        <Icon name="arrow-left" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Profile</Text>
                    <View style={{ width: 40 }} />
                </View>
            </SafeAreaView>

            {/* ✅ Fixed Profile Section */}
            <View style={styles.profileSection}>
                <View style={styles.avatarContainer}>
                    <View style={styles.avatar}>
                        <Icon name="account" size={60} color="#FFFFFF" />
                    </View>
                    <TouchableOpacity
                        style={styles.editAvatarButton}
                        activeOpacity={0.8}
                        onPress={() => Alert.alert('Coming Soon', 'Profile picture upload will be available soon.')}>
                        <Icon name="camera" size={16} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
                <Text style={styles.userName}>
                    {userData?.fullName || 'User'}
                </Text>
                <Text style={styles.userPhone}>
                    {userData?.phoneNumber ? `+91 ${userData.phoneNumber}` : ''}
                </Text>
            </View>

            {/* ✅ Fixed Wallet Balance Section */}
            <View style={styles.walletSection}>
                <TouchableOpacity
                    style={styles.walletCard}
                    activeOpacity={0.8}
                    onPress={() => navigation.navigate('ProfileWallet')}>
                    <View style={styles.walletHeader}>
                        <View style={styles.walletIconContainer}>
                            <Icon name="wallet-outline" size={24} color="#00C896" />
                        </View>
                        <View style={styles.walletInfo}>
                            <Text style={styles.walletLabel}>Total Balance</Text>
                            <Text style={styles.walletBalance}>
                                ₹{totalBalance.toLocaleString('en-IN', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                })}
                            </Text>
                            <View style={styles.balanceBreakdown}>
                                <Text style={styles.breakdownText}>
                                    Wallet: ₹{walletBalance.toFixed(2)}
                                </Text>
                                <Text style={styles.breakdownDot}>•</Text>
                                <Text style={styles.breakdownText}>
                                    Bonus: ₹{bonusBalance.toFixed(2)}
                                </Text>
                            </View>
                        </View>
                        <Icon name="chevron-right" size={24} color="#666666" />
                    </View>

                    <View style={styles.walletActions}>
                        <TouchableOpacity
                            style={styles.addMoneyButton}
                            activeOpacity={0.8}
                            onPress={(e) => {
                                e.stopPropagation();
                                navigation.navigate('Recharge');
                            }}>
                            <Icon name="plus-circle" size={16} color="#00C896" />
                            <Text style={styles.addMoneyText}>Add Money</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.withdrawButton}
                            activeOpacity={0.8}
                            onPress={(e) => {
                                e.stopPropagation();
                                navigation.navigate('Withdraw');
                            }}>
                            <Icon name="bank-transfer-out" size={16} color="#FF9800" />
                            <Text style={styles.withdrawText}>Withdraw</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </View>

            {/* ✅ Scrollable Settings Section */}
            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor="#00C896"
                        colors={['#00C896']}
                    />
                }>

                {/* Settings List */}
                <View style={styles.settingsList}>
                    <Text style={styles.sectionTitle}>Settings</Text>
                    {settings.map((item, idx) => (
                        <TouchableOpacity
                            key={idx}
                            style={[
                                styles.settingItem,
                                item.label === 'Logout' && styles.logoutItem
                            ]}
                            activeOpacity={0.7}
                            onPress={() => handleNavigation(item)}>
                            <View style={[
                                styles.settingIconContainer,
                                item.label === 'Logout' && styles.logoutIconContainer
                            ]}>
                                <Icon
                                    name={item.icon}
                                    size={22}
                                    color={item.label === 'Logout' ? '#FF5252' : '#00C896'}
                                />
                            </View>
                            <Text style={[
                                styles.settingLabel,
                                item.label === 'Logout' && styles.logoutLabel
                            ]}>
                                {item.label}
                            </Text>
                            <Icon
                                name="chevron-right"
                                size={20}
                                color={item.label === 'Logout' ? '#FF5252' : '#666666'}
                            />
                        </TouchableOpacity>
                    ))}
                </View>

                {/* App Info Section */}
                <View style={styles.appInfoSection}>
                    <Text style={styles.appName}>TradeHub</Text>
                    <Text style={styles.versionText}>Version 1.0.0</Text>
                    <Text style={styles.copyrightText}>© 2025 TradeHub. All rights reserved.</Text>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },

    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000000',
    },

    loadingText: {
        marginTop: 12,
        fontSize: 14,
        color: '#999999',
        fontWeight: '600',
    },

    safeArea: {
        backgroundColor: '#000000',
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#000000',
    },

    backButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },

    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
        letterSpacing: 0.3,
    },

    // ✅ Fixed Profile Section (Non-scrollable)
    profileSection: {
        alignItems: 'center',
        paddingVertical: 18,
        paddingHorizontal: 16,
        backgroundColor: '#000000',
        borderBottomWidth: 1,
        borderBottomColor: '#1A1A1A',
    },

    avatarContainer: {
        position: 'relative',
        marginBottom: 16,
    },

    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#1A1A1A',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: '#00C896',
    },

    editAvatarButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#00C896',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: '#000000',
    },

    userName: {
        fontSize: 22,
        fontWeight: '800',
        color: '#FFFFFF',
        marginBottom: 4,
        letterSpacing: 0.3,
    },

    userPhone: {
        fontSize: 14,
        color: '#999999',
        fontWeight: '500',
        letterSpacing: 0.5,
    },

    // ✅ Fixed Wallet Section (Non-scrollable)
    walletSection: {
        paddingHorizontal: 16,
        paddingVertical: 16,
        backgroundColor: '#000000',
        borderBottomWidth: 1,
        borderBottomColor: '#1A1A1A',
    },

    walletCard: {
        backgroundColor: '#1A1A1A',
        borderRadius: 14,
        padding: 14,
        borderWidth: 1,
        borderColor: '#2A2A2A',
    },

    walletHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },

    walletIconContainer: {
        width: 38,
        height: 38,
        borderRadius: 24,
        backgroundColor: 'rgba(0, 200, 150, 0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },

    walletInfo: {
        flex: 1,
    },

    walletLabel: {
        fontSize: 10,
        color: '#999999',
        marginBottom: 4,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },

    walletBalance: {
        fontSize: 19,
        fontWeight: '800',
        color: '#FFFFFF',
        letterSpacing: -0.5,
        marginBottom: 6,
    },

    balanceBreakdown: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },

    breakdownText: {
        fontSize: 11,
        color: '#666666',
        fontWeight: '500',
    },

    breakdownDot: {
        fontSize: 11,
        color: '#666666',
    },

    walletActions: {
        flexDirection: 'row',
        gap: 12,
    },

    addMoneyButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 200, 150, 0.15)',
        paddingVertical: 12,
        borderRadius: 10,
        gap: 6,
        borderWidth: 1,
        borderColor: '#00C896',
    },

    addMoneyText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#00C896',
        letterSpacing: 0.3,
    },

    withdrawButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 152, 0, 0.15)',
        paddingVertical: 12,
        borderRadius: 10,
        gap: 6,
        borderWidth: 1,
        borderColor: '#FF9800',
    },

    withdrawText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#FF9800',
        letterSpacing: 0.3,
    },

    // ✅ Scrollable Settings Section
    scrollView: {
        flex: 1,
    },

    scrollContent: {
        paddingBottom: 30,
    },

    settingsList: {
        paddingHorizontal: 16,
        paddingTop: 22,
        marginBottom: 20,
    },

    sectionTitle: {
        fontSize: 10,
        fontWeight: '700',
        color: '#999999',
        marginBottom: 10,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },

    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1A1A1A',
        paddingVertical: 12,
        paddingHorizontal: 12,
        marginBottom: 8,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#2A2A2A',
    },

    logoutItem: {
        backgroundColor: 'rgba(255, 82, 82, 0.1)',
        borderColor: 'rgba(255, 82, 82, 0.3)',
    },

    settingIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 20,
        backgroundColor: 'rgba(0, 200, 150, 0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },

    logoutIconContainer: {
        backgroundColor: 'rgba(255, 82, 82, 0.15)',
    },

    settingLabel: {
        fontSize: 13,
        color: '#FFFFFF',
        fontWeight: '600',
        flex: 1,
        letterSpacing: 0.2,
    },

    logoutLabel: {
        color: '#FF5252',
    },

    // App Info Section
    appInfoSection: {
        paddingHorizontal: 16,
        paddingVertical: 32,
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#1A1A1A',
    },

    appName: {
        fontSize: 18,
        fontWeight: '800',
        color: '#FFFFFF',
        marginBottom: 8,
        letterSpacing: 0.5,
    },

    versionText: {
        fontSize: 13,
        color: '#666666',
        fontWeight: '500',
        marginBottom: 4,
    },

    copyrightText: {
        fontSize: 11,
        color: '#666666',
        fontWeight: '400',
        marginTop: 8,
    },
});
