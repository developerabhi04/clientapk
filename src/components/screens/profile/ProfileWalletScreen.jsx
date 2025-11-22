import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ProfileWalletScreen = ({ navigation }) => {
    // Mock data - replace with actual data from your state/context
    const walletBalance = 1250.35;
    const cashBalance = 1250.35;

    // Mock transaction history with all types
    const transactions = [
        { 
            id: '1', 
            type: 'credit', 
            category: 'add_money',
            amount: 5000, 
            date: '2025-11-07', 
            time: '10:30 AM',
            description: 'Added money via UPI',
            icon: 'plus-circle',
            color: '#00C896'
        },
        { 
            id: '2', 
            type: 'debit', 
            category: 'withdrawal',
            amount: 3000, 
            date: '2025-11-06', 
            time: '02:15 PM',
            description: 'Withdrawal to bank',
            icon: 'bank-transfer-out',
            color: '#FF9800'
        },
        { 
            id: '3', 
            type: 'credit', 
            category: 'dividend',
            amount: 150, 
            date: '2025-11-05', 
            time: '11:45 AM',
            description: 'Dividend received',
            icon: 'gift',
            color: '#9C27B0'
        },
        { 
            id: '4', 
            type: 'debit', 
            category: 'stock_purchase',
            amount: 2500, 
            date: '2025-11-04', 
            time: '04:20 PM',
            description: 'Stock purchase - RELIANCE',
            icon: 'cart',
            color: '#2196F3'
        },
        { 
            id: '5', 
            type: 'credit', 
            category: 'stock_sale',
            amount: 3200, 
            date: '2025-11-03', 
            time: '09:00 AM',
            description: 'Stock sale - TCS',
            icon: 'cash-multiple',
            color: '#00C896'
        },
        { 
            id: '6', 
            type: 'credit', 
            category: 'add_money',
            amount: 10000, 
            date: '2025-11-02', 
            time: '08:30 AM',
            description: 'Added money via Card',
            icon: 'plus-circle',
            color: '#00C896'
        },
    ];

    // Get transaction icon based on type
    const getTransactionIcon = (transaction) => {
        return {
            icon: transaction.icon,
            color: transaction.color,
        };
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000000" />

            {/* Header */}
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
                contentContainerStyle={styles.scrollContent}>

                {/* Main Balance Card */}
                <View style={styles.mainBalanceCard}>
                    <View style={styles.balanceHeader}>
                        <Icon name="wallet" size={28} color="#00C896" />
                        <Text style={styles.balanceHeaderText}>Total Balance</Text>
                    </View>
                    <Text style={styles.mainBalanceValue}>
                        ₹{Math.abs(walletBalance).toLocaleString('en-IN', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        })}
                    </Text>
                    <View style={styles.balanceTypeBadge}>
                        <Text style={styles.balanceTypeBadgeText}>
                            Stocks, F&O balance
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
                            return (
                                <View key={transaction.id} style={styles.transactionItem}>
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
                                            <Text style={styles.transactionDescription}>
                                                {transaction.description}
                                            </Text>
                                            <View style={styles.transactionMeta}>
                                                <Text style={styles.transactionDate}>
                                                    {transaction.date}
                                                </Text>
                                                <Text style={styles.transactionDot}>•</Text>
                                                <Text style={styles.transactionTime}>
                                                    {transaction.time}
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

            {/* Bottom Buttons */}
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

    // Main Balance Card
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
        marginBottom: 12,
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

    // Section Title
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 12,
    },

    // Transactions Section
    transactionsSection: {
        marginHorizontal: 16,
    },

    transactionsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
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

    transactionDescription: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 4,
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
    },

    // Empty State
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

    // Bottom Buttons
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
