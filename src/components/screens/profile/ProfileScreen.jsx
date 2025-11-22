import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const settings = [
    { icon: 'account-outline', label: 'Profile', route: 'EditProfile' },
    { icon: 'clipboard-text-outline', label: 'Order', route: 'TopOrder' },
    { icon: 'bank', label: 'Bank Account', route: 'AccountSettings' },
    { icon: 'shield-check', label: 'Privacy & Security', route: 'PrivacySecurity' },
    { icon: 'bell', label: 'Notifications', route: 'Notifications' },
    { icon: 'share', label: 'Refer & Invite', route: 'ReferInvite' },
    { icon: 'help-circle', label: 'Help & Support', route: 'HelpSupport' },
];

export default function ProfileScreen({ navigation }) {
    // Mock wallet balance - replace with actual data
    const walletBalance = 1250.75;

    const handleLogout = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        });
    };

    const handleNavigation = (route) => {
        try {
            navigation.navigate(route);
        } catch (error) {
            console.log(`Screen ${route} not implemented yet`);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000000" />

            <SafeAreaView edges={['top']} style={styles.safeArea}>
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}>
                        <Icon name="arrow-left" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                    {/* <TouchableOpacity style={styles.bellButton}>
                        <Icon name="bell-outline" size={24} color="#FFFFFF" />
                    </TouchableOpacity> */}
                    {/* <TouchableOpacity style={styles.settingsButton}>
                        <Icon name="cog-outline" size={24} color="#FFFFFF" />
                    </TouchableOpacity> */}
                </View>
            </SafeAreaView>

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}>

                {/* Profile Section */}
                <View style={styles.profileSection}>
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatar}>
                            <Icon name="account" size={60} color="#FFFFFF" />
                        </View>
                    </View>
                    <Text style={styles.userName}>John Doe</Text>

                </View>

                {/* Wallet Balance Section */}
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
                                <Text style={styles.walletLabel}>Wallet Balance</Text>
                                <Text style={styles.walletBalance}>
                                    ₹{walletBalance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </Text>
                            </View>
                            <Icon name="chevron-right" size={24} color="#FFFFFF" />
                        </View>

                        <TouchableOpacity
                            style={styles.addMoneyButton}
                            activeOpacity={0.8}
                            onPress={(e) => {
                                e.stopPropagation();
                                navigation.navigate('Recharge');
                            }}>
                            <Icon name="plus-circle" size={14} color="#00C896" />
                            <Text style={styles.addMoneyText}>Add money</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                </View>

                {/* Settings List */}
                <View style={styles.settingsList}>
                    {settings.map((item, idx) => (
                        <TouchableOpacity
                            key={idx}
                            style={styles.settingItem}
                            activeOpacity={0.7}
                            onPress={() => handleNavigation(item.route)}>
                            <Icon name={item.icon} size={24} color="#FFFFFF" />
                            <Text style={styles.settingLabel}>{item.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Version */}
                <View style={styles.versionSection}>
                    <Text style={styles.versionText}>Version 1.0.0</Text>
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

    safeArea: {
        backgroundColor: '#000000',
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
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

    bellButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 'auto',
    },

    settingsButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 8,
    },

    scrollView: {
        flex: 1,
    },

    scrollContent: {
        paddingBottom: 40,
    },

    // Profile Section
    profileSection: {
        alignItems: 'center',
        paddingTop: 20,
        paddingBottom: 30,
    },

    avatarContainer: {
        position: 'relative',
        marginBottom: 16,
    },

    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#1A1A1A',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: '#2A2A2A',
    },

    userName: {
        fontSize: 22,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 12,
        letterSpacing: 0.3,
    },

    editPictureButton: {
        paddingVertical: 8,
    },

    editPictureText: {
        fontSize: 14,
        color: '#FFFFFF',
        fontWeight: '500',
    },

    // Wallet Balance Section
    walletSection: {
        marginBottom: 24,
        paddingHorizontal: 16,
    },

    walletCard: {
        backgroundColor: '#1A1A1A',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#2A2A2A',
    },

    walletHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },

    walletIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#0D2B24',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },

    walletInfo: {
        flex: 1,
    },

    walletLabel: {
        fontSize: 13,
        color: '#999999',
        marginBottom: 4,
        fontWeight: '500',
    },

    walletBalance: {
        fontSize: 20,
        fontWeight: '800',
        color: '#FFFFFF',
        letterSpacing: -0.5,
    },

    addMoneyButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0D2B24',
        paddingVertical: 10,
        borderRadius: 10,
        gap: 8,
        borderWidth: 1,
        borderColor: '#00C896',
    },

    addMoneyText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#00C896',
        letterSpacing: 0.3,
    },

    // Settings List
    settingsList: {
        paddingHorizontal: 16,
        marginBottom: 20,
    },

    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 18,
        borderBottomWidth: 1,
        borderBottomColor: '#1A1A1A',
    },

    settingLabel: {
        fontSize: 16,
        color: '#FFFFFF',
        fontWeight: '400',
        marginLeft: 16,
        flex: 1,
        letterSpacing: 0.2,
    },

    // Version Section
    versionSection: {
        paddingHorizontal: 16,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#1A1A1A',
    },

    versionText: {
        fontSize: 13,
        textAlign: 'center',
        color: '#666666',
        fontWeight: '400',
        paddingVertical: 12,
    },
});
