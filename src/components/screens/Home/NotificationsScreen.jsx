import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const NOTIFICATIONS_DATA = [
    {
        id: '1',
        type: 'transaction',
        icon: 'check-circle',
        iconColor: '#00C896',
        iconBg: '#0D2B24',
        title: 'Payment Successful',
        message: 'Your payment of ₹1,500 has been credited to your wallet',
        time: '1 mins ago',
        isRead: false,
    },
    {
        id: '2',
        type: 'trade',
        icon: 'chart-line',
        iconColor: '#2196F3',
        iconBg: '#1A1F2A',
        title: 'Trade Executed',
        message: 'Your buy order for NIFTY 50 has been executed at ₹19,435.30',
        time: '1 hour ago',
        isRead: false,
    },
    {
        id: '3',
        type: 'alert',
        icon: 'alert-circle',
        iconColor: '#FF9800',
        iconBg: '#2A1F0D',
        title: 'Price Alert',
        message: 'SENSEX has reached your target price of ₹64,500',
        time: '3 hours ago',
        isRead: true,
    },
    {
        id: '4',
        type: 'system',
        icon: 'information',
        iconColor: '#2196F3',
        iconBg: '#1A1F2A',
        title: 'Account Verified',
        message: 'Your account details have been successfully verified',
        time: '1 day ago',
        isRead: true,
    },
    {
        id: '5',
        type: 'transaction',
        icon: 'cash-minus',
        iconColor: '#FF5252',
        iconBg: '#2A1F1F',
        title: 'Withdrawal Initiated',
        message: 'Your withdrawal request of ₹5,000 is being processed',
        time: '2 days ago',
        isRead: true,
    },
    {
        id: '6',
        type: 'trade',
        icon: 'trending-up',
        iconColor: '#00C896',
        iconBg: '#0D2B24',
        title: 'Profit Achieved',
        message: 'Your portfolio gained ₹2,500 today',
        time: '3 days ago',
        isRead: true,
    },
    {
        id: '7',
        type: 'system',
        icon: 'shield-check',
        iconColor: '#9C27B0',
        iconBg: '#1F1A2A',
        title: 'Security Update',
        message: 'Two-factor authentication has been enabled on your account',
        time: '1 week ago',
        isRead: true,
    },
];

