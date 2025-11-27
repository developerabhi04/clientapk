import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    TextInput,
    FlatList,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect } from '@react-navigation/native';
import ApiService from '../../../services/ApiService';

const FILTER_OPTIONS = [
    { id: 'all', label: 'All', icon: 'view-grid' },
    { id: 'credit', label: 'Credit', icon: 'plus-circle' },
    { id: 'debit', label: 'Debit', icon: 'minus-circle' },
    { id: 'withdrawal', label: 'Withdrawal', icon: 'bank-transfer-out' },
    { id: 'pending', label: 'Pending', icon: 'clock-outline' },
];

const TransactionHistoryScreen = ({ navigation }) => {
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [transactions, setTransactions] = useState([]);
    // const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // ✅ Fetch transactions on screen focus
    useFocusEffect(
        useCallback(() => {
            fetchTransactions();
        }, [])
    );

    // ✅ Fetch transactions from backend
    const fetchTransactions = async () => {
        try {
            console.log('📜 Fetching all transactions...');

            // Fetch all transactions (no limit)
            const response = await ApiService.getTransactions(1, 100);

            if (response.success) {
                console.log('✅ Transactions fetched:', response.data.length);
                console.log('📊 Transaction breakdown:', {
                    total: response.data.length,
                    credit: response.data.filter(t => t.type === 'credit').length,
                    debit: response.data.filter(t => t.type === 'debit').length,
                    withdrawals: response.data.filter(t => t.category === 'withdrawal').length,
                    pending: response.data.filter(t => t.status === 'pending').length,
                });
                setTransactions(response.data);
            } else {
                console.error('❌ Failed to fetch transactions:', response.message);
            }
        } catch (error) {
            console.error('❌ Error fetching transactions:', error);
        } finally {
            // setLoading(false);
            setRefreshing(false);
        }
    };

    // ✅ Pull to refresh
    const onRefresh = () => {
        setRefreshing(true);
        fetchTransactions();
    };

    // ✅ Filter transactions based on selected filter and search query
    const filteredTransactions = transactions.filter((transaction) => {
        // ✅ FIXED: Filter by type/status/category
        const matchesFilter =
            selectedFilter === 'all' ||
            (selectedFilter === 'credit' && transaction.type === 'credit') ||
            (selectedFilter === 'debit' && transaction.type === 'debit') ||
            (selectedFilter === 'withdrawal' && transaction.category === 'withdrawal') || // ✅ Fixed this line
            (selectedFilter === 'pending' && transaction.status === 'pending');

        // Filter by search query
        const matchesSearch =
            searchQuery === '' ||
            transaction.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            transaction.paymentDetails?.utrNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            transaction.withdrawalDetails?.utrNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            transaction.withdrawalDetails?.bankName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            transaction.tradeDetails?.stockSymbol?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            transaction.category?.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesFilter && matchesSearch;
    });

    // ✅ Get transaction icon and color based on category
    const getTransactionIcon = (category) => {
        const iconMap = {
            add_money: { icon: 'plus-circle', color: '#00C896' },
            withdrawal: { icon: 'bank-transfer-out', color: '#FF9800' },
            trade_buy: { icon: 'cart', color: '#2196F3' },
            trade_sell: { icon: 'cash-multiple', color: '#00C896' },
            profit: { icon: 'trending-up', color: '#00C896' },
            loss: { icon: 'trending-down', color: '#FF5252' },
            dividend: { icon: 'gift', color: '#9C27B0' },
            signup_bonus: { icon: 'gift', color: '#FFD700' },
            refund: { icon: 'refresh', color: '#2196F3' },
            default: { icon: 'swap-horizontal', color: '#999999' },
        };

        return iconMap[category] || iconMap.default;
    };

    // ✅ Get status badge color
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

    // ✅ Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // ✅ Format time
    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    // ✅ Render transaction item
    const renderTransactionItem = ({ item }) => {
        const iconData = getTransactionIcon(item.category);
        const statusColor = getStatusColor(item.status);

        return (
            <TouchableOpacity
                style={styles.transactionCard}
                activeOpacity={0.8}
                onPress={() => navigation.navigate('TransactionDetail', { transaction: item })}>
                <View style={styles.transactionLeft}>
                    <View
                        style={[
                            styles.transactionIcon,
                            { backgroundColor: iconData.color + '20' },
                        ]}>
                        <Icon name={iconData.icon} size={24} color={iconData.color} />
                    </View>
                    <View style={styles.transactionInfo}>
                        <Text style={styles.transactionDescription}>
                            {item.description}
                        </Text>
                        <View style={styles.transactionMeta}>
                            <Text style={styles.transactionDate}>
                                {formatDate(item.createdAt)}
                            </Text>
                            <Text style={styles.transactionDot}>•</Text>
                            <Text style={styles.transactionTime}>
                                {formatTime(item.createdAt)}
                            </Text>
                            {item.status !== 'completed' && (
                                <>
                                    <Text style={styles.transactionDot}>•</Text>
                                    <View style={[
                                        styles.statusBadge,
                                        { backgroundColor: statusColor + '20' }
                                    ]}>
                                        <Text style={[
                                            styles.statusText,
                                            { color: statusColor }
                                        ]}>
                                            {item.status}
                                        </Text>
                                    </View>
                                </>
                            )}
                        </View>
                    </View>
                </View>

                <View style={styles.transactionRight}>
                    <Text
                        style={[
                            styles.transactionAmount,
                            { color: item.type === 'credit' ? '#00C896' : '#FF5252' },
                        ]}>
                        {item.type === 'credit' ? '+' : '-'}₹
                        {item.amount.toLocaleString('en-IN')}
                    </Text>
                    <Icon name="chevron-right" size={20} color="#666666" />
                </View>
            </TouchableOpacity>
        );
    };

    // ✅ Show loading state
    // if (loading) {
    //     return (
    //         <View style={styles.loadingContainer}>
    //             <ActivityIndicator size="large" color="#00C896" />
    //             <Text style={styles.loadingText}>Loading transactions...</Text>
    //         </View>
    //     );
    // }

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
                    <Text style={styles.headerTitle}>Transaction History</Text>
                    <TouchableOpacity
                        style={styles.downloadButton}
                        onPress={() => console.log('Download feature coming soon')}>
                        {/* <Icon name="download" size={22} color="#FFFFFF" /> */}
                    </TouchableOpacity>
                </View>

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <Icon name="magnify" size={20} color="#999999" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search transactions, UTR, bank..."
                        placeholderTextColor="#666666"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <Icon name="close-circle" size={20} color="#999999" />
                        </TouchableOpacity>
                    )}
                </View>

                {/* Filter Tabs */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filterContainer}>
                    {FILTER_OPTIONS.map((filter) => {
                        // ✅ Calculate count for each filter
                        let count = 0;
                        if (filter.id === 'all') {
                            count = transactions.length;
                        } else if (filter.id === 'credit') {
                            count = transactions.filter(t => t.type === 'credit').length;
                        } else if (filter.id === 'debit') {
                            count = transactions.filter(t => t.type === 'debit').length;
                        } else if (filter.id === 'withdrawal') {
                            // ✅ Fixed: Count withdrawals by category
                            count = transactions.filter(t => t.category === 'withdrawal').length;
                        } else if (filter.id === 'pending') {
                            count = transactions.filter(t => t.status === 'pending').length;
                        }

                        return (
                            <TouchableOpacity
                                key={filter.id}
                                style={[
                                    styles.filterTab,
                                    selectedFilter === filter.id && styles.filterTabActive,
                                ]}
                                onPress={() => setSelectedFilter(filter.id)}
                                activeOpacity={0.7}>
                                <Icon
                                    name={filter.icon}
                                    size={18}
                                    color={selectedFilter === filter.id ? '#00C896' : '#999999'}
                                />
                                <Text
                                    style={[
                                        styles.filterTabText,
                                        selectedFilter === filter.id && styles.filterTabTextActive,
                                    ]}>
                                    {filter.label}
                                </Text>
                                {/* ✅ Show count badge */}
                                <View style={[
                                    styles.countBadge,
                                    selectedFilter === filter.id && styles.countBadgeActive
                                ]}>
                                    <Text style={[
                                        styles.countText,
                                        selectedFilter === filter.id && styles.countTextActive
                                    ]}>
                                        {count}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </SafeAreaView>

            {/* Transaction List */}
            {filteredTransactions.length > 0 ? (
                <FlatList
                    data={filteredTransactions}
                    renderItem={renderTransactionItem}
                    keyExtractor={(item) => item._id || item.id}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor="#00C896"
                            colors={['#00C896']}
                        />
                    }
                />
            ) : (
                <View style={styles.emptyState}>
                    <Icon name="receipt-text-outline" size={64} color="#666666" />
                    <Text style={styles.emptyStateTitle}>No transactions found</Text>
                    <Text style={styles.emptyStateText}>
                        {searchQuery
                            ? 'Try adjusting your search'
                            : selectedFilter !== 'all'
                                ? `No ${selectedFilter} transactions yet`
                                : 'Your transaction history will appear here'}
                    </Text>
                    {(searchQuery || selectedFilter !== 'all') && (
                        <TouchableOpacity
                            style={styles.clearButton}
                            onPress={() => {
                                setSearchQuery('');
                                setSelectedFilter('all');
                            }}>
                            <Text style={styles.clearButtonText}>Clear Filters</Text>
                        </TouchableOpacity>
                    )}
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

    downloadButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Search Bar
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1A1A1A',
        marginHorizontal: 16,
        marginTop: 12,
        marginBottom: 16,
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#2A2A2A',
    },

    searchInput: {
        flex: 1,
        fontSize: 14,
        color: '#FFFFFF',
        marginLeft: 10,
        fontWeight: '500',
        padding: 0,
    },

    // Filter Tabs
    filterContainer: {
        paddingHorizontal: 16,
        paddingBottom: 16,
        gap: 10,
    },

    filterTab: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1A1A1A',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        gap: 6,
        borderWidth: 1,
        borderColor: '#2A2A2A',
    },

    filterTabActive: {
        backgroundColor: '#0D2B24',
        borderColor: '#00C896',
    },

    filterTabText: {
        fontSize: 13,
        color: '#999999',
        fontWeight: '600',
    },

    filterTabTextActive: {
        color: '#00C896',
    },

    countBadge: {
        backgroundColor: '#2A2A2A',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 10,
        minWidth: 20,
        alignItems: 'center',
    },

    countBadgeActive: {
        backgroundColor: '#00C896',
    },

    countText: {
        fontSize: 11,
        color: '#999999',
        fontWeight: '700',
    },

    countTextActive: {
        color: '#000000',
    },

    // Transaction List
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 20,
    },

    transactionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#1A1A1A',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#2A2A2A',
    },

    transactionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },

    transactionIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },

    transactionInfo: {
        flex: 1,
    },

    transactionDescription: {
        fontSize: 15,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 6,
    },

    transactionMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        flexWrap: 'wrap',
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

    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
    },

    statusText: {
        fontSize: 10,
        fontWeight: '700',
        textTransform: 'uppercase',
    },

    transactionRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },

    transactionAmount: {
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.3,
    },

    // Empty State
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 40,
    },

    emptyStateTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
        marginTop: 20,
        marginBottom: 8,
    },

    emptyStateText: {
        fontSize: 14,
        color: '#999999',
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 20,
    },

    clearButton: {
        backgroundColor: '#00C896',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 10,
    },

    clearButtonText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#FFFFFF',
    },
});

export default TransactionHistoryScreen;
