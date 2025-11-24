import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect } from '@react-navigation/native';
import ApiService from '../../../services/ApiService';

const ProfileWalletScreen = ({ navigation }) => {
    const [userData, setUserData] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useFocusEffect(
        useCallback(() => {
            fetchWalletData();
        }, [])
    );

    const fetchWalletData = async () => {
        try {
            console.log('💰 Fetching wallet data...');

            const profileResponse = await ApiService.getUserProfile();
            
            if (profileResponse.success) {
                setUserData(profileResponse.data);
                console.log('✅ Wallet Balance:', profileResponse.data.walletBalance);
                console.log('✅ Bonus Balance:', profileResponse.data.bonusBalance);
                console.log('✅ Total Balance:', profileResponse.data.totalBalance);
            }

            const transactionsResponse = await ApiService.getTransactions(1, 6);
            
            if (transactionsResponse.success) {
                setTransactions(transactionsResponse.data || []);
                console.log('✅ Transactions fetched:', transactionsResponse.data?.length || 0);
            }

        } catch (error) {
            console.error('❌ Error fetching wallet data:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchWalletData();
    };

    const getTransactionIcon = (transaction) => {
        const iconMap = {
            add_money: { icon: 'plus-circle', color: '#00C896' },
            withdrawal: { icon: 'bank-transfer-out', color: '#FF9800' },
            dividend: { icon: 'gift', color: '#9C27B0' },
            trade_buy: { icon: 'cart', color: '#2196F3' },
            trade_sell: { icon: 'cash-multiple', color: '#00C896' },
            signup_bonus: { icon: 'gift', color: '#FFD700' },
            profit: { icon: 'trending-up', color: '#00C896' },
            loss: { icon: 'trending-down', color: '#FF5252' },
            refund: { icon: 'refresh', color: '#2196F3' },
            default: { icon: 'swap-horizontal', color: '#999999' },
        };

        return iconMap[transaction.category] || iconMap.default;
    };

    const getStatusColor = (status) => {
        const colors = {
            completed: '#00C896',
            pending: '#FF9800',
            failed: '#FF5252',
            rejected: '#FF5252',
            cancelled: '#999999',
        };
        return colors[status] || '#999999';
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#00C896" />
                <Text style={styles.loadingText}>Loading wallet...</Text>
            </View>
        );
    }

    // ✅ Calculate balances with fallback
    const walletBalance = userData?.walletBalance || 0;
    const bonusBalance = userData?.bonusBalance || 0;
    const totalBalance = walletBalance + bonusBalance;

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000000" />

            <SafeAreaView edges={['top']} style={styles.safeAreaTop}>
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}>
                        <Icon name="arrow-left" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Wallet</Text>
                    <TouchableOpacity
                        style={styles.historyButton}
                        onPress={() => navigation.navigate('TransactionHistory')}>
                        <Icon name="history" size={22} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>

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

                {/* Main Balance Card */}
                <View style={styles.mainBalanceCard}>
                    <View style={styles.balanceHeader}>
                        <Icon name="wallet" size={28} color="#00C896" />
                        <Text style={styles.balanceHeaderText}>Total Balance</Text>
                    </View>
                    <Text style={styles.mainBalanceValue}>
                        ₹{totalBalance.toLocaleString('en-IN', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        })}
                    </Text>
                    
                    {/* ✅ Balance Breakdown */}
                    <View style={styles.balanceBreakdownContainer}>
                        <View style={styles.breakdownCard}>
                            <Icon name="wallet" size={20} color="#00C896" />
                            <View style={styles.breakdownInfo}>
                                <Text style={styles.breakdownLabel}>Main Wallet</Text>
                                <Text style={styles.breakdownValue}>
                                    ₹{walletBalance.toFixed(2)}
                                </Text>
                            </View>
                        </View>
                        
                        <View style={styles.breakdownDivider} />
                        
                        <View style={styles.breakdownCard}>
                            <Icon name="gift" size={20} color="#FFD700" />
                            <View style={styles.breakdownInfo}>
                                <Text style={styles.breakdownLabel}>Bonus</Text>
                                <Text style={[styles.breakdownValue, styles.bonusValue]}>
                                    ₹{bonusBalance.toFixed(2)}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.balanceTypeBadge}>
                        <Text style={styles.balanceTypeBadgeText}>
                            Stocks Balance
                        </Text>
                    </View>
                </View>

                {/* Recent Transactions */}
                <View style={styles.transactionsSection}>
                    <View style={styles.transactionsHeader}>
                        <Text style={styles.sectionTitle}>Recent Transactions</Text>
                        {transactions.length > 0 && (
                            <TouchableOpacity
                                onPress={() => navigation.navigate('TransactionHistory')}>
                                <Text style={styles.viewAllText}>View All</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {transactions.length > 0 ? (
                        transactions.map((transaction) => {
                            const iconData = getTransactionIcon(transaction);
                            const statusColor = getStatusColor(transaction.status);
                            
                            return (
                                <View key={transaction._id || transaction.id} style={styles.transactionItem}>
                                    <View style={styles.transactionLeft}>
                                        <View style={[
                                            styles.transactionIcon,
                                            { backgroundColor: iconData.color + '20' }
                                        ]}>
                                            <Icon 
                                                name={iconData.icon} 
                                                size={20} 
                                                color={iconData.color} 
                                            />
                                        </View>
                                        <View style={styles.transactionInfo}>
                                            <View style={styles.transactionTopRow}>
                                                <Text style={styles.transactionDescription}>
                                                    {transaction.description}
                                                </Text>
                                                {transaction.status !== 'completed' && (
                                                    <View style={[
                                                        styles.statusBadge,
                                                        { backgroundColor: statusColor + '20' }
                                                    ]}>
                                                        <Text style={[
                                                            styles.statusText,
                                                            { color: statusColor }
                                                        ]}>
                                                            {transaction.status}
                                                        </Text>
                                                    </View>
                                                )}
                                            </View>
                                            <View style={styles.transactionMeta}>
                                                <Text style={styles.transactionDate}>
                                                    {formatDate(transaction.createdAt)}
                                                </Text>
                                                <Text style={styles.transactionDot}>•</Text>
                                                <Text style={styles.transactionTime}>
                                                    {formatTime(transaction.createdAt)}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                    <Text style={[
                                        styles.transactionAmount,
                                        { 
                                            color: transaction.type === 'credit' ? '#00C896' : '#FF5252' 
                                        }
                                    ]}>
                                        {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount}
                                    </Text>
                                </View>
                            );
                        })
                    ) : (
                        <View style={styles.emptyState}>
                            <Icon name="receipt-text-outline" size={48} color="#666666" />
                            <Text style={styles.emptyStateText}>No transactions yet</Text>
                            <Text style={styles.emptyStateSubtext}>
                                Your transaction history will appear here
                            </Text>
                        </View>
                    )}
                </View>
            </ScrollView>

            <SafeAreaView edges={['bottom']} style={styles.safeAreaBottom}>
                <View style={styles.bottomButtonsContainer}>
                    <TouchableOpacity
                        style={styles.withdrawButton}
                        activeOpacity={0.8}
                        onPress={() => navigation.navigate('Withdraw')}>
                        <Icon name="bank-transfer-out" size={20} color="#FFFFFF" />
                        <Text style={styles.withdrawButtonText}>Withdraw</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.addMoneyButton}
                        activeOpacity={0.8}
                        onPress={() => navigation.navigate('Recharge')}>
                        <Icon name="plus-circle" size={20} color="#FFFFFF" />
                        <Text style={styles.addMoneyButtonText}>Add money</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </View>
    );
};

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

    safeAreaTop: {
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

    historyButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },

    scrollView: {
        flex: 1,
    },

    scrollContent: {
        paddingBottom: 30,
    },

    mainBalanceCard: {
        backgroundColor: '#1A1A1A',
        marginHorizontal: 16,
        marginTop: 20,
        marginBottom: 20,
        padding: 24,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#2A2A2A',
        alignItems: 'center',
    },

    balanceHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 10,
    },

    balanceHeaderText: {
        fontSize: 16,
        color: '#999999',
        fontWeight: '600',
    },

    mainBalanceValue: {
        fontSize: 42,
        fontWeight: '800',
        color: '#FFFFFF',
        letterSpacing: -2,
        marginBottom: 16,
    },

    balanceBreakdownContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#0D2B24',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        marginBottom: 12,
        gap: 12,
        width: '100%',
    },

    breakdownCard: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },

    breakdownInfo: {
        flex: 1,
    },

    breakdownLabel: {
        fontSize: 10,
        color: '#999999',
        marginBottom: 2,
        fontWeight: '500',
    },

    breakdownValue: {
        fontSize: 14,
        color: '#FFFFFF',
        fontWeight: '700',
    },

    bonusValue: {
        color: '#FFD700',
    },

    breakdownDivider: {
        width: 1,
        height: 30,
        backgroundColor: '#2A2A2A',
    },

    balanceTypeBadge: {
        backgroundColor: '#0D2B24',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#00C896',
    },

    balanceTypeBadgeText: {
        fontSize: 12,
        color: '#00C896',
        fontWeight: '600',
    },

    transactionsSection: {
        marginHorizontal: 16,
    },

    transactionsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },

    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
    },

    viewAllText: {
        fontSize: 14,
        color: '#00C896',
        fontWeight: '600',
    },

    transactionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#1A1A1A',
        padding: 14,
        borderRadius: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#2A2A2A',
    },

    transactionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },

    transactionIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },

    transactionInfo: {
        flex: 1,
    },

    transactionTopRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },

    transactionDescription: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFFFFF',
        flex: 1,
    },

    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 10,
        marginLeft: 8,
    },

    statusText: {
        fontSize: 10,
        fontWeight: '700',
        textTransform: 'uppercase',
    },

    transactionMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },

    transactionDate: {
        fontSize: 12,
        color: '#999999',
        fontWeight: '500',
    },

    transactionTime: {
        fontSize: 12,
        color: '#999999',
        fontWeight: '500',
    },

    transactionDot: {
        fontSize: 12,
        color: '#666666',
    },

    transactionAmount: {
        fontSize: 16,
        fontWeight: '700',
        marginLeft: 8,
    },

    emptyState: {
        alignItems: 'center',
        paddingVertical: 40,
    },

    emptyStateText: {
        fontSize: 16,
        color: '#999999',
        marginTop: 16,
        fontWeight: '600',
    },

    emptyStateSubtext: {
        fontSize: 13,
        color: '#666666',
        marginTop: 8,
        textAlign: 'center',
    },

    safeAreaBottom: {
        backgroundColor: '#000000',
    },

    bottomButtonsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 12,
        backgroundColor: '#000000',
        borderTopWidth: 1,
        borderTopColor: '#1A1A1A',
    },

    withdrawButton: {
        flex: 1,
        backgroundColor: '#FF9800',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#FF9800',
        gap: 8,
    },

    withdrawButtonText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#FFFFFF',
        letterSpacing: 0.3,
    },

    addMoneyButton: {
        flex: 1,
        backgroundColor: '#00C896',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 12,
        gap: 8,
    },

    addMoneyButtonText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#FFFFFF',
        letterSpacing: 0.3,
    },
});

export default ProfileWalletScreen;