const NotificationsScreen = ({ navigation }) => {
    const [notifications, setNotifications] = useState(NOTIFICATIONS_DATA);
    const [filter, setFilter] = useState('all');

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const filteredNotifications = filter === 'all'
        ? notifications
        : notifications.filter(n => n.type === filter);

    const markAsRead = (id) => {
        setNotifications(prev =>
            prev.map(notif =>
                notif.id === id ? { ...notif, isRead: true } : notif
            )
        );
    };

    const markAllAsRead = () => {
        setNotifications(prev =>
            prev.map(notif => ({ ...notif, isRead: true }))
        );
    };

    const renderNotification = ({ item }) => (
        <TouchableOpacity
            style={[
                styles.notificationCard,
                !item.isRead && styles.notificationCardUnread
            ]}
            activeOpacity={0.7}
            onPress={() => markAsRead(item.id)}>

            <View style={[styles.iconContainer, { backgroundColor: item.iconBg }]}>
                <Icon name={item.icon} size={24} color={item.iconColor} />
            </View>

            <View style={styles.notificationContent}>
                <View style={styles.notificationHeader}>
                    <Text style={styles.notificationTitle} numberOfLines={1}>
                        {item.title}
                    </Text>
                    {!item.isRead && <View style={styles.unreadDot} />}
                </View>

                <Text style={styles.notificationMessage} numberOfLines={2}>
                    {item.message}
                </Text>

                <View style={styles.notificationFooter}>
                    <Icon name="clock-outline" size={12} color="#666666" />
                    <Text style={styles.notificationTime}>{item.time}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000000" />

            {/* Header */}
            <SafeAreaView edges={['top']} style={styles.safeArea}>
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                        activeOpacity={0.7}>
                        <Icon name="arrow-left" size={24} color="#FFFFFF" />
                    </TouchableOpacity>

                    <View style={styles.headerCenter}>
                        <Text style={styles.headerTitle}>Notifications</Text>
                        {unreadCount > 0 && (
                            <View style={styles.headerBadge}>
                                <Text style={styles.headerBadgeText}>{unreadCount}</Text>
                            </View>
                        )}
                    </View>

                    <TouchableOpacity
                        style={styles.markAllButton}
                        onPress={markAllAsRead}
                        activeOpacity={0.7}>
                        <Icon name="check-all" size={22} color="#00C896" />
                    </TouchableOpacity>
                </View>

                {/* Filter Tabs */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filterContainer}>
                    {[
                        { key: 'all', label: 'All', icon: 'view-grid' },
                        { key: 'transaction', label: 'Payments', icon: 'cash' },
                        { key: 'trade', label: 'Trades', icon: 'chart-line' },
                        { key: 'alert', label: 'Alerts', icon: 'bell' },
                        { key: 'system', label: 'System', icon: 'cog' },
                    ].map((type) => (
                        <TouchableOpacity
                            key={type.key}
                            style={[
                                styles.filterTab,
                                filter === type.key && styles.filterTabActive
                            ]}
                            onPress={() => setFilter(type.key)}
                            activeOpacity={0.7}>
                            <Icon
                                name={type.icon}
                                size={16}
                                color={filter === type.key ? '#00C896' : '#999999'}
                            />
                            <Text style={[
                                styles.filterTabText,
                                filter === type.key && styles.filterTabTextActive
                            ]}>
                                {type.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </SafeAreaView>

            {/* Notifications List */}
            {filteredNotifications.length > 0 ? (
                <FlatList
                    data={filteredNotifications}
                    renderItem={renderNotification}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            ) : (
                <View style={styles.emptyState}>
                    <View style={styles.emptyIconContainer}>
                        <Icon name="bell-off-outline" size={60} color="#666666" />
                    </View>
                    <Text style={styles.emptyStateTitle}>No Notifications</Text>
                    <Text style={styles.emptyStateText}>
                        You're all caught up! Check back later for updates.
                    </Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },

    safeArea: {
        backgroundColor: '#000000',
    },

    // Header
    header: {
        backgroundColor: '#000000',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#1A1A1A',
    },

    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },

    headerCenter: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },

    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
        letterSpacing: 0.3,
    },

    headerBadge: {
        backgroundColor: '#FF5252',
        borderRadius: 10,
        paddingHorizontal: 8,
        paddingVertical: 2,
        minWidth: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },

    headerBadgeText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#FFFFFF',
    },

    markAllButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Filter Tabs
    filterContainer: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#000000',
        gap: 10,
    },

    filterTab: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: '#1A1A1A',
        borderWidth: 1,
        borderColor: '#2A2A2A',
        gap: 6,
    },

    filterTabActive: {
        backgroundColor: '#0D2B24',
        borderColor: '#00C896',
    },

    filterTabText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#999999',
    },

    filterTabTextActive: {
        color: '#00C896',
    },

    // Notifications List
    listContent: {
        padding: 16,
        paddingBottom: 32,
    },

    notificationCard: {
        backgroundColor: '#1A1A1A',
        borderRadius: 12,
        padding: 14,
        marginBottom: 12,
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#2A2A2A',
    },

    notificationCardUnread: {
        backgroundColor: '#0D2B24',
        borderColor: '#00C896',
        borderWidth: 1.5,
    },

    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },

    notificationContent: {
        flex: 1,
    },

    notificationHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 6,
    },

    notificationTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#FFFFFF',
        flex: 1,
    },

    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#00C896',
        marginLeft: 8,
    },

    notificationMessage: {
        fontSize: 13,
        color: '#999999',
        lineHeight: 18,
        marginBottom: 8,
    },

    notificationFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },

    notificationTime: {
        fontSize: 11,
        color: '#666666',
        fontWeight: '600',
    },

    // Empty State
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 40,
    },

    emptyIconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#1A1A1A',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        borderWidth: 2,
        borderColor: '#2A2A2A',
    },

    emptyStateTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#FFFFFF',
        marginBottom: 8,
        letterSpacing: 0.3,
    },

    emptyStateText: {
        fontSize: 14,
        color: '#999999',
        textAlign: 'center',
        lineHeight: 20,
    },
});

export default NotificationsScreen;
